import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import ChatPage from './components/ChatPage';
import ChatPage from './components/Chat';

function App() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const response = await axios.get('http://localhost:3001/api/data');
    //             setData(response.data);
    //         } catch (err) {
    //             setError(err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();
    // }, []);

    // if (loading) {
    //     return <div>加载中...</div>;
    // }

    // if (error) {
    //     return <div>出错了：{error.message}</div>;
    // }

    return (
        <div className="App">
          <ChatPage />
        </div>
    );
}

export default App;