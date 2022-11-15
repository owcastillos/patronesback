# patronesback

## Installation

* Create Docker image
`sudo docker build --tag owcastillos/backend_node .`
* If you want test your created image, you can run
`sudo docker run --env AWS_ACCESS_KEY_ID={your_access_key} --env AWS_SECRET_ACCESS_KEY={your_secret_key} --publish 3000:3000 owcastillos/backend_node`
* Publish your Docker image
`docker push owcastillos/backend_node`
* Create a PR and accept the changes
