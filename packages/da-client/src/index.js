import Leaflet from 'leaflet';
import React from 'react';
import ReactDOM from 'react-dom';
// import './index.css';
// import 'leaflet/dist/leaflet.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

Leaflet.Icon.Default.imagePath =
  '//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
