import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ChatPage = () => {
    const [messages, setMessages] = useState([]);
    const [memoryInfo, setMemoryInfo] = useState(null);

    useEffect(() => {
        // Fetch chat messages
        axios.get('http://localhost:3000/chat/0')
            .then(response => {
                setMessages(response.data.messages);
                setMemoryInfo(response.data.memoryInfo);
            })
            .catch(error => {
                console.error('Error fetching chat messages:', error);
            });
    }, []);

    const handleApproveAccess = () => {
        axios.post('http://localhost:3000/memory/approve-access')
            .then(response => {
                setMessages(prevMessages => [...prevMessages, response.data.newMessage]);
            })
            .catch(error => {
                console.error('Error approving access:', error);
            });
    };

    const handleRejectAccess = () => {
        axios.post('http://localhost:3000/memory/reject-access')
            .then(response => {
                setMessages(prevMessages => [...prevMessages, response.data.newMessage]);
            })
            .catch(error => {
                console.error('Error rejecting access:', error);
            });
    };

    return (
        <div>
            <h1>Chat Messages</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>
                        <strong>{message.role}:</strong> {message.content}
                    </li>
                ))}
            </ul>
            <div>
                <h2>Memory Information</h2>
                <p>{memoryInfo ? memoryInfo.details : 'No memory information available'}</p>
            </div>
            <div>
                <button onClick={handleApproveAccess}>Approve Access</button>
                <button onClick={handleRejectAccess}>Reject Access</button>
            </div>
        </div>
    );
};

export default ChatPage;