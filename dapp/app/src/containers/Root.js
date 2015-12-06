import React                    from 'react';
import GameCanvas               from './GameCanvas';

export default class Root extends React.Component {
  render () {
    return (
      <div>
        <GameCanvas />
      </div>
    );
  }
}
