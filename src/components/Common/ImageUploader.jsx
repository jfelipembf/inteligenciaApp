import React from "react";
import { Input } from "reactstrap";

const ImageUploader = ({ image, onImageChange }) => {
  const inputRef = React.useRef(null);

  const handleClick = () => {
    inputRef.current.click();
  };

  return (
    <div
      className="position-relative"
      style={{ width: "150px", height: "150px" }}
    >
      <div
        className="rounded-circle overflow-hidden d-flex align-items-center justify-content-center"
        style={{
          width: "150px",
          height: "150px",
          border: "2px dashed #ccc",
          cursor: "pointer",
          backgroundColor: "#f8f9fa",
        }}
        onClick={handleClick}
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            alt="Preview"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <i
            className="bx bx-user-circle text-muted"
            style={{ fontSize: "64px" }}
          ></i>
        )}
      </div>
      <div
        className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
        style={{
          width: "32px",
          height: "32px",
          backgroundColor: "#556ee6",
          bottom: "10px",
          right: "10px",
          cursor: "pointer",
        }}
        onClick={handleClick}
      >
        <i className="bx bx-pencil text-white" style={{ fontSize: "18px" }}></i>
      </div>
      <input
        type="file"
        ref={inputRef}
        className="d-none"
        accept="image/*"
        onChange={onImageChange}
      />
    </div>
  );
};

export default ImageUploader;
