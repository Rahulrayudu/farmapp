
import { FileUploader } from "react-drag-drop-files";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import agr3 from "../assets/agr4.jpg"
import SimpleForm from "./Chat";

import React, { useState } from 'react';
import axios from 'axios';

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [classOutput, setClassOutput] = useState('');

  const _handleSubmit = (e) => {
    e.preventDefault();
    if (file) {
      const formData = new FormData();
      formData.append('image', file);

      axios
        .post('http://localhost:5000/file-info', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          const { class1 } = response.data;
          const outputText = `Class: ${class1}`;
          setClassOutput(outputText);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  };

  const _handleImageChange = (e) => {
    e.preventDefault();
    const reader = new FileReader();
    const file = e.target.files[0];

    reader.onloadend = () => {
      setFile(file);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const $imagePreview = file ? <img src={URL.createObjectURL(file)} alt="Preview" /> : null;

  return (
    <>
    <Navbar/>
    <div className="hero">
      <img alt="back" src={agr3} className="img_back"/>
    </div>
    <div className="container">
      <h3>Image Classification</h3>
      <form onSubmit={_handleSubmit}>
        <input className="fileInput" type="file" onChange={_handleImageChange} />
        <button className="submitButton" type="submit">Upload Image</button>
      </form>
      <div className="previewContainer">
        <div className="imgPreview">
          {$imagePreview}
          <div className="transparent-box">
            {classOutput}
          </div>
        </div>
      </div>
    </div>
    <SimpleForm/>
    </>
  );
};

export default FileUploadForm;




