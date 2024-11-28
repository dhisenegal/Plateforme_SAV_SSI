import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa"; // Icônes des réseaux sociaux

const Footer = () => (
  <footer className="py-12 bg-blue-700 text-white text-center">
    <div className="container mx-auto px-6">
      {/* Section pour les informations légales et de contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
        {/* Liens */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Entreprise</h4>
          <ul>
            <li>
              <Link href="#" className="hover:text-blue-300">À propos</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-300">Services</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-300">Contact</Link>
            </li>
          </ul>
        </div>

        {/* Liens légaux */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Légal</h4>
          <ul>
            <li>
              <Link href="#" className="hover:text-blue-300">Politique de confidentialité</Link>
            </li>
            <li>
              <Link href="#" className="hover:text-blue-300">Conditions d'utilisation</Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Contact</h4>
          <ul>
            <li>
              <Link href="mailto:contact@dhi.com" className="hover:text-blue-300">sav@dhisn.com</Link>
            </li>
            <li>
              <Link href="tel:+1234567890" className="hover:text-blue-300">770000000</Link>
            </li>
          </ul>
        </div>

        {/* Réseaux sociaux */}
        <div>
          <h4 className="font-semibold text-lg mb-4">Suivez-nous</h4>
          <div className="flex justify-center space-x-4">
            <Link href="https://facebook.com" target="_blank">
              <FaFacebookF size={35} color="blue"
              className="hover:bg-blue-300 bg-white rounded-full p-2 cursor-pointer" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <FaTwitter size={35} color="blue" 
              className="hover:bg-blue-300  bg-white rounded-full p-2 cursor-pointer" />
            </Link>
            <Link href="https://linkedin.com" target="_blank">
              <FaLinkedinIn size={35} color="blue" 
              className="hover:bg-blue-300 cursor-pointer  bg-white rounded-full p-2" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <FaInstagram size={35} color="blue" 
              className="hover:bg-blue-300  bg-white rounded-full p-2 cursor-pointer" />
            </Link>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p>&copy; 2024 DHI. Tous droits réservés.</p>
    </div>
  </footer>
);

export default Footer;
