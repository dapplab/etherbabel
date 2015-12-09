import React                    from 'react';
import GameCanvas               from './GameCanvas';
import '../favicon.ico';

export default class Root extends React.Component {
  render () {
    return (
      <div>
        <GameCanvas />
      </div>
    );
  }
}
