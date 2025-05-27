import React from 'react';

class MenuItem extends React.Component {
  /**
   * Provides a specific CSS class based on the menu item category.
   * Useful for category-specific styling.
   * @param {string} category - The category of the menu item.
   * @returns {string} The CSS class name corresponding to the category, or an empty string if no specific class is defined.
   */
  getCategoryClass(category) {
    switch(category) {
      case 'main': return 'main-course';
      case 'drink': return 'drink';
      case 'dessert': return 'dessert';
      default: return '';
    }
  }

  render() {
    const { item } = this.props;

    return (
      <div
        className={`menu-item ${this.getCategoryClass(item.category)}`}
        role="listitem"
        aria-label={`${item.name}, ${item.price} Kč`}
      >
        <div className="item-name">{item.name}</div>
        <div className="item-price" aria-label={`${item.price} Kč`}>{item.price} Kč</div>
      </div>
    );
  }
}

export default MenuItem;