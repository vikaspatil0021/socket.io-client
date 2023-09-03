import React, { FC } from 'react';
import './App.css';
import { ChatArea } from './Components/ChatArea/ChatArea';

const App: FC = () => {
  return (
    <div className="App">
      <div>
        <ChatArea />
      </div>
    </div>
  );
}

export default App;
