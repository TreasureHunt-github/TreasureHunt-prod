import React from "react";
import './ChatSection.css';

const ChatSection = ({ messages, messagesEndRef }) => {
  return (
    <div ref={messagesEndRef} className="chat-section">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.side}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSection;
