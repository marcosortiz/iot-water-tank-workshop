# #!/bin/bash

# Load config
mydir="${0%/*}"
USER_POOL_ID=$(cat "$mydir"/../../src/config/config.json | jq -r '.UserPoolId')
BACKEND_REGION=${REGION:-$(cat "$mydir"/../../src/config/config.json | jq -r '.region')}

aws cognito-idp admin-create-user --user-pool-id $USER_POOL_ID --username <email> --region $BACKEND_REGION