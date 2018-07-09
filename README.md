# [Google Cloud Next ’18](https://cloud.withgoogle.com/next18/sf/) demo app

## Developing

This folder contains the source for the nodejs demo app.

## Building

You can build a docker image out of it via

    export docker_rev=<put-your-revision-here>
    docker build -t gcr.io/sap-hybris-sf-playground/cloudnext18/webapp:${docker_rev} -f Dockerfile .
    docker push gcr.io/sap-hybris-sf-playground/cloudnext18/webapp:${docker_rev}

## Running


### locally 
You need MySQL instance and you can pass the credentials as OS vars:

    APP_PORT=3000 DB_SCHEMA='contacts-demo' DB_USER='root' DB_PASSWORD='' DB_DIALECT='mysql' DB_HOST='localhost' DB_PORT='3306' node server.js

### Docker
You can docker run the image you build earlier in ## Build part or you can use latest.
    export APP_PORT=3000 
    export DB_SCHEMA='contacts-demo'
    export DB_USER='root'
    export DB_PASSWORD=''
    export DB_DIALECT='mysql'
    export DB_HOST='localhost'
    export DB_PORT='3306'
    docker run --name mysql57 -e MYSQL_DATABASE=${DB_SCHEMA} -e MYSQL_USER=${DB_USER} -e MYSQL_PASSWORD=${DB_PASSWORD} -e MYSQL_ROOT_PASSWORD=${DB_PASSWORD} -p ${DB_PORT}:${DB_PORT} mysql:5.7 
    docker run --link mysql57 -p ${APP_PORT}:${APP_PORT} -e gcr.io/sap-hybris-sf-playground/cloudnext18/webapp:${docker_rev}

### knative on Kubernetes

You need to have a cluster with [knative installed](https://github.com/knative/docs/tree/master/install).

You can deploy and access the Route (k8s service/ingress) and Configuration (k8s deployment) objects by:
    
    # deploys the application route and configuration
    kubectl apply -f knative-serving.route.configuration.yaml
    # to access the app:
    export WEBAPP_HOST=`kubectl -n demo get route  webapp-ui  -o jsonpath="{.status.domain}"`
    export WEBAPP_IP=`kubectl get svc knative-ingressgateway -n istio-system -o jsonpath="{.status.loadBalancer.ingress[*].ip}"`
    echo 'curl --header "Host:'${WEBAPP_HOST}'" http://'${WEBAPP_IP}''
    curl --header "Host:$WEBAPP_HOST" http://${WEBAPP_IP}
    
You can find more details by looking in to: 

    # shows the route:
    kubectl -n demo get route webapp-ui -o yaml
    
    # shows the configuration:
    kubectl -n demo get configurations -o yaml
    
    # shows the revision created by the configuration:
    kubectl -n demo get revisions -o yaml    
