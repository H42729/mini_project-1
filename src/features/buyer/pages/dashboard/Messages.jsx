import React from 'react';
import { Truck, Send } from 'lucide-react';
import './Messages.css';
import { useBuyer } from '../../context/BuyerContext';

export default function Messages() {
  const {
    messages,
    replyText,
    setReplyText,
    handleSendMessage,
    t
  } = useBuyer();

  return (
    <div className="buyer-view-container animate-fade-in">
      <div className="buyer-view-header">
        <div>
          <h1 className="buyer-view-title">{t('messages.title')}</h1>
          <p className="buyer-view-subtitle">
            {t('messages.subtitle')}
          </p>
        </div>
      </div>

      <div className="buyer-chat-card">
        <div className="buyer-chat-header">
          <div className="buyer-chat-participant">
            <div className="buyer-chat-avatar">
              <Truck size={18} />
            </div>
            <div>
              <h4 className="buyer-chat-name">{t('messages.activeChannel')}</h4>
              <p className="buyer-chat-status">
                <span className="status-live-beacon" /> {t('messages.participants')}
              </p>
            </div>
          </div>
        </div>

        <div className="buyer-chat-messages">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`buyer-message-bubble ${m.isBuyer ? 'buyer-own' : 'buyer-external'}`}
            >
              <div className="buyer-msg-meta">
                <span className="buyer-msg-sender">{m.sender}</span>
                <span className="buyer-msg-role">({m.role})</span>
                <span className="buyer-msg-time">{m.time}</span>
              </div>
              <p className="buyer-msg-text">{m.text}</p>
            </div>
          ))}
        </div>

        <form className="buyer-chat-input-bar" onSubmit={handleSendMessage}>
          <input
            type="text"
            className="buyer-chat-input"
            placeholder={t('messages.inputPlaceholder')}
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
          />
          <button type="submit" className="buyer-btn-primary">
            <Send size={15} />
            <span>{t('messages.send')}</span>
          </button>
        </form>
      </div>
    </div>
  );
}
