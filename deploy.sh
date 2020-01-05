#!/bin/bash

echo '~~~~~~~~~~~~'
echo '~= Deploy =~'
echo '~~~~~~~~~~~~'

echo ''
echo 'deploying...'
echo '------------'
# git subtree push --prefix server heroku master
git push heroku `git subtree split --prefix server master`:master --force

echo '~~~~~~~~~~~~~~'
echo '~= Deployed =~'
echo '~~~~~~~~~~~~~~'
echo 'https://cancer-detection-prod.herokuapp.com/'