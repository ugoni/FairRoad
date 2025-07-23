import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import slogan from '../assets/slogan.png';
import '../css/Navbar.css';

function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  const toggleMenu = () => setShowMenu((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar px-3 dark-divider" style={{ backgroundColor: '#ffffff' }}>  
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* 로고 */}
        <Link className="navbar-brand" to="/">
          <img src={slogan} alt="Slogan" style={{ width: '100px' }} />
        </Link>

        <div className="d-flex align-items-center">
          <form
            className="d-flex me-3"
            role="search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="form-control form-control-sm me-2 search-input"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-primary btn-sm p-1"
              type="submit"
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                outline: 'none',
              }}
            >
            <img width="25" height="25" 
                src="https://img.icons8.com/ios-filled/50/search--v1.png" 
                alt="search--v1"/>
            </button>
          </form>
          <div className="dropdown" ref={menuRef}>
            <button
              className="menu-button"
              onClick={toggleMenu}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer',
              }}
            >
              <img width="25" height="25" 
                  src="https://img.icons8.com/ios/50/menu--v7.png" 
                  alt="menu--v7"/>
            </button>
            {showMenu && (
              <ul
                className="dropdown-menu show"
                style={{
                  display: 'block',
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  zIndex: 1000,
                }}
              >
                <li><Link className="dropdown-item" to="/mypage">마이페이지</Link></li>
                <li><Link className="dropdown-item" to="/calendar">캘린더</Link></li>
                <li><Link className="dropdown-item" to="/settings">설정</Link></li>
                <li><Link className="dropdown-item" to="/login">로그인</Link></li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
