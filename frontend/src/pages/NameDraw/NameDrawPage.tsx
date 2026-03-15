import { useState, useEffect, useCallback } from 'react';
import { FiSave } from 'react-icons/fi';
import { useLocation } from 'react-router-dom';
import { drawService } from '../../services/drawService';
import { templateService } from '../../services/templateService';
import { useAuth } from '../../hooks/useAuth';
import { DrawType } from '../../types';
import type { NameDrawConfig, DrawTemplate } from '../../types';
import './NameDraw.css';

export default function NameDrawPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [namesText, setNamesText] = useState('');
  const [allowRepeat, setAllowRepeat] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [showSave, setShowSave] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  const parseNames = useCallback((): string[] => {
    return namesText
      .split(/[\n,]/)
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
  }, [namesText]);

  // Carregar template se veio do dashboard
  useEffect(() => {
    const state = location.state as { template?: DrawTemplate } | null;
    if (state?.template?.type === DrawType.NAME) {
      const config = state.template.config as NameDrawConfig;
      setQuantity(config.quantity);
      setNamesText(config.names.join('\n'));
      setAllowRepeat(config.allowRepeat);
    }
  }, [location.state]);

  const handleDraw = async () => {
    setError('');
    const names = parseNames();

    if (names.length === 0) {
      setError('Insira pelo menos um nome');
      return;
    }

    setLoading(true);
    try {
      const response = await drawService.drawNames({
        quantity,
        names,
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setError('Apenas arquivos .csv ou .txt são aceitos');
      return;
    }

    if (file.size > 1024 * 1024) {
      setError('Arquivo muito grande (máximo 1MB)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setNamesText(text);
      setError('');
    };
    reader.readAsText(file);
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    try {
      await templateService.create({
        name: templateName,
        type: DrawType.NAME,
        config: { quantity, names: parseNames(), allowRepeat },
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
            <div className="card-icon" style={{ background: '#3B82F6' }}>Aa</div>
            <h2>Sorteio de Nomes</h2>
          </div>

          <div className="draw-config-box">
            <div className="inline-config" style={{ marginBottom: 16 }}>
              <span>Sortear</span>
              <input
                type="number"
                className="number-input"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min={1}
                max={1000}
              />
              <span>nome(s)</span>
            </div>

            <textarea
              className="form-input"
              placeholder="Separe os nomes por linha ou vírgula"
              value={namesText}
              onChange={(e) => setNamesText(e.target.value)}
              rows={8}
            />

            <div className="file-upload">
              <label className="file-upload-label">
                Para carregar a lista de um arquivo .csv,{' '}
                <span className="file-link">clique aqui</span>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  hidden
                />
              </label>
            </div>
          </div>

          <div className="draw-options">
            <div className="toggle-wrapper">
              <input
                type="checkbox"
                className="toggle"
                id="allowRepeatNames"
                checked={!allowRepeat}
                onChange={(e) => setAllowRepeat(!e.target.checked)}
              />
              <label htmlFor="allowRepeatNames" className="toggle-label">
                Não repetir nome
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
                    placeholder="Nome do modelo (ex: Sorteio Equipe)"
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
            <div className="results-title">Nome(s) Sorteado(s)</div>
            <div className="results-list">
              {results.map((name, idx) => (
                <span key={idx} className="result-item result-item-name">{name}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
