kubectl delete service/simcf-backend-service
kubectl delete deployment.apps/simcf-backend-deploy
kubectl create -f k8s-deploy.yml
sleep 10
kubectl get service simcf-backend-service
echo 'Update URL service in front aplication'