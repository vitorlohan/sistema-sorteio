import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHash, FiUsers, FiTarget, FiLogIn, FiLogOut, FiGrid, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../../hooks/useAuth';
import './Header.css';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="container header-inner">
        <Link to="/" className="header-logo" onClick={closeMenu}>
          <span className="logo-text">MegaSorteio.com</span>
        </Link>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
        >
          {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>

        <div className={`header-collapse ${menuOpen ? 'open' : ''}`}>
          <nav className="header-nav">
            <Link to="/numeros" className={`nav-link ${isActive('/numeros') ? 'active' : ''}`} onClick={closeMenu}>
              <FiHash size={16} />
              Números
            </Link>
            <Link to="/nomes" className={`nav-link ${isActive('/nomes') ? 'active' : ''}`} onClick={closeMenu}>
              <FiUsers size={16} />
              Nomes
            </Link>
            <Link to="/roleta" className={`nav-link ${isActive('/roleta') ? 'active' : ''}`} onClick={closeMenu}>
              <FiTarget size={16} />
              Roleta
            </Link>
          </nav>

          <div className="header-auth">
            {isAuthenticated ? (
              <div className="user-menu">
                <Link to="/dashboard" className="btn btn-secondary btn-sm" onClick={closeMenu}>
                  <FiGrid size={14} />
                  {user?.name?.split(' ')[0]}
                </Link>
                <button onClick={() => { logout(); closeMenu(); }} className="btn btn-sm btn-logout">
                  <FiLogOut size={14} /> Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm" onClick={closeMenu}>
                <FiLogIn size={14} /> Entrar
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
