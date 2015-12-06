import React              from 'react';
import Matter             from 'matter-js';
import BabelStore         from './../store/babelStore';

import 'styles/core.scss';
import brickStyle1        from '../images/style1.png';
import brickStyle2        from '../images/style2.png';
import brickStyle3        from '../images/style3.png';
import brickStyle4        from '../images/style4.png';
import brickStyle5        from '../images/style5.png';
import loaderImg          from '../images/loader.gif';

import addBrickSound from '../sounds/addBrick.wav';
import collapseSound from '../sounds/collapse.wav';
import winSound from '../sounds/win.wav';

function playSound(soundNO){
  switch(soundNO) {
    case 0:
      let audio = new Audio(addBrickSound);
      audio.play();
      break;
    case 1:
      let audio1 = new Audio(collapseSound);
      audio1.play();
      break;
    case 2:
      let audio2 = new Audio(winSound);
      audio2.play();
      break;
  }
}

// game sizes

let canvasWidth = 750;
let canvasHeight = window.innerHeight;
let brickWidth = 100;
let brickHeight = 20;
let brickBorder = 1;
let brickFullHeight = brickHeight + brickBorder*2;
let brickHalfWidth = brickWidth / 2;
let brickD = 1073741824;
let brickR = brickD / 2;
let centralBrickLeft = canvasWidth/2 - brickWidth/2;

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    Composites = Matter.Composites,
    babelLevel = 0,
    isDropping = false;

// create a Matter.js engine
let engine = Engine.create(document.getElementById('canvas-container'));
let renderOptions = engine.render.options;
    renderOptions.wireframes = false;
    engine.render.canvas.width = canvasWidth;
    engine.render.canvas.height = canvasHeight;
let ground = Bodies.rectangle(canvasWidth/2, canvasHeight+10, canvasHeight+10, 80, { isStatic: true, render: { visible: false } });

World.add(engine.world, [ground]);
Engine.run(engine);

export default class GameCanvas extends React.Component {

  constructor() {
    super();

    this.babelStore = new BabelStore();
    this.babel = this.babelStore.babel;
    this.state = { action: null, bricks: [], addedBrick: null, celebrate: false, loading: false, showLoader: true };

    this.setupFilters(this.babel);
  }

  collapse(obj) {
    let bricks = this.state.bricks.slice(0, obj.collapsedAt+1);
    this.setState({ bricks: bricks, action: 'collapse', from: obj.collapsedAt, win: obj, collapsedAmount: obj.amount, celebrate: this.babelStore.donatedByU(obj.account), loading: false });
    console.log("Collapsed!", this.babelStore.donatedByU(obj.account), obj);
    this.setState({ action: null });    
  }

  addBrick(brick) {
    let bricks = this.state.bricks;
    bricks.push(brick);
    this.setState({ action: 'addBrick', addedBrick: brick, bricks: bricks, loading: false });
    console.log("AddBrick", brick);
    this.setState({ addedBrick: null, action: null });
  }

  addBrickCallback(err, result) {
    if (err) {
        console.log(err);
    } else {
        var obj = this.babelStore.formatBrick(result.args);
        this.addBrick(obj);
    }
  }

  collapseCallback(err, result) {
    if (err) {
      console.log(err);
    } else {
      var obj = {
        id: result.args.id.toNumber(),
        collapsedAt: result.args.collapsedAt.toNumber(),
        account: result.args.account,
        amount: result.args.amount.toString(),
        height: result.args.height.toNumber
      };
      this.collapse(obj);
    }
  }

  setupFilters(babel) {
    babel.AddBrick('latest', this.addBrickCallback.bind(this));
    babel.Collapse('latest', this.collapseCallback.bind(this));
  }


  handleClick(e) {
    playSound(0);
    let ele = e.target;
    ele.disabled = true;
    setTimeout(() => {
      ele.disabled = false;
    }, 1000);

    this.setState({ loading: true, action: null });
    this.babel.addBrick('', {
        from: this.babelStore.gamerAddress,
        value: this.babelStore.brickPrice,
    });
  }

  collapseBricks(from) {
    playSound(1);
    let bricks = engine.world.bodies;
    let collapsedAt = from + 1;
    let collapseBrick = bricks[collapsedAt];

    if (!collapseBrick)
      return;

    for(let j = from + 1; j < bricks.length; j++) {
      Body.setInertia(bricks[j], 0.1);
      Body.setPosition(bricks[j], { x: collapseBrick.position.x+Common.choose([200,-200]), y: canvasHeight - collapsedAt*20 });
    }

    //clear collapesed bricks
    setTimeout(() => {
      World.remove(engine.world, bricks.slice(collapsedAt));
    }, 2000);
  }

  componentDidMount() {
    setTimeout( ()=> {
        var bricks = this.babelStore.getBricksFromOffsets();
        this.initBricks(bricks);
        this.setState({ bricks: bricks, showLoader: false });
    }, 1000 );
  }

  initBricks(bricks){
      var bodies = [];
      for(var i = 0; i < bricks.length; i++){
        bodies.push(this.createBrickRectangle(bricks[i], canvasHeight - 40 - brickHeight * i));
      }

      console.log(bodies);
      World.add(engine.world, bodies);
  }

  createBrickRectangle(brick, y = 5) {
    let offset = centralBrickLeft + brickHalfWidth * brick.offset / brickR;
    let texture = Common.choose([brickStyle4, brickStyle5, brickStyle3, brickStyle1, brickStyle2]);
    console.log(offset, y);
    return Bodies.rectangle(offset, y, brickWidth, brickHeight,
                            { label: brick.id, inertia: Infinity, density: 10000,
                              render: { sprite: { texture: texture } } });
  }

  renderBrickList() {
    switch(this.state.action){
     case 'addBrick':
        let brick = this.state.addedBrick;
        if(brick !== null){
          let newBody = this.createBrickRectangle(brick);
          World.add(engine.world, newBody);
        }
      case 'collapse':
        this.collapseBricks(this.state.from);
    }
  }

  renderLoading(loading) {
    if(loading){
      return (
        <div className="loading animated infinite zoomOutRight">&nbsp;</div>
      )
    } else {
      return '';
    }
  }

  render () {
    this.renderBrickList();

    let win = '';
    if(this.state.celebrate) {
      playSound(2);
      win = <div className="win animated infinite swing"><p>You just won <b>{ (Number(this.state.collapsedAmount)/1000000000000000000).toLocaleString() }</b> coins. </p></div>;
      setTimeout(() => {
        this.setState({ celebrate: false });
      }, 40000);
    }

    let loader = '';
    if(this.state.loader) {
      loader = <div className="loader"><img src={loaderImg} /></div>;
    }

    return (
      <div id="game-canvas">
        <div className="game-spec">
          <h2>Babel the Tower</h2>
          <p>Insert 1 eth coin, drop a Christmas gift and win rewards. lol</p>
          <p>Enjoy and have fun :)</p>
          <p>
            <a target='_blank' href='https://github.com/dapplab/etherbabel'>Github</a>
            &nbsp;
            &nbsp;
            &nbsp;
            <a target='_blank' href='https://github.com/dapplab/etherbabel'>Help</a>
          </p>
          <button className="btn btn-primary insert-coin" onClick={(e) => this.handleClick(e)}>Insert Coin</button>
        </div>
        { this.renderLoading(this.state.loading) }
        { win }
        { loader }
      </div>
    )
  }
}

// for debug
window.bricks = engine.world.bodies;
