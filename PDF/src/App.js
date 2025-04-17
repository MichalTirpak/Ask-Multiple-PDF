
import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import GetAnswers from './GetAnswers';
import PostPdf from './PostPdf';

function App() {
  return (
    /**
     * Routes for website
     */
    <Router>
      <Routes>
        <Route path='/' element={<GetAnswers/>} />
        <Route path='/upload' element={<PostPdf/>} />
      </Routes>
    </Router>
  );
}

export default App;
