import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';

const PostPdf = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [showCheckbox, setShowCheckbox] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setIsHovered(false);
    } else {
      alert('Please select a valid PDF file.');
    }
  };

  const handleDragEnter = () => {
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const onDrop = useCallback(acceptedFiles => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (selectedFile.type === 'application/pdf') {
        setIsHovered(false);
        setSelectedFile(selectedFile);
      } else {
        alert('Please drop a valid PDF file.');
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: '.pdf',
    noClick: true,
  });

  const handleFileButtonClick = () => {
    const input = document.getElementById('fileInput');
    if (input) {
      input.click();
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://10.1.1.154:88/process-pdf", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        alert("File uploaded successfully");
        setShowCheckbox(true); // ✅ Show checkbox on success
      } else {
        alert("Upload failed: " + result.error);
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  return (
    <div className="content">
      <div className="min-height-200 bg-white position-absolute w-100 d-flex align-items-center justify-content-center">
        <h1 className="">Ask Multiple PDF</h1>
      </div>
      <div>
        <div className="bg-dark">
          <main className="main-content position-relative border-radius-lg ps">
            <div className="row d-flex justify-content-center mt-10">
              <div className="col-md-7 mt-5">
                <h2 className="text-bg-dark d-flex align-items-center justify-content-center">Upload Your PDF</h2>
                <form onSubmit={handleFormSubmit}>
                  <div className='d-flex align-items-center justify-content-center'>
                    <button className="mt-3 mb-2 btn btn-dark" type="button" onClick={handleFileButtonClick}>
                      Select a PDF File
                    </button>
                  </div>
                  <div
                    {...getRootProps({
                      className: `card drop-area d-flex align-items-center justify-content-center 
                        ${isHovered ? 'bg-grey' : selectedFile ? 'bg-grey-6' : 'bg-white'}`,
                      onDragEnter: handleDragEnter,
                      onDragLeave: handleDragLeave,
                    })}
                    style={{ height: '35vh' }}
                  >
                    <input {...getInputProps()} id="fileInput" style={{ display: 'none' }} onChange={handleFileChange} />
                    {selectedFile ? (
                      <h4 className='t-black'>{selectedFile.name}</h4>
                    ) : (
                      <h4 className=''>Or drop it here!</h4>
                    )}
                  </div>

                  <div className='d-flex align-items-center justify-content-center'>
                    <button type="submit" className='mt-4 btn btn-white'>Upload</button>
                  </div>

                  {/* ✅ Checkbox appears after successful upload */}
                  {showCheckbox && (
                    <div className="form-check mt-3 d-flex align-items-center justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="afterUploadCheckbox"
                        checked={isChecked}
                        onChange={(e) => setIsChecked(e.target.checked)}
                      />
                      <label className="form-check-label ms-2" htmlFor="afterUploadCheckbox">
                        I want to continue with processing
                      </label>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PostPdf;