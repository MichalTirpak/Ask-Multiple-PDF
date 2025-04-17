docker run --name swagger -d -p 89:8080 -e SWAGGER_JSON=/swagger.yaml -v /home/pacman/h12-ml/swager/data/swagger.yaml:/swagger.yaml swaggerapi/swagger-ui
