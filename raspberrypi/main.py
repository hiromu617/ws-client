import asyncio
import websockets
import time
import json
import random

async def hello():
    uri = "ws://localhost:4567/ws"
    async with websockets.connect(uri) as websocket:
        while True:
            time.sleep(0.3)
            data = {
                'type': 'voltageData',
                'data': [
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                    random.randint(0,100),
                ]
            }
            print(data)
            await websocket.send(json.dumps(data))
            rcv = await websocket.recv()
            if rcv == "stop":
                print("stopped")
                break

asyncio.run(hello())
