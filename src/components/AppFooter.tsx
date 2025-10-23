import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

export function AppFooter() {
  return (
    <footer className="app-footer">
      <div className="footer-inner">
        <div style={{display:'flex',alignItems:'center',gap:12}}>
          <div className="footer-brand" style={{fontWeight:700}}>DocuFlow</div>
          <div className="footer-sub" style={{color:'var(--muted)',fontSize:13}}>Build beautiful document workflows</div>
        </div>
        <div className="footer-links">
          <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub" className="icon-link">
            <FaGithub />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="icon-link">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="Twitter" className="icon-link">
            <FaTwitter />
          </a>
        </div>
        <div className="copyright">© {new Date().getFullYear()} DocuFlow. All rights reserved.</div>
      </div>
    </footer>
  );
}


