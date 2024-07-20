import React from 'react';
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon
import leetcode from '../../images/leetcode.png'

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white p-4 mt-10">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <span className="text-sm mb-2 md:mb-0">Made by Shivam Aggarwal</span>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/shivamaggarwal10/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition-colors"
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://leetcode.com/aggarwalshivam/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-gray-400 transition-colors"
          >
            <img
              src={leetcode} // Path to your LeetCode icon
              alt="LeetCode"
              className="w-6 h-6" // Adjust size as needed
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
