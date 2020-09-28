import React from "react";
import "./footer.css";
import { catagories } from "../../util/api";
import { Link } from "react-router-dom";

const getCatagories = () => {
  let result = catagories.map((c, i) => {
    return (
      <li>
        <Link key={i} to="/">
          {c}
        </Link>
      </li>
    );
  });
  result.shift();
  return result;
};

const scrollToTop = () => {
  window.scrollTo(0, 0);
};
export default function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <h6>About</h6>
        <p>
          Uflix is online service where you can stream thousands of Hollywood
          and Bollywood movies, TV Shows, Series and more without any ads. Uflix
          provide you an On Demand option for their members so they can demand
          what they want and Uflix will try to provide content to their members
          what they demand for. And for entertainment everywhere we have
          introduced app ‘UFLIX’ which is available on Apple and Google Play
          Store. Uflix will try to provide you every type of Content.
          <br />
        </p>
      </div>
      <div>
        <h6>Contact Us</h6>
        <p>
          You can mail us at
          <a href="mailto:uflix.info@gmail.com"> uflix.info@gmail.com</a> <br />
          Or Visit us at Office Flat 204, Alamgir Heights Sharfabad Chowrangi, Karachi, Pakistan
        </p>
      </div>

      <div>
        <h6>Categories</h6>
        <ul className="footer-links catagories">{getCatagories()}</ul>
      </div>

      <div>
        <h6>Quick Links</h6>
        <ul className="footer-links">
          <li>
            <Link onClick={scrollToTop} to="/policy">
              Privacy &amp; Policy
            </Link>
          </li>
          <li>
            <Link onClick={scrollToTop} to="/refund_policy">
              Refund Policy
            </Link>
          </li>
          <li>
            <Link onClick={scrollToTop} to="/term_of_use">
              Term Of Use
            </Link>
          </li>
        </ul>
      </div>

      <div className="container">
        <div>
          <ul className="social-icons">
            <li>
              <a
                className="facebook"
                href="https://www.facebook.com/Uflix-110843250375519/"
              >
                <ion-icon name="logo-facebook"></ion-icon>
              </a>
            </li>
            <li>
              <a className="twitter" href="https://twitter.com/Uflix2?s=08">
                <ion-icon name="logo-twitter"></ion-icon>
              </a>
            </li>
            <li>
              <a
                className="instagram"
                href="https://www.instagram.com/uflix.official/?igshid=1vybwq0cvb2qe"
              >
                <ion-icon name="logo-instagram"></ion-icon>
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="copyright-text">
            Copyright &copy; 2019 All Rights Reserved by
            <a href="/"> Uflix</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
