import React from "react";
import { Linkedin, Github } from "lucide-react";

// Inline SVG for the new X (Twitter) logo
const XIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M4 4L20 20" />
    <path d="M20 4L4 20" />
  </svg>
);

const Footer = () => {
  const handleLinkClick = (linkType) => {
    // Handle different link types
    switch (linkType) {
      case 'resources':
        // Add your resources page logic here
        console.log('Resources clicked');
        break;
      case 'legal':
        // Add your legal page logic here
        console.log('Legal clicked');
        break;
      case 'company':
        // Add your company page logic here
        console.log('Company clicked');
        break;
      default:
        break;
    }
  };

  return (
    <footer style={{ background: 'var(--theme-bg)', color: 'var(--theme-text)', borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Links */}
          <div className="flex space-x-6 mb-4 md:mb-0">
            <button 
              onClick={() => handleLinkClick('resources')}
              className="text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer" 
              style={{ color: 'var(--theme-heading)' }}
            >
              Resources
            </button>
            <button 
              onClick={() => handleLinkClick('legal')}
              className="text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer" 
              style={{ color: 'var(--theme-heading)' }}
            >
              Legal
            </button>
            <button 
              onClick={() => handleLinkClick('company')}
              className="text-sm hover:opacity-80 transition-opacity bg-transparent border-none cursor-pointer" 
              style={{ color: 'var(--theme-heading)' }}
            >
              Company
            </button>
          </div>
          {/* Social Icons */}
          <div className="flex space-x-6">
            <a 
              href="https://x.com/TanishqShukla17" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity" 
              style={{ color: 'var(--theme-text)' }}
              aria-label="X (Twitter)"
            >
              <XIcon width={24} height={24} />
            </a>
            <a 
              href="https://www.linkedin.com/in/contacttanishqshukla/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity" 
              style={{ color: 'var(--theme-text)' }}
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="https://github.com/Leviathan2004" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity" 
              style={{ color: 'var(--theme-text)' }}
              aria-label="GitHub"
            >
              <Github size={24} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
