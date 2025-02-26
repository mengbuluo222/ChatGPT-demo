import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { Input, Button, List, Card, Space, message } from 'antd';
import 'antd/dist/reset.css'; // 导入重置样式

const ChatApp = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [loading, setLoading] = useState(false);
  // 存储聊天消息的状态
  const [messages, setMessages] = useState([
    { id: 1, text: 'Welcome to the chat interface!', sender: 'bot' },
  ]);
  // 存储用户输入的消息状态
  const [inputValue, setInputValue] = useState('');
  // 存储用户钱包地址
  const [account, setAccount] = useState(null);

  useEffect(() => {
    // 检查 MetaMask 是否已安装
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' })
        .then(accounts => {
          setAccount(accounts[0]);
        })
        .catch(error => {
          console.error('User denied account access:', error);
        });
    } else {
      console.error('MetaMask is not installed');
    }
  }, []);

  // 处理用户发送消息的函数
  const handleSendMessage = () => {
    setLoading(true);
    if (inputValue.trim() === '') return;
    const newMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
    };
    // 更新消息列表
    setMessages([...messages, newMessage]);
    // 清空输入框
    setInputValue('');

    // 获取回答
    async function askQuestion(inputValue) {
      try {
        const response = await axios.get(`http://localhost:3001/api/chat/0?question=${encodeURIComponent(inputValue)}`);
        return response.data;
      } catch (error) {
        // console.error('调用接口失败:', error);
        throw error;
      }finally {
        // 结束加载
        setLoading(false);
      }
    }
    askQuestion(inputValue).then((answer) => {
      
      const responseMessage = {
        id: messages.length + 2,
        text: answer.result,
        sender: 'bot',
      };
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
    });
  };

  // 处理输入框内容变化的函数
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // 处理按下回车键发送消息的函数
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Approve Access 请求
  const handleApproveAccess = async() => {    
    if (!account) {
      message.error('Please connect to MetaMask first');
      return;
    }

    try {
      // 连接到以太坊钱包
      const provider = new ethers.BrowserProvider(window.ethereum);
      // 获取签名者
      const signer = await provider.getSigner(account);
      // 获取当前网络的 chainId
      const network = await provider.getNetwork();
      const chainId = network.chainId;
      // 构造签名数据
      const domain = {
        name: 'ChatApp',
        version: '1',
        chainId: chainId, // 主网，测试网可以使用 3 或其他
        verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC', // 替换为你的合约地址
      };
  
      const types = {
        Approval: [
          { name: 'message', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      };
  
      const messageData = {
        message: 'Approve Access',
        timestamp: Math.floor(Date.now() / 1000),
      };

      console.log('signer', signer);
      const signature = await signer.signTypedData(domain, types, messageData);
      console.log('Signature', signature);
      
      
      axios.post('/memory/approve-access', { message: messageData, signature, domain, types, chainId })
        .then(response => {
          console.log('Approved access:', response);
          setMessages(prevMessages => [...prevMessages, { id: Date.now(), text: 'Access successful', sender: 'bot' }]);
        })
        .catch(error => {
          console.error('Error approving access:', error);
          message.error('Access failure');
        });
      
    } catch (error) {
      console.log('Error signing message:', error);
      
      // message.error('Signature failure');
      messageApi.open({
        type: 'error',
        content: 'This is an error message',
      });
    }
};
// reject Access 请求
const handleRejectAccess = () => {
    axios.post('/memory/reject-access')
    // axios.post('http://localhost:3001/api/reject')
        .then(response => {
            setMessages(prevMessages => [...prevMessages, response.data.receivedData]);
        })
        .catch(error => {
            console.error('Error rejecting access:', error);
        });
};

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <Card title="Chat">
        <List
          dataSource={messages}
          renderItem={(item) => (
            <List.Item
              style={{
                justifyContent: item.sender === 'user' ? 'flex-end' : 'flex-start',
                textAlign: item.sender === 'user'? 'right' : 'left',
              }}
            >
              <div
                style={{
                  backgroundColor: item.sender === 'user' ? '#e6f7ff' : '#f5f5f5',
                  padding: 10,
                  borderRadius: 5,
                  display: 'inline-block',
                  maxWidth: '80%',
                }}
              >
                <div style={{ fontWeight: 'bold', marginBottom: 5 }}>
                  {item.sender === 'user' ? 'user' : 'bot'}
                </div>
                {item.text}
              </div>
            </List.Item>
          )}
        />
        <div style={{ marginTop: 10 }}>
          {/* 加载状态 */}
          {loading && <div style={{marginTop: 10}}>Loading...</div>}
          <Input
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder="input your question..."
            style={{ flex: 1 }}
          />
          <Space style={{ marginTop: '10px'}}>
              <Button onClick={handleApproveAccess}>Approve</Button>
              <Button onClick={handleRejectAccess}>Reject</Button>
              <Button onClick={handleSendMessage}>Send</Button>
          </Space> 
          <p>Your account: { account }</p>
        </div>
      </Card>
    </div>
  );
};

export default ChatApp;