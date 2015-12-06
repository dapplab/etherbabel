import React                    from 'react';
import GameCanvas               from './GameCanvas';

import addBrickSound from '../sounds/addBrick.wav';
import winSound from '../sounds/win.wav';

export default class Root extends React.Component {
  render () {
    return (
      <div>
        <GameCanvas />
        <div>
          <embed id='addBrickSound' src={addBrickSound} autostart="false" hidden></embed>
          <embed src="../sounds/win.wav" autostart="false" hidden></embed>
        </div>
      </div>
    );
  }
}
