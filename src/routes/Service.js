import Navbar from "../components/Navbar";
import agr3 from "../assets/1.jpg"
import arg from "../assets/agr4.jpg"
import React from 'react';
import SimpleForm from "./Chat";
import { Link } from "react-router-dom";
const CardBox = ({ imageUrl, title, description, buttonUrl }) => {
    return (
      <>
      
      <div className="card">
        <img src={imageUrl} alt="Card" className="card-image" />
        <div className="card-content">
          <h3 className="card-title">{title}</h3>
          <p className="card-description">{description}</p>
          <Link to={buttonUrl} className="card-button">Learn More</Link>
        </div>
      </div>
      </>
    );
  };



const Service = () => {
    const cardData = [
        {
          imageUrl: 'https://mdbootstrap.com/img/new/standard/nature/184.webp',
          title: 'Crop Disease',
          description: 'detect the crop disease.',
          buttonUrl: '/FileUploadForm',
        },
        {
          imageUrl: 'https://mdbootstrap.com/img/new/standard/nature/184.webp',
          title: 'Card 2',
          description: 'This is the description for Card 2.',
          buttonUrl: 'https://mdbootstrap.com/img/new/standard/nature/184.webp',
        },
        {
          imageUrl: agr3,
          title: 'Card 3',
          description: 'This is the description for Card 3.',
          buttonUrl: 'https://mdbootstrap.com/img/new/standard/nature/184.webp',
        },
      ];
    
      return (
        <>
        <Navbar/>
        <div className="bo_ser">

        <div className="app" id="services">
        <div>
           <h1>Services</h1>
        </div>
         <div className="cards">
            {cardData.map((card, index) => (
            <CardBox
            key={index}
            imageUrl={card.imageUrl}
            title={card.title}
            description={card.description}
            buttonUrl={card.buttonUrl}
        />
      ))}
      </div>
    </div>
    </div>
    <SimpleForm/>
        </>
      );
}

export default Service;




