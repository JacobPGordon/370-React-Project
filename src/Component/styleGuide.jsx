import React from "react";
import color from '../assets/colors.png';
import mobile from '../assets/mobile.png';
import webapp from '../assets/webapp.png';
import text from '../assets/Text.png';
import '../css/styleGuide.css';
import icon from '../assets/icon2.png';
import logo from '../assets/Logo.jpg';

export default class Style extends React.Component {
    render() {
        return (
            <div className="container">
                <div className="color">
                    <h3 style={{textAlign: 'center'}}> All colors and text fonts that are going to be used </h3>
                    <img src={color} alt="Colors" style={{maxWidth: '50%'}}/>
                    <img src={text} alt="Texts" style={{maxWidth: '50%', align: 'right'}}/>
                </div>
                <div className="template">
                    <h3 style={{textAlign: 'center'}}> Templates of all main pages </h3>
                </div>
                <div className="web">
                <img src={webapp} alt="Webapp" style={{maxWidth:'50%', align:'left'}}/>

                <img src={mobile} alt="Mobile" style={{maxWidth:'40%', align:'right'}}/>
                </div>

                <div className="LogoAndIcon">
                    <h3 style={{textAlign: 'center'}}> Logo and Icon of Treehouse </h3>
                    <img src={icon} alt="Icon" style={{maxWidth: '50%', align: 'left'}}/>
                    <img src={logo} alt="Logo" style={{maxWidth: '50%', align: 'right'}}/>
                </div>
            </div>
        );
    };
}
