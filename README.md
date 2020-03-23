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

Dataset Downloads
---------------------------
https://www.matthuisman.nz/2019/01/download-google-drive-files-wget-curl.html
```
wget -O $filename 'https://docs.google.com/uc?export=download&id=$fileid'
```

Data Generator
```
wget -O img_align_celeba.zip 'https://docs.google.com/uc?export=download&id='
$ wget --save-cookies cookies.txt 'https://docs.google.com/uc?export=download&id=1ElQ3B5HcIJynrxp1r58cg7UMrJYCwjv2' -O- \
     | sed -rn 's/.*confirm=([0-9A-Za-z_]+).*/\1/p' > confirm.txt

$ wget --load-cookies cookies.txt -O img_align_celeba.zip \
     'https://docs.google.com/uc?export=download&id=1ElQ3B5HcIJynrxp1r58cg7UMrJYCwjv2&confirm='$(<confirm.txt)
```

Environment Variables
---------------------
- set in root .env files
- changing environment variable names requires updates to:
  - deploy.sh
  - client/webpack.*.js files
  - client/App.js
  - server/server.js