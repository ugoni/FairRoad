import React,{ useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import slogan from '../assets/slogan.png'; 
import searchIcon from '../assets/searchIcon.png';
import menuIcon from '../assets/menuIcon.png';
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
            <div className="dropdown" ref={menuRef}>
            <button
              className="menu-button"
              onClick={toggleMenu}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                margin: 0,
                cursor: 'pointer'
              }}
            >
              <img src={menuIcon} alt="Menu" style={{width: '28px',height: '28px'}}/>
            </button>
              {showMenu && (
                <ul className="dropdown-menu show" style={{ display: 'block', position: 'absolute' }}>
                  <li><Link className="dropdown-item" to="/mypage">마이페이지</Link></li>
                  <li><Link className="dropdown-item" to="/calendar">캘린더</Link></li>
                  <li><Link className="dropdown-item" to="/settings">설정</Link></li>
                  <li><Link className="dropdown-item" to="/login">로그인</Link></li>
                </ul>
              )}
            </div>
        </div>
      </div>
    </div>
  </nav>
  );
}

export default Navbar;
