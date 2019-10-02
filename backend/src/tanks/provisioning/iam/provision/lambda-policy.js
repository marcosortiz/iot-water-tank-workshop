module.exports = {
    LAMBDA_POLICY: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "lambda:ListFunctions",
                    "lambda:ListEventSourceMappings",
                    "lambda:ListLayerVersions",
                    "lambda:ListLayers",
                    "lambda:GetAccountSettings",
                    "lambda:CreateEventSourceMapping"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": "lambda:*",
                "Resource": "arn:aws:lambda:*:*:layer:*"
            },
            {
                "Effect": "Allow",
                "Action": "lambda:*",
                "Resource": [
                    "arn:aws:lambda:*:*:event-source-mapping:*",
                    "arn:aws:lambda:*:*:layer:*:*",
                    "arn:aws:lambda:*:*:function:FUNCTION-NAME"
                ]
            }
        ]
    }
};