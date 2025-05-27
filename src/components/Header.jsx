import React from 'react';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOnline: navigator.onLine, // Initialize state based on current online status
    };
    // Bind methods
    this.handleOnline = this.handleOnline.bind(this);
    this.handleOffline = this.handleOffline.bind(this);
  }

  componentDidMount() {
    // Add event listeners when component mounts
    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  componentWillUnmount() {
    // Remove event listeners when component unmounts
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }

  handleOnline() {
    this.setState({ isOnline: true });
  }

  handleOffline() {
    this.setState({ isOnline: false });
  }

  render() {
    const { isOnline } = this.state;

    return (
      <header className="app-header" role="banner">
        <div className="header-content">
          <h1>Restaurant Cash Register</h1>
          <div
            className={`connection-status ${isOnline ? 'online' : 'offline'}`}
            role="status"
            aria-label={`Stav připojení: ${isOnline ? 'Online' : 'Offline'}`}
          >
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
      </header>
    );
  }
}

export default Header;  