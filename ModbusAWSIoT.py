#
# Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#

# ModbusToAWSIoT.py
# This is an example script that connects to a modbus slave device to read
# a temperature value and publish to an MQTT Topic in AWS IoT every 5 seconds.
# If an exception occurs, it will wait 5 seconds and try again.
# Since the function is long-lived it will run forever when deployed to a
# Greengrass core.  The handler will NOT be invoked in our example since
# we are executing an infinite loop.

import greengrasssdk
import platform
from threading import Timer
import time
import logging
import sys
import os
import json
import uuid
import socket
# import pymodbus libraries for the modbus client
from pymodbus.client.sync import ModbusTcpClient as ModbusClient
from pymodbus.payload import BinaryPayloadDecoder
from pymodbus.payload import BinaryPayloadBuilder
from pymodbus.constants import Endian
from pymodbus.compat import iteritems

# Instantiate the client for your modbus slave device. In this example we are
# using the local IP address where a simulator exists. Change this to your
# desired IP. In addition, the typical default port for Modbus TCP is 502. For
# this example, 5020 was used.
mbclient = ModbusClient('192.168.4.125', port=502)

# Default port for modbus slave is typically 502. Using 5020 for simulation to
# avoid root permissions.
logger = logging.getLogger(__name__)
logging.basicConfig(stream=sys.stdout, level=logging.DEBUG)

# Creating a greengrass core sdk client
client = greengrasssdk.client('iot-data')

# in an infinite loop, this procedure will poll the bearing temperature from a
# modbus slave device (simulator) and publish the value to AWS IoT via MQTT.

def report_initial_state():

    host_name = socket.gethostname() 
    host_ip = socket.gethostbyname(host_name) 

    initialState = {
        'state': {
            'reported': {
            'telemetryPerMinRate': 4,
            'minTankLevelThreshold': 15,
            'maxTankLevelThreshold': 85,
            'ipAddress': host_ip
            }
        },
        'clientToken': str(uuid.uuid4())
    }

    THING_NAME = os.environ['THING_NAME']

    client.update_thing_shadow(
        thingName=THING_NAME,
        payload=json.dumps(initialState)
    )

def poll_level():
    
    THING_NAME = os.environ['THING_NAME']
    # MIN = 2.685
    # MAX = 3.21
    MIN = float(os.environ['SENSOR_MIN'])
    MAX = float(os.environ['SENSOR_MAX'])
    DIFF = MAX-MIN
    count = 0
    payload = {
        'telemetry': []
    }
    while True:

        
        try:

            for i in range(0, 15): 
                # connect to modbus slave device
                mbclient.connect()
                # set the address and number of bytes that will be read on the modbus device
                ADDRESS = int(os.environ['ADDRESS'])
                THING_NAME = os.environ['THING_NAME']
                count = 2
                # read the holding register value for the temperature
                rr = mbclient.read_input_registers(ADDRESS, count, unit=1)
                # decode results as a 32 bit float
                decoder = BinaryPayloadDecoder.fromRegisters(rr.registers,
                    byteorder=Endian.Big,
                    wordorder=Endian.Little)
                decoded = {
                    'float': decoder.decode_32bit_float()
                }
                # publish results to topic in AWS IoT
                for name, value in iteritems(decoded):

                    if value < MIN:
                        percent = 0.00
                    elif value > MAX:
                        percent = 100.00
                    else:
                        # percent = ((DIFF-(MAX-value))/DIFF*100)+(225/800*100)
                        percent = (value-2.3926)/0.8392*100

                    payload['telemetry'].append(
                    {
                        'recorded_at': int(time.time()),
                        'tankLevel': round(percent,2),
                        'sensorValue': round(value,3)
                    })

                    logger.debug('Count is: ' + str(i))
                    logger.debug("Payload is: " + json.dumps(payload))
                    time.sleep(1)

            client.publish(topic='tanks/' + THING_NAME + '/telemetry', payload=json.dumps(payload))

            payload['telemetry'] = []              

        except Exception as e:
            logging.info("Error: {0}".format(str(e)))

        

report_initial_state()
poll_level()

# This is a dummy handler and will not be invoked
# Instead the code above will be executed in an infinite loop for our example


def function_handler(event, context):
    return
