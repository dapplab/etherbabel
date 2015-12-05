import React              from 'react';
import Matter             from 'matter-js';

import brickStyle1        from '../images/style1.png';
import brickStyle2        from '../images/style2.png';
import brickStyle3        from '../images/style3.png';
import brickStyle4        from '../images/style4.png';
import brickStyle5        from '../images/style5.png';

var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Body = Matter.Body,
    Common = Matter.Common,
    Constraint = Matter.Constraint,
    Events = Matter.Events;

    console.log(Body, World, engine);
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
        // Bodies.rectangle(290, 455, 100, 20, { isStatic: true, friction: 1 }),
        // Bodies.rectangle(300, 475, 100, 20, { isStatic: true, friction: 1 }),
        // Bodies.rectangle(300 - offset*2, 495, 100, 20, { isStatic: true, friction: 1 }),
        // Bodies.rectangle(300 + offset*5, 515, 100, 20, { isStatic: true, friction: 1 }),
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



export default class GameCanvas extends React.Component {

  handleClick(e) {
    let offset = 10 * Common.random(0, 1) * Common.choose([1,-1]);
    let texture =  Common.choose([brickStyle1, brickStyle2, brickStyle3, brickStyle4, brickStyle5]);
    let newBody = Bodies.rectangle(300 - offset, 5, 200, 40, { isStatic: false, friction: 1, render: { sprite: { texture: texture } } });
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

  collapseBricks(from) {
    let bricks = engine.world.bodies;

    for(let j = from + 1; j < bricks.length; j++) {
      Body.setStatic(bricks[j], false);
      Body.setPosition(bricks[from], { x: 100, y: 50 });
    }
    // Body.setVelocity(bricks[from-1], { x: 100, y: 200 });

    // Body.setStatic(bricks[from], false);
    // setTimeout(() => {
    //   Body.setPosition(bricks[from], { x: 100, y: 50 });
    // }, 5000);
    
    
    // Body.setStatic(bricks[2], false);
    // Body.applyForce(bricks[2], { x: 100, y: 20 }, { 
    //                     x: 100, 
    //                     y: 50
    //                 });
    console.log(bricks[from]);
  }

  render () {
    return (
      <div id="game-canvas">
        <button className="btn btn-primary" onClick={(e) => this.handleClick(e)}>Insert Coin</button>
        <button className="btn btn-danger" onClick={(e) => this.collapseBricks(5)}>Collapse from 5</button>
      </div>
    )
  }
}

window.bricks = engine.world.bodies;
