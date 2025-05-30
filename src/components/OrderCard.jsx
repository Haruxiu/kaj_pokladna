import React, { useState } from 'react';

class OrderCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showStatusChange: false,
      previousStatus: null,
      audioRef: React.createRef(),
    };
    // Bind methods
    this.handleStatusChange = this.handleStatusChange.bind(this);
    this.handleRevertStatus = this.handleRevertStatus.bind(this);
    this.getStatusInfo = this.getStatusInfo.bind(this); // Bind helper method
  }

  /**
   * Provides information (text and CSS class) for a given order status.
   * @param {string} status - The status of the order (e.g., 'pending', 'ready', 'paid').
   * @returns {{text: string, class: string}} An object containing the display text and corresponding CSS class for the status.
   */
  getStatusInfo(status) {
    switch(status) {
      case 'pending':
        return { text: 'Čeká na přípravu', class: 'pending' };
      case 'ready':
        return { text: 'Připraveno\nk platbě', class: 'ready' };
      case 'paid':
        return { text: 'Zaplaceno', class: 'paid' };
      default:
        return { text: status, class: '' };
    }
  }

  /**
   * Handles changing the status of the order.
   * Updates the status via the updateStatus prop and plays audio if the new status is 'ready'.
   * @param {string} newStatus - The new status to set for the order.
   */
  handleStatusChange(newStatus) {
    const { updateStatus, order } = this.props;
    this.setState({ previousStatus: order.status, showStatusChange: true });
    updateStatus(order.id, newStatus);
    if (newStatus === 'ready' && this.state.audioRef.current) {
      this.state.audioRef.current
        .play()
        .catch(err => console.warn('Audio playback failed:', err));
    }
  }

  /**
   * Reverts the order status to the previous status if available.
   * Used when the revert button is clicked after a status change.
   */
  handleRevertStatus() {
    const { updateStatus, order } = this.props;
    const { previousStatus } = this.state;
    if (previousStatus) {
      updateStatus(order.id, previousStatus);
      this.setState({ showStatusChange: false, previousStatus: null });
    }
  }

  render() {
    const { order, compact, updateStatus } = this.props;
    const { showStatusChange, previousStatus } = this.state;

    const statusInfo = this.getStatusInfo(order.status);
    const total = order.items.reduce((sum, item) => sum + item.price, 0);

    const audioSrc = '/kaj_pokladna/sounds/prepared.mp3';

  
    return (
      <div className={`order-card ${compact ? 'compact' : ''}`} role="article">

        <audio ref={this.state.audioRef} preload="auto">
          <source src= {audioSrc} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
        
        <div className="order-header">
          <div>
            <h3>Objednávka #{order.id.toString().slice(-4)}</h3>
            {!compact && <div className="table-info" role="status">{order.tableName}</div>}
          </div>
          <div className="order-status">
            {showStatusChange ? (
              <div className="status-change">
                <span
                  className={`status-badge ${statusInfo.class}`}
                  role="status"
                  aria-label={`Stav objednávky: ${statusInfo.text}`}
                >
                  {statusInfo.text}
                </span>
                <button
                  className="revert-btn"
                  onClick={this.handleRevertStatus}
                  aria-label="Vrátit předchozí stav"
                >
                  ↩
                </button>
              </div>
            ) : (
              <span
                className={`status-badge ${statusInfo.class}`}
                role="status"
                aria-label={`Stav objednávky: ${statusInfo.text}`}
              >
                {statusInfo.text}
              </span>
            )}
          </div>
        </div>
        
        <div className="order-items" role="list">
          {order.items.map((item, index) => (
            <div key={index} className="order-item" role="listitem">
              <span>{item.name}</span>
              <span aria-label={`${item.price} Kč`}>{item.price} Kč</span>
            </div>
          ))}
        </div>
        
        <div className="order-footer">
          <div className="order-total" role="status">
            Celkem: <span aria-label={`Celková částka ${total} Kč`}>{total} Kč</span>
          </div>
          
          {!compact && updateStatus && (
            <div className="order-actions">
              {order.status === 'pending' && (
                <button
                  className="ready-btn"
                  onClick={() => this.handleStatusChange('ready')}
                  aria-label="Označit objednávku jako připravenou"
                >
                  Označit jako připravené
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default OrderCard;