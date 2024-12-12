import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import ChatInput from './ChatInput';
import Message from './Message';
import Sidebar from './Sidebar';
import "../styles/Chat.css";

const socket = io('http://localhost:5000', {
    withCredentials: true,
    transports: ['websocket']
});

function Chat({ username }) {
    const [messages, setMessages] = useState([]);
    const [activeUsers, setActiveUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [filePreview, setFilePreview] = useState(null);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        // Add connection status logging
        socket.on('connect', () => {
            console.log('Connected to server with ID:', socket.id);
        });
    
        socket.on('connect_error', (error) => {
            console.error('Connection error:', error);
        });
    
        if (username) {
            console.log('Emitting join event for user:', username);
            socket.emit('join', username);
        }
    
        socket.on('updateUserList', (users) => {
            console.log('Active users updated:', users);
            setActiveUsers(users.filter(user => user.username !== username));
        });
    
        socket.on('receive_private_message', (data) => {
            console.log('Received message:', data);
            setMessages(prev => [...prev, data]);
        });
    
        socket.on('message_sent', (response) => {
            console.log('Message sent status:', response);
        });
    
        return () => {
            socket.off('connect');
            socket.off('connect_error');
            socket.off('updateUserList');
            socket.off('receive_private_message');
            socket.off('message_sent');
        };
    }, [username]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (message.trim() && selectedUser) {
            console.log('Sending message to:', selectedUser);
            const messageData = {
                sender: username,
                receiver: selectedUser,
                message: message.trim()
            };
            
            socket.emit('send_private_message', messageData);
            
            // Add message to local state
            setMessages(prev => [...prev, { ...messageData, timestamp: new Date() }]);
            setMessage('');
        }
    }, [message, selectedUser, username]);

    const handleTyping = (text) => {
        setMessage(text);
        if (selectedUser) {
            socket.emit('typing', { user: username, receiver: selectedUser });
        }
    };

    const onEmojiClick = (event, emojiObject) => {
        setMessage(prevMessage => prevMessage + emojiObject.emoji);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFilePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="chat-container">
            <Sidebar
                username={username}
                activeUsers={activeUsers}
                selectedUser={selectedUser}
                onSelectUser={setSelectedUser}
            />
            
            <div className="chat-box">
                {selectedUser ? (
                    <>
                        <div className="chat-header">
                            <h3>Chat with {selectedUser}</h3>
                        </div>
                        <div className="messages">
                            {messages
                                .filter(msg => 
                                    (msg.sender === selectedUser && msg.receiver === username) ||
                                    (msg.sender === username && msg.receiver === selectedUser)
                                )
                                .map((msg, index) => (
                                    <Message
                                        key={index}
                                        text={msg.message}
                                        isSender={msg.sender === username}
                                        time={new Date(msg.timestamp).toLocaleTimeString()}
                                    />
                                ))}
                        </div>
                        <ChatInput
                            message={message}
                            setMessage={handleTyping}
                            handleSubmit={handleSubmit}
                            onEmojiClick={onEmojiClick}
                            showEmojiPicker={showEmojiPicker}
                            setShowEmojiPicker={setShowEmojiPicker}
                            handleFileUpload={handleFileUpload}
                            filePreview={filePreview}
                            setFilePreview={setFilePreview}
                        />
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <h3>Welcome, {username}!</h3>
                        <p>Select a user to start chatting</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Chat;