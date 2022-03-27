import React from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa';
import './../style/footer.css'

function Footer() {
    return (
    <footer className="footer">
        <ul className="social_list">
            <li>
                <FaFacebook href="https://www.facebook.com/muryelca/"/>
            </li>
            <li>
                <FaInstagram href="https://www.instagram.com/muryelca/"/>
            </li>
            <li>
                <FaLinkedin href="https://www.linkedin.com/in/muryelca/"/>
            </li>
            <li>
                <FaGithub href="https://github.com/muryelca" />
            </li>

        </ul>
        </footer>)
}

export default Footer;