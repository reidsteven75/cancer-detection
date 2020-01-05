#!/bin/bash

echo '~~~~~~~~~~~~'
echo '~= Deploy =~'
echo '~~~~~~~~~~~~'

echo ''
echo 'deploying...'
echo '------------'
git subtree push --prefix api heroku master

echo '~~~~~~~~~~~~~~'
echo '~= Deployed =~'
echo '~~~~~~~~~~~~~~'
echo 'https://cancer-detection-prod.herokuapp.com/'

heroku logs -t -a cancer-detection-prod