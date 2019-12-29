#!/bin/bash

WEB_APP_BUILD_DIR=./web-app/build
API_BUILD_DIR=./api/build
MODEL_DIR=models

# set env from .env file
ENV_FILE=$1
source $ENV_FILE

echo '~~~~~~~~~~~'
echo '~= Build =~'
echo '~~~~~~~~~~~'
echo 'ENV: '$NODE_ENV

echo 'deleting old build...'
echo '---------------------'
rm -r $API_BUILD_DIR 
mkdir -p $API_BUILD_DIR

echo 'building web-app...'
echo '------------------'
cd web-app
env NODE_ENV=$NODE_ENV \
    HTTPS=$HTTPS \
    HOST=$HOST \
    SERVER_PORT=$SERVER_PORT \
    npm run build
cd ..
cp -r $WEB_APP_BUILD_DIR $API_BUILD_DIR/web-app
echo 'built:' $WEB_APP_BUILD_DIR '->' $API_BUILD_DIR 

echo 'building models...'
echo '------------------'
for folder in $MODEL_DIR/* ; do
  mkdir -p $API_BUILD_DIR/$folder
  cp -r ./$folder/trained-model $API_BUILD_DIR/$folder
  cp ./$folder/Dockerfile $API_BUILD_DIR/$folder
  cp ./$folder/predict.py $API_BUILD_DIR/$folder
  cp ./$folder/utils.py $API_BUILD_DIR/$folder
  cp ./$folder/requirements.txt $API_BUILD_DIR/$folder
  cp ./$folder/config.py $API_BUILD_DIR/$folder
  echo 'built:' ./$folder '->' $API_BUILD_DIR/$folder
done

echo ''
echo 'committing new build...'
echo '-----------------------'
git commit -m 'web-app re-build' $API_BUILD_DIR/web-app

echo '~~~~~~~~~~~'
echo '~= Built =~'
echo '~~~~~~~~~~~'