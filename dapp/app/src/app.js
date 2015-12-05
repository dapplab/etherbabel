import React                  from 'react';
import ReactDOM               from 'react-dom';
import Root                   from './containers/Root';

const target  = document.getElementById('root');

const node = (
  <Root />
);

ReactDOM.render(node, target);
