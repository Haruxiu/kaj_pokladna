import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Create a wrapper component that uses the useLocation hook
const withLocation = (WrappedComponent) => {
  return function WithLocationComponent(props) {
    const location = useLocation();
    return <WrappedComponent {...props} location={location} />;
  };
};

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // We don't need state for active link if we use location prop
    };
    this.handlePrintLastReceipt = this.handlePrintLastReceipt.bind(this);
  }

  // We will determine active link based on location prop
  isActive(path) {
    return this.props.location.pathname === path;
  }

  handlePrintLastReceipt() {
    const { history, showReceipt } = this.props;
    if (history && history.length > 0) {
      const lastOrder = history[history.length - 1];
      showReceipt(lastOrder.id);
    } else {
      alert('Historie plateb je prázdná. Žádná účtenka k tisku.');
    }
  }

  render() {
    const { history, showReceipt, location } = this.props;

    return (
      <nav className="main-nav" role="navigation" aria-label="Hlavní navigace">
        <ul role="menubar">
          <li role="none">
            <Link
              to="/"
              className={this.isActive('/') ? 'active' : ''}
              role="menuitem"
              aria-current={this.isActive('/') ? 'page' : undefined}
            >
              Objednávky
            </Link>
          </li>
          <li role="none">
            <Link
              to="/new-order"
              className={this.isActive('/new-order') ? 'active' : ''}
              role="menuitem"
              aria-current={this.isActive('/new-order') ? 'page' : undefined}
            >
              Nová objednávka
            </Link>
          </li>
          <li role="none">
            <Link
              to="/payment"
              className={this.isActive('/payment') ? 'active' : ''}
              role="menuitem"
              aria-current={this.isActive('/payment') ? 'page' : undefined}
            >
              Platba
            </Link>
          </li>
          <li role="none">
            <Link
              to="/history"
              className={this.isActive('/history') ? 'active' : ''}
              role="menuitem"
              aria-current={this.isActive('/history') ? 'page' : undefined}
            >
              Historie
            </Link>
          </li>
          <li role="none">
            <Link
              to="/menu"
              className={this.isActive('/menu') ? 'active' : ''}
              role="menuitem"
              aria-current={this.isActive('/menu') ? 'page' : undefined}
            >
              Menu
            </Link>
          </li>
        </ul>

        <div className="nav-footer">
          <div className="help-contact" role="complementary" aria-label="Kontaktní informace">
            <h4>Potřebujete pomoc?</h4>
            <p>Zavolejte na: <a href="tel:+420123456789" aria-label="Zavolejte na +420 123 456 789">+420 123 456 789</a></p>
            <p>Email: <a href="mailto:podpora@restaurant.cz" aria-label="Napište na podpora@restaurant.cz">podpora@restaurant.cz</a></p>
          </div>
          <div className="nav-actions" role="toolbar" aria-label="Akce">
            <button
              className="nav-action-btn"
              onClick={this.handlePrintLastReceipt}
              aria-label="Vytisknout poslední účtenku"
            >
              Vytisknout poslední účtenku
            </button>
            <button
              className="nav-action-btn"
              onClick={() => alert('Zálohování dat...')}
              aria-label="Zálohovat data"
            >
              Zálohovat data
            </button>
          </div>
        </div>
      </nav>
    );
  }
}

export default withLocation(Navigation);