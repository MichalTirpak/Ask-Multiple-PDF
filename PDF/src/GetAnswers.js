import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function GetAnswers() {
  const [searchResult, setSearchResult] = useState({ summary: '', grouped: {} });
  const [expandedPDFs, setExpandedPDFs] = useState({});
  const [animatedSummary, setAnimatedSummary] = useState('');

  const fetchData = async (search) => {
    try {
      const response = await axios.post(`http://10.1.1.154:88/search-similar`, { text: search }, {
        headers: { 'Content-Type': 'application/json' }
      });

      const allTexts = response.data.map(item => item.text).join(" ");

      const summarizeResponse = await axios.post(`http://10.1.1.154:88/summarize`, { text: allTexts }, {
        headers: { 'Content-Type': 'application/json' }
      });

      // Zoskupenie podľa názvu súboru
      const groupedByFile = {};
      response.data.forEach(item => {
        const name = item.name.slice(item.name.lastIndexOf('/') + 1);
        if (!groupedByFile[name]) {
          groupedByFile[name] = [];
        }
        groupedByFile[name].push(item);
      });

      setSearchResult({
        summary: summarizeResponse.data.summary,
        grouped: groupedByFile
      });

      setExpandedPDFs({});
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const searchQuery = event.target.search.value;
    fetchData(searchQuery);
  };

  const togglePDF = (pdfName) => {
    setExpandedPDFs(prev => ({
      ...prev,
      [pdfName]: !prev[pdfName]
    }));
  };

  // ✍️ Písací stroj efekt pre summary
  useEffect(() => {
    if (searchResult.summary) {
      setAnimatedSummary('');
      let index = 0;
      const interval = setInterval(() => {
        setAnimatedSummary(prev => prev + searchResult.summary.charAt(index));
        index++;
        if (index >= searchResult.summary.length) {
          clearInterval(interval);
        }
      }, 20); // rýchlosť písania (ms per char)

      return () => clearInterval(interval);
    }
  }, [searchResult.summary]);

  return (
    <div className='content'>
      <div className="min-height-300 bg-dark position-absolute w-100 d-flex align-items-center justify-content-center">
        <h1 className='text-bg-dark'>Ask Multiple PDF</h1>
      </div>

      <div className="bg-white">
        <main className='main-content position-relative border-radius-lg ps'>
          <div className="row d-flex justify-content-center mt-10">
            <div className="col-md-8">
              <form className="d-flex align-items-center mt-3 mb-5" onSubmit={handleSubmit}>
                <input id="search" type="text" className="form-control me-2" placeholder="Search" />
                <button type="submit" className="btn btn-secondary mt-3">Search</button>
              </form>

              {animatedSummary && (
                <div className="card bg-dark text-bg-dark mb-4">
                  <div className='card-head pt-4 px-3'>
                    <h5 className='fw-bold text-bg-dark'>Summary</h5>
                  </div>
                  <div className='card-body pt-4 px-3'>
                    <p>{animatedSummary}<span className="blinking-cursor">|</span></p>
                  </div>
                </div>
              )}

              {Object.entries(searchResult.grouped).map(([pdfName, entries], i) => (
                <div key={i} className="card bg-white text-bg-white mb-4 shadow-sm">
                  <div className='card-head pt-3 px-3 d-flex justify-content-between align-items-center'>
                    <h5 className='fw-bold'>{pdfName}</h5>
                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => togglePDF(pdfName)}
                    >
                      {expandedPDFs[pdfName] ? 'Hide Pages' : 'Show Pages'}
                    </button>
                  </div>

                  {expandedPDFs[pdfName] && (
                    <div className="accordion-body pt-3 px-3 pb-3">
                      {entries.map((entry, idx) => (
                        <div key={idx} className="border-top pt-2 mb-3">
                          <div className="d-flex justify-content-between">
                            <strong>Page: {entry.page}</strong>
                          </div>
                          <p className="mt-2">{entry.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default GetAnswers;
