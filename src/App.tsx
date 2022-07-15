import React, { useEffect, useState } from 'react';
import { Chart } from './components/Chart';

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
      <div>
        <button
          onClick={() => {
            setIsCounting(!isCounting);
          }}
        >
          {!isCounting ? 'start' : 'stop'}
        </button>
        <button
          onClick={() => {
            setVoltages([]);
          }}
        >
          clear
        </button>
      </div>
      <Chart data={voltages} />
    </div>
  );
};

export default App;
