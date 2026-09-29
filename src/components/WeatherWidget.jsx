import React, { useState } from 'react';
import { Sun, CloudSun, Wind, Droplets, Volume2, VolumeX, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { mockWeatherData } from '../data/mockData';
import { translations } from '../data/translations';
import { speechController } from '../utils/speechHelper';

export default function WeatherWidget({ lang }) {
  const [isSpeakingWeather, setIsSpeakingWeather] = useState(false);
  const [showForecast, setShowForecast] = useState(false);
  const t = translations[lang];
  const w = mockWeatherData;

  const handleSpeakWeather = () => {
    const audioText = lang === 'ta' ? w.audioTa : w.audioEn;

    if (isSpeakingWeather) {
      speechController.stop();
      setIsSpeakingWeather(false);
    } else {
      setIsSpeakingWeather(true);
      speechController.speak(audioText, lang, 'weather-advisory', () => {
        setIsSpeakingWeather(false);
      });
    }
  };

  return (
    <section className="section-wrapper" aria-label="Weather and Farming Advisory">
      <div className="section-header-row">
        <h2 className="section-title">
          <CloudSun size={22} color="#b45309" />
          {t.weatherTitle}
        </h2>
        <button
          className={`card-audio-pill ${isSpeakingWeather ? 'speaking' : ''}`}
          onClick={handleSpeakWeather}
          title={lang === 'ta' ? 'வானிலை ஆலோசனையை கேட்க' : 'Listen to advisory'}
          aria-label="Listen to weather advisory"
        >
          {isSpeakingWeather ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      <div className="weather-advisory-card">
        <div className="weather-header-row">
          <div className="weather-temp-group">
            <div className="weather-icon-sun">
              <Sun size={32} />
            </div>
            <div>
              <div className="temp-digits">{w.temp}</div>
              <div className="weather-condition-text">
                {lang === 'ta' ? w.conditionTa : w.conditionEn}
              </div>
            </div>
          </div>

          <div className="weather-stats">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
              <Droplets size={14} color="#0284c7" />
              <span>{w.humidity} ஈரப்பதம்</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4, marginTop: 4 }}>
              <Wind size={14} color="#0d9488" />
              <span>{lang === 'ta' ? w.wind : w.windEn}</span>
            </div>
          </div>
        </div>

        <div className="advisory-body">
          <div className="advisory-title-row">
            <span className="advisory-badge">
              <Sparkles size={16} />
              {t.harvestAdvisory}
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', background: '#dcfce7', padding: '2px 8px', borderRadius: 4 }}>
              {lang === 'ta' ? 'உறுதி செய்யப்பட்டது' : 'Verified'}
            </span>
          </div>
          <p className="advisory-text-ta">
            {lang === 'ta' ? w.advisoryTa : w.advisoryEn}
          </p>
        </div>

        <button
          onClick={() => setShowForecast(!showForecast)}
          style={{
            marginTop: 12,
            width: '100%',
            background: 'rgba(255, 255, 255, 0.6)',
            border: '1px solid #fde047',
            borderRadius: 10,
            padding: '8px 12px',
            minHeight: 38,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            fontSize: 13,
            fontWeight: 700,
            color: '#854d0e'
          }}
        >
          <span>{lang === 'ta' ? 'அடுத்த 3 நாட்கள் விவசாய வானிலை' : '3-Day Agricultural Forecast'}</span>
          {showForecast ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showForecast && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 10 }}>
            {[
              { dayTa: "நாளை", dayEn: "Tomorrow", temp: "32°C", rain: "0%", icon: "☀️", noteTa: "அறுவடைக்கு உகந்தது", noteEn: "Good for harvest" },
              { dayTa: "வியாழன்", dayEn: "Thursday", temp: "30°C", rain: "10%", icon: "🌤️", noteTa: "உலர்த்த சிறந்த நாள்", noteEn: "Good for drying" },
              { dayTa: "வெள்ளி", dayEn: "Friday", temp: "29°C", rain: "20%", icon: "⛅", noteTa: "லேசான மேகம்", noteEn: "Partly cloudy" },
            ].map((f, i) => (
              <div key={i} style={{ background: '#fff', padding: 8, borderRadius: 10, textAlign: 'center', border: '1px solid #fef08a' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#78350f' }}>{lang === 'ta' ? f.dayTa : f.dayEn}</div>
                <div style={{ fontSize: 22, margin: '2px 0' }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#15803d' }}>{f.temp}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#65a30d' }}>{lang === 'ta' ? f.noteTa : f.noteEn}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
