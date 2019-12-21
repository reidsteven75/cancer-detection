Init
----------------
```
$ ./init.sh
```
- install Google Cloud SDK: https://cloud.google.com/sdk/docs/downloads-interactive#mac

Dev
----------------
client
```
$ docker-compose up --build client
```

server
```
$ docker-compose up --build server
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

Node Modules
------------
- install & uninstalls should be done locally
- when changing node_modules run the following command:
```
$ docker-compose down
```

Environment Variables
---------------------
- set in root .env files
- changing environment variable names requires updates to:
  - deploy.sh
  - client/webpack.*.js files
  - client/App.js
  - server/server.js