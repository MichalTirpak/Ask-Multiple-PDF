import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
/*
{searchResult.map((result, index) => (
  <div className="card bg-dark text-bg-dark mb-4" key={index}>
      <div className='card-head pt-4 px-3'>
        <a href={`http://10.1.1.154:8000/${result.metadata.name.slice(5)}`}>
          <h5 className='fw-bold text-bg-dark'>{result.metadata.name.slice(5)}</h5>
        </a>
      </div>
      <div className='card-body pt-4 px-3'>
          <div>
              <p>{result.page_content}</p>
          </div>
      </div>
  </div>
))}
*/
