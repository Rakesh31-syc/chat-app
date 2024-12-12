import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Register.css';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        // Check if fields are filled
        if (!username || !password) {
            setError('Please fill in all fields.');
            return;
        }

        // Get existing users from localStorage
        const existingUsers = JSON.parse(localStorage.getItem('users')) || [];

        // Check if the username already exists
        const userExists = existingUsers.some(user => user.username === username);

        if (userExists) {
            setError('Username already exists. Please choose another one.');
        } else {
            // Add new user and store in localStorage
            const newUser = { username, password };
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            // Navigate to the login page after registration
            navigate('/');
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                {error && <p className="error">{error}</p>}
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Register</button>
            </form>
            <p>
                Already have an account? <a href="/">Login</a>
            </p>
        </div>
    );
}

export default Register;
