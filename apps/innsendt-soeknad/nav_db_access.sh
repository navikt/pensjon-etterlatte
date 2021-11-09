#!/bin/bash

# ======================================================
# Script to simplify database access in dev and/or prod.
# ======================================================

usage() { 
	echo -e "\033[0;31mERROR:\033[0m Invalid or missing flags."
	echo "Usage: nav_db_access [options]"
	echo -e "\nwhere options include: \n"
	echo -e "\t-u <firstname.lastname@nav.no> \n\t\tYour email address at nav."
	echo -e "\t-p <gcloud project id> \n\t\tThe gcp PROJECT_ID. Can be found using 'gcloud projects list --filter=<namespace>"
	echo -e "\t-i <db instance name> \n\t\tThe gcp database instance NAME. Can be found using 'gcloud beta sql instances list --project <PROJECT_ID>'"
	echo -e "\n\t(optional) \n\t-h <int hours access> \n\t\tNumber of hours the temp access should be valid. Max 8 hours."
}

while getopts ":u:p:i:h:" opt; do
	case "$opt" in 
		u)
			user=${OPTARG}
			;;
		p)
			project=${OPTARG}
			;;
		i)
			instance=${OPTARG}
			;;
		h)
			hours=${OPTARG}
			;;
		*)
			usage
			;;
	esac
done
shift $((OPTIND-1))

# Ensure required options are supplied
if [ -z "${user}" ] || [ -z "${project}" ] || [ -z "${instance}" ]; then
    usage
    exit 1;
fi

# Ensure user is authenicated, and run login if not.
[[ "$(gcloud auth list)" =~ "${user}" ]] &>/dev/null || gcloud auth login

# Ensure supplied project exists
project_list=$(gcloud projects list)
if [[ ! "${project_list}" =~ "${project}" ]]; then
	echo -e "\n\033[0;31mERROR:\033[0m Invalid PROJECT_ID ${project}" 
	echo -e "\nAvailable projects are: \n\n${project_list}"
	exit 1;
fi

# Ensure supplied instance exists
instance_list=$(gcloud sql instances list --project ${project})
if [[ ! "${instance_list}" =~ "${instance}" ]]; then
	echo -e "\n\033[0;31mERROR:\033[0m Invalid sqlinstance ${instance}"
	echo -e "\nAvailable instances for ${project} are: \n\n${instance_list}"
	exit 1;
fi

# Check if hours was set by user, or set equal 1 if not.
[[ -z "${hours}" ]] &>/dev/null && hours=1

# Ensure hours are valid (min 1, max 8)
if [ ${hours} -lt 1 ] || [ ${hours} -gt 8 ]; then
	echo -e "\n\033[0;31mERROR:\033[0m Hours must be in the range 1-8"
	exit 1;
fi


echo -e "\nSetting up temporary access (+${hours}H) for"
echo -e "\tUser: \t\t\033[0;36m${user}\033[0m"
echo -e "\tProject: \t\033[0;36m${project}\033[0m"
echo -e "\tSQL-instance: \t\033[0;36m${instance}\033[0m.\n"
read -p "Is this correct? [Y/n] " continue

# Stop script if user input == n
if [[ "${continue}" == "n" ]]; then
    echo "Aborting setup ..."
	exit 1;
fi

# Set end of token as date
accessToDate=$(date -v +${hours}H -u +'%Y-%m-%dT%H:%M:%SZ')


# Add IAM policy binding to project with roles/cloudsql.admin
gcloud projects add-iam-policy-binding ${project} \
    --member user:${user} \
    --role roles/cloudsql.admin \
    --condition="expression=request.time < timestamp('${accessToDate}'),title=temp_access"

# Create sql user with supplied username/email
gcloud beta sql users create ${user} \
    --instance=${instance} \
    --type=cloud_iam_user \
    --project ${project}

# Add IAM policy binding to project with roles/cloudsql.instanceUser
gcloud projects add-iam-policy-binding ${project} \
    --member=user:${user} \
    --role=roles/cloudsql.instanceUser \
    --condition="expression=request.time < timestamp('${accessToDate}'),title=temp_access"

# Get connection name
CONNECTION_NAME=$(gcloud sql instances describe ${instance} \
  --format="get(connectionName)" \
  --project ${project});
 

# Create proxy with port 5432
createProxyConnection() {
	cloud_sql_proxy -instances=${CONNECTION_NAME}=tcp:5432
}

# Setup proxy if not already setup
proxySetup() {
	echo "Missing cloud_sql_proxy. Installing and moving to ~/Applications"

	curl -o cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64 --output ~/Applications
	chmod +x ~/Applications/cloud_sql_proxy
	ln -s ~/Applications/cloud_sql_proxy /usr/local/bin 

	createProxyConnection
}

# Try to create proxy connection, setup if cloud_sql_proxy is missing
createProxyConnection || proxySetup

# Print username and password
echo -e "\nUSERNAME: ${user} \nTEMP PASSWORD: $(gcloud auth print-access-token)"
