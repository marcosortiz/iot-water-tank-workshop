# Lab 4 - Setting up AWS IoT Events

AWS IoT Events is a fully managed service that makes it easy to detect and respond to events from IoT sensors and applications. Before IoT Events, you had to build custom applications to collect data, apply decision logic to detect an event, and then trigger another application to react to the event. 

## Architecure

The picture bellow highlighs the building blocks we will be working with on this lab.

![](../imgs/lab4/fig1.png)

You will leverage AWS IoT Events to create custom conditional logic to monitor your tank level. Whenever the tank level exceeds the maximum threshold value, your logic will push a notification to an Amazon SNS topic, so that subscripers to that topic can receive an e-mail or text message notification. The same is true, whenever the tank level comes back to a value below the maximum level threshold.

## Step 1) Create an AWS IoT Even Detector Model

For time constraints reasons, you will not create the detector model from scratch. You will leverage an existing template and edit it to create your detector model.

<details>
    <summary>1) Exporting the detector model template</summary>

- Open a new tab in your browser and go to the [IoT Events Detector models page](https://us-east-1.console.aws.amazon.com/iotevents/home?region=us-east-1#/detectormodel).
- On the **Detector models** table, click the radio button to the left of the **TankLevelThresholds** detector model and then click **Actions**>**Export detector model**.
- A pop up dialog will show up, click **Export** and save it as a file on your computer and close the pop up dialog.

![](../imgs/lab4/fig2.gif)
</details>

<details>
    <summary>2) Editing exported detector model file</summary>

Open the file, replace every occurence of **input.tankLevel** for **input.Tank1** and save it.

> **Note:** For documentation purpose, we will assume you are monitoring **Tank1**. If you are using another tank, please use your tank name. For example, if you are working on **Tank2**, you will replace every occurence of **input.tankLevel** for **input.Tank2**.

![](../imgs/lab4/fig3.gif)
</details>

<details>
    <summary>3) Importing detector model</summary>

> **Note:** For documentation purpose, we will assume you are monitoring **Tank1**. If you are using another tank, please replace any occurances of **Tank1** by your tank name.

- Go back to the [IoT Events Detector models page](https://us-east-1.console.aws.amazon.com/iotevents/home?region=us-east-1#/detectormodel). On the **Detector models** table, click **Actions**>**Import detector model**
- A pop up dialog will show up, click **Import**, select the file you edited and click open.
- On the top right corner of the screen, click **Publish**.
- A pop up dialog will open. Change the **Detector model name** from TankLevelThresholds to **Tank1** and click **Save and publish**.
- On the top right corner of the screen, click **Publish**. You will be redirected to the main detector models screen.

![](../imgs/lab4/fig4.gif)
</details>

<details>
    <summary>4) Checking your tank state</summary>

> **Note:** For documentation purpose, we will assume you are monitoring **Tank1**. If you are using another tank, please click on the appropriate tank link.
> 

- On the **Detector models** table, click on **Tank1** link on the **Name** column.
- On the **Detectors** panel, you should see your tank state up in up to 15 seconds.
- Click on **Tank1** under the **Key value** column. You will then be able to see more information about your tank on the **Variables** panel.

![](../imgs/lab4/fig5.gif)
</details>


## Step 2) Understanding The Detector Model
Now that you created the detector model for your tank, lets take a minute to understand its logic. The picture bellow illustrates your detector model implementation:

![](../imgs/lab4/fig6.png)

<details>
    <summary>Your detector model has 3 states: Initializing, Normal and Dangerous (click for details).</summary>

1. **Initializing:** After you publish your detector mode, whenever it receives the first input data, it will go to the initializing state. The state has 2 events:
   1. **OnEnter:** Whenever the detector model enters this state, it initializes the following variables:
      1. **maxThreshold:** set to 85(%).
      2. **maxThresholdExceeded:** set to false.
      3. **tankLevel:** set to whatever tankLevel we are receiving as input from the tank.
   2. **OnIput:** Whenever we are on that state and receive new inputs, we set the **tankLevel** variable to the value we are receiving from the tank.
2. **Normal:** This is the state that the water tank should be whenever its **tankLevel** is not greater than **maxThreshold** (85%). This state has 3 events:
   1. **OnEnter:** Whenever we enter the into the normal state coming from the dangerous state (not the initializing state), we publish a message into **tanks/Tank1/tankLevelEvent** so that we can record that event into DynamoDB and send an SNS notification for subscribed users.
   2. **OnInput:** Whenever we receive new data from the tanks, we set the following variables:
      1. **tankLevel:** set to whatever tankLevel we are receiving as input from the tank.
      2. **maxThresholdExceeded:** set to true if the tank level that we are receiving from the water tank is greater than **maxThreshold** (85%). Otherwise we set it to false.
3. **Dangerous:** This is the state that the water tank should be whenever its **tankLevel** is greater than **maxThreshold** (85%). This state has 3 events:
   1. **OnEnter:** Every single time we enter this state, we publish a message into **tanks/Tank1/tankLevelEvent** so that we can record that event into DynamoDB and send an SNS notification for subscribed users.
   2. **OnInput:** Whenever we receive new data from the tanks, we set the following variables:
      1. **tankLevel:** set to whatever tankLevel we are receiving as input from the tank.
      2. **maxThresholdExceeded:** set to false if the tank level that we are receiving from the water tank is less than or equal to **maxThreshold** (85%). Otherwise we set it to false.
</details>
<details>
    <summary>And 3 transition events: normal, thresholdExceeded and backToNormal (click for details).</summary>

1. **normal**: Whenever we enter the **Initializing** state, we will initialize the variables and always transition to the **Normal** state.
2. **thresholdExceeded:** While in the **Normal** state, whenever the **thresholdExceeded** variable is **true**, we move into the **Dangerous** state.
3. **backToNormal:** While in the **Dangerous** state, whenever the **thresholdExceeded** variable is **false**, we move into the **Normal** state.
</details>

<br/>


<details>
   <summary>Now that you understand how your detector model works, take a minute to investigate it (click for details).</summary>

   - Open a new tab in your browser and go to the [IoT Events Detector models page](https://us-east-1.console.aws.amazon.com/iotevents/home?region=us-east-1#/detectormodel).
   - Step 2.
   - Step 3.

   ![](../imgs/lab4/fig7.gif)
</details>



## Step 3) Setup SNS Subscriptions
**TODO:** Marcos will add description.

## Step 4) Inspect MQTT Topic Payload
**TODO:** Marcos will add description.

## Step 5) Trigger High Tank Level Notification
**TODO:** Marcos will add description.


---
[<- Lab 3 - AWS IoT Core Data Flow](3-iot-core-data-flow.md)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;[-> Appendix](../appendix/appendix.md)