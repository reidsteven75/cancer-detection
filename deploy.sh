#!/bin/bash

echo '~~~~~~~~~~~~'
echo '~= Deploy =~'
echo '~~~~~~~~~~~~'

echo ''
echo 'deploying...'
echo '------------'
git push heroku master

echo '~~~~~~~~~~~~~~'
echo '~= Deployed =~'
echo '~~~~~~~~~~~~~~'
echo 'https://cancer-detection-prod.herokuapp.com/'