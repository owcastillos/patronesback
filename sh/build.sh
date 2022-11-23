docker build --tag simcf-backend .
docker tag simcf-backend:latest 596779343245.dkr.ecr.us-east-2.amazonaws.com/simcf-backend:latest
docker push 596779343245.dkr.ecr.us-east-2.amazonaws.com/simcf-backend