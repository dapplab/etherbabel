import React              from 'react';
import Matter             from 'matter-js';
import Web3               from 'web3';
import babelABI           from './../babel-abi';

import 'styles/core.scss';
import brickStyle1        from '../images/style1.png';
import brickStyle2        from '../images/style2.png';
import brickStyle3        from '../images/style3.png';
import brickStyle4        from '../images/style4.png';
import brickStyle5        from '../images/style5.png';

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
    engine.render.canvas.width = 750;
    engine.render.canvas.height = 1800;
let ground = Bodies.rectangle(375, 1810, 760, 120, { isStatic: true, render: { visible: false } });

World.add(engine.world, [ground]);
Engine.run(engine);

function setupWeb3(sandboxId) {
  var web3 = new Web3();
  web3.setProvider(new web3.providers.HttpProvider("http://babel.on.ether.camp:8555/sandbox/" + sandboxId));

  return web3;
}

function setupBabel(web3, address, abi) {
    var Babel = web3.eth.contract(abi);
    var babel = Babel.at(address);
    console.log("babel initalized.", babel);

    return babel;
}

var sandboxId = "ad4d13f2bb42be973245d513b0b10a4fbdd95677";
var babelAddress = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';
var gamerAddress = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var web3 = setupWeb3(sandboxId);
console.log(babelABI);
var babel = setupBabel(web3, babelAddress, babelABI);

var brickPrice = web3.toWei('1', 'ether');

var canvasWidth = 680;
var canvasHeight = 720;

var brickWidth = 100;
var brickHeight = 20;
var brickBorder = 1;
var brickFullHeight = brickHeight + brickBorder*2;
var brickHalfWidth = brickWidth / 2;

var brickD = 1073741824;
var brickR = brickD / 2;

var centralBrickLeft = canvasWidth/2 - brickWidth/2;

window.web3 = web3;
window.babel = babel;
var coinbase = web3.eth.coinbase;

export default class GameCanvas extends React.Component {

  constructor() {
    super();
    this.state = { action: null, bricks: [], addedBrick: null, celebrate: false, loading: false };
  }

  donatedByU(brickFrom) {
    return brickFrom === coinbase
  }

  collapse(obj) {
    let bricks = this.state.bricks.slice(0, obj.collapsedAt+1);
    this.setState({ bricks: bricks, action: 'collapse', from: obj.collapsedAt, celebrate: this.donatedByU(obj.account), loading: false });
    console.log("Collapsed!", this.donatedByU(obj.account), obj);
    this.setState({ action: null })
  }

  addBrick(brick) {
    let bricks = this.state.bricks;
    bricks.push(brick);
    this.setState({ action: 'addBrick', addedBrick: brick, bricks: bricks, celebrate: false, loading: false });
    console.log("AddBrick", brick);
    this.setState({ addedBrick: null, action: null });
  }

  formatBrick(brick) {
    if (Array.isArray(brick)) { // Init
        return {
            id: brick[0].toString(),
            from: brick[1],
            value: brick[2].toString(),
            offset: brick[3].toString(),
            donated: this.donatedByU(brick[1])
        }
    } else { // Event
        return {
            id: brick.id.toString(),
            from: brick.from,
            height: brick.height.toString(),
            offset: brick.offset.toString(),
            donated: this.donatedByU(brick.from)
        };
    }
  }

  addBrickCallback(err, result) {
    if (err) {
        console.log(err);
    } else {
        var obj = this.formatBrick(result.args);
        this.addBrick(obj);
    }
  }

  CollapseCallback(err, result) {
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
    babel.Collapse('latest', this.CollapseCallback.bind(this));
  }

  handleClick() {
    this.setState({ loading: true, action: null });
    babel.addBrick({
        from: gamerAddress,
        value: brickPrice,
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
      Body.setPosition(bricks[j], { x: collapseBrick.position.x+Common.choose([-50,-50]), y: 1800 - collapsedAt*20 });
    }

    //clear collapesed bricks
    setTimeout(() => {
      World.remove(engine.world, bricks.slice(collapsedAt));
    }, 3000);
  }

  getBricks() {
    var bricks = this.state.bricks;

    var i = 0;
    while(true) {
      var brick = this.formatBrick(babel.bricks(i, { from: gamerAddress }));

      if(brick.from === '0x') {
        break;
      } else {
        bricks.push(brick);
      }
      i++;
    }

    this.setState({ brick: bricks, action: 'init' });
  }

  componentWillMount() {
    this.setupFilters(babel);
    this.getBricks();
  }

  renderBrickList() {
    switch(this.state.action){
      case 'init':
        let bodies = this.state.bricks.reduce((objs, brick) => {
                    let offset = centralBrickLeft + brickHalfWidth * brick.offset / brickR
                    objs.push(Bodies.rectangle(375 - offset, 5, 100, 20, { friction: 1, frictionStatic: 50 }));
                    return objs;
                  }, []);
        console.log(bodies);
        World.add(engine.world, bodies.reverse());
     case 'addBrick':
        let brick = this.state.addedBrick;
        if(brick !== null){
          let offset = centralBrickLeft + brickHalfWidth * brick.offset / brickR;
          let texture =  Common.choose([brickStyle4, brickStyle5, brickStyle3, brickStyle1, brickStyle2]);
          let newBody = Bodies.rectangle(375 - offset, 5, 100, 20, { label: brick.id, inertia: Infinity, density: 10000, mass: 10000, render: { sprite: { texture: texture } } });

          World.add(engine.world, newBody);
        }
      case 'collapse':
        this.collapseBricks(this.state.from);
    }
  }

  renderLoading(loading) {
    if(loading){
      return (
        <div> loading ...... </div>
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