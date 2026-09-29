import React, { useState } from 'react';
import { Search, Mic, MicOff, Volume2, Sparkles } from 'lucide-react';
import { translations } from '../data/translations';
import { speechController } from '../utils/speechHelper';

export default function SearchVoiceBar({ lang, searchQuery, setSearchQuery, onSearchSubmit }) {
  const [isListening, setIsListening] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [recognizedVoiceText, setRecognizedVoiceText] = useState('');
  const t = translations[lang];

  const handleStartVoice = () => {
    setShowVoiceModal(true);
    setIsListening(true);
    setRecognizedVoiceText('');

    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setRecognizedVoiceText(transcript);
        setSearchQuery(transcript);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      try {
        recognition.start();
      } catch (err) {
        console.warn("Speech recognition error:", err);
      }
    } else {
      setTimeout(() => {
        const sample = lang === 'ta' ? 'தக்காளி விலை' : 'Tomato price';
        setRecognizedVoiceText(sample);
        setSearchQuery(sample);
        setIsListening(false);
      }, 1800);
    }
  };

  const handleSelectQuickVoice = (text) => {
    setRecognizedVoiceText(text);
    setSearchQuery(text);
    if (onSearchSubmit) onSearchSubmit(text);
    speechController.speak(text, lang, 'search-chip');
    setTimeout(() => {
      setShowVoiceModal(false);
    }, 400);
  };

  return (
    <>
      <div className="search-container">
        <div className="search-box">
          <Search size={22} color="#15803d" />
          <input
            type="text"
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            aria-label="Search produce and schemes"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontWeight: 'bold',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '0 8px',
                minHeight: '40px'
              }}
              title="Clear search"
            >
              ✕
            </button>
          )}
          <button
            className={`voice-mic-btn ${isListening ? 'listening' : ''}`}
            onClick={handleStartVoice}
            aria-label={t.voiceSearchTooltip}
            title={t.voiceSearchTooltip}
          >
            <Mic size={24} />
          </button>
        </div>
      </div>

      {showVoiceModal && (
        <div className="modal-backdrop" onClick={() => setShowVoiceModal(false)}>
          <div className="voice-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="voice-active-orb">
              <Mic size={40} />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
              {isListening ? t.listening : (lang === 'ta' ? 'குரல் உள்ளீடு முடிந்தது' : 'Voice Input Completed')}
            </h3>

            <p style={{ fontSize: 15, color: '#64748b', marginBottom: 16 }}>
              {lang === 'ta' 
                ? 'பயிர்களின் பெயர், சந்தை விலை அல்லது திட்டங்களை சத்தமாக கூறவும்' 
                : 'Say crop names, market prices or government schemes clearly'}
            </p>

            <div className="voice-transcript-box">
              {recognizedVoiceText || (isListening ? (lang === 'ta' ? 'பேசுங்கள்...' : 'Listening...') : '')}
            </div>

            <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
              {lang === 'ta' ? 'அல்லது விரைவாக தொடவும்:' : 'Or tap a popular search:'}
            </div>

            <div className="voice-quick-chips">
              {t.voiceExamples.map((chip, idx) => (
                <button
                  key={idx}
                  className="voice-chip"
                  onClick={() => handleSelectQuickVoice(chip)}
                >
                  <Sparkles size={14} color="#ea580c" style={{ display: 'inline', marginRight: 4 }} />
                  {chip}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowVoiceModal(false)}
              style={{
                width: '100%',
                minHeight: 48,
                background: '#16a34a',
                color: '#ffffff',
                border: 'none',
                borderRadius: 14,
                fontSize: 16,
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              {lang === 'ta' ? 'முடிந்தது' : 'Done'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
