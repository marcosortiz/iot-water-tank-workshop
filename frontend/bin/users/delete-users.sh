# #!/bin/bash

# Load config
mydir="${0%/*}"
USER_POOL_ID=$(cat "$mydir"/../../src/config/config.json | jq -r '.UserPoolId')

aws cognito-idp admin-delete-user --user-pool-id $USER_POOL_ID --username <value>