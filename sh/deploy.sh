kubectl apply -f k8s-deploy.yml
sleep 10
kubectl get service simcf-backend-service
echo 'Update URL service in front aplication'