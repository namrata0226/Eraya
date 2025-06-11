import "../componentStyles/Footer.css";
import { Phone, Mail } from '@mui/icons-material';
import { YouTube, Instagram } from '@mui/icons-material';
function Footer() {
  return (
  <div className="footer">
      <div className="footer-container">
        {/* Section1 */}
        <div className="footer-section contact">
            <h3>Contact Us</h3>
            <p><Phone fontSize='small'/>Phone : +9865467888</p>
            <p><Mail fontSize='small'/>Email : eraya@gmail.com</p>
        </div>

        {/* Section2 */}
        <div className="footer-section social">
            <h3>Follow me</h3>
            <div className="social-links">
                <a href="" target="_blank">
                    <YouTube className='social-icon'/>
                </a>
                <a href="" target="_blank">
                    <Instagram className='social-icon'/>
                </a>
            </div>
        </div>

        {/* Section3 */}
        <div className="footer-section about">
            <h3>About</h3>
            <p>Add a touch of green to your space with our beautifully crafted, low-maintenance terrariums — perfect for homes, offices, or gifting.</p>
    </div>
    <div className="footer-bottom">
        <p>&copy; 2025 Eraya . All rights reserved</p>
    </div>
    </div>
    </div>
  )
}

export default Footer
