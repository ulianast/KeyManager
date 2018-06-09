import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
import {BrowserRouter} from 'react-router-dom';
// import routes from './routes.js';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import WebFont from 'webfontloader';

// remove tap delay, essential for MaterialUI to work properly
injectTapEventPlugin();

// WebFont.load({
//   google: {
//     families: ['Montserrat', 'sans-serif']
//   }
// });

ReactDOM.render(
	<BrowserRouter>
		<App />
	</BrowserRouter>,
document.getElementById('root'));

registerServiceWorker();
