import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import agr3 from "../assets/2.jpg"
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
        url="/service"
        btnClass="show"
        />
        </>
    )
}

export default Home;