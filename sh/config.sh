curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.18.9/2020-11-02/bin/linux/amd64/kubectl
chmod +x ./kubectl
mkdir -p $HOME/bin && cp ./kubectl $HOME/bin/kubectl && export PATH=$PATH:$HOME/bin
echo 'export PATH=$PATH:$HOME/bin' >> ~/.bashrc
source ~/.bashrc

curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

aws ecr get-login-password --region us-east-2 | docker login --username AWS --password-stdin 596779343245.dkr.ecr.us-east-2.amazonaws.com/simcf-backend
aws eks --region us-east-2 update-kubeconfig --name simcf-cluster