import React from 'react';

class ReceiptModal extends React.Component {
  constructor(props) {
    super(props);
    // Bind methods
    this.handlePrint = this.handlePrint.bind(this);
  }

  handlePrint() {
    window.print();
  }

  render() {
    const { show, content, onClose } = this.props;

    if (!show) return null;

    return (
      <div 
        className="modal-overlay" 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="receipt-title"
      >
        <div className="modal-content receipt-modal">
          <button 
            className="close-btn" 
            onClick={onClose}
            aria-label="Zavřít účtenku"
          >
            ×
          </button>
          <h2 id="receipt-title">Účtenka</h2>
          
          <div 
            className="receipt-content"
            role="document"
            aria-label="Obsah účtenky"
          >
            <pre>{content}</pre>
          </div>
          
          <div className="modal-actions">
            <button 
              className="print-btn" 
              onClick={this.handlePrint}
              aria-label="Vytisknout účtenku"
            >
              Tisknout
            </button>
            <button 
              className="close-modal-btn" 
              onClick={onClose}
              aria-label="Zavřít účtenku"
            >
              Zavřít
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ReceiptModal;