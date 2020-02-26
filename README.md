Init
----------------
```
$ ./init.sh
```

Dev
---
web app
```
$ docker-compose up --build web-app
```

api
```
$ docker-compose up --build api
```


AI Models
---------

#### Synthetic Data Generation

GAN
```
$ MODE=generate docker-compose up --build tumor-detector-2d
```

#### 2D Object Detection

Train Model
```
$ MODE=train docker-compose up --build tumor-detector-2d
```

Predict With Trained Model
```
$ MODE=predict docker-compose up --build tumor-detector-2d
```

Build
-----
dev
```
$ ./build.sh .env
```

prod
```
$ ./build.sh .env.prod
```

Deploy
------
```
$ ./deploy.sh
```
- 'heroku.yml' = heroku config
- server ENV variables set in Heroku

Logs
----
```
$ heroku logs -t -a cancer-detection-prod
```

Favicons
--------
https://favicon.io/favicon-converter/

Node Modules
------------
- install & uninstalls should be done locally
- when changing node_modules run the following command:
```
$ docker-compose down
```

Docker No Space Left
--------------------
`docker rm $(docker ps -q -f 'status=exited')`
`docker rmi $(docker images -q -f 'dangling=true')`

Environment Variables
---------------------
- set in root .env files
- changing environment variable names requires updates to:
  - deploy.sh
  - client/webpack.*.js files
  - client/App.js
  - server/server.js