import React, { useEffect, useState } from 'react';
import { Chart } from './components/Chart';
import { Button, Flex, Grid, GridItem } from '@chakra-ui/react';

const socket = new WebSocket('ws://localhost:4567/ws');

const App = () => {
  const [voltages, setVoltages] = useState<[number, number][]>([]);
  const [isCounting, setIsCounting] = useState(false);

  // ラズパイの代わり
  useEffect(() => {
    if (!isCounting) return;
    const id = setInterval(() => {
      const num = Math.floor(Math.random() * 100);
      socket.send(JSON.stringify({ type: 'voltageData', data: num }));
    }, 1000);

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
    if (!event.data) {
      return;
    }
    const message = JSON.parse(event.data);
    console.log(message);
    if (message.type === 'voltageData') {
      setVoltages([...voltages, [Date.now(), message.data]]);
      return;
    }
  };

  return (
    <div className="App">
      <Flex gap={4} p={4}>
        <Button
          onClick={() => {
            setIsCounting(!isCounting);
          }}
        >
          {!isCounting ? 'start' : 'stop'}
        </Button>
        <Button
          onClick={() => {
            setVoltages([]);
          }}
        >
          clear
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
              <Chart data={voltages} />
            </GridItem>
          );
        })}
      </Grid>
    </div>
  );
};

export default App;
