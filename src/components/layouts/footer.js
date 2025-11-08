import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white/80 backdrop-blur-md py-4 border-t text-center text-gray-500 text-sm">
      © {new Date().getFullYear()} <span className="font-semibold text-indigo-600">Kalyanamalai ❤️</span>
    </footer>
  );
};

export default Footer;
