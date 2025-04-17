import { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [apiResponse, setApiResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Automatically upload when file is selected
  useEffect(() => {
    if (selectedFile) {
      handleUpload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  // Handle file input
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Preview original image
    setApiResponse(null); // Clear previous response
  };

  // Upload file and update preview with response image
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('notebookName', 'micrOCR.ipynb');

      const response = await axios.post(
        'http://172.16.1.81:8000/api/micrScanner',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      setApiResponse(response.data);

      // Parse the JSON response and replace preview with processed image
      const parsed = JSON.parse(response.data.outputs[0].text.join(''));
      if (parsed.micr_region_Bounding_box) {
        setPreviewUrl(parsed.micr_region_Bounding_box);
      }

    } catch (error) {
      console.error('Upload failed:', error);
      setApiResponse({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>MICR Extractor From Cheque</h1>

      <div className="upload-container">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          id="file-upload"
          style={{ display: 'none' }}
        />

        {/* Choose Button */}
        <div className="button-container">
          <label htmlFor="file-upload" className="file-label">
            Choose Image
          </label>
        </div>

        {/* Image Preview */}
        {previewUrl && (
          <div className="preview-section">
            <img src={previewUrl} alt="Preview" className="preview-image" />
            {isLoading && <p>Processing...</p>}
          </div>
        )}
      </div>

      {/* API Response */}
      {apiResponse && (
        <div className="response-section">
          <h3>API Response:</h3>
          <pre>
            {JSON.stringify(
              JSON.parse(apiResponse.outputs[0].text.join('')),
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
}

export default App;
