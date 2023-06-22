import { Component } from "react";
import "./NavbarStyles.css";
import { Link } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import { HashLink as Lin } from "react-router-hash-link";

class Navbar extends Component{
    state = { clicked: false};
    handleClick = () =>{
        this.setState({clicked: !this.state.clicked})
    }
    render(){
        return(
            <nav className="NavbarItems">
                <h1 className="navbar-logo">AgriBot</h1>

                <div className="menu-icons" onClick={this.handleClick}>
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars"}></i>
                </div>
                
                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu"}>
                    {MenuItems.map((item,index)=>{
                        return(
                            <li key={index}>
                                <Lin className={item.cName} to={item.url} smooth>
                                    <i className={item.icon}>
                                    </i>{item.title}
                                </Lin>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        )
    }
}

export default Navbar;