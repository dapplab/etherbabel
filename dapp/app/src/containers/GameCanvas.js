import React              from 'react';
import Matter             from 'matter-js';
import Web3               from 'web3';
import babelABI           from './../babel-abi';

let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    Events = Matter.Events,
    babelLevel = 0,
    isDropping = false;

let engine = Engine.create(document.getElementById('canvas-container'));
let renderOptions = engine.render.options;
    renderOptions.wireframes = false;
    engine.render.canvas.width = 750;
    engine.render.canvas.height = 1800;
let ground = Bodies.rectangle(375, 1810, 760, 120, { isStatic: true, render: { visible: false } });

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

var sandboxId = "d6959069f7057c64247014c551f33ed658e4343f";
var babelAddress = '0x17956ba5f4291844bc25aedb27e69bc11b5bda39';
var gamerAddress = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';

var web3 = setupWeb3(sandboxId);
console.log(babelABI);
var babel = setupBabel(web3, babelAddress, babelABI);

var brickPrice = web3.toWei('1', 'ether');

var canvasWidth = 680;
var canvasHeight = 720;

var brickWidth = 120;
var brickHeight = 30;
var brickBorder = 1;
var brickFullHeight = brickHeight + brickBorder*2;
var brickHalfWidth = brickWidth / 2;

var brickD = 1001;
var brickR = brickD / 2;

var centralBrickLeft = canvasWidth/2 - brickWidth/2;

window.web3 = web3;
window.babel = babel;
var coinbase = web3.eth.coinbase;

export default class GameCanvas extends React.Component {

  constructor() {
    super();
    this.state = { action: 'init', bricks: [], celebrate: false, loading: false };
  }

  donatedByU(brickFrom) {
    console.log('brickFrom', brickFrom);
    return brickFrom === coinbase
  }

  collapse(obj) {
    let bricks = this.state.bricks.slice(0, obj.collapsedAt+1);
    this.setState({ bricks: bricks, celebrate: this.donatedByU(obj.account), loading: false });
    console.log("Collapsed!", this.donatedByU(obj.account), obj);
  }

  addBrick(brick) {
    let bricks = this.state.bricks;
    bricks.push(brick);
    this.setState({ bricks: bricks, celebrate: false, loading: false });
    console.log("AddBrick", brick);
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
    this.setState({ loading: true });
    babel.addBrick({
        from: gamerAddress,
        value: brickPrice,
    });
  }

  frozenBricks(bricks=[]) {
    if (bricks.length == 0) return;
    bricks.forEach((brick) => {
      Body.setStatic(brick, true);
    });
  }

  collapseBricks(from) {
    let bricks = engine.world.bodies;

    for(let j = from + 1; j < bricks.length; j++) {
      Body.setStatic(bricks[j], false);
      console.log(bricks.length, bricks[j]);
    }

    Body.setVelocity(bricks[4], { x: 100, y: 0 });
    Body.setPosition(bricks[4], { x: 100, y: 0 });
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

    this.setState({ brick: bricks });
  }

  componentWillMount() {
    this.setupFilters(babel);
    this.getBricks();
  }

  renderBrick(brick, i) {
    let left = centralBrickLeft + brickHalfWidth * brick.offset / brickR;
    let bottom = i*brickFullHeight;
    let className = 'brick';
    if(brick.donated){ className = 'brick donated' }
    return (
      <div className={className} key={brick.id} style={ { bottom: bottom, left: left } } data-offset={brick.offset} data-level={i} >{brick.id}</div>
    )
  }

  renderBrickList() {
    switch(this.state.action){
      case 'init':
        let bodies = this.state.bricks.reduce((objs, brick) => {
                    objs.push(Bodies.rectangle(300 - (brick.offset * Common.random(0, 1) * Common.choose([1,-1])), 5, 100, 20, { friction: 1, frictionStatic: 50 }));
                    return objs;
                  }, [ground]);
        console.log(bodies);
        World.add(engine.world, bodies.reverse());
        Engine.run(engine);
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
      <div>
        <div id="game-canvas">
          <a className="btn btn-primary" onClick={(e) => this.handleClick()}>Insert Coin</a>
          <a className="btn btn-danger" onClick={(e) => this.collapseBricks(15)}>Collapse from 5</a>
        </div>
        { this.renderLoading(this.state.loading) }
      </div>
    )
  }
}
