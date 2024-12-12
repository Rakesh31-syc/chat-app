import React, { useState } from 'react';
import { Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Chat from './components/Chat';
import './styles/App.css';



function App() {
    const [username, setUsername] = useState(null);
    const navigate = useNavigate();

    
    const handleLogin = ({ username, password }) => {
        
        const users = JSON.parse(localStorage.getItem('users')) || [];

        
        const userExists = users.some(user => user.username === username && user.password === password);

        if (userExists) {
            setUsername(username); 
            navigate('/chat'); 
        } else {
            alert('Invalid credentials. Please try again.');
        }
    };


    const handleLogout = () => {
        setUsername(null); 
        navigate('/'); 
    };

    return (
        <div>
            {username && (
                <header>
                    <h2>Welcome, {username}</h2>
                    <button onClick={handleLogout}>Logout</button>
                </header>
            )}
            <Routes>
                <Route
                    path="/"
                    element={
                        username ? (
                            <Navigate to="/chat" />
                        ) : (
                            <Login onLogin={handleLogin} />
                        )
                    }
                />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={username ? <Chat username={username} /> : <Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </div>
    );
}

export default App;
