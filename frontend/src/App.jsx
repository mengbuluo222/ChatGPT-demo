import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ChatPage from './components/ChatPage'; // 不加签名验证
// import ChatPage from './components/Chat'; // 加签名验证

function App() {

    return (
        <div className="App">
          <ChatPage />
        </div>
    );
}

export default App;