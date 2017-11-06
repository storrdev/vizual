import React, { Component } from 'react';
import * as THREE from 'three';
import Rainbow from 'rainbowvis.js';

// import Frau from './Frau.json';

const BIT_DEPTH = 255;

class ThreeJS extends Component {
  constructor(props) {
    super(props);

    this.state = {
      groupScale: 4,
      colors: [
        'ff3a3a', // red
        'ff961e', // orange
        'ffee00', // yellow
        '64f24f', // green
        '584dd1',  // blue
        '7621a0' // purple
      ]
    }

    this.groupScale = 4;
    this.counter = 0;
    this.colorCounter = 0;
    this.colorIncrement = -1;
    this.colorIndex = 0;
    this.increase = Math.PI * 2 / 1000;
    this.colors = [ 0xff0000, 0xffff00, 0x00ff00, 0x00ffff, 0x0000ff, 0xff00ff ];

    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount() {
    // Override state with props if they are present
    this.setState((prevState, props) => {
      return Object.assign({}, prevState, { ...props });
    }, () => {
      // Wait until the state has been overwritten by incoming props
      // before initializing anything

      // Initialize Rainbow
      this.rainbow = new Rainbow();
      this.rainbow.setNumberRange(0, 255);
      this.rainbow.setSpectrum(...this.props.colors);

      // Initialize & append the canvas
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize( window.innerWidth, window.innerHeight );
      this.refs.self.appendChild( this.renderer.domElement );

      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 3, 1000 );
    
      // Get the amount of audio data we're working with so
      // we can use that to generate shapes and stuff
      let audioData = this.props.onAudio();

      // Create group to hold all the shapes
      this.group = new THREE.Group();
      this.shapes = [];

      audioData.forEach((ad, index) => {
        let geometry = new THREE.CylinderGeometry(1.5, 1.5, 3, 10, false);
        // let geometry = new THREE.TorusGeometry( 1.5, 3, 8, 3 );
        // let geometry = new THREE.TetrahedronGeometry(3, 0);
        let edges = new THREE.EdgesGeometry( geometry );

        let color = new THREE.Color(`#${this.rainbow.colourAt(this.colorCounter)}`);

        let material = new THREE.MeshBasicMaterial( { color: color } );
        let shape = new THREE.LineSegments( edges, material );

        // shape.setRotationFromAxisAngle(new THREE.Vector3(0.5, 1, 1), 180);

        shape.rotation.x += 0.002 * index;
        shape.rotation.y += 0.002 * index;
        shape.rotation.z += 0.002 * index;

        this.shapes.push( shape );

        this.group.add( shape );

        if (index % 255 === 0) {
          this.colorIncrement *= -1;
          // console.log(this.colorIncrement);
        }

        this.colorCounter += this.colorIncrement;
      });
      
      this.scene.add( this.group );
      
      this.camera.position.z = 5;
      
      // Start Animations
      this.animate();
      this.handleResize();

      // Add window resize handler so the canvas resizes along with the window
      window.addEventListener('resize', this.handleResize);
    });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(prevProps);
    console.log(this.props);
    if (this.props.colors.length !== this.state.colors.length) {
      console.log('componentDidUpdate');
      this.setState((prevState, props) => {
        return Object.assign({}, prevState, { ...props });
      });
    }

    if (typeof this.rainbow !== 'undefined') {
      console.log('changing colors');
      console.log(this.props.colors);
      this.rainbow.setSpectrum(...this.props.colors);
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  animate() {
    requestAnimationFrame( this.animate );
    let audioData = this.props.onAudio();

    audioData.forEach((ad, index) => {
      let percent = audioData[index] / BIT_DEPTH;

      let x = ((this.groupScale + 4) / 3) + (percent / 60);
      let y = ((this.groupScale + 10) / 9) - (percent / 40);
      let z = (2 / (this.groupScale + 3)) - (percent / 20);

      
      // if (index === Date.now() % 1024) {
      //   this.shapes[index].visible = true;
        this.shapes[index].scale.set( x, y, 3 );
      // } else {
        // this.shapes[index].scale.set( this.groupScale, this.groupScale, this.groupScale );
      // }
      
      // this.pyramids[index].material.color.setHex(this.rainbow.colourAt(index % 100));
    });
    // debugger;
    
    this.group.rotation.x += this.getRandomArbitrary(0.001, 0.003);
    this.group.rotation.y += this.getRandomArbitrary(0.001, 0.003);
    this.group.rotation.z -= this.getRandomArbitrary(0.001, 0.003);

    this.groupScale = Math.sin( this.counter ) * 10;
  
    this.renderer.render(this.scene, this.camera);

    this.counter += this.increase / 5;

    this.colorCounter += this.colorIncrement;
  }

  handleResize(e) {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  render() {
    return <div className="three-js" ref="self"></div>;
  }
}

export default ThreeJS;