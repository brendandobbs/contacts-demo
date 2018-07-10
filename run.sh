#!/bin/bash

if [ "${LOCAL_SQL_PROXY}" = "enabled" ]
then
    # Start cloud_sql_proxy
    echo ${privateKeyData} > /cloudsql/token
    # ./cloud_sql_proxy -instances=$(CONNECTION_NAME)=tcp:3306 -credential_file=/secrets/cloudsql/privateKeyData
    /cloudsql/cloud_sql_proxy -instances=${connectionName}=tcp:3306 -credential_file=/cloudsql/token > /cloudsql/cloud_sql_proxy.log &
    sleep 5
    echo "Cloud SQL proxy started. Logs at /cloudsql/cloud_sql_proxy.log"
else
    echo "SQL Proxy NOT started (${LOCAL_SQL_PROXY} not set to enabled)".
fi

# Start the nodejs app
npm start
