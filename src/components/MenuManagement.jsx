import React from 'react';
import '../styles/components.scss';

// Receive menuItems, setMenuItems, nextItemId, setNextItemId as props
class MenuManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        price: '',
        category: 'main'
      },
      editingId: null,
      deleteConfirmId: null,
      selectedCategory: 'all',
      newCategoryName: '',
      showCategoryModal: false,
      editingCategories: [],
      isLoading: false,
      svgColor: 'currentColor', // State to manage SVG color
    };

    this.formRef = React.createRef();
    this.svgRef = React.createRef(); // Ref for SVG element

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.editItem = this.editItem.bind(this);
    this.requestDeleteItem = this.requestDeleteItem.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelDelete = this.cancelDelete.bind(this);
    this.handleAddCategory = this.handleAddCategory.bind(this);
    this.openCategoryModal = this.openCategoryModal.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    this.handleSaveCategories = this.handleSaveCategories.bind(this);
    this.getCategoryDisplayName = this.getCategoryDisplayName.bind(this);
    this.handleSvgClick = this.handleSvgClick.bind(this); // Bind new method
  }

  componentDidMount() {
    // Initialize editingCategories state from prop when modal is opened, not here
    // The useEffect for initializing customCategories is handled in App now.
    this.setState({ isLoading: false });
  }

  componentWillUnmount() {
    // Clean up event listeners
  }

  /**
   * Groups menu items by category.
   * @returns {Array<object>} An array of objects, each containing a category and an array of items in that category, sorted by a preferred order.
   */
  getGroupedMenuItems() {
    const { menuItems, customCategories } = this.props;
    const grouped = menuItems.reduce((acc, item) => {
      const category = item.category || 'Uncategorized';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    const categoryOrder = ['main', 'drink', 'dessert', ...customCategories];
    return categoryOrder
      .filter(category => grouped[category])
      .map(category => ({
        category,
        items: grouped[category]
      }));
  }

  /**
   * Filters menu items based on the currently selected category.
   * @returns {Array<object>} An array of menu items belonging to the selected category, or all items if 'Vše' is selected.
   */
  getFilteredMenuItems() {
    const { menuItems } = this.props;
    const { selectedCategory } = this.state;
    if (selectedCategory === 'all') {
      return menuItems;
    }
    return menuItems.filter(item => item.category === selectedCategory);
  }

  /**
   * Handles changes in form input fields (name, price, category).
   * Updates the formData state.
   * @param {object} e - The synthetic event object from the input change.
   */
  handleInputChange(e) {
    const { name, value } = e.target;
    this.setState(prevState => ({
      formData: {
        ...prevState.formData,
        [name]: name === 'price' ? parseFloat(value) || '' : value
      }
    }));
  }

  /**
   * Handles the submission of the menu item form.
   * Adds a new item or updates an existing item based on the editingId state.
   * Updates the menuItems state and resets the form.
   * @param {object} e - The synthetic event object from the form submission.
   */
  handleSubmit(e) {
    e.preventDefault();
    const { formData, editingId } = this.state;
    const { menuItems, setMenuItems, nextItemId, setNextItemId } = this.props;

    if (!formData.name || !formData.price) {
      alert('Vyplňte všechny údaje!');
      return;
    }

    if (editingId) {
      setMenuItems(menuItems.map(item =>
        item.id === editingId ? { ...formData, id: editingId } : item
      ));
      this.setState({ editingId: null });
    } else {
      const newItem = { ...formData, id: nextItemId };
      setMenuItems([...menuItems, newItem]);
      setNextItemId(nextItemId + 1);
    }

    this.setState({ formData: { name: '', price: '', category: 'main' } });
  }

  /**
   * Sets the component state to allow editing of a specific menu item.
   * Populates the form with the item's data.
   * @param {number} id - The ID of the menu item to edit.
   */
  editItem(id) {
    const { menuItems } = this.props;
    const itemToEdit = menuItems.find(item => item.id === id);
    if (itemToEdit) {
      this.setState({
        formData: {
          name: itemToEdit.name,
          price: itemToEdit.price,
          category: itemToEdit.category
        },
        editingId: id,
      });
      this.formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /**
   * Sets the deleteConfirmId state to show the delete confirmation modal for a specific item.
   * @param {number} id - The ID of the item to be deleted.
   */
  requestDeleteItem(id) {
    this.setState({ deleteConfirmId: id });
  }

  /**
   * Confirms and performs the deletion of the item with the deleteConfirmId.
   * Updates the menuItems state.
   */
  confirmDelete() {
    const { menuItems, setMenuItems } = this.props;
    const { deleteConfirmId } = this.state;
    setMenuItems(menuItems.filter(item => item.id !== deleteConfirmId));
    this.setState({ deleteConfirmId: null });
  }

  /**
   * Cancels the delete operation and hides the confirmation modal.
   */
  cancelDelete() {
    this.setState({ deleteConfirmId: null });
  }

  /**
   * Handles adding a new custom category.
   * Adds the new category to the customCategories state if it's not empty and doesn't already exist.
   */
  handleAddCategory() {
    const { newCategoryName } = this.state;
    const { customCategories, setCustomCategories } = this.props;
    if (newCategoryName.trim()) {
      if (customCategories.includes(newCategoryName.trim())) {
        alert('Tato kategorie již existuje!');
        return;
      }
      const updatedCategories = [...customCategories, newCategoryName.trim()];
      setCustomCategories(updatedCategories);
      this.setState({ newCategoryName: '' });
    }
  }

  /**
   * Opens the category management modal and initializes the editingCategories state.
   */
  openCategoryModal() {
    this.setState({ editingCategories: [...this.props.customCategories], showCategoryModal: true });
  }

  /**
   * Handles changes to a category name within the category management modal.
   * Updates the editingCategories state.
   * @param {number} index - The index of the category being edited in the editingCategories array.
   * @param {string} newName - The new name for the category.
   */
  handleCategoryChange(index, newName) {
    this.setState(prevState => {
      const updatedCategories = [...prevState.editingCategories];
      updatedCategories[index] = newName;
      return { editingCategories: updatedCategories };
    });
  }

  /**
   * Handles the deletion of a custom category from the modal.
   * Removes the category from the editingCategories state if it's not currently used by any menu item.
   * @param {number} index - The index of the category to delete in the editingCategories array.
   */
  handleDeleteCategory(index) {
    const { editingCategories } = this.state;
    const { menuItems } = this.props;
    const categoryToDelete = editingCategories[index];
    const categoryInUse = menuItems.some(item => item.category === categoryToDelete);
    if (categoryInUse) {
      alert('Tuto kategorii nelze smazat, protože je používána v menu!');
      return;
    }
    this.setState(prevState => ({
      editingCategories: prevState.editingCategories.filter((_, i) => i !== index)
    }));
  }

  /**
   * Saves the changes made to custom categories in the modal.
   * Updates the global customCategories state and potentially menu items' categories.
   * Closes the modal.
   */
  handleSaveCategories() {
    const { editingCategories } = this.state;
    const { menuItems, setMenuItems, setCustomCategories } = this.props;

    const uniqueCategories = new Set(editingCategories);
    if (uniqueCategories.size !== editingCategories.length) {
      alert('Kategorie nemohou mít stejný název!');
      return;
    }

    const updatedMenuItems = menuItems.map(item => {
      const oldCategory = item.category;
      const newCategory = editingCategories.find(cat => cat === oldCategory);
      return newCategory ? { ...item, category: newCategory } : item;
    });
    setMenuItems(updatedMenuItems);

    setCustomCategories(editingCategories);
    this.setState({ showCategoryModal: false });
  }

  /**
   * Provides a display name for categories, mapping internal keys to user-friendly strings.
   * @param {string} category - The internal category key (e.g., 'main', 'drink', or a custom category name).
   * @returns {string} The user-friendly display name for the category.
   */
  getCategoryDisplayName(category) {
    switch(category) {
      case 'main':
        return 'Hlavní jídlo';
      case 'drink':
        return 'Nápoj';
      case 'dessert':
        return 'Dezert';
      default:
        return category;
    }
  }

  /**
   * Handles the click event on the SVG icon next to the menu list title.
   * Toggles the color of the SVG icon as an example interaction.
   */
  handleSvgClick() {
    console.log('SVG clicked!');
    // Example interaction: Toggle SVG color
    this.setState(prevState => ({
      svgColor: prevState.svgColor === 'currentColor' ? 'blue' : 'currentColor',
    }));
  }

  render() {
    const { formData, editingId, deleteConfirmId, selectedCategory, newCategoryName, showCategoryModal, editingCategories, isLoading, svgColor } = this.state;
    const { menuItems, customCategories } = this.props; // eslint-disable-next-line no-unused-vars

    if (isLoading) {
      return (
        <div className="loading" role="status" aria-label="Načítání">
          Načítání...
        </div>
      );
    }

    const filteredMenuItems = this.getFilteredMenuItems();

    const defaultCategories = ['main', 'drink', 'dessert'];
    const allCategories = ['all', ...defaultCategories, ...customCategories];

    return (
      <div className="menu-management" role="main">
        <h2>Správa menu</h2>

        <section className="menu-management-container">
          <section className="menu-form-section">
            <h3 className="section-title">Přidat/Upravit položku</h3>
            <div className="menu-form card" ref={this.formRef} role="form" aria-label={editingId ? 'Upravit položku menu' : 'Přidat novou položku do menu'}>
              <h4>{editingId ? 'Upravit položku' : 'Přidat novou položku'}</h4>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="itemName">Název:</label>
                  <input
                    type="text"
                    id="itemName"
                    name="name"
                    value={formData.name}
                    onChange={this.handleInputChange}
                    required
                    aria-label="Název položky menu"
                    placeholder="Zadejte název položky"
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="itemPrice">Cena:</label>
                  <input
                    type="number"
                    id="itemPrice"
                    name="price"
                    value={formData.price}
                    onChange={this.handleInputChange}
                    required
                    aria-label="Cena položky menu"
                    placeholder="Zadejte cenu položky"
                    step="0.01"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="itemCategory">Kategorie:</label>
                  <select
                    id="itemCategory"
                    name="category"
                    value={formData.category}
                    onChange={this.handleInputChange}
                    required
                    aria-label="Vyberte kategorii položky menu"
                  >
                     <option value="main">Hlavní jídlo</option>
                     <option value="drink">Nápoj</option>
                     <option value="dessert">Dezert</option>
                    {customCategories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingId ? 'Uložit změny' : 'Přidat položku'}
                  </button>
                  {editingId && (
                    <button type="button" className="cancel-btn" onClick={() => this.setState({ editingId: null, formData: { name: '', price: '', category: 'main' } })}>
                      Zrušit úpravy
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>

          <section className="menu-list-section">
            <h3 className="section-title">Seznam položek menu</h3>
            <div className="menu-list card">
              <div className="menu-list-header">
                <h4>Dostupné položky
                   <svg ref={this.svgRef} onClick={this.handleSvgClick} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={svgColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '10px', cursor: 'pointer' }}>
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8m-3 4a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16m18-8v4h-4m-3 4h4v4"></path>
                   </svg>
                 </h4>
              </div>
              <div className="category-filter" role="tablist" aria-label="Filtry kategorií">
                 {/* Render category filter buttons */}
                 {allCategories.map(category => (
                    <button
                      key={category}
                      className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
                      onClick={() => this.setState({ selectedCategory: category })}
                      role="tab"
                      aria-selected={selectedCategory === category}
                    >
                      {category === 'all' ? 'Vše' : this.getCategoryDisplayName(category)}
                    </button>
                  ))}
                   <button className="category-btn manage-categories-btn" onClick={this.openCategoryModal}>
                     Spravovat kategorie
                   </button>
              </div>

              <div className="menu-items">
                {filteredMenuItems.length === 0 ? (
                  <div className="empty-state">Žádné položky k zobrazení.</div>
                ) : (
                  filteredMenuItems.map(item => (
                    <div key={item.id} className="menu-item">
                      <div className="menu-item-content">
                        <span className="item-name">{item.name}</span>
                        <span className="item-price">{item.price} Kč</span>
                      </div>
                      <div className="item-actions">
                        <button className="edit-btn" onClick={() => this.editItem(item.id)}>
                          Upravit
                        </button>
                        <button className="delete-btn" onClick={() => this.requestDeleteItem(item.id)}>
                          Smazat
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </section>

        {/* Delete Confirmation Modal */}
        {deleteConfirmId !== null && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Potvrdit smazání</h3>
              <p>Opravdu chcete smazat tuto položku?</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={this.cancelDelete}>
                  Zrušit
                </button>
                <button className="confirm-btn" onClick={this.confirmDelete}>
                  Smazat
                </button>
              </div>
            </div>
          </div>
        )}

         {/* Category Management Modal */}
         {showCategoryModal && (
           <div className="modal-overlay">
             <div className="modal-content">
               <h3>Spravovat kategorie</h3>
                <div className="modal-body">
                   <div className="categories-list">
                      {editingCategories.map((category, index) => (
                         <div key={index} className="category-edit-item">
                            <input
                                type="text"
                                value={category}
                                onChange={(e) => this.handleCategoryChange(index, e.target.value)}
                                className="form-input"
                            />
                            <button onClick={() => this.handleDeleteCategory(index)} className="btn-error">Smazat</button>
                         </div>
                      ))}
                   </div>
                    <div className="add-category-input">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => this.setState({ newCategoryName: e.target.value })}
                            placeholder="Nová kategorie"
                            className="form-input"
                        />
                         <button onClick={this.handleAddCategory} className="btn-primary">Přidat</button>
                    </div>
                </div>
               <div className="modal-actions">
                 <button className="btn btn-secondary" onClick={() => this.setState({ showCategoryModal: false, newCategoryName: '' })}>Zrušit</button>
                 <button className="btn btn-primary" onClick={this.handleSaveCategories}>Uložit</button>
               </div>
             </div>
           </div>
         )}
      </div>
    );
  }
}

export default MenuManagement;