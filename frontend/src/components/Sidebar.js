import React from 'react';
import "../styles/Sidebar.css";

function Sidebar({ username, activeUsers, selectedUser, onSelectUser }) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="user-profile">
                    <div className="user-avatar">
                        {username[0].toUpperCase()}
                        <span className="online-status"></span>
                    </div>
                    <h3>{username}</h3>
                </div>
            </div>

            <div className="user-list">
                <div className="user-list-header">
                    <h3>Active Users</h3>
                    <span className="user-count">{activeUsers.length}</span>
                </div>
                
                {activeUsers.map((user) => (
                    user.username !== username && (
                        <div
                            key={user.socketId}
                            className={`user-item ${selectedUser === user.username ? 'active' : ''}`}
                            onClick={() => onSelectUser(user.username)}
                        >
                            <div className="user-avatar">
                                {user.username[0].toUpperCase()}
                                <span className="online-status"></span>
                            </div>
                            <div className="user-info">
                                <span className="user-name">{user.username}</span>
                                <span className="user-status">Online</span>
                            </div>
                        </div>
                    )
                ))}
            </div>

            <div className="sidebar-footer">
                <div className="settings-button">
                    <span>⚙️</span>
                </div>
            </div>
        </div>
    );
}

export default Sidebar;