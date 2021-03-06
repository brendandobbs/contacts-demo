#!/bin/bash

if [ "${SQL_PROXY_ENABLED}" = "true" ]
then
    # Start cloud_sql_proxy
    echo ${privateKeyData} > /cloudsql/token
    # ./cloud_sql_proxy -instances=$(CONNECTION_NAME)=tcp:3306 -credential_file=/secrets/cloudsql/privateKeyData
    echo "Executing: /cloudsql/cloud_sql_proxy -instances=${connectionName}=tcp:3306 -credential_file=/cloudsql/token > /cloudsql/cloud_sql_proxy.log &"
    /cloudsql/cloud_sql_proxy -instances=${connectionName}=tcp:3306 -credential_file=/cloudsql/token > /cloudsql/cloud_sql_proxy.log &
    sleep 5
    echo "Cloud SQL proxy started. running cat /cloudsql/cloud_sql_proxy.log"
    cat /cloudsql/cloud_sql_proxy.log
else
    echo "SQL Proxy NOT started (SQL_PROXY_ENABLED not set to true)".
fi

# Start the nodejs app
npm start