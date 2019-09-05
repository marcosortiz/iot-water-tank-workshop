# IoT Water Tank Workshop

Monitoring remote oilfield assets has always been challenging given traditional SCADA (Supervisory Control & Data Acquisition) and network limitations. With accurate real time data, oil & gas operators can reduce operating expenses, minimize downtime, and improve safety. 

In this builder session, you will learn how to setup an edge hardware and software solution to monitor a water tank level. We will use the following AWS services: AWS IoT Greengrass, AWS IoT Core, AWS IoT Events, Amazon CloudWatch, Amazon DynamoDB and Amazon SNS.

The picture bellow, illustrates the overall architecture of what we will be building.

![](docs/imgs/overall-architecture.png)

On the left hand side, you can see the water tank device. It has a tank level sensors connected to a device running AWS GreenGrass that will send telemetry data to AWS IoT Core. Once telemetry data is received on AWS IoT Core, it will:

1. Save a **tankLevel** custom metric on Amazon CloudWatch, so that we can plot tank level values over time.
2. Pushes the data through AWS IoT Events, so we can keep track if the tank level is within acceptable thresholds or not. Whenever the tank level exceeds the maximum threshold value, it will push a notification to an Amazon SNS topic, so that subscripers to that topic can receive an e-mail or text message notification. The same is true, whenever the tank level comes back to a value below the maximum level threshold.

On the right hand side, you have a user that accesses a website running on S3 to monitor the water tank level. The website interact with 3 AWS services:

1. It subscribes to an AWS IoT Core topic, to receive live telemetry from the tank.
2. It can fetch historical water tank levels from Amazon CloudWatch logs
3. I also fetchs an Amazon DynamoDB table, to display tank level threshold events.

The animation bellow will give you an idea of what the user experience is like on that web application.

![](docs/imgs/webapp-ux.gif)


## Builder Session Instructions

To get started with this builder session hands-on activities, please check our [documentation](docs/instructions/0-getting-started.md).