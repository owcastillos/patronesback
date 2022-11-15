aws configure set aws_access_key_id |AWS_ACCESS_KEY_ID|
aws configure set aws_secret_access_key |AWS_SECRET_ACCESS_KEY|

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 596779343245.dkr.ecr.us-east-2.amazonaws.com/simcf-backend
aws eks --region us-east-2 update-kubeconfig --name simcf-cluster