import React, { useState, useMemo, useEffect } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedCategory: 'all',
      orderItems: [],
      tableNumber: '',
      groupedMenuItems: [],
      filteredMenuItems: [],
    };

    this.getCategoryDisplayName = this.getCategoryDisplayName.bind(this);
    this.handleDragStart = this.handleDragStart.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.filterAndGroupItems = this.filterAndGroupItems.bind(this);
  }

  componentDidMount() {
    this.filterAndGroupItems(this.props.menuItems, this.props.customCategories, this.state.selectedCategory);
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.menuItems !== this.props.menuItems ||
      prevProps.customCategories !== this.props.customCategories ||
      prevState.selectedCategory !== this.state.selectedCategory
    ) {
      this.filterAndGroupItems(this.props.menuItems, this.props.customCategories, this.state.selectedCategory);
    }
  }

  filterAndGroupItems(menuItems, customCategories, selectedCategory) {
    const grouped = menuItems.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {});

    const categoryOrder = ['main', 'drink', 'dessert', ...(customCategories || [])];
    const groupedItems = categoryOrder
      .filter(category => grouped[category])
      .map(category => ({
        category,
        items: grouped[category]
      }));

    const filteredItems = selectedCategory === 'all'
      ? menuItems
      : menuItems.filter(item => item.category === selectedCategory);

    this.setState({ groupedMenuItems: groupedItems, filteredMenuItems: filteredItems });
  }

  getCategoryDisplayName(category) {
    switch(category) {
      case 'main':
        return 'Hlavní jídla';
      case 'drink':
        return 'Nápoje';
      case 'dessert':
        return 'Dezerty';
      default:
        return category;
    }
  }

  handleDragStart(e, item) {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  }

  handleDrop(e) {
    e.preventDefault();
    const item = JSON.parse(e.dataTransfer.getData('text/plain'));
    this.setState(prevState => ({
      orderItems: [...prevState.orderItems, item]
    }));
  }

  handleDragOver(e) {
    e.preventDefault();
  }

  removeItem(index) {
    this.setState(prevState => ({
      orderItems: prevState.orderItems.filter((_, i) => i !== index)
    }));
  }

  handleSubmit(e) {
    e.preventDefault();
    const { tableNumber, orderItems } = this.state;
    const { onOrderSubmit } = this.props;

    if (!tableNumber) {
      alert('Vyberte číslo stolu!');
      return;
    }
    if (orderItems.length === 0) {
      alert('Přidejte alespoň jednu položku do objednávky!');
      return;
    }

    onOrderSubmit({
      tableNumber,
      items: orderItems,
      timestamp: new Date().toISOString()
    });

    this.setState({ orderItems: [], tableNumber: '' });
  }

  render() {
    const { selectedCategory, orderItems, tableNumber, groupedMenuItems, filteredMenuItems } = this.state;
    const { customCategories, tables } = this.props;

    return (
      <div className="order-form" role="main">
        <div className="order-section">
          <h2 className="order-section-header">Nová objednávka</h2>
          <div className="menu-section">
            <div className="category-filter" role="tablist" aria-label="Filtry kategorií">
              <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                onClick={() => this.setState({ selectedCategory: 'all' })}
                role="tab"
                aria-selected={selectedCategory === 'all'}
                aria-label="Zobrazit všechny položky"
              >
                Vše
              </button>
              {['main', 'drink', 'dessert'].map(category => (
                 <button
                   key={category}
                   className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                   onClick={() => this.setState({ selectedCategory: category })}
                   role="tab"
                   aria-selected={selectedCategory === category}
                   aria-label={`Zobrazit ${this.getCategoryDisplayName(category)}`}
                 >
                   {this.getCategoryDisplayName(category)}
                 </button>
              ))}
              {Array.isArray(customCategories) && customCategories.map(category => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => this.setState({ selectedCategory: category })}
                  role="tab"
                  aria-selected={selectedCategory === category}
                  aria-label={`Zobrazit ${category}`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="menu-items" role="tabpanel" aria-label="Seznam položek menu">
              {selectedCategory === 'all' ? (
                groupedMenuItems.map(({ category, items }) => (
                  <div key={category} className="menu-category">
                    <h3 className="category-title">{this.getCategoryDisplayName(category)}</h3>
                    <ul className="menu-items-list">
                      {items.map(item => (
                        <li
                          key={item.id}
                          className="menu-item"
                          draggable
                          onDragStart={(e) => this.handleDragStart(e, item)}
                          role="button"
                          tabIndex={0}
                          aria-label={`${item.name} - ${item.price} Kč`}
                        >
                          <span>{item.name}</span>
                          <span>{item.price} Kč</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <ul className="menu-items-list">
                  {filteredMenuItems.map(item => (
                    <li
                      key={item.id}
                      className="menu-item"
                      draggable
                      onDragStart={(e) => this.handleDragStart(e, item)}
                      role="button"
                      tabIndex={0}
                      aria-label={`${item.name} - ${item.price} Kč`}
                    >
                      <span>{item.name}</span>
                      <span>{item.price} Kč</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="order-section">
          <h2 className="order-section-header">Vaše objednávka</h2>
          <div className="current-order">
            <div className="table-selection">
              <h3>Vyberte stůl</h3>
              <div className="table-list" role="radiogroup" aria-label="Výběr stolu">
                {tables.map(table => (
                  <div
                    key={table.id}
                    className={`table-item ${tableNumber === table.id.toString() ? 'selected' : ''}`}
                    onClick={() => this.setState({ tableNumber: table.id.toString() })}
                    role="radio"
                    aria-checked={tableNumber === table.id.toString()}
                    tabIndex={0}
                    aria-label={`Stůl ${table.name}`}
                  >
                    {table.name}
                  </div>
                ))}
              </div>
            </div>

            <div
              className="order-drop-zone"
              onDrop={this.handleDrop}
              onDragOver={this.handleDragOver}
              role="region"
              aria-label="Přetáhněte položky do objednávky"
            >
              {orderItems.length === 0 ? (
                <p className="empty-order" role="status">Přetáhněte položky z menu</p>
              ) : (
                <div className="order-items" role="list">
                  {orderItems.map((item, index) => (
                    <div key={index} className="order-item" role="listitem">
                      <span>{item.name}</span>
                      <span>{item.price} Kč</span>
                      <button
                        className="remove-btn"
                        onClick={() => this.removeItem(index)}
                        aria-label={`Odstranit ${item.name} z objednávky`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="order-summary">
            <button
              className="submit-btn"
              onClick={this.handleSubmit}
              disabled={!tableNumber || orderItems.length === 0}
            >
              Odeslat objednávku
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderForm; 