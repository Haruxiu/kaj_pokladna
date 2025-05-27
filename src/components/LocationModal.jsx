import React from 'react';

class LocationModal extends React.Component {
  render() {
    const { show, info, onClose } = this.props;

    if (!show) return null;

    return (
      <div 
        className="modal-overlay" 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="location-title"
      >
        <div className="modal-content location-modal">
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Zavřít okno s polohou"
          >
            ×
          </button>
          <h2 id="location-title">Vaše poloha</h2>
          
          {info ? (
            <div 
              className="location-info"
              role="region"
              aria-label="Informace o poloze"
            >
              <p>Zeměpisná šířka: <span aria-label={`Zeměpisná šířka ${info.latitude}`}>{info.latitude}</span></p>
              <p>Zeměpisná délka: <span aria-label={`Zeměpisná délka ${info.longitude}`}>{info.longitude}</span></p>
              <p>Přesnost: <span aria-label={`Přesnost ${info.accuracy} metrů`}>{info.accuracy} metrů</span></p>
              
              <div 
                className="location-visualization"
                role="img"
                aria-label="Vizualizace vaší polohy na mapě"
              >
                <svg width="200" height="200" viewBox="0 0 200 200" aria-hidden="true">
                  <circle cx="100" cy="100" r="80" fill="lightblue" stroke="blue" strokeWidth="2"/>
                  <circle cx="100" cy="100" r="3" fill="red"/>
                  <text x="100" y="190" textAnchor="middle">Vaše poloha</text>
                </svg>
              </div>
            </div>
          ) : (
            <p role="alert">Nelze získat informace o poloze</p>
          )}
          
          <button 
            className="close-modal-btn" 
            onClick={onClose}
            aria-label="Zavřít okno s polohou"
          >
            Zavřít
          </button>
        </div>
      </div>
    );
  }
}

export default LocationModal;