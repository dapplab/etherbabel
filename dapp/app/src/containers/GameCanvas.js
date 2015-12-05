import React              from 'react';
import Matter             from 'matter-js';

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

World.add(engine.world, [
  ground
]);

// run the engine
Engine.run(engine);

export default class GameCanvas extends React.Component {

  handleClick(e) {
    babelLevel++;
    isDropping = true;

    let bricks = engine.world.bodies;
    let lastBrick = bricks[bricks.length -1];

    let offset = 20 * Common.random(0, 1) * Common.choose([1,-1]);
    let texture =  Common.choose([brickStyle4, brickStyle5, brickStyle3, brickStyle1, brickStyle2]);


    let newBody = Bodies.rectangle(375 - offset, 5, 100, 20, { label: 'new brick ID', inertia: Infinity, density: 10000, mass: 10000, render: { sprite: { texture: texture } } });

    World.add(engine.world, newBody);
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

  render () {
    return (
      <div id="game-canvas">
        <button className="btn btn-primary" disabled={isDropping} onClick={(e) => this.handleClick(e)}>Insert Coin</button>
        <button className="btn btn-danger" onClick={(e) => this.collapseBricks(15)}>Collapse from 5</button>
      </div>
    )
  }
}

// for debug
window.bricks = engine.world.bodies;