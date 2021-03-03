import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import GameField from './components/GameField'
import Footer from './components/Footer/footer'


ReactDOM.render(
  <React.StrictMode>
    {/* <App /> */}
		<div>
			<GameField/>
			<Footer/>
		</div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
