import React from 'react';
import { Link } from 'react-router-dom';
import slogan from '../assets/slogan.png'; 

function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light dark-divider">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          <img src={slogan} alt="Slogan" style={{ width: '100px' }} />
        </Link>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
