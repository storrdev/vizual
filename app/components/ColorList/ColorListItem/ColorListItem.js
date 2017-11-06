import React, { Component } from 'react';

import _style from './style.json';

class ColorListItem extends Component {
  handleClick(e) {
    if (typeof this.props.onClick === 'function') {
      this.props.onClick(e);
    }
  }

  render() {
    let style = Object.assign({}, _style, {
      backgroundColor: `#${this.props.color}`
    });

    return (
      <div className="color-list-item" style={style} onClick={this.handleClick.bind(this)}>

      </div>
    );
  }
}

export default ColorListItem;
