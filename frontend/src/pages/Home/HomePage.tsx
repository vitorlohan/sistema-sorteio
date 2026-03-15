import { Link } from 'react-router-dom';
import { FiHash, FiUsers, FiTarget, FiShield, FiSave, FiSmartphone, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi';
import './Home.css';

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container">
          <div className="hero-badge">Plataforma de Sorteios Online</div>
          <h1 className="hero-title">
            Realize sorteios com <span>transparência</span> e <span>segurança</span>
          </h1>
          <p className="hero-subtitle">
            Números, nomes ou roleta — escolha o modo ideal para o seu sorteio.
            Resultados gerados com criptografia, rápidos e imparciais.
          </p>
          <div className="hero-actions">
            <Link to="/numeros" className="btn btn-primary btn-lg">
              Começar agora <FiArrowRight />
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Criar conta gratuita</Link>
          </div>
          <div className="hero-trust">
            <div className="trust-item"><FiCheck className="trust-check" /> Gratuito para uso básico</div>
            <div className="trust-item"><FiCheck className="trust-check" /> Sem necessidade de cadastro</div>
            <div className="trust-item"><FiCheck className="trust-check" /> Criptografia de ponta</div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Três modos de sorteio</h2>
            <p className="section-desc">Escolha a modalidade que melhor se adapta à sua necessidade</p>
          </div>
          <div className="features-grid">
            <Link to="/numeros" className="feature-card">
              <div className="feature-icon feature-icon--numbers">
                <FiHash size={24} />
              </div>
              <h3>Sorteio de Números</h3>
              <p>Defina intervalo, quantidade e sorteie números aleatórios com segurança criptográfica.</p>
              <span className="feature-link">Sortear números <FiArrowRight size={14} /></span>
            </Link>

            <Link to="/nomes" className="feature-card">
              <div className="feature-icon feature-icon--names">
                <FiUsers size={24} />
              </div>
              <h3>Sorteio de Nomes</h3>
              <p>Insira nomes manualmente ou importe via CSV. Sorteie um ou vários de uma vez.</p>
              <span className="feature-link">Sortear nomes <FiArrowRight size={14} /></span>
            </Link>

            <Link to="/roleta" className="feature-card">
              <div className="feature-icon feature-icon--roulette">
                <FiTarget size={24} />
              </div>
              <h3>Roleta Interativa</h3>
              <p>Gire a roleta com animação fluida. Personalize cores e entradas ao seu gosto.</p>
              <span className="feature-link">Girar roleta <FiArrowRight size={14} /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="benefits">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Por que escolher nossa plataforma?</h2>
            <p className="section-desc">Tecnologia de ponta para sorteios justos e confiáveis</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon benefit-icon--shield"><FiShield size={32} /></div>
              <h4>Seguro</h4>
              <p>Randomização criptográfica garante resultados justos e imparciais</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon benefit-icon--save"><FiSave size={32} /></div>
              <h4>Salve modelos</h4>
              <p>Crie uma conta e salve suas configurações para reutilizar depois</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon benefit-icon--mobile"><FiSmartphone size={32} /></div>
              <h4>Responsivo</h4>
              <p>Funciona perfeitamente em desktop, tablet e celular</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon benefit-icon--fast"><FiZap size={32} /></div>
              <h4>Rápido</h4>
              <p>Interface moderna e leve com resultados instantâneos</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-inner">
            <h2>Pronto para sortear?</h2>
            <p>Comece agora mesmo — é rápido, gratuito e não precisa de cadastro.</p>
            <div className="cta-actions">
              <Link to="/numeros" className="btn btn-primary btn-lg">
                Iniciar sorteio <span style={{ marginLeft: '4px' }}>&rsaquo;</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
