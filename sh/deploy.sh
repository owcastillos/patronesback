kubectl delete service/simcf-backend-service
kubectl delete deployment.apps/simcf-backend-deploy
kubectl create -f k8s-deploy.yml