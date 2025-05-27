import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import MenuItem from './MenuItem';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/components.scss';
import PropTypes from 'prop-types';

// Wrapper component to inject location and navigate for class components
function withLocationAndNavigation(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return <Component {...props} location={location} navigate={navigate} />;
  };
}

class NewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrder: [],
      selectedTable: null,
      selectedCategory: 'Vše',
      isLoading: true,
      showTableModal: false,
    };

    this.menuItemsRef = React.createRef();

    // Bind methods
    this.onDragEnd = this.onDragEnd.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.calculateTotal = this.calculateTotal.bind(this);
    this.handleTableSelect = this.handleTableSelect.bind(this);
    this.handleSubmitOrder = this.handleSubmitOrder.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleOpenTableModal = this.handleOpenTableModal.bind(this);
    this.handleCloseTableModal = this.handleCloseTableModal.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isLoading: false,
      });
    }, 500);
  }

  getGroupedMenuItems() {
    const { menuItems } = this.props;
    const grouped = menuItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    const preferredOrder = ['main', 'drink', 'dessert'];
    const allCategories = Object.keys(grouped);

    const sortedCategories = allCategories.sort((a, b) => {
      const aIndex = preferredOrder.indexOf(a);
      const bIndex = preferredOrder.indexOf(b);

      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex;
      } else if (aIndex !== -1) {
        return -1;
      } else if (bIndex !== -1) {
        return 1;
      } else {
        return a.localeCompare(b);
      }
    });

    return sortedCategories.map(category => ({
      category,
      items: grouped[category]
    }));
  }

  getFilteredMenuItems() {
    const { menuItems } = this.props;
    const { selectedCategory } = this.state;
    if (selectedCategory === 'Vše') {
      return menuItems;
    }
    const grouped = this.getGroupedMenuItems().reduce((acc, group) => {
      acc[group.category] = group.items;
      return acc;
    }, {});

    return grouped[selectedCategory] || [];
  }

  handleCategoryChange(category) {
    this.setState({ selectedCategory: category });
  }

  /**
   * Handles the end of a drag operation from the menu to the order.
   * Adds the dragged menu item to the current order if dropped in the order area.
   * @param {object} result - The result object provided by react-beautiful-dnd on drag end.
   */
  onDragEnd(result) {
    if (!result.destination) return;

    if (result.source.droppableId === 'menu-drop-area' && result.destination.droppableId === 'order-drop-area') {
      const { menuItems } = this.props;
      const item = menuItems.find(item => item.id === parseInt(result.draggableId));
      if (item) {
        this.setState(prevState => ({
          currentOrder: [...prevState.currentOrder, { ...item }]
        }));
      }
    }
  }

  /**
   * Removes an item from the current order by its index.
   * @param {number} index - The index of the item to remove from the current order array.
   */
  removeItem(index) {
    this.setState(prevState => {
      const newOrder = [...prevState.currentOrder];
      newOrder.splice(index, 1);
      return { currentOrder: newOrder };
    });
  }

  /**
   * Calculates the total price of items in the current order.
   * @returns {number} The total price of the current order.
   */
  calculateTotal() {
    return this.state.currentOrder.reduce((sum, item) => sum + item.price, 0);
  }

  /**
   * Opens the table selection modal.
   */
  handleOpenTableModal() {
    this.setState({ showTableModal: true });
  }

  /**
   * Closes the table selection modal.
   */
  handleCloseTableModal() {
    this.setState({ showTableModal: false });
  }

  /**
   * Handles the selection of a table from the modal.
   * Sets the selected table in the state and closes the modal.
   * @param {object} table - The selected table object.
   */
  handleTableSelect(table) {
    this.setState({ selectedTable: table, showTableModal: false });
  }

  /**
   * Handles the submission of the current order.
   * Creates a new order object, adds it to the global orders state,
   * clears the current order and selected table, and navigates home.
   */
  handleSubmitOrder() {
    const { selectedTable, currentOrder } = this.state;
    const { setOrders, navigate } = this.props;

    if (!selectedTable) {
      alert('Vyberte prosím stůl.');
      return;
    }

    if (currentOrder.length === 0) {
      alert('Objednávka je prázdná!');
      return;
    }

    const order = {
      id: Date.now(),
      tableId: selectedTable.id,
      tableName: selectedTable.name,
      items: currentOrder,
      total: this.calculateTotal(),
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    setOrders(prevOrders => [...prevOrders, order]);
    this.setState({ currentOrder: [], selectedTable: null });
    alert('Objednávka byla úspěšně vytvořena!');
    navigate('/');
  }

  /**
   * Renders a single menu item as a Draggable component.
   * @param {object} item - The menu item object to render.
   * @param {number} index - The index of the menu item in the list.
   * @returns {JSX.Element} A Draggable MenuItem component.
   */
  renderMenuItems(item, index) {
    return (
      <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            <MenuItem item={item} />
          </div>
        )}
      </Draggable>
    );
  }

  /**
   * Renders a single item within the current order list.
   * @param {object} item - The order item object to render.
   * @param {number} index - The index of the item in the current order array.
   * @returns {JSX.Element} A JSX element representing an item in the order list.
   */
  renderOrderItems(item, index) {
    return (
      <div key={index} className="order-item">
        <span>{item.name} </span>
        <span>{item.price} Kč</span>
        <button
          className="remove-btn"
          onClick={() => this.removeItem(index)}
        >
          X
        </button>
      </div>
    );
  }

  render() {
    const { currentOrder, selectedTable, selectedCategory, isLoading, showTableModal } = this.state;
    const { menuItems, tables, customCategories } = this.props;

    const groupedMenuItems = this.getGroupedMenuItems();
    const filteredMenuItems = selectedCategory === 'Vše'
      ? menuItems
      : groupedMenuItems.find(group => group.category === selectedCategory)?.items || [];

    if (isLoading) {
      return <div className="loading">Načítání...</div>;
    }

    return (
      <DragDropContext onDragEnd={this.onDragEnd}>
        <div className="new-order-container">
          <div className="menu-section">
            <div className="category-filter">
              {['Vše', 'main', 'drink', 'dessert', ...customCategories].map(category => (
                <button
                  key={category}
                  className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
                  onClick={() => this.handleCategoryChange(category)}
                >
                  {category === 'Vše' ? 'Vše' : 
                   category === 'main' ? 'Hlavní jídla' :
                   category === 'drink' ? 'Nápoje' :
                   category === 'dessert' ? 'Dezerty' : category}
                </button>
              ))}
            </div>

            <Droppable droppableId="menu-drop-area" isDropDisabled={true}>
              {(provided) => (
                <div className="menu-items" ref={provided.innerRef} {...provided.droppableProps}>
                  {selectedCategory === 'Vše' ? (
                    groupedMenuItems.map((categoryGroup) => (
                      categoryGroup.items.length > 0 && (
                        <div key={categoryGroup.category} className="menu-category">
                          <h4 className="category-title">
                            {categoryGroup.category === 'main' ? 'Hlavní jídla' :
                             categoryGroup.category === 'drink' ? 'Nápoje' :
                             categoryGroup.category === 'dessert' ? 'Dezerty' : categoryGroup.category}
                          </h4>
                          {categoryGroup.items.map((item, index) => this.renderMenuItems(item, index))}
                        </div>
                      )
                    ))
                  ) : (
                    filteredMenuItems.length > 0 ? (
                      <div className="menu-category">
                        {filteredMenuItems.map((item, index) => this.renderMenuItems(item, index))}
                      </div>
                    ) : (
                      <div className="empty-state">Žádné položky v této kategorii.</div>
                    )
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div className="order-section">
            <div className="selected-table">
              {selectedTable ? (
                <>
                  <h3>{selectedTable.name}</h3>
                  <button className="change-table-btn" onClick={this.handleOpenTableModal}>Změnit stůl</button>
                </>
              ) : (
                <button className="select-table-btn" onClick={this.handleOpenTableModal}>Vybrat stůl</button>
              )}
            </div>

            <Droppable droppableId="order-drop-area">
              {(provided) => (
                <div className="order-items" {...provided.droppableProps} ref={provided.innerRef}>
                  {currentOrder.length === 0 ? (
                    <div className="empty-order">Přetáhněte položky menu sem</div>
                  ) : (
                    currentOrder.map((item, index) => this.renderOrderItems(item, index))
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <div className="order-summary">
              <div className="total-amount">
                Celkem: {this.calculateTotal()} Kč
              </div>
              <button 
                className="submit-btn"
                disabled={currentOrder.length === 0 || !selectedTable}
                onClick={this.handleSubmitOrder}
              >
                Odeslat objednávku
              </button>
            </div>

            {showTableModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Vyberte stůl</h3>
                  <div className="table-list">
                    {tables.map(table => (
                      <div 
                        key={table.id} 
                        className="table-item"
                        onClick={() => this.handleTableSelect(table)}
                      >
                        {table.name}
                      </div>
                    ))}
                  </div>
                  <div className="modal-actions">
                    <button className="btn btn-secondary" onClick={this.handleCloseTableModal}>Zrušit</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DragDropContext>
    );
  }
}

NewOrder.propTypes = {
  menuItems: PropTypes.array.isRequired,
  tables: PropTypes.array.isRequired,
  customCategories: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
  navigate: PropTypes.func.isRequired,
  setOrders: PropTypes.func.isRequired,
};

const NewOrderWithLocationAndNavigation = withLocationAndNavigation(NewOrder);

export default NewOrderWithLocationAndNavigation;