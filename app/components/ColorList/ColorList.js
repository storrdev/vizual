import React, { Component } from 'react';
import { SketchPicker } from 'react-color';
import styles from './ColorList.scss';

import ColorListItem from './ColorListItem';

class ColorList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      color: '#ff0000',
      pickerOpen: false,
    };
  }

  handleAddClick(e) {
    this.setState((prevState, props) => {
      return { pickerOpen: !prevState.pickerOpen };
    });
  }

  handleColorChange(color, e) {
    this.setState((prevState, props) => {
      return { color: color.hex };
    });
  }

  handleColorAccept(e) {
    if (typeof this.props.onAddColor === 'function') {
      this.props.onAddColor(this.state.color);
    }

    this.setState((prevState, props) => {
      return { pickerOpen: false };
    });
  }

  handleColorListItemClick(index, e) {
    this.setState((prevState, props) => {
      let colors
    })
  }

  render() {
    return (
      <div className="color-list">
        {
          this.state.pickerOpen ?
            <div className="color-picker-wrapper">
              <SketchPicker
                color={this.state.color}
                onChangeComplete={this.handleColorChange.bind(this)}
                presetColors={[]} />
              <div className="accept-color" onClick={this.handleColorAccept.bind(this)}>Accept</div>
            </div>
            :
            ''
        }
        {
          this.props.colors.map((color, index) => {
            return (
              <ColorListItem
                color={color}
                key={`color-list-item-${index}`}
                onClick={this.handleColorListItemClick.bind(this, index)} /> 
            );
          })
        }
        <div className="add-button" onClick={this.handleAddClick.bind(this)}>+</div>
      </div>
    );
  }
}

export default ColorList;
