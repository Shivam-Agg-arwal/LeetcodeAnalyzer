import React from 'react';
import { FaLinkedin } from 'react-icons/fa'; // LinkedIn icon
import leetcode from '../../images/leetcode.png';
import { useSelector } from 'react-redux'; // Import useSelector

const Footer = () => {
  const { lightMode } = useSelector((state) => state.profile); // Use useSelector to get lightMode from the store

  return (
    <footer
      className={`w-full p-4 mt-10 border-t ${
        lightMode ? 'bg-white text-gray-900 border-gray-300' : 'bg-gray-800 text-white border-white'
      }`}
    >
      <div className="flex flex-col md:flex-row justify-between items-center">
        <span
          className={`text-sm mb-2 md:mb-0 ${
            lightMode ? 'text-gray-900' : 'text-white'
          }`}
        >
          Made by Shivam Aggarwal
        </span>
        <div className="flex gap-4">
          <a
            href="https://www.linkedin.com/in/shivamaggarwal10/"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-lg hover:text-gray-400 transition-colors ${
              lightMode ? 'text-gray-900' : 'text-white'
            }`}
          >
            <FaLinkedin size={24} />
          </a>
          <a
            href="https://leetcode.com/aggarwalshivam/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-gray-400 transition-colors ${
              lightMode ? 'text-gray-900' : 'text-white'
            }`}
          >
            <img
              src={leetcode} // Path to your LeetCode icon
              alt="LeetCode"
              className={`w-6 h-6 ${
                lightMode ? 'filter invert-0' : ''
              }`} // Adjust size and filter for light mode
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
