import React, { useEffect, useState } from 'react';
import { Chart } from './components/Chart';
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';
import { useSetRecoilState } from 'recoil';
import { voltageState } from './recoil/atoms';

const socket = new WebSocket(`ws://${process.env.REACT_APP_BASE_URL}/ws`);

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

  // ラズパイの代わり
  useEffect(() => {
    if (!isCounting) return;
    const id = setInterval(() => {
      socket.send(
        JSON.stringify({
          type: 'voltageData',
          data: [
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
            Math.floor(Math.random() * 100),
          ],
        }),
      );
    }, 500);

    return () => {
      console.log('clear');
      clearInterval(id);
    };
  }, [isCounting]);

  socket.onopen = () => {
    console.log('socket connected');
    console.log(socket);
  };
  socket.onmessage = (event) => {
    if (!isReceived) setIsReceived(true);
    if (!event.data) {
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

  return (
    <div>
      <Flex gap={4} p={4}>
        <Button
          onClick={() => {
            setIsCounting(!isCounting);
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
      </Flex>
      <Grid
        templateColumns="repeat(3, 1fr)"
        templateRows="repeat(3, 1fr)"
        gap={2}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          return (
            <GridItem w="100%" h="300" bg="blue.50" key={i}>
              <Chart index={i} />
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
};

export default App;
