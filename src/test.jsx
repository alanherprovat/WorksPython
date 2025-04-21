import React, { useRef, useState } from 'react';
import { Cropper } from 'react-advanced-cropper';
import 'react-advanced-cropper/dist/style.css';

 const RectangularCropper = () => {
  const cropperRef = useRef(null);
  const [image, setImage] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCrop = () => {
    const cropper = cropperRef.current;
    if (cropper) {
      const canvas = cropper.getCanvas();
      if (canvas) {
        setCroppedImage(canvas.toDataURL());
      }
    }
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center space-y-4 min-h-screen">
    <input
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="block mx-auto"
    />

    {image && (
        <>
        <Cropper
            ref={cropperRef}
            src={image}
            stencilProps={{ handlers: true, movable: true, resizable: true }}
            style={{ height: 400, width: '100%', maxWidth: 600 }}
            className="cropper border"
        />
        <button
            onClick={handleCrop}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded shadow"
        >
            Crop Image
        </button>
        </>
    )}

    {croppedImage && (
        <div className="flex flex-col items-center mt-4">
        <h3 className="text-lg font-semibold mb-2">Cropped Image:</h3>
        <img
            src={croppedImage}
            alt="Cropped"
            className="border shadow"
            style={{ height: 400, width: 'auto' }}
        />
        </div>
    )}
    </div>

  );
};

export default RectangularCropper;