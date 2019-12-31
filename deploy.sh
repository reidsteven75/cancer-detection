#!/bin/bash

echo '~~~~~~~~~~~~'
echo '~= Deploy =~'
echo '~~~~~~~~~~~~'

echo ''
echo 'deploying...'
echo '------------'
git push origin `git subtree split --prefix api master`:master --force

echo '~~~~~~~~~~~~~~'
echo '~= Deployed =~'
echo '~~~~~~~~~~~~~~'
echo 'https://cancer-detection-prod.herokuapp.com/'