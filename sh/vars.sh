sed 's/|AWS_ACCESS_KEY_ID|/'"$AWS_ACCESS_KEY_ID"'/' -i sh/config.sh
sed 's/|AWS_SECRET_ACCESS_KEY|/'"$AWS_SECRET_ACCESS_KEY"'/' -i sh/config.sh

sed 's/|AWS_ACCESS_KEY_ID|/'"$AWS_ACCESS_KEY_ID"'/' -i k8s-deploy.yml
sed 's/|AWS_SECRET_ACCESS_KEY|/'"$AWS_SECRET_ACCESS_KEY"'/' -i k8s-deploy.yml

cat sh/config.sh