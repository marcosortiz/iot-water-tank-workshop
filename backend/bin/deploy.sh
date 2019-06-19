# #!/bin/bash

# Load config
mydir="${0%/*}"
BACKEND_REGION=${REGION:-$(cat "$mydir"/../../config/config.json | jq -r '.region')}
S3_SAM_BUCKET=${SAM_BUCKET:-$(cat "$mydir"/../../config/config.json | jq -r '.samS3BucketName')}
CFN_STACK_NAME=${STACK_NAME:-$(cat "$mydir"/../../config/config.json | jq -r '.cloudformationStackName')}
COGNITO_USERNAME=${USERNAME:-$(cat "$mydir"/../../config/config.json | jq -r '.username')}

# Execute sam commands to deploy the package
aws s3 mb s3://$S3_SAM_BUCKET --region $BACKEND_REGION
sam build
sam package --template-file template.yaml --output-template-file packaged.yaml --s3-bucket $S3_SAM_BUCKET --region $BACKEND_REGION
sam deploy --template-file packaged.yaml --stack-name $CFN_STACK_NAME --capabilities CAPABILITY_NAMED_IAM --region $BACKEND_REGION --parameter-overrides Username=$COGNITO_USERNAME