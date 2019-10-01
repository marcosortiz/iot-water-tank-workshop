export default {
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
                    "arn:aws:greengrass:*:*:/greengrass/definition/functions/THING-Function-Definition/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP",
                    "arn:aws:greengrass:*:*:/greengrass/definition/subscriptions/THING-Resource-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/definition/devices/THING-Device-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/definition/connectors/THING-Connector-Definition/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP/deployments/*",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/resources/THING-Resource-Definition/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/cores/THING-Core-Definition/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/connectors/THING-Connector-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/groups/GROUP/certificateauthorities/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/loggers/THING-Logger-Definition/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/cores/THING-Core-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/definition/functions/THING-Function-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/bulk/deployments/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/resources/THING-Resource-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/definition/devices/THING-Device-Definition/versions/*",
                    "arn:aws:greengrass:*:*:/greengrass/definition/loggers/THING-Logger-Definition",
                    "arn:aws:greengrass:*:*:/greengrass/things/THING/connectivityInfo",
                    "arn:aws:greengrass:*:*:/greengrass/definition/subscriptions/THING-Subscription-Definition/versions/*"
                ]
            }
        ]
    }
};