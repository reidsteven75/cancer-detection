#!/bin/bash

WEB_APP_BUILD_DIR=./web-app/build
API_BUILD_DIR=./api/build

# set env from .env file
ENV_FILE=$1
source $ENV_FILE

echo '~~~~~~~~~~~'
echo '~= Build =~'
echo '~~~~~~~~~~~'
echo 'ENV: '$NODE_ENV

echo 'building web-app...'
echo '------------------'
cd web-app
env NODE_ENV=$NODE_ENV \
    HTTPS=$HTTPS \
    HOST=$HOST \
    SERVER_PORT=$SERVER_PORT \
    npm run build
cd ..

echo ''
echo 'moving files for build...'
echo '-------------------------'
rm -r $API_BUILD_DIR 
mkdir -p $API_BUILD_DIR
cp -r $WEB_APP_BUILD_DIR $API_BUILD_DIR/web-app
echo 'moved:' $WEB_APP_BUILD_DIR '->' $API_BUILD_DIR 

echo ''
echo 'committing new build...'
echo '-----------------------'
git commit -m 'web-app re-build' $API_BUILD_DIR/web-app

echo '~~~~~~~~~~~'
echo '~= Built =~'
echo '~~~~~~~~~~~'