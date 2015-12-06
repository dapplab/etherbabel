import React                    from 'react';
import GameCanvas               from './GameCanvas';

import addBrickSound from './../sounds/addBrick.wav';
import winSound from './../sounds/win.wav';
import backgroundXmas from './../sounds/background-xmas.mid';
import CollapseSound from './../sounds/collapse.wav';

export default class Root extends React.Component {
  render () {
    return (
      <div>
        <GameCanvas />
        <div>
          <embed src={addBrickSound} autostart="false" hidden></embed>
          <embed src={CollapseSound} autostart="false" hidden></embed>
          <embed src={winSound} autostart="false" hidden></embed>
          <embed src={backgroundXmas} autostart="true" loop="true" hidden/>
        </div>
      </div>
    );
  }
}
