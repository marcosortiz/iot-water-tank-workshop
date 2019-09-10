# Lab 1 - Connecting to AWS IoT Core
TODO: Jon will add documentation.

## Access the AWS Management Console

Use the provided login URL to access the console sign-on web page.  Using the provided credentials, type in the **IAM user name** and **password**, and click the **Sign In** button.

You should now see the AWS Management Console home page.

## Find your Greengrass Group

On the AWS Management Console home page, type **greengrass** into the **Find Services** search bar.  Click the **IoT Greengrass** item (the first query result).

You should now be in the AWS IoT portal.  Under **Greengrass** in the left hand menu, click **Groups**.  Next, click the group card labeled with your tank number (i.e. Tank1-Group).

You should land on your Greengrass group's deployments page.

## Deploy Greengrass Configuration v1

Next, click the **Actions** drop down, and click **Deploy**. You should see a green notification message, with the message '*Started Greengrass Group deployment*'.

After starting a deployment, you should see a new deployment item appear under the **Group history overview** grid.  Your deployment will start with an '*Is Pending*' status (gray circle), progress to '*In Progress*' status (yellow circle), and finally end with '*Successfully completed*' status (green circle).

> Note: If your deployment results with a '*Failed*' status (red circle), please notify the event staff to troubleshoot.

## MQTT Test - hello/world

After confirming a '*Successfully completed*' status for your Greengrass Group deployment, open a new browser tab, and access the AWS Management Console.

On the AWS Management Console home page, type **iot core** into the **Find Services** search bar.  Click the **IoT Core** item (the first query result).

You should now be in the AWS IoT portal.  Click **Test** in the left hand menu.  Under **Subscription topic**, enter hello/world/Tank{NUMBER}, where {NUMBER} is your assigned tank number (i.e. hello/world/Tank1).

You should now see messages displayed every 5 seconds, coming from your device.  This is a simple hello world message - next, you will edit a Lambda function to publish datapoints captured from a liquid tape sensor.

## Edit Lambda Function

## Edit Greengrass Function Definition

## Edit Greengrass Subscription Definition

## Deploy Greengrass Configuration v2

## MQTT Test - sensor telemetry
---
[<- Prerequisites](0-prereqs.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[-> Lab 2 - Using The Web Application](2-webapp.md)