# #!/bin/bash

CFN_STACK_NAME=${STACK_NAME:-$(cat "$mydir"/../../config/config.json | jq -r '.cloudformationStackName')}

node src/cli/removeTanks.js $CFN_STACK_NAME
