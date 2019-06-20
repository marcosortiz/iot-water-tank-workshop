# #!/bin/bash

mydir="${0%/*}"

# Load config
mydir="${0%/*}"
TAGET_REGION=${REGION:-$(cat "$mydir"/../config/config.json | jq -r '.region')}
CFN_STACK_NAME=${STACK_NAME:-$(cat "$mydir"/../config/config.json | jq -r '.cloudformationStackName')}
EMAIL=${USERNAME:-$(cat "$mydir"/../config/config.json | jq -r '.username')}

aws cloudformation deploy --template-file template.yml --stack-name $CFN_STACK_NAME --capabilities CAPABILITY_NAMED_IAM --region $TAGET_REGION --parameter-overrides Email=$EMAIL