import "./HeroStyles.css"

function HeroSection(props){ 
    return(
        <> 
        <div className={props.cName} style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: "710px"
            }}>
            <img alt="farm" src={props.heroImg} />
        </div>

        <div className="hero-text">
            <h1>{props.title}</h1>
            
            <p>{props.text}</p>
            
            <a href={props.url} className={props.btnClass}> {props.buttonText} &#8594;</a>
        </div>
        </>
    )
}

export default HeroSection;