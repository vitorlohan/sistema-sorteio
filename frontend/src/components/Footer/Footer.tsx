import { Link } from 'react-router-dom';
import { FiHash, FiUsers, FiTarget, FiShield } from 'react-icons/fi';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span>MegaSorteio.com</span>
            </Link>
            <p className="footer-tagline">
              Sorteios rápidos, seguros e imparciais com criptografia de ponta.
            </p>
          </div>

          <div className="footer-col">
            <h4>Sorteios</h4>
            <ul>
              <li><Link to="/numeros"><FiHash size={14} /> Números</Link></li>
              <li><Link to="/nomes"><FiUsers size={14} /> Nomes</Link></li>
              <li><Link to="/roleta"><FiTarget size={14} /> Roleta</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Conta</h4>
            <ul>
              <li><Link to="/login">Entrar</Link></li>
              <li><Link to="/register">Criar conta</Link></li>
              <li><Link to="/dashboard">Painel</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Segurança</h4>
            <ul>
              <li><span className="footer-info"><FiShield size={14} /> Criptografia AES</span></li>
              <li><span className="footer-info">JWT com rotação</span></li>
              <li><span className="footer-info">Rate limiting</span></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sistema de Sorteio. Todos os direitos reservados.</p>
          <p className="footer-dev">Desenvolvido por Vitor Lohan</p>
        </div>
      </div>
    </footer>
  );
}
