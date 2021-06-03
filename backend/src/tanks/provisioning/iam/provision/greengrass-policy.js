module.exports = {
    GREENGRASS_POLICY: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "greengrass:CreateSoftwareUpdateJob",
                    "greengrass:DisassociateServiceRoleFromAccount",
                    "greengrass:ListResourceDefinitions",
                    "greengrass:ListFunctionDefinitions",
                    "greengrass:ListSubscriptionDefinitions",
                    "greengrass:CreateResourceDefinition",
                    "greengrass:GetServiceRoleForAccount",
                    "greengrass:ListConnectorDefinitions",
                    "greengrass:StartBulkDeployment",
                    "greengrass:CreateSubscriptionDefinition",
                    "greengrass:CreateLoggerDefinition",
                    "greengrass:CreateCoreDefinition",
                    "greengrass:CreateDeviceDefinition",
                    "greengrass:CreateFunctionDefinition",
                    "greengrass:ListBulkDeployments",
                    "greengrass:CreateGroup",
                    "greengrass:ListDeviceDefinitions",
                    "greengrass:AssociateServiceRoleToAccount",
                    "greengrass:ListCoreDefinitions",
                    "greengrass:ListGroups",
                    "greengrass:ListLoggerDefinitions",
                    "greengrass:CreateConnectorDefinition"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": "greengrass:*",
                "Resource": [
                    "arn:aws:greengrass:*:*:/greengrass/bulk/deployments/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/connectors/CONNECTOR-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/connectors/CONNECTOR-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/cores/CORE-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/cores/CORE-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/devices/DEVICE-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/devices/DEVICE-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/functions/FUNCTION-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/functions/FUNCTION-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/loggers/LOGGER-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/loggers/LOGGER-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/resources/RESOURCE-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/resources/RESOURCE-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/subscriptions/SUBSCRIPTION-DEFINITION",
                    "arn:aws:greengrass:*:*:/greengrass/definition/subscriptions/SUBSCRIPTION-DEFINITION/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP-ID",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP-ID/certificateauthorities/*",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP-ID/deployments/*",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP-ID/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/things/THING-NAME/connectivityInfo"
                ]
            }
        ]
    }
};