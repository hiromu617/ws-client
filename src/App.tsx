import React, { useState, useRef } from 'react';
import { Chart } from './components/Chart';
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { voltageState } from './recoil/atoms';
import { send } from 'process';

const socket = new WebSocket(
  `ws://abracadabrant-chaise-74400.herokuapp.com/ws`,
);
// https://abracadabrant-chaise-74400.herokuapp.com/

//  data format
// [
//   [
//     [100000, 100],
//     [100000, 100],
//     [100000, 100],
//   ],
//   [
//     [100000, 100],
//     [100000, 100],
//     [100000, 100],
//   ],
//   [
//     [100000, 100],
//     [100000, 100],
//     [100000, 100],
//   ],
// ]

const App = () => {
  const setVoltageState = useSetRecoilState(voltageState);
  const [isCounting, setIsCounting] = useState(false);
  const [isReceived, setIsReceived] = useState(false);
  const [startTime, setStartTime] = useState(0);
  let intervalId = useRef<NodeJS.Timer | null>(null);

  socket.onopen = () => {
    console.log('socket connected');
    console.log(socket);
  };
  socket.onmessage = (event) => {
    if (!isReceived) setIsReceived(true);
    if (!event.data) {
      return;
    }
    if (event.data === 'measureTime') {
      const endTime = Date.now();
      alert(`${endTime - startTime}ms`);
      return;
    }
    const message: { type: string; data: number[] } = JSON.parse(event.data);
    if (message.type === 'voltageData') {
      const now = Date.now();
      setVoltageState((old) =>
        old.map((voltage, i) => [...voltage, [now, message.data[i]]]),
      );
      return;
    }
  };

  const start = () => {
    setIsCounting(true);
    const id = setInterval(() => {
      socket.send(
        JSON.stringify({
          type: 'voltageData',
          data: [
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
            Math.floor(Math.random() * 3),
          ],
        }),
      );
      intervalId.current = id;
    }, 300);
  };

  const stop = () => {
    if (!intervalId.current) return;
    setIsCounting(false);
    clearInterval(intervalId.current);
  };

  const measureTime = () => {
    setStartTime(Date.now());
    socket.send('measureTime');
  };

  return (
    <div>
      <Flex gap={4} p={4}>
        <Button
          onClick={() => {
            if (!isCounting) start();
            else stop();
          }}
          colorScheme={!isCounting ? 'blue' : 'red'}
        >
          {!isCounting ? 'start(simulation)' : 'stop'}
        </Button>
        <Button
          onClick={() => {
            setVoltageState([[], [], [], [], [], [], [], [], []]);
          }}
        >
          clear
        </Button>
        <Button
          disabled={!isReceived}
          onClick={() => {
            socket.send('stop');
            setIsReceived(false);
          }}
        >
          Stop
        </Button>
        <Button onClick={measureTime}>measure time</Button>
      </Flex>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(3, 1fr)"
        gap={2}
        h="full"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          return (
            <GridItem w="100%" h="30vh" bg="blue.50" key={i}>
              <Chart index={i} />
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
};

export default App;
