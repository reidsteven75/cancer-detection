#!/bin/bash

WEB_APP_BUILD_DIR=./web-app/build
SERVER_BUILD_DIR=./server/build
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
rm -r $SERVER_BUILD_DIR 
mkdir -p $SERVER_BUILD_DIR

echo 'building web-app...'
echo '------------------'
cd web-app
env NODE_ENV=$NODE_ENV \
    HTTPS=$HTTPS \
    HOST=$HOST \
    SERVER_PORT=$SERVER_PORT \
    npm run build
cd ..
cp -r $WEB_APP_BUILD_DIR $SERVER_BUILD_DIR/web-app
echo 'built:' $WEB_APP_BUILD_DIR '->' $SERVER_BUILD_DIR 

echo 'building models...'
echo '------------------'
for folder in $MODEL_DIR/* ; do
  mkdir -p $SERVER_BUILD_DIR/$folder
  file="$(basename -- $folder)"
  cp -r ./$folder/trained-model $API_BUILD_DIR/$folder
  cp ./$folder/Dockerfile $SERVER_BUILD_DIR/$folder
  cp ./$folder/predict.py $SERVER_BUILD_DIR/$folder
  cp ./$folder/utils.py $SERVER_BUILD_DIR/$folder
  cp ./$folder/requirements.txt $SERVER_BUILD_DIR/$folder
  cp ./$folder/config.py $SERVER_BUILD_DIR/$folder
  cp ./$folder/config.py $SERVER_BUILD_DIR/$folder

  # tensorflowjs_converter --input_format keras \
  #                      ./$folder/trained-model/$file.h5 \
  #                      $SERVER_BUILD_DIR/$folder
  echo 'built:' ./$folder '->' $SERVER_BUILD_DIR/$folder
done

echo ''
echo 'committing new build...'
echo '-----------------------'
git commit -m 'web-app re-build' $SERVER_BUILD_DIR/web-app

echo '~~~~~~~~~~~'
echo '~= Built =~'
echo '~~~~~~~~~~~'