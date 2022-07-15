import React, { useEffect, useState } from 'react';

const socket = new WebSocket('ws://localhost:4567/ws');

const App = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [voltages, setVoltages] = useState<number[]>([]);
  const [inputText, setInputText] = useState('');
  const [isCounting, setIsCounting] = useState(false);

  useEffect(() => {
    if (!isCounting) return;
    const id = setInterval(() => {
      const num = Math.random();
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
    if (message.type === 'voltageData') {
      setVoltages([...voltages, message.data]);
      return;
    }
    if (message.type === 'message') {
      setMessages([...messages, message.data]);
    }
  };

  const sendMessage = () => {
    if (!socket) return;
    socket.send(JSON.stringify({ type: 'message', data: inputText }));
    setInputText('');
  };

  return (
    <div className="App">
      <div>
        <input
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
        <button onClick={sendMessage}>send</button>
      </div>
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
            setMessages([]);
          }}
        >
          clear
        </button>
      </div>
      {messages.map((message, i) => (
        <div key={i}>{message}</div>
      ))}
    </div>
  );
};

export default App;
