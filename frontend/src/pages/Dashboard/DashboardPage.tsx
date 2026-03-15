import { useState, useEffect, useCallback, JSX } from 'react';
import { FiTarget, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { templateService } from '../../services/templateService';
import type { DrawTemplate, DrawType } from '../../types';
import './Dashboard.css';

const typeLabels: Record<string, string> = {
  number: 'Números',
  name: 'Nomes',
  roulette: 'Roleta',
};

const typeIcons: Record<string, JSX.Element> = {
  number: <span>123</span>,
  name: <span>Aa</span>,
  roulette: <FiTarget size={20} />,
};

const typeColors: Record<string, string> = {
  number: '#D97706',
  name: '#3B82F6',
  roulette: '#DC2626',
};

const typeLinks: Record<string, string> = {
  number: '/numeros',
  name: '/nomes',
  roulette: '/roleta',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<DrawTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DrawType | ''>('');
  const [page, setPage] = useState(1);
  const perPage = 9;

  const loadTemplates = useCallback(async () => {
    try {
      const response = await templateService.getAll(filter as DrawType || undefined);
      if (response.data?.templates) {
        setTemplates(response.data.templates);
      }
    } catch {
      // Silently fail
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este modelo?')) return;
    try {
      await templateService.delete(id);
      setTemplates((prev) => prev.filter((t) => t._id !== id));
    } catch {
      alert('Erro ao excluir modelo');
    }
  };

  const handleFilterChange = (newFilter: DrawType | '') => {
    setFilter(newFilter);
    setPage(1);
  };

  const totalPages = Math.ceil(templates.length / perPage);
  const paginatedTemplates = templates.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="container page-content">
      <div className="dashboard-header">
        <div>
          <h1>Olá, {user?.name?.split(' ')[0]}!</h1>
          <p className="dashboard-subtitle">Gerencie seus modelos de sorteio salvos</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/numeros" className="quick-action-card">
          <span className="qa-icon" style={{ background: '#D97706' }}>123</span>
          <span>Sortear Números</span>
        </Link>
        <Link to="/nomes" className="quick-action-card">
          <span className="qa-icon" style={{ background: '#3B82F6' }}>Aa</span>
          <span>Sortear Nomes</span>
        </Link>
        <Link to="/roleta" className="quick-action-card">
          <span className="qa-icon" style={{ background: '#DC2626' }}><FiTarget size={24} /></span>
          <span>Sortear Roleta</span>
        </Link>
      </div>

      {/* Templates */}
      <div className="templates-section">
        <div className="templates-header">
          <h2>Meus Modelos</h2>
          <div className="filter-tabs">
            <button
              className={`filter-tab ${filter === '' ? 'active' : ''}`}
              onClick={() => handleFilterChange('')}
            >
              Todos
            </button>
            <button
              className={`filter-tab ${filter === 'number' ? 'active' : ''}`}
              onClick={() => handleFilterChange('number' as DrawType)}
            >
              Números
            </button>
            <button
              className={`filter-tab ${filter === 'name' ? 'active' : ''}`}
              onClick={() => handleFilterChange('name' as DrawType)}
            >
              Nomes
            </button>
            <button
              className={`filter-tab ${filter === 'roulette' ? 'active' : ''}`}
              onClick={() => handleFilterChange('roulette' as DrawType)}
            >
              Roleta
            </button>
          </div>
        </div>

        {loading ? (
          <div className="spinner" />
        ) : templates.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>Nenhum modelo salvo</h3>
            <p>Crie um sorteio e salve como modelo para reutilizar depois</p>
          </div>
        ) : (
          <>
            <div className="templates-grid">
              {paginatedTemplates.map((template) => (
                <div key={template._id} className="template-card">
                  <div className="template-card-header">
                    <span
                      className="template-type-badge"
                      style={{ background: typeColors[template.type] }}
                    >
                      {typeIcons[template.type]}
                    </span>
                    <div>
                      <h3>{template.name}</h3>
                      <span className="template-type-label">
                        {typeLabels[template.type]}
                      </span>
                    </div>
                  </div>
                  <div className="template-card-actions">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => navigate(typeLinks[template.type], { state: { template } })}
                    >
                      Usar
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(template._id)}
                    >
                      Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <FiChevronLeft size={16} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`pagination-btn ${page === p ? 'active' : ''}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="pagination-btn"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  <FiChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
