import React from 'react';
import EmojiPicker from 'emoji-picker-react';
import "../styles/ChatInput.css";

function ChatInput({ 
    message, 
    setMessage, 
    handleSubmit, 
    onEmojiClick,
    showEmojiPicker,
    setShowEmojiPicker,
    handleFileUpload,
    filePreview,
    setFilePreview 
}) {
    const handleInputChange = (e) => {
        setMessage(e.target.value); // Fix: Pass the value instead of the event
    };

    return (
        <div className="chat-input-container">
            <div className="input-wrapper">
                <button 
                    className="emoji-button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                >
                    😊
                </button>
                
                <input
                    type="text"
                    value={message}
                    onChange={handleInputChange} // Use the new handler
                    placeholder="Type a message..."
                    className="chat-input-field"
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                />

                <label className="attachment-button">
                    📎
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        accept="image/*"
                    />
                </label>

                {showEmojiPicker && (
                    <div className="emoji-picker">
                        <EmojiPicker onEmojiClick={onEmojiClick} />
                    </div>
                )}
            </div>

            {filePreview && (
                <div className="file-preview">
                    <img src={filePreview} alt="Preview" />
                    <button onClick={() => setFilePreview(null)}>✕</button>
                </div>
            )}

            <button 
                className="send-button"
                onClick={handleSubmit}
            >
                ➤
            </button>
        </div>
    );
}

export default ChatInput;