import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebookF,
  faLinkedinIn,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <div className="bg-gray-800 text-white p-6 ">
      <div className="container mx-auto">
        <div className="flex justify-between items-start mb-6 mt-60">
          {/* Contact Information */}
          <div className="w-1/3">
            <h3 className="font-bold text-xl mb-2">Contact Information</h3>
            <p>
              <span className="font-bold">Address:</span> 123 Street, City,
              Country
            </p>
            <p>
              <span className="font-bold">Phone:</span> +123 456 7890
            </p>
            <p>
              <span className="font-bold">Email:</span> example@company.com
            </p>
          </div>

          {/* Useful Links */}
          <div className="w-1/3">
            <h3 className="font-bold text-xl mb-2">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  FAQs
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>
          <div className="w-1/3">
            <h3 className="font-bold text-xl mb-2">Other Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:underline">
                  Security Partners
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Medical Donors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Sponsors
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Board Members Information
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Icons */}
          <div className="w-1/3 flex justify-end items-center">
            <a
              href="https://instagram.com/company"
              className="mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a
              href="https://facebook.com/company"
              className="mr-4"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faFacebookF} size="2x" />
            </a>
            <a
              href="https://linkedin.com/company"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FontAwesomeIcon icon={faLinkedinIn} size="2x" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
