import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useLocalStorage from './hooks/useLocalStorage';
import Navigation from './components/Navigation';
import Orders from './components/Orders';
import NewOrder from './components/NewOrder';
import History from './components/History';
import MenuManagement from './components/MenuManagement';
import Payment from './components/Payment';
import './styles/main.scss';

// Main App component managing global state and routing.
class App extends Component {
  constructor(props) {
    super(props);
    // Initialize state by attempting to load from localStorage,
    // falling back to default data if localStorage is empty.
    this.state = {
      orders: JSON.parse(localStorage.getItem('orders')) || [],
      history: JSON.parse(localStorage.getItem('history')) || [],
      menuItems: JSON.parse(localStorage.getItem('menuItems')) || [
        // Default menu items
        { id: 1, name: 'Kuřecí řízek', price: 150, category: 'main' },
        { id: 2, name: 'Hovězí guláš', price: 130, category: 'main' },
        { id: 3, name: 'Pivo', price: 35, category: 'drink' },
        { id: 4, name: 'Kola', price: 30, category: 'drink' },
        { id: 5, name: 'Zmrzlina', price: 45, category: 'dessert' }
      ],
      nextItemId: JSON.parse(localStorage.getItem('nextItemId')) || 6, // Tracks the next available ID for new menu items
      customCategories: JSON.parse(localStorage.getItem('customCategories')) || [], // Stores user-defined menu categories
      tables: JSON.parse(localStorage.getItem('tables')) || [
        // Static table data
        { id: 1, name: 'Stůl 1' },
        { id: 2, name: 'Stůl 2' },
        { id: 3, name: 'Stůl 3' },
        { id: 4, name: 'Stůl 4' }
      ]
    };
    // Bind all handler methods to the instance
    this.updateOrderStatus = this.updateOrderStatus.bind(this);
    this.showLocation = this.showLocation.bind(this);
    this.showReceipt = this.showReceipt.bind(this);
    this.setOrders = this.setOrders.bind(this);
    this.setHistory = this.setHistory.bind(this);
    this.setMenuItems = this.setMenuItems.bind(this);
    this.setNextItemId = this.setNextItemId.bind(this);
    this.setCustomCategories = this.setCustomCategories.bind(this);
  }

  /**
   * Lifecycle method called after component updates (state or props changes).
   * Used here to persist relevant state changes to localStorage.
   * @param {object} prevProps - The previous props of the component.
   * @param {object} prevState - The previous state of the component.
   */
  componentDidUpdate(prevProps, prevState) {
    // Check if specific state slices have changed before saving to avoid unnecessary writes
    if (prevState.orders !== this.state.orders) {
      localStorage.setItem('orders', JSON.stringify(this.state.orders));
    }
    if (prevState.history !== this.state.history) {
      localStorage.setItem('history', JSON.stringify(this.state.history));
    }
    if (prevState.menuItems !== this.state.menuItems) {
      localStorage.setItem('menuItems', JSON.stringify(this.state.menuItems));
    }
    if (prevState.nextItemId !== this.state.nextItemId) {
      localStorage.setItem('nextItemId', JSON.stringify(this.state.nextItemId));
    }
    if (prevState.customCategories !== this.state.customCategories) {
      localStorage.setItem('customCategories', JSON.stringify(this.state.customCategories));
    }
    // Tables are currently static, so saving them is not necessary unless they become dynamic.
  }

  /**
   * Custom state updater for the 'orders' state.
   * Updates the state and immediately persists the change to localStorage.
   * @param {function|Array<object>} updater - A function that receives the previous orders state and returns the new state, or the new state array directly.
   */
  setOrders(updater) {
    this.setState(prevState => {
      // Handle both function-based and direct value updates
      const newOrders = typeof updater === 'function' ? updater(prevState.orders) : updater;
      localStorage.setItem('orders', JSON.stringify(newOrders));
      return { orders: newOrders };
    });
  }

  /**
   * Custom state updater for the 'history' state.
   * Updates the state and immediately persists the change to localStorage.
   * @param {function|Array<object>} updater - A function that receives the previous history state and returns the new state, or the new state array directly.
   */
  setHistory(updater) {
    this.setState(prevState => {
      const newHistory = typeof updater === 'function' ? updater(prevState.history) : updater;
      localStorage.setItem('history', JSON.stringify(newHistory));
      return { history: newHistory };
    });
  }

  /**
   * Custom state updater for the 'menuItems' state.
   * Updates the state and immediately persists the change to localStorage.
   * @param {function|Array<object>} updater - A function that receives the previous menuItems state and returns the new state, or the new state array directly.
   */
   setMenuItems(updater) {
    this.setState(prevState => {
      const newMenuItems = typeof updater === 'function' ? updater(prevState.menuItems) : updater;
      localStorage.setItem('menuItems', JSON.stringify(newMenuItems));
      return { menuItems: newMenuItems };
    });
  }

  /**
   * Custom state updater for the 'nextItemId' state.
   * Updates the state and immediately persists the change to localStorage.
   * @param {function|number} updater - A function that receives the previous nextItemId state and returns the new state, or the new state number directly.
   */
   setNextItemId(updater) {
    this.setState(prevState => {
      const newNextItemId = typeof updater === 'function' ? updater(prevState.nextItemId) : updater;
      localStorage.setItem('nextItemId', JSON.stringify(newNextItemId));
      return { nextItemId: newNextItemId };
    });
  }

  /**
   * Custom state updater for the 'customCategories' state.
   * Updates the state and immediately persists the change to localStorage.
   * @param {function|Array<string>} updater - A function that receives the previous customCategories state and returns the new state, or the new state array directly.
   */
   setCustomCategories(updater) {
    this.setState(prevState => {
      const newCustomCategories = typeof updater === 'function' ? updater(prevState.customCategories) : updater;
      localStorage.setItem('customCategories', JSON.stringify(newCustomCategories));
      return { customCategories: newCustomCategories };
    });
  }

  /**
   * Updates the status of a specific order.
   * @param {number} orderId - The ID of the order to update.
   * @param {string} newStatus - The new status to set for the order (e.g., 'pending', 'ready', 'paid').
   */
  updateOrderStatus(orderId, newStatus) {
    this.setOrders(orders =>
      orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  }

  /**
   * Handler to show user's location (simulated using alert).
   * Connected to the History component's geolocation button.
   * @param {object} location - An object containing location details (e.g., latitude, longitude, accuracy).
   */
  showLocation(location) {
    alert(`Vaše poloha: ${location.latitude}, ${location.longitude}`);
  }

  /**
   * Handler to generate and display a receipt for a completed order (simulated print).
   * Connected to the History and Payment components.
   * @param {number} orderId - The ID of the order to generate a receipt for.
   */
  showReceipt(orderId) {
    const order = this.state.history.find(item => item.id === orderId);
    if (!order) {
      alert('Účtenka nebyla nalezena.');
      return;
    }

    // Helper function to format the receipt content as a string.
    const generateReceipt = (paidOrder) => {
      let receipt = '\n';
      receipt += '==================\n';
      receipt += '=== RESTAURACE ===\n';
      receipt += '==================\n\n';
      receipt += `Transakce #${paidOrder.id.toString().slice(-4)}\n`;
      receipt += `Datum: ${new Date(paidOrder.paymentTimestamp).toLocaleString()}\n\n`;
      receipt += `Stůl: ${paidOrder.tableName}\n`;
      receipt += `Číslo objednávky: ${paidOrder.id}\n\n`;
      receipt += '------------------\n\n';
      receipt += 'Položky:\n\n';
      paidOrder.items.forEach(item => {
        receipt += `${item.name} ${item.price} Kč\n`;
      });
      receipt += '\n------------------\n\n';
      receipt += `Celkem: ${paidOrder.total} Kč\n`;
      receipt += `Platba: ${paidOrder.paymentMethod === 'cash' ? 'Hotovost' : 'Karta'}\n\n`;
      receipt += '==================\n\n';
      receipt += 'Děkujeme za návštěvu!\n';
      receipt += 'Vítejte znovu\n\n';
      receipt += '=== Harukoid s.r.o. ===\n';
      return receipt;
    };

    // Open a new window to simulate printing.
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blokován. Povolte prosím vyskakovací okna pro tisk účtenky.');
      return;
    }

    const receiptContent = generateReceipt(order);
    // Construct basic HTML content for the receipt window.
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Účtenka #${order.id.toString().slice(-4)}</title>
          <style>
            @page {
              size: 5.5in 8.5in; /* Typical receipt size */
              margin: 0;
            }
            body {
              font-family: monospace; /* Monospace font for receipt look */
              white-space: pre; /* Preserve line breaks and spaces */
              padding: 40px;
              font-size: 14px;
              line-height: 1.6;
              width: 5.5in;
              min-height: 8.5in;
              margin: 0;
              text-align: center;
            }
            @media print {
              body {
                padding: 40px;
                margin: 0;
                width: 5.5in;
                min-height: 8.5in;
                text-align: center;
              }
            }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `;

    // Write content to the new window and close the document stream.
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Once the content is loaded, trigger the print dialog and close the window after printing.
    printWindow.onload = function() {
      printWindow.print();
      printWindow.onafterprint = function() {
        printWindow.close();
      };
    };
  }

  render() {
    // Destructure state variables for easier access in render method.
    const { orders, history, menuItems, nextItemId, customCategories, tables } = this.state;

    return (
      // BrowserRouter provides routing context.
      <Router>
        <div className="app">
          <div className="app-content">
            {/* Navigation component, receives history and showReceipt handler */}
            <Navigation history={history} showReceipt={this.showReceipt} />

            <main className="main-content"> {/* Main content area with semantic tag */}
              <header className="app-header"> {/* Header with semantic tag */}
                <div className="header-content">
                  <h1>Restaurant Cash Register</h1> {/* Main application title */}
                  {/* Connection status indicator */}
                  <div id="connectionStatus" className="connection-status">Online</div>
                </div>
              </header>
              {/* Routes define which component to render based on the URL path */}
              <Routes>
                {/* Route for the Orders page, passes orders state and updateOrderStatus handler */}
                <Route path="/" element={<Orders orders={orders} updateOrderStatus={this.updateOrderStatus} />} />
                {/* Route for the New Order page, passes menu data, tables, order setter, and custom categories */}
                <Route path="/new-order" element={<NewOrder menuItems={menuItems} tables={tables} setOrders={this.setOrders} customCategories={customCategories} />} />
                {/* Route for the History page, passes history data and showLocation handler */}
                <Route path="/history" element={<History history={history} showLocation={this.showLocation} />} />
                {/* Route for the Menu Management page, passes menu data, setters, and category data/setters */}
                <Route path="/menu" element={<MenuManagement menuItems={menuItems} setMenuItems={this.setMenuItems} nextItemId={nextItemId} setNextItemId={this.setNextItemId} customCategories={customCategories} setCustomCategories={this.setCustomCategories} />} />
                {/* Route for the Payment page, passes orders data, setters for orders/history, and showReceipt handler */}
                <Route path="/payment" element={<Payment orders={orders} setOrders={this.setOrders} setHistory={this.setHistory} showReceipt={this.showReceipt} />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    );
  }
}

export default App; // Export the main App component