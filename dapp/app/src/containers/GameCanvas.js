import React              from 'react';
import Matter             from 'matter-js';
import Web3               from 'web3';
import babelABI           from './../babel-abi';

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Common = Matter.Common,
    Events = Matter.Events;

// create a Matter.js engine
var engine = Engine.create(document.body);
var renderOptions = engine.render.options;
    renderOptions.wireframes = false;

// create two boxes and a ground
var boxA = Bodies.rectangle(100, 20, 80, 80);
var boxB = Bodies.rectangle(100, 50, 80, 80);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true, friction: 1 });

// add all of the bodies to the world
// World.add(engine.world, [boxA, boxB, ground]);

var offset = 5;
World.add(engine.world, [
    Bodies.rectangle(290, 455, 100, 20, { isStatic: true, friction: 1 }),
    Bodies.rectangle(300, 475, 100, 20, { isStatic: true, friction: 1 }),
    Bodies.rectangle(300 - offset*2, 495, 100, 20, { isStatic: true, friction: 1 }),
    Bodies.rectangle(300 + offset*5, 515, 100, 20, { isStatic: true, friction: 1 }),
    // Bodies.rectangle(100, 100 + offset, 100.5 + 2 * offset, 50.5),
    // Bodies.rectangle(100 + offset, 100, 50.5, 600.5 + 2 * offset),
    // Bodies.rectangle(-offset, 100, 50.5, 100.5 + 2 * offset),
    ground
]);

// run the engine
Engine.run(engine);
Events.on(engine, 'collisionActive', function(event) {
            var pairs = event.pairs;

            // change object colours to show those ending a collision
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i];
                pair.bodyA.render.fillStyle = '#979797';
                pair.bodyB.render.fillStyle = '#cff498';
            }
            Body.setStatic(pairs[0].bodyA, true);
            Body.setStatic(pairs[0].bodyB, true);
        })

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

var sandboxId = "8ff32c3ea555ff03ad973175d832279cd3cf8fa5";
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

export default class GameCanvas extends React.Component {

  constructor() {
    super();
    this.state = { bricks: [] };
  }

  collapse(obj) {
    let bricks = this.state.bricks.slice(0, obj.collapsedAt+1);
    this.setState({ bricks: bricks });
    console.log("Collapsed!", obj);
  }

  addBrick(brick) {
    let bricks = this.state.bricks;
    bricks.push(brick);
    this.setState({ bricks: bricks });
    console.log("AddBrick", brick);
  }

  formatBrick(brick) {
    if ($.isArray(brick)) { // Init
        return {
            id: brick[0].toString(),
            from: brick[1],
            value: brick[2].toString(),
            offset: brick[3].toString()
        }
    } else { // Event
        return {
            id: brick.id.toString(),
            from: brick.from,
            height: brick.height.toString(),
            offset: brick.offset.toString()
        };
    }
  }

  setupFilters(babel) {
    console.log(babel);
    babel.AddBrick('latest', function(err, result) {
        if (err) {
            console.log(err);
        } else {
            var obj = this.formatBrick(result.args);
            this.addBrick(obj);
        }
    });

    babel.Collapse('latest', function(err, result) {
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
    });
  }

  componentWillMount() {
    this.setupFilters(babel);
    this.getBricks();
  }

  handleClick(e) {
    let offset = 10;
    let newBody = Bodies.rectangle(300 - (offset * Common.random(0, 1) * Common.choose([1,-1])), 5, 100, 20, { friction: 1, frictionStatic: 50 });

    World.add(engine.world, [
        newBody,
        ground
      ]);
    setTimeout(() => {
      // this.frozenBricks([newBody]);
    }, 3000);
    // World.clear(engine.world);
    // World.remove(engine.world, engine.world.bodies)
    // console.log(engine.world.bodies);
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

  clearCanvas() {
    $('#canvas').remove();
    $('body').append("<div id='canvas'></div>");
  }

  addBrickToCanvas(level, brick) {
    $('#canvas').append('<div class="brick" data-offset="' + brick.offset + '" data-level="'+ level + '">' + level + '</div>');
  }

  getBricks() {
    var bricks = [];

    var i = 0;
    while(true) {
        var brick = this.formatBrick(babel.bricks(i, { from: gamerAddress }));

        if(brick.from === '0x') {
            break;
        } else {
            bricks.push(brick);
            console.log("Load brick", brick);
        }

        i++;
    }

    console.log('getBricks');

    this.setState({ bricks: bricks });
  }

  renderDemo(bricks) {
    this.clearCanvas();
    $.each(bricks, this.addBrickToCanvas);

    $('#canvas .brick').each(function(i, el) {
        var level = $(el).data('level');
        var offset = parseInt($(el).data('offset'));
        var left = centralBrickLeft + brickHalfWidth * offset / brickR;
        $(el).css('bottom', level*brickFullHeight);
        $(el).css('left', left);
    });
  }

  render () {
    this.renderDemo(this.state.bricks);
    return (
      <div id="game-canvas">
        <a className="btn btn-primary" onClick={(e) => this.handleClick(e)}>Insert Coin</a>
        <a className="btn btn-danger" onClick={(e) => this.collapseBricks(15)}>Collapse from 5</a>
      </div>
    )
  }
}
