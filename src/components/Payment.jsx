import React, { useState, useEffect } from 'react';
import OrderCard from './OrderCard';

class Payment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOrders: [],
      paymentMethod: 'cash',
      amountReceived: '',
      change: 0,
      selectedTable: null,
    };

    // Bind methods
    this.toggleOrderSelection = this.toggleOrderSelection.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.processPayment = this.processPayment.bind(this);
    this.generateReceipt = this.generateReceipt.bind(this);
    this.updateOrderStatus = this.updateOrderStatus.bind(this); // Assuming this method is defined here or passed down
  }

  componentDidUpdate(prevProps, prevState) {
    // Recalculate change if amount received, payment method, or selected orders change
    if (
      prevState.amountReceived !== this.state.amountReceived ||
      prevState.paymentMethod !== this.state.paymentMethod ||
      prevState.selectedOrders !== this.state.selectedOrders
    ) {
      if (this.state.paymentMethod === 'cash' && this.state.amountReceived) {
        const total = this.calculateTotal();
        this.setState({ change: Math.max(0, parseFloat(this.state.amountReceived) - total) });
      }
    }
  }

  /**
   * Toggles the selection state of an order for payment.
   * Adds or removes the orderId from the selectedOrders state array.
   * @param {number} orderId - The ID of the order to toggle selection for.
   */
  toggleOrderSelection(orderId) {
    this.setState(prevState => ({
      selectedOrders: prevState.selectedOrders.includes(orderId)
        ? prevState.selectedOrders.filter(id => id !== orderId)
        : [...prevState.selectedOrders, orderId]
    }));
  }

  /**
   * Calculates the total amount due for all currently selected orders with status 'ready'.
   * @returns {number} The total sum of prices of selected ready orders.
   */
  calculateTotal() {
    const { orders } = this.props;
    const { selectedOrders } = this.state;
    const readyOrders = orders.filter(order => order.status === 'ready');
    return readyOrders
      .filter(order => selectedOrders.includes(order.id))
      .reduce((sum, order) => sum + order.total, 0);
  }

  /**
   * Processes the payment for the selected orders.
   * Validates cash payment amount, updates order statuses to 'paid',
   * moves paid orders to history, clears selection, and shows a receipt.
   */
  processPayment() {
    const { orders, setOrders, setHistory, showReceipt } = this.props;
    const { selectedOrders, paymentMethod, amountReceived } = this.state;
    const total = this.calculateTotal();

    if (paymentMethod === 'cash' && parseFloat(amountReceived) < total) {
      alert('Obdržená částka je menší než celková cena!');
      return;
    }

    const paidOrders = orders.filter(order => selectedOrders.includes(order.id));
    const remainingOrders = orders.filter(order => !selectedOrders.includes(order.id));

    const now = new Date();
    const newHistoryEntries = paidOrders.map(order => ({
      ...order,
      status: 'paid',
      paymentMethod,
      paymentTimestamp: now.toISOString()
    }));

    setOrders(remainingOrders);
    setHistory(prevHistory => [...prevHistory, ...newHistoryEntries]);

    this.setState({ selectedOrders: [], amountReceived: '', change: 0, selectedTable: null });

    const receiptContent = this.generateReceipt(paidOrders, paymentMethod, total);
    showReceipt(receiptContent);
  }

  /**
   * Generates a formatted receipt string for paid orders.
   * Includes order details, items, total, payment method, and change (for cash payments).
   * @param {Array<object>} paidOrders - An array of order objects that have been paid.
   * @param {string} method - The payment method used ('cash' or 'card').
   * @param {number} total - The total amount paid.
   * @returns {string} A formatted string representing the receipt.
   */
  generateReceipt(paidOrders, method, total) {
    const { amountReceived, change } = this.state; // Access state for cash details
    let receipt = '=== RESTAURACE ===\n';
    receipt += `Datum: ${new Date().toLocaleString()}\n`;
    receipt += '------------------\n';

    paidOrders.forEach(order => {
      receipt += `Objednávka #${order.id.toString().slice(-4)}\n`;
      order.items.forEach(item => {
        receipt += `${item.name.padEnd(20, ' ')} ${item.price.toFixed(2).padStart(8, ' ')} Kč\n`;
      });
      receipt += `${'Celkem:'.padEnd(20, ' ')} ${order.total.toFixed(2).padStart(8, ' ')} Kč\n`;
      receipt += '------------------\n';
    });

    receipt += `${'Celková částka:'.padEnd(20, ' ')} ${total.toFixed(2).padStart(8, ' ')} Kč\n`;
    receipt += `Způsob platby: ${method === 'cash' ? 'Hotovost' : 'Karta'}\n`;

    if (method === 'cash') {
      receipt += `Obdržená částka: ${parseFloat(amountReceived).toFixed(2)} Kč\n`; // Use state here
      receipt += `Vráceno: ${change.toFixed(2)} Kč\n`; // Use state here
    }

    receipt += '==================\n';
    receipt += 'Děkujeme za návštěvu!\n';

    return receipt;
  }

  /**
   * Updates the status of an order via the setOrders prop.
   * This is a local helper to call the global state setter from App.jsx.
   * @param {number} orderId - The ID of the order to update.
   * @param {string} newStatus - The new status for the order.
   */
  updateOrderStatus(orderId, newStatus) {
    this.props.setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  }

  render() {
    const { orders, setOrders, setHistory, showReceipt } = this.props; // Destructure all props needed
    const { selectedOrders, paymentMethod, amountReceived, change, selectedTable } = this.state;
    const readyOrders = orders.filter(order => order.status === 'ready');
    const totalAmount = this.calculateTotal();

    return (
      <div className="payment-container" role="main">
        <h2>Platba</h2>

        {!selectedTable ? (
          <div className="table-selection">
            <h3>Vyberte stůl k platbě</h3>
            <div className="table-list" role="radiogroup" aria-label="Výběr stolu k platbě">
              {/* Tables are hardcoded here, should ideally come from props */}
              {[{ id: 1, name: 'Stůl 1' }, { id: 2, name: 'Stůl 2' }, { id: 3, name: 'Stůl 3' }, { id: 4, name: 'Stůl 4' }].map(table => (
                <div
                  key={table.id}
                  className="table-item"
                  onClick={() => this.setState({ selectedTable: table })}
                  role="radio"
                  aria-checked={selectedTable?.id === table.id}
                  tabIndex={0}
                  aria-label={table.name}
                >
                  {table.name}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="payment-content">
            <div className="section-header">
              <button
                className="back-btn"
                onClick={() => this.setState({ selectedTable: null })}
                aria-label="Zpět na výběr stolu"
              >
                ← Zpět na výběr stolu
              </button>
              <h3>Objednávky připravené k platbě pro {selectedTable.name}</h3>
            </div>
            <div className="orders-section">
              {readyOrders.filter(order => order.tableId === selectedTable.id).length === 0 ? (
                <div className="empty-state" role="status">Žádné objednávky připravené k platbě pro tento stůl</div>
              ) : (
                <div className="orders-list" role="list">
                  {readyOrders.filter(order => order.tableId === selectedTable.id).map(order => (
                    <div key={order.id} className="payment-order-card" role="listitem">
                      <label className="order-checkbox">
                        <input
                          type="checkbox"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => this.toggleOrderSelection(order.id)}
                          aria-label={`Vybrat objednávku ${order.id} k platbě`}
                        />
                        <OrderCard
                          order={order}
                          compact
                          updateStatus={this.updateOrderStatus} // Assuming updateOrderStatus is passed down or available
                        />
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="payment-section">
              <h3>Způsob platby</h3>

              <div className="payment-methods" role="radiogroup" aria-label="Výběr způsobu platby">
                <div className="payment-method-wrapper">
                  <input
                    type="radio"
                    id="cash"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={() => this.setState({ paymentMethod: 'cash', amountReceived: '', change: 0 })}
                    aria-label="Platba hotovostí"
                  />
                  <label className="payment-method" htmlFor="cash">
                    <span>Hotovost</span>
                  </label>
                </div>

                <div className="payment-method-wrapper">
                  <input
                    type="radio"
                    id="card"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => this.setState({ paymentMethod: 'card', amountReceived: '', change: 0 })}
                    aria-label="Platba kartou"
                  />
                  <label className="payment-method" htmlFor="card">
                    <span>Karta</span>
                  </label>
                </div>
              </div>

              {paymentMethod === 'cash' && (
                <div className="cash-details">
                  <div className="form-group">
                    <label htmlFor="amountReceived">Obdržená částka (Kč)</label>
                    <input
                      id="amountReceived"
                      type="number"
                      value={amountReceived}
                      onChange={(e) => this.setState({ amountReceived: e.target.value })}
                      min={totalAmount} // Use the calculated total
                      step="1"
                      aria-label={`Obdržená částka v Kč, minimálně ${totalAmount} Kč`}
                    />
                  </div>

                  <div className="change-amount" role="status">
                    Vráceno: <span aria-label={`Vrácená částka ${change.toFixed(2)} Kč`}>{change.toFixed(2)} Kč</span>
                  </div>
                </div>
              )}

              <div className="payment-summary">
                <div className="total-amount" role="status">
                  Celkem k platbě: <span aria-label={`Celková částka k platbě ${totalAmount.toFixed(2)} Kč`}>{totalAmount.toFixed(2)} Kč</span>
                </div>

                <button
                  className="process-payment-btn"
                  onClick={this.processPayment}
                  disabled={selectedOrders.length === 0 || (paymentMethod === 'cash' && (!amountReceived || parseFloat(amountReceived) < totalAmount))}
                  aria-label="Zpracovat platbu"
                >
                  Zpracovat platbu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default Payment;