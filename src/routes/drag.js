import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import agr3 from "../assets/agr4.jpg"

const fileTypes = ["JPG", "PNG", "GIF"];

function DragDrop() {
  const [file, setFile] = useState(null);

  const handleChange = (file) => {
    setFile(file);
  };

  return (
    <>
      <Navbar/>
        <div className="img1_drag_drop">
        <img alt="farm" src={agr3} className="im_drag" />
        </div>
       <div className="drag-drop-container">
        <FileUploader handleChange={handleChange} name="file" types={fileTypes} classes="drop_area"/>
       </div>
    </>
  );
}

export default DragDrop;
