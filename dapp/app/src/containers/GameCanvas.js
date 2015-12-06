import React              from 'react';
import Matter             from 'matter-js';
import BabelStore         from './../store/babelStore';

import 'styles/core.scss';
import brickStyle1        from '../images/style1.png';
import brickStyle2        from '../images/style2.png';
import brickStyle3        from '../images/style3.png';
import brickStyle4        from '../images/style4.png';
import brickStyle5        from '../images/style5.png';

// game sizes

let canvasWidth = 750;
let canvasHeight = 1200;
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
    this.state = { action: null, bricks: [], addedBrick: null, celebrate: false, loading: false };

    this.setupFilters(this.babel);
  }

  collapse(obj) {
    let bricks = this.state.bricks.slice(0, obj.collapsedAt+1);
    this.setState({ bricks: bricks, action: 'collapse', from: obj.collapsedAt, celebrate: this.babelStore.donatedByU(obj.account), loading: false });
    console.log("Collapsed!", this.babelStore.donatedByU(obj.account), obj);
    this.setState({ action: null })
  }

  addBrick(brick) {
    let bricks = this.state.bricks;
    bricks.push(brick);
    this.setState({ action: 'addBrick', addedBrick: brick, bricks: bricks, celebrate: false, loading: false });
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

  handleClick() {
    this.setState({ loading: true, action: null });
    this.babel.addBrick({
        from: this.babelStore.gamerAddress,
        value: this.babelStore.brickPrice,
    });
  }

  collapseBricks(from) {
    let bricks = engine.world.bodies;
    let collapsedAt = from + 1;
    let collapseBrick = bricks[collapsedAt];

    if (!collapseBrick)
      return;

    for(let j = from + 1; j < bricks.length; j++) {
      Body.setInertia(bricks[j], 0.1);
      Body.setPosition(bricks[j], { x: collapseBrick.position.x+Common.choose([-50,-50]), y: canvasHeight - collapsedAt*20 });
    }

    //clear collapesed bricks
    setTimeout(() => {
      World.remove(engine.world, bricks.slice(collapsedAt));
    }, 3000);
  }

  componentDidMount() {
    this.babelStore.getBricks((bricks) => {
      this.setState({ bricks: bricks, action: 'init' });
    });
  }

  renderBrickList() {
    switch(this.state.action){
      case 'init':
        let bodies = this.state.bricks.reduce((objs, brick) => {
                    let offset = centralBrickLeft + brickHalfWidth * brick.offset / brickR;
                    let texture = Common.choose([brickStyle4, brickStyle5, brickStyle3, brickStyle1, brickStyle2]);
                    objs.push(Bodies.rectangle(offset, 5, brickWidth, brickHeight, { label: brick.id, inertia: Infinity, density: 10000, mass: 10000, render: { sprite: { texture: texture } } }));
                    return objs;
                  }, []);

            console.log(bodies);
        World.add(engine.world, bodies.reverse());
     case 'addBrick':
        let brick = this.state.addedBrick;
        if(brick !== null){
          let offset = centralBrickLeft + brickHalfWidth * brick.offset / brickR;
          let texture =  Common.choose([brickStyle4, brickStyle5, brickStyle3, brickStyle1, brickStyle2]);
          let newBody = Bodies.rectangle(offset, 5, brickWidth, brickHeight, { label: brick.id, inertia: Infinity, density: 10000, mass: 10000, render: { sprite: { texture: texture } } });

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
    return (
      <div id="game-canvas">
        <button className="btn btn-primary" onClick={(e) => this.handleClick(e)}>Insert Coin</button>
        <button className="btn btn-danger" onClick={(e) => this.collapseBricks(15)}>Collapse from 5</button>
        { this.renderLoading(this.state.loading) }
      </div>
    )
  }
}

// for debug
window.bricks = engine.world.bodies;