import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';

class Orders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
    };
  }

  /**
   * Lifecycle method that runs after the component has been mounted to the DOM.
   * Used here to simulate a loading state.
   */
  componentDidMount() {
    // Simulate loading
    this.timer = setTimeout(() => this.setState({ isLoading: false }), 500);
  }

  /**
   * Lifecycle method that runs just before the component is unmounted from the DOM.
   * Used here to clean up the simulated loading timer.
   */
  componentWillUnmount() {
    // Clean up the timer to prevent memory leaks
    clearTimeout(this.timer);
  }

  render() {
    const { orders, updateOrderStatus } = this.props;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <div
          className="loading"
          role="status"
          aria-label="Načítání objednávek"
        >
          Načítání...
        </div>
      );
    }

    return (
      <div className="orders-container" role="main">
        <h2>Aktivní objednávky</h2>

        {orders.length === 0 ? (
          <div
            className="empty-state"
            role="status"
            aria-label="Žádné aktivní objednávky"
          >
            Žádné aktivní objednávky
          </div>
        ) : (
          <div
            className="orders-grid"
            role="list"
            aria-label="Seznam aktivních objednávek"
          >
            {orders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                updateStatus={updateOrderStatus}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

export default Orders;