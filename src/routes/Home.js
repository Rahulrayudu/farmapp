import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import agr3 from "../assets/agr4.jpg";
import Service from "./Service";


function Home(){
    return(
        <>
        <Navbar/>
        <HeroSection 
        cName="hero"
        heroImg={agr3}
        title="Farming is a profession of hope"
        text="We are here for you"
        buttonText="Services"
        url="#services"
        btnClass="show"
        />
        <Service/>
        </>
    )
}

export default Home;