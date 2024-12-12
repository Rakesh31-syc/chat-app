import React, { useState } from 'react';
import "../styles/Message.css";

function Message({ text, time, isSender, status }) {
    const [showReactions, setShowReactions] = useState(false);
    const [reactions, setReactions] = useState([]);

    const handleReaction = (emoji) => {
        setReactions([...reactions, emoji]);
        setShowReactions(false);
    };

    const getStatusIcon = () => {
        switch(status) {
            case 'sent': return '✓';
            case 'delivered': return '✓✓';
            case 'read': return '✓✓';
            default: return '';
        }
    };

    return (
        <div className={`message ${isSender ? 'sender' : 'receiver'}`}>
            <p className="message-text">{text}</p>
            
            <div className="message-footer">
                <span className="message-time">{time}</span>
                {isSender && <span className="message-status">{getStatusIcon()}</span>}
            </div>

            {reactions.length > 0 && (
                <div className="message-reactions">
                    {reactions.map((reaction, index) => (
                        <span key={index} className="reaction">{reaction}</span>
                    ))}
                </div>
            )}

            <button 
                className="reaction-button"
                onClick={() => setShowReactions(!showReactions)}
            >
                😊
            </button>

            {showReactions && (
                <div className="reaction-picker">
                    {['👍', '❤️', '😊', '😂', '😮', '😢'].map(emoji => (
                        <span
                            key={emoji}
                            onClick={() => handleReaction(emoji)}
                            className="reaction-option"
                        >
                            {emoji}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Message;