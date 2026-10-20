import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">

      {/* Top gradient line */}
      <div className="footer-gradient-line"></div>

      <div className="footer-container">

        {/* =========================
            FOOTER TOP
        ========================= */}
        <div className="footer-top">

          <div className="footer-intro">

            <Link to="/" className="footer-logo">
              <div className="footer-logo-mark">
                C
              </div>

              <div className="footer-logo-text">
                <strong>CYBRICAL</strong>
                <span>TECH</span>
              </div>
            </Link>

            <p>
              We build innovative digital solutions,
              AI-powered experiences and technology
              that help businesses grow.
            </p>

            <Link
              to="/contact"
              className="footer-project-button"
            >
              Start a Project
              <span>↗</span>
            </Link>

          </div>


          {/* =========================
              COMPANY
          ========================= */}
          <div className="footer-column">

            <h3>Company</h3>

            <Link to="/about">
              About
            </Link>

            <Link to="/services">
              Services
            </Link>

            <Link to="/courses">
              Courses
            </Link>

            <Link to="/works">
              Our Works
            </Link>

            <Link to="/photos">
              Our Team
            </Link>

            <Link to="/blog">
              Blog
            </Link>

          </div>


          {/* =========================
              SERVICES
          ========================= */}
          <div className="footer-column">

            <h3>Services</h3>

            <Link to="/services">
              Web Development
            </Link>

            <Link to="/services">
              SEO & Digital Marketing
            </Link>

            <Link to="/services">
              AI & Automation
            </Link>

            <Link to="/services">
              UI/UX Design
            </Link>

            <Link to="/services">
              Social Media Marketing
            </Link>

          </div>


          {/* =========================
              COURSES
          ========================= */}
          <div className="footer-column">

            <h3>Courses</h3>

            <Link to="/courses/web-development">
              Web Development
            </Link>

            <Link to="/courses/ai">
              Artificial Intelligence (AI)
            </Link>

            <Link to="/courses/android">
              Android App Development
            </Link>

            <Link to="/courses/seo">
              SEO Optimization
            </Link>

            <Link to="/courses/digital-marketing">
              Digital Marketing
            </Link>

          </div>


          {/* =========================
              CONTACT
          ========================= */}
          <div className="footer-column footer-contact">

            <h3>Contact</h3>

            <a href="mailto:cybricaltech@gmail.com">
              cybricaltech@gmail.com
            </a>

            <a href="tel:+918368597373">
              +91 836 859 7373
            </a>

            <Link to="/location">
              D-60, D Block,
              <br />
              Sector 63, Noida,
              <br />
              Uttar Pradesh 201301
            </Link>

          </div>

        </div>


        {/* =========================
            FOOTER CTA
        ========================= */}
        <div className="footer-cta">

          <div>
            <span>
              HAVE AN IDEA?
            </span>

            <h2>
              Let's make it
              <strong> happen.</strong>
            </h2>
          </div>

          <Link
            to="/contact"
            className="footer-cta-button"
          >
            Let's Talk
            <span>↗</span>
          </Link>

        </div>


        {/* =========================
            FOOTER BOTTOM
        ========================= */}
        <div className="footer-bottom">

          <p>
            © {new Date().getFullYear()} Cybrical Tech.
            All rights reserved.
          </p>

          <div className="footer-socials">

            <a
              href="#"
              aria-label="LinkedIn"
            >
              in
            </a>

            <a
              href="#"
              aria-label="Instagram"
            >
              ig
            </a>

            <a
              href="#"
              aria-label="Facebook"
            >
              f
            </a>

          </div>

          <div className="footer-legal">

            <a href="#">
              Privacy Policy
            </a>

            <a href="#">
              Terms
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;