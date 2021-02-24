#!/usr/bin/env sh

if test -f /secrets/srvbarnepensjon/username;
then
    export SERVICEUSER_USERNAME=$(cat /secrets/srvbarnepensjon/username)
fi

if test -f /secrets/srvbarnepensjon/password;
then
    export SERVICEUSER_PASSWORD=$(cat /secrets/srvbarnepensjon/password)
fi
