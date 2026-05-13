import React from 'react'
import './Contact.css'
import { assets } from '../../assets/frontend'; // Assuming assets are here, or remove if not needed for icons

const Contact = () => {
    return (
        <div className='contact' id='contact'>
            <h2 className='contact-title'>Get In <span>Touch</span></h2>

            <div className="contact-content">
                <div className="contact-left">
                    <h3>Let's Talk</h3>
                    <p>Have some questions? We are here to help. Send us a message and we will respond as soon as possible.</p>

                    <div className="contact-details">
                        <div className="contact-detail-item">
                            <span>📞</span> {/* Replace with Icon if available */}
                            <span>+91 98765 43210</span>
                        </div>
                        <div className="contact-detail-item">
                            <span>📧</span>
                            <span>support@carebridge.org</span>
                        </div>
                        <div className="contact-detail-item">
                            <span>📍</span>
                            <span>Hyderabad, India</span>
                        </div>
                    </div>
                </div>

                <div className="contact-right">
                    <form className="contact-form">
                        <input type="text" placeholder='Your Name' required />
                        <input type="email" placeholder='Your Email' required />
                        <textarea placeholder='Your Message' required></textarea>
                        <button type='submit' className='contact-submit'>Send Message</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Contact
