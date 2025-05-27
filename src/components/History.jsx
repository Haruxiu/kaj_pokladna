import React, { useState, useEffect, useCallback } from 'react';
import { getLocation } from '../utils/geolocation';

class History extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filteredHistory: [],
      dateFrom: '',
      dateTo: '',
      isLoading: false,
      paymentMethodFilter: 'all',
      sortOrder: 'desc',
    };

    // Bind methods
    this.handleDateFromChange = this.handleDateFromChange.bind(this);
    this.handleDateToChange = this.handleDateToChange.bind(this);
    this.handlePaymentMethodFilterChange = this.handlePaymentMethodFilterChange.bind(this);
    this.handleSortOrderChange = this.handleSortOrderChange.bind(this);
    this.filterHistory = this.filterHistory.bind(this);
    this.handleShowLocation = this.handleShowLocation.bind(this);
  }

  componentDidMount() {
    // Initial filtering when component mounts
    this.filterHistory(this.props.history);
  }

  componentDidUpdate(prevProps, prevState) {
    // Refilter if history prop or filter/sort state changes
    if (
      prevProps.history !== this.props.history ||
      prevState.dateFrom !== this.state.dateFrom ||
      prevState.dateTo !== this.state.dateTo ||
      prevState.paymentMethodFilter !== this.state.paymentMethodFilter ||
      prevState.sortOrder !== this.state.sortOrder
    ) {
      this.filterHistory(this.props.history);
    }
  }

  /**
   * Handles the change event for the 'dateFrom' input.
   * Updates the dateFrom state.
   * @param {object} e - The synthetic event object from the input change.
   */
  handleDateFromChange(e) {
    this.setState({ dateFrom: e.target.value });
  }

  /**
   * Handles the change event for the 'dateTo' input.
   * Updates the dateTo state.
   * @param {object} e - The synthetic event object from the input change.
   */
  handleDateToChange(e) {
    this.setState({ dateTo: e.target.value });
  }

  /**
   * Handles the change event for the 'paymentMethod' select.
   * Updates the paymentMethodFilter state.
   * @param {object} e - The synthetic event object from the select change.
   */
  handlePaymentMethodFilterChange(e) {
    this.setState({ paymentMethodFilter: e.target.value });
  }

  /**
   * Handles the change event for the 'sortOrder' select.
   * Updates the sortOrder state.
   * @param {object} e - The synthetic event object from the select change.
   */
  handleSortOrderChange(e) {
    this.setState({ sortOrder: e.target.value });
  }

  /**
   * Filters and sorts the transaction history based on current state filters and sort order.
   * Updates the filteredHistory state.
   * @param {Array<object>} currentHistory - The full history array from props.
   */
  filterHistory(currentHistory) {
    const { dateFrom, dateTo, paymentMethodFilter, sortOrder } = this.state;
    let result = [...currentHistory];

    if (dateFrom) {
      result = result.filter(transaction =>
        new Date(transaction.paymentTimestamp) >= new Date(dateFrom));
    }

    if (dateTo) {
      result = result.filter(transaction =>
        new Date(transaction.paymentTimestamp) <= new Date(`${dateTo}T23:59:59`));
    }

    if (paymentMethodFilter !== 'all') {
      result = result.filter(transaction => transaction.paymentMethod === paymentMethodFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.paymentTimestamp);
      const dateB = new Date(b.paymentTimestamp);
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });

    this.setState({ filteredHistory: result });
  }

  calculateStats() {
    const { filteredHistory } = this.state;
    const revenue = filteredHistory.reduce((sum, transaction) => sum + transaction.total, 0);
    const count = filteredHistory.length;
    const averageTransaction = count > 0 ? revenue / count : 0;
    const totalItemsSold = filteredHistory.reduce((sum, transaction) => sum + transaction.items.length, 0);

    return { revenue, count, averageTransaction, totalItemsSold };
  }

  /**
   * Fetches the user's current location using the Geolocation API and calls the showLocation prop handler.
   * Handles loading state and errors.
   */
  async handleShowLocation() {
    this.setState({ isLoading: true });
    try {
      const location = await getLocation();
      this.props.showLocation(location);
    } catch (error) {
      alert(error.message);
    } finally {
      this.setState({ isLoading: false });
    }
  }

  render() {
    const { filteredHistory, dateFrom, dateTo, isLoading, paymentMethodFilter, sortOrder } = this.state;
    const { history } = this.props; // Keep original history prop for filterHistory method
    const { revenue, count, averageTransaction, totalItemsSold } = this.calculateStats();

    return (
      <div className="history-container" role="main">
        <h2>Historie tržeb</h2>

        <div className="history-filters" role="search">
          <div className="filter-group">
            <label htmlFor="dateFrom">Od:</label>
            <input
              id="dateFrom"
              type="date"
              value={dateFrom}
              onChange={this.handleDateFromChange}
              aria-label="Filtrovat od data"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="dateTo">Do:</label>
            <input
              id="dateTo"
              type="date"
              value={dateTo}
              onChange={this.handleDateToChange}
              aria-label="Filtrovat do data"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="paymentMethod">Způsob platby:</label>
            <select
              id="paymentMethod"
              value={paymentMethodFilter}
              onChange={this.handlePaymentMethodFilterChange}
              aria-label="Filtrovat podle způsobu platby"
            >
              <option value="all">Všechny</option>
              <option value="cash">Hotovost</option>
              <option value="card">Karta</option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="sortOrder">Řadit dle data:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={this.handleSortOrderChange}
              aria-label="Řadit podle data"
            >
              <option value="desc">Nejnovější</option>
              <option value="asc">Nejstarší</option>
            </select>
          </div>

          <button
            className="filter-btn"
            onClick={() => this.filterHistory(history)} // Pass original history prop
            aria-label="Aplikovat filtry"
          >
            Filtrovat
          </button>
        </div>

        <div className="history-stats" role="region" aria-label="Statistiky tržeb">
          <div className="stat-item">
            <span className="stat-label">Celková tržba:</span>
            <span className="stat-value" aria-label={`Celková tržba ${revenue.toFixed(2)} Kč`}>{revenue.toFixed(2)} Kč</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Počet transakcí:</span>
            <span className="stat-value" aria-label={`Počet transakcí ${count}`}>{count}</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Průměrná hodnota transakce:</span>
            <span className="stat-value" aria-label={`Průměrná hodnota transakce ${averageTransaction.toFixed(2)} Kč`}>{averageTransaction.toFixed(2)} Kč</span>
          </div>

          <div className="stat-item">
            <span className="stat-label">Celkem prodaných položek:</span>
            <span className="stat-value" aria-label={`Celkem prodaných položek ${totalItemsSold}`}>{totalItemsSold}</span>
          </div>
        </div>

        <div className="history-list" role="list">
          {filteredHistory.length === 0 ? (
            <div className="empty-state" role="status">Žádné transakce v zadaném období</div>
          ) : (
            filteredHistory.map(transaction => (
              <div key={transaction.id} className="history-item" role="listitem">
                <div className="transaction-header">
                  <h3>Transakce #{transaction.id.toString().slice(-4)}</h3>
                  <p>Datum: {new Date(transaction.paymentTimestamp).toLocaleString()}</p>
                  {transaction.tableName && <p> {transaction.tableName}</p>}
                </div>

                <div className="transaction-details">
                  <div className="transaction-items" role="list">
                    {transaction.items.map((item, index) => (
                      <div key={index} className="transaction-item" role="listitem">
                        <span>{item.name}</span>
                        <span aria-label={`${item.price} Kč`}>{item.price} Kč</span>
                      </div>
                    ))}
                  </div>

                  <div className="transaction-summary">
                    <div className="transaction-total" role="status">
                      Celkem: <span aria-label={`Celková částka ${transaction.total} Kč`}>{transaction.total} Kč</span>
                    </div>
                    <div className="transaction-method" role="status">
                      Platba: {transaction.paymentMethod === 'cash' ? 'Hotovost' : 'Karta'}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="location-btn"
          onClick={this.handleShowLocation}
          disabled={isLoading}
          aria-label="Zobrazit moji aktuální polohu"
        >
          {isLoading ? 'Načítání...' : 'Zobrazit moji polohu'}
        </button>
      </div>
    );
  }
}

export default History;