import React from 'react';
import { Link } from 'react-router-dom';
import slogan from '../assets/slogan.png'; 
import searchIcon from '../assets/searchIcon.png';
import '../css/Navbar.css';
function Navbar() {
  return (
  <nav className="navbar navbar-expand-lg navbar-light dark-divider">
    <div className="container-fluid">
      <Link className="navbar-brand" to="/">
        <img src={slogan} alt="Slogan" style={{ width: '100px' }} />
      </Link>
      <div className="collapse navbar-collapse">
        <div className="ms-auto d-flex align-items-center">
          <form className="d-flex me-3" role="search" onSubmit={(e) => e.preventDefault()}>
            <input
              className="form-control form-control-sm me-2 search-input"
              type="search"
              placeholder="Search"
              aria-label="Search"
              style={{ width: '400px' }}
            />
            <button
                className="btn btn-outline-primary btn-sm p-1"
                type="submit"
                style={{
                  border: 'none',
                  background: 'none',
                  padding: 0,
                  outline: 'none'
                }}>
                <img src={searchIcon} alt="Search" 
                      style={{ width: '16px', height: '16px' }}/>
              </button>
          </form>
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link" to="/login">Login</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  );
}

export default Navbar;
