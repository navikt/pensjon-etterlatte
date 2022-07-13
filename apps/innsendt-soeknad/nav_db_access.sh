#!/bin/bash

# ======================================================
# Script to simplify database access in dev and/or prod.
# ======================================================

info() {
    echo -e "INFO: $1"
}

warn() {
    echo -e "\033[1;33mWARN:\033[0m $1"
}

error() {
    echo -e "\033[1;31mERROR:\033[0m $1"
}

usage() {
	error "Invalid or missing flags."
	echo "Usage: nav_db_access [options]"
	echo -e "\nwhere options include: \n"
	echo -e "\t-u <firstname.lastname@nav.no> \n\t\tYour email address at nav."
	echo -e "\t-p <gcloud project id> \n\t\tThe gcp PROJECT_ID. Can be found using 'gcloud projects list --filter=<namespace>"
	echo -e "\t-i <db instance name> \n\t\tThe gcp database instance NAME. Can be found using 'gcloud beta sql instances list --project <PROJECT_ID>'"
	echo -e "\n\t(optional) \n\t-t <port> \n\t\tWhich port to use."
	echo -e "\t-h <int hours access> \n\t\tNumber of hours the temp access should be valid. Max 8 hours."
}

# Initialize provided options
while getopts ":u:p:i:h:t:" opt; do
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
	  t)
	    port=${OPTARG}
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

[[ -z "${port}" ]] &>/dev/null && port=5433

# Ensure user is authenicated, and run login if not.
[[ "$(gcloud auth list)" =~ "${user}" ]] &>/dev/null || gcloud auth login

# Ensure supplied project exists
project_list=$(gcloud projects list)
if [[ ! "${project_list}" =~ "${project}" ]]; then
	error "Invalid PROJECT_ID ${project}\n"
	info "Available projects are: \n\n${project_list}"
	exit 1;
fi

# Ensure supplied instance exists
instance_list=$(gcloud sql instances list --project ${project})
if [[ ! "${instance_list}" =~ "${instance}" ]]; then
	error "Invalid sqlinstance ${instance}\n"
	echo -e "\tAvailable instances for ${project} are: \n\n${instance_list}"
	exit 1;
fi

# Check if hours was set by user, or set equal 1 if not.
[[ -z "${hours}" ]] &>/dev/null && hours=1

# Ensure hours are valid (min 1, max 8)
if [ ${hours} -lt 1 ] || [ ${hours} -gt 8 ]; then
	error "Hours must be in the range 1-8"
	exit 1;
fi


info "Setting up temporary access (+${hours}H) for"
echo -e "\tUser: \t\t\033[0;36m${user}\033[0m"
echo -e "\tProject: \t\033[0;36m${project}\033[0m"
echo -e "\tSQL-instance: \t\033[0;36m${instance}\033[0m"
echo -e "\tPort: \t\t\033[0;36m${port}\033[0m\n"
read -p "Is this correct? [Y/n] " continue

# Stop script if user input == n
if [[ "${continue}" == "n" ]]; then
    warn "Aborting setup ..."
	exit 1;
fi

# Remove existing IAM bindings for user
gcloud projects remove-iam-policy-binding ${project} \
    --member=user:${user} \
    --role=roles/cloudsql.instanceUser \
    --all \
    >/dev/null

# Check if SQL user exists. Create one if it doesn't.
user_list=$(gcloud beta sql users list --instance=${instance} --project ${project})
if [[ ! "${user_list}" =~ "${user}" ]]; then

    info "User ${user} not in sql users list. Setting up admin access for 1 minute to init sql user."

    # Add IAM policy binding to project with roles/cloudsql.admin
    gcloud projects add-iam-policy-binding ${project} \
        --member user:${user} \
        --role roles/cloudsql.admin \
        --condition="expression=request.time < timestamp('$(date -v +1M -u +'%Y-%m-%dT%H:%M:%SZ')'),title=temp_access" \
        >/dev/null

    info "Creating user ${user} on instance ${instance}"
    # Create sql user with supplied username/email
    gcloud beta sql users create ${user} \
        --instance=${instance} \
        --type=cloud_iam_user \
        --project ${project} \
        >/dev/null
else
    info "User ${user} exists on instance ${instance}."
fi

# Set end of token as date
access_to_date=$(date -v +${hours}H -u +'%Y-%m-%dT%H:%M:%SZ')

# Add IAM policy binding to project with roles/cloudsql.instanceUser
gcloud projects add-iam-policy-binding ${project} \
    --member=user:${user} \
    --role=roles/cloudsql.instanceUser \
    --condition="expression=request.time < timestamp('${access_to_date}'),title=temp_access" \
    >/dev/null

# Get connection name
connection_name=$(gcloud sql instances describe ${instance} \
  --format="get(connectionName)" \
  --project ${project});


# Create proxy with $port
createProxyConnection() {
    info "Trying to run cloud_sql_proxy"

    port_usage="$(lsof -i:$port)"
    if [[ -z "${port_usage}" ]]; then
        info "Port $port is available. Setting up proxy."
        cloud_sql_proxy -instances=${connection_name}=tcp:$port > /dev/null 2>&1 &
    elif [[ "${port_usage}" =~ "cloud_sql" ]]; then
        warn "Port $port already in use by cloud_sql_proxy. Restarting proxy."
        kill $(pgrep -f "cloud_sql_proxy")
        createProxyConnection
    else
        error "Port $port already in use by unknown process. To avoid destructive operations, this must be handled manually."
        info "\tRun 'lsof -i:$port' to find the culprit. If it seems safe to kill, simply run 'kill -9 \$(lsof -i:$port -t)'"
        exit 1;
    fi
}

# Setup proxy if not already setup
proxySetup() {
	warn "Missing cloud_sql_proxy. Downloading and moving to ~/Applications"

	curl -o ~/Applications/cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.darwin.amd64
	chmod +x ~/Applications/cloud_sql_proxy
	ln -s ~/Applications/cloud_sql_proxy /usr/local/bin 

	createProxyConnection
}

# Try to create proxy connection, setup if cloud_sql_proxy is missing
if [ -f "/usr/local/bin/cloud_sql_proxy" ]; then
    createProxyConnection
else
    warn "cloud_sql_proxy missing. Retry proxy setup."
    proxySetup
fi

# Print username and password
echo "------------------------------"
echo -e "JDBC URL: \tjdbc:postgresql://localhost:$port/<database>\n"
echo -e "USERNAME: \t${user}\n"
echo -e "TEMP PWD: \t$(gcloud auth print-access-token)"
echo "------------------------------"
