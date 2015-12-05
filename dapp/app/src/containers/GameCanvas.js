import React              from 'react';
import Matter                 from 'matter-js';


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



export default class GameCanvas extends React.Component {

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

  render () {
    return (
      <div id="game-canvas">
        <a className="btn btn-primary" onClick={(e) => this.handleClick(e)}>Insert Coin</a>
        <a className="btn btn-danger" onClick={(e) => this.collapseBricks(15)}>Collapse from 5</a>
      </div>
    )
  }
}
