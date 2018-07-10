#!/bin/bash

if [ "${SQL_PROXY_ENABLED}" = "true" ]
then
    # Start cloud_sql_proxy
    echo ${SQL_PROXY_privateKeyData} > /cloudsql/token
    # ./cloud_sql_proxy -instances=$(CONNECTION_NAME)=tcp:3306 -credential_file=/secrets/cloudsql/privateKeyData
    /cloudsql/cloud_sql_proxy -instances=${SQL_PROXY_connectionName}=tcp:3306 -credential_file=/cloudsql/token > /cloudsql/cloud_sql_proxy.log &
    sleep 5
    echo "Cloud SQL proxy started. running cat /cloudsql/cloud_sql_proxy.log ..."
    cat /cloudsql/cloud_sql_proxy.log
else
    echo "SQL Proxy NOT started (SQL_PROXY_ENABLED not set to true)".
fi

# Start the nodejs app
npm start