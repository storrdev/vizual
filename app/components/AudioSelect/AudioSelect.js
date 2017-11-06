import React, { Component } from 'react';
import style from './style.json';

import ColorList from '../ColorList';
import ThreeJS from '../ThreeJS';

class AudioSelect extends Component {
  constructor(props) {
    super(props);

    this.state = {
      audioLoaded: false,
      colors: [
        'ff3a3a', // red
        'ff961e', // orange
        'ffee00', // yellow
        '64f24f', // green
        '00FFE4', // cyan
        '584dd1',  // blue
        '7621a0', // purple,
        'FF00B2'
      ]
    };

    this.getAudio = this.getAudio.bind(this);
  }

  componentDidMount() {
    // Create audio context
    this.ac = new (window.AudioContext || window.webkitAudioContext)();
    this.source = null; // BufferSource containing buffered audio
    this.analyser = this.ac.createAnalyser();

    // setInterval(() => {
    //   this.setState((prevState, props) => {
    //     let colors = prevState.colors;
    //     let last = colors.pop();
    //     colors.unshift(last);

    //     return { colors };
    //   });
    // }, 50);
  }

  handleChange(e) {
    let file = e.target.files[0];
    
    let reader = new FileReader();
    reader.onload = e => {
      
      this.ac.decodeAudioData(reader.result, buffer => {
        if (this.source !== null) {
          this.source.disconnect(this.ac.destination);
          this.source = null;
        }

        this.source = this.ac.createBufferSource();
        this.source.connect(this.analyser);
        this.source.buffer = buffer;
        this.source.connect(this.ac.destination);
        this.source.start(0);
        this.setState((prevState, props) => {
          return { audioLoaded: true };
        }, () => {
          this.refs['file-input'].style.display = 'hidden';
        });
      });
    }

    reader.readAsArrayBuffer(file);
  }

  handleColorListAdd(hex) {
    // String off the pound symbol
    let color = hex.substr(1);

    this.setState((prevState, props) => {
      let colors = prevState.colors;

      colors.push(color);

      return { colors };
    });
  }

  getAudio() {
    if (typeof this.analyser !== 'undefined') {
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount); // Uint8Array should be the same length as the frequencyBinCount 
      this.analyser.getByteFrequencyData(this.dataArray); // fill the Uint8Array with data returned from getByteFrequencyData()
      return this.dataArray;
    } else {
      return [];
    }
  }

  render() {
    return (
      <div className="audio-select" style={style}>
        <input type="file" onChange={this.handleChange.bind(this)} ref="file-input" />
        {/* <ColorList
          colors={this.state.colors}
          onAddColor={this.handleColorListAdd.bind(this)} /> */}
        {
          this.state.audioLoaded ?
            <ThreeJS onAudio={this.getAudio} colors={this.state.colors} />
            : ''
        }
      </div>
    );
  }
}

export default AudioSelect;
