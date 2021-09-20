#!/bin/bash -l
npm i -g serverless@$SLS_VERSION
### Install serverless plugins ###
IFS=', ' read -ra plugin <<< ${PLUGINS//[[:blank:]]/}
for i in "${plugin[@]}"
do
    serverless plugin install --name $i
done

echo "::set-output name=version::$(serverless --version)"
sls $1 --stage $STAGE  
#serverless--masterAlias
