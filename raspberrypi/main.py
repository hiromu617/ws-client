import asyncio
import websockets
import time
import json
import random
import serial
ser = serial.Serial('/dev/ttyUSB0', 115200)

async def hello():
    uri = "ws://abracadabrant-chaise-74400.herokuapp.com/ws"
    async with websockets.connect(uri) as websocket:
        while True:
            time.sleep(0.3)
            voltage = read_voltage()
            data = {
                'type': 'voltageData',
                'data': voltage
            }
            print(data)
            if voltage:
                await websocket.send(json.dumps(data))

            rcv = await websocket.recv()
            if rcv == "stop":
                print("stopped")
                break


def read_voltage():
    ser.readline().decode()
    output = []
    while ser.in_waiting:
        list = ser.readline().decode().split('\t')
        if len(list) == 1:
            continue
        output.append(float(list[1].split('V')[0]))
        if len(output) == 9:
            return output

asyncio.run(hello())
