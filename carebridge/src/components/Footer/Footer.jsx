

import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer-content">
        {/* Left Section - Logo + Slogan */}
        <div className="footer-logo">
          <h2 className="logo-text">Care<span className="logo-highlight">Bridge</span></h2>
          <p className="footer-slogan">Share & Care</p>
          <p>Care Bridge is a community-driven donation platform that connects people willing to help with those in need. Whether it’s food, clothing, or education support, our mission is to build a bridge of care and compassion.</p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/donation">Donate</Link></li>
            <li><a href="/#about">About Us</a></li>
            <li><a href="/#contact">Contact</a></li>
          </ul>
        </div>

        {/* Right Section - Contact Info */}
        <div className="footer-contact">
          <h3>Contact</h3>
          <p>Email: support@carebridge.org</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: Hyderabad, India</p>
        </div>

        {/* Social Icons */}
        <div className="social-links">
          <h3>Follow Us</h3>
          <div className="social-icons">
            <a href="https://www.linkedin.com/in/k-sidhu-bba3b2285" target="_blank" rel="noopener noreferrer">
              <img className="linkedin" src="linkedin_icon.png" alt="LinkedIn" />
            </a>
            <a href="https://www.instagram.com/our_careerbridge/" target="_blank" rel="noopener noreferrer">
              <img style={{ color: 'black' }} className="insta" src="insta.png" alt="Instagram" />
            </a>
          </div>
        </div>
      </div>

      <hr />
      <p className="footer-bottom">© 2026 Care Bridge | Share & Care. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
