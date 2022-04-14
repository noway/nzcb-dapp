import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';
import { globalStyles } from './styles';
import { init } from "@web3-onboard/react";
import { getInitOptions } from './web3';



init(getInitOptions());


ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

globalStyles()

