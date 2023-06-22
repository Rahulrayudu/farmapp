import SimpleForm from "../routes/Chat";
import "./HeroStyles.css"
import { HashLink as Link } from "react-router-hash-link";
function HeroSection(props){ 
    return(
        <> 
        <div className={props.cName} style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
            }}>
            <img alt="farm" src={props.heroImg} />
        </div>

        <div className="hero-text">
            <h1>{props.title}</h1>
            
            <p>{props.text}</p>
            
            <Link to={props.url} className={props.btnClass} smooth> {props.buttonText} &#8594;</Link>
        </div>
        <SimpleForm/>
        </>
    )
}

export default HeroSection;