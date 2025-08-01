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
    <nav className="navbar px-3 dark-divider">  
      <div className="container-fluid d-flex justify-content-between align-items-center">
        {/* 로고와 홈 아이콘 */}
        <div className="d-flex align-items-center">
          <Link className="navbar-brand" to="/">
            <img src={slogan} alt="Slogan" />
          </Link>
          <Link to="/">
            <img width="30" height="30" src="https://img.icons8.com/fluency-systems-regular/48/135b65/home--v1.png" alt="home--v1"/>
          </Link>
        </div>

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
              className="btn btn-outline-primary btn-sm p-1 search-button"
              type="submit"
            >
            <img width="25" height="25" 
                src="https://img.icons8.com/ios-filled/50/135b65/search.png" alt="search"/>
            </button>
          </form>
          <div className="dropdown" ref={menuRef}>
            <button
              className="menu-button"
              onClick={toggleMenu}
            >
            <img width="25" height="25" 
                src="https://img.icons8.com/ios-filled/50/135b65/menu.png" alt="menu"/>
            </button>
            {showMenu && (
              <ul
                className="dropdown-menu show"
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
