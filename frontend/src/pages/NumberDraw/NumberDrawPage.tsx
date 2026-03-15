import { useState, useEffect } from 'react';
import { FiSave } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { drawService } from '../../services/drawService';
import { templateService } from '../../services/templateService';
import { useAuth } from '../../hooks/useAuth';
import { DrawType } from '../../types';
import type { NumberDrawConfig, DrawTemplate } from '../../types';
import './NumberDraw.css';

export default function NumberDrawPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [results, setResults] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Template save
  const [showSave, setShowSave] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  // Carregar template se veio do dashboard
  useEffect(() => {
    const state = location.state as { template?: DrawTemplate } | null;
    if (state?.template?.type === DrawType.NUMBER) {
      const config = state.template.config as NumberDrawConfig;
      setQuantity(config.quantity);
      setMin(config.min);
      setMax(config.max);
      setAllowRepeat(config.allowRepeat);
    }
  }, [location.state]);

  const handleDraw = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await drawService.drawNumbers({
        quantity,
        min,
        max,
        allowRepeat,
      });

      if (response.data?.results) {
        setResults(response.data.results);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: { message: string }[] } } };
      setError(
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Erro ao realizar sorteio'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    try {
      await templateService.create({
        name: templateName,
        type: DrawType.NUMBER,
        config: { quantity, min, max, allowRepeat },
      });
      setShowSave(false);
      setTemplateName('');
      alert('Modelo salvo com sucesso!');
    } catch {
      alert('Erro ao salvar modelo');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container page-content">
      <div className="draw-layout">
        <div className="card">
          <div className="card-header">
            <div className="card-icon" style={{ background: '#D97706' }}>123</div>
            <h2>Sorteador de Números</h2>
          </div>

          <div className="draw-config-box">
            <div className="inline-config">
              <span>Sortear</span>
              <input
                type="number"
                className="number-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={1000}
              />
              <span>número(s) entre</span>
              <input
                type="number"
                className="number-input"
                value={min}
                onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              />
              <span>e</span>
              <input
                type="number"
                className="number-input"
                value={max}
                onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="draw-options">
            <div className="toggle-wrapper">
              <input
                type="checkbox"
                className="toggle"
                id="allowRepeat"
                checked={!allowRepeat}
                onChange={(e) => setAllowRepeat(!e.target.checked)}
              />
              <label htmlFor="allowRepeat" className="toggle-label">
                Não repetir número
              </label>
            </div>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <button
            className="btn btn-primary btn-block btn-lg"
            onClick={handleDraw}
            disabled={loading}
          >
            {loading ? 'Sorteando...' : 'Sortear ›'}
          </button>

          {isAuthenticated && (
            <div className="save-section">
              {showSave ? (
                <div className="save-form">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nome do modelo (ex: Mega Sena)"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    maxLength={100}
                  />
                  <div className="save-actions">
                    <button className="btn btn-primary btn-sm" onClick={handleSaveTemplate} disabled={saving}>
                      {saving ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button className="btn btn-secondary btn-sm" onClick={() => setShowSave(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <button className="btn btn-secondary btn-sm" onClick={() => setShowSave(true)}>
                <FiSave size={14} /> Salvar como modelo
                </button>
              )}
            </div>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <div className="results-container">
            <div className="results-title">Resultados do Sorteio</div>
            <div className="results-list">
              {results.map((num, idx) => (
                <span key={idx} className="result-item">{num}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
