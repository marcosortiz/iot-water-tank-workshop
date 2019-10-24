module.exports = {
    IOT_CORE_POLICY: {
        "Version": "2012-10-17",
        "Statement": [
            {
                "Effect": "Allow",
                "Action": [
                    "iot:DescribeAccountAuditConfiguration",
                    "iot:DescribeAuditTask",
                    "iot:DescribeAuthorizer",
                    "iot:DescribeBillingGroup",
                    "iot:DescribeCACertificate",
                    "iot:DescribeCertificate",
                    "iot:DescribeDefaultAuthorizer",
                    "iot:DescribeEndpoint",
                    "iot:DescribeEventConfigurations",
                    "iot:DescribeIndex",
                    "iot:DescribeJob",
                    "iot:DescribeJobExecution",
                    "iot:DescribeRoleAlias",
                    "iot:DescribeScheduledAudit",
                    "iot:DescribeSecurityProfile",
                    "iot:DescribeStream",
                    "iot:DescribeThing",
                    "iot:DescribeThingGroup",
                    "iot:DescribeThingRegistrationTask",
                    "iot:DescribeThingType",
                    "iot:GetEffectivePolicies",
                    "iot:GetIndexingConfiguration",
                    "iot:GetJobDocument",
                    "iot:GetLoggingOptions",
                    "iot:GetOTAUpdate",
                    "iot:GetPendingJobExecutions",
                    "iot:GetPolicy",
                    "iot:GetPolicyVersion",
                    "iot:GetRegistrationCode",
                    "iot:GetStatistics",
                    "iot:GetThingShadow",
                    "iot:GetTopicRule",
                    "iot:GetV2LoggingOptions",
                    "iot:ListActiveViolations",
                    "iot:ListAttachedPolicies",
                    "iot:ListAuditFindings",
                    "iot:ListAuditTasks",
                    "iot:ListAuthorizers",
                    "iot:ListBillingGroups",
                    "iot:ListCACertificates",
                    "iot:ListCertificates",
                    "iot:ListCertificatesByCA",
                    "iot:ListIndices",
                    "iot:ListJobExecutionsForJob",
                    "iot:ListJobExecutionsForThing",
                    "iot:ListJobs",
                    "iot:ListOTAUpdates",
                    "iot:ListOutgoingCertificates",
                    "iot:ListPolicies",
                    "iot:ListPolicyPrincipals",
                    "iot:ListPolicyVersions",
                    "iot:ListPrincipalPolicies",
                    "iot:ListPrincipalThings",
                    "iot:ListRoleAliases",
                    "iot:ListScheduledAudits",
                    "iot:ListSecurityProfiles",
                    "iot:ListSecurityProfilesForTarget",
                    "iot:ListStreams",
                    "iot:ListTagsForResource",
                    "iot:ListTargetsForPolicy",
                    "iot:ListTargetsForSecurityProfile",
                    "iot:ListThingGroups",
                    "iot:ListThingGroupsForThing",
                    "iot:ListThingPrincipals",
                    "iot:ListThingRegistrationTaskReports",
                    "iot:ListThingRegistrationTasks",
                    "iot:ListThings",
                    "iot:ListThingsInBillingGroup",
                    "iot:ListThingsInThingGroup",
                    "iot:ListThingTypes",
                    "iot:ListTopicRules",
                    "iot:ListV2LoggingLevels",
                    "iot:ListViolationEvents",
                    "iot:SearchIndex",
                    "iot:TestAuthorization",
                    "iot:TestInvokeAuthorizer",
                    "iot:ValidateSecurityProfileBehaviors"
                ],
                "Resource": "*"
            },
            {
                "Effect": "Allow",
                "Action": [
                    "iot:Connect",
                    "iot:CreateTopicRule",
                    "iot:DeleteTopicRule",
                    "iot:DisableTopicRule",
                    "iot:EnableTopicRule",
                    "iot:Publish",
                    "iot:Receive",
                    "iot:ReplaceTopicRule",
                    "iot:Subscribe",
                    "iot:UpdateThing",
                    "iot:UpdateThingShadow"
                ],
                "Resource": [
                    "arn:aws:iot:*:*:client/CLIENT-ID",
                    "arn:aws:iot:*:*:rule/RULE-NAME",
                    "arn:aws:iot:*:*:thing/THING-NAME",
                    "arn:aws:iot:*:*:topic/TOPIC-NAME",
                    "arn:aws:iot:*:*:topicfilter/TOPIC-FILTER",
                ]
            }
        ]
    }
}