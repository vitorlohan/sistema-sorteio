import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSave, FiPlus, FiX, FiPlay, FiTarget } from 'react-icons/fi';
import { drawService } from '../../services/drawService';
import { templateService } from '../../services/templateService';
import { useAuth } from '../../hooks/useAuth';
import { DrawType } from '../../types';
import type { RouletteDrawConfig, DrawTemplate } from '../../types';
import RouletteWheel from '../../components/RouletteWheel/RouletteWheel';
import './RouletteDraw.css';

const DEFAULT_COLORS = ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#8B5CF6', '#EC4899'];

export default function RouletteDrawPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const [entriesText, setEntriesText] = useState('');
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [winner, setWinner] = useState<string | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winnerIndex, setWinnerIndex] = useState(0);
  const [error, setError] = useState('');

  const [showSave, setShowSave] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);

  const parseEntries = (): string[] => {
    return entriesText
      .split(/[\n,]/)
      .map((e) => e.trim())
      .filter((e) => e.length > 0);
  };

  // Carregar template se veio do dashboard
  useEffect(() => {
    const state = location.state as { template?: DrawTemplate } | null;
    if (state?.template?.type === DrawType.ROULETTE) {
      const config = state.template.config as RouletteDrawConfig;
      setEntriesText(config.entries.join('\n'));
      setColors(config.colors);
    }
  }, [location.state]);

  const handleSpin = async () => {
    setError('');
    const entries = parseEntries();

    if (entries.length < 2) {
      setError('Insira pelo menos 2 entradas para a roleta');
      return;
    }

    setSpinning(true);
    setWinner(null);

    try {
      const response = await drawService.drawRoulette({ entries, colors });

      if (response.data) {
        setWinnerIndex(response.data.winnerIndex);
        // O winner será exibido após a animação (via callback)
        setTimeout(() => {
          setWinner(response.data!.winner);
          setSpinning(false);
        }, 5000);
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string; errors?: { message: string }[] } } };
      setError(
        error.response?.data?.errors?.[0]?.message ||
        error.response?.data?.message ||
        'Erro ao realizar sorteio'
      );
      setSpinning(false);
    }
  };

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...colors];
    newColors[index] = color;
    setColors(newColors);
  };

  const addColor = () => {
    if (colors.length < 20) {
      setColors([...colors, '#6B7280']);
    }
  };

  const removeColor = (index: number) => {
    if (colors.length > 1) {
      setColors(colors.filter((_, i) => i !== index));
    }
  };

  const handleSaveTemplate = async () => {
    if (!templateName.trim()) return;
    setSaving(true);
    try {
      await templateService.create({
        name: templateName,
        type: DrawType.ROULETTE,
        config: { entries: parseEntries(), colors },
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

  const entries = parseEntries();

  return (
    <div className="container page-content">
      <div className="roulette-page-header">
        <div className="card-icon" style={{ background: '#DC2626' }}><FiTarget size={24} /></div>
        <h1>Sorteio de Roleta</h1>
      </div>

      <div className="roulette-layout">
        {/* Sidebar */}
        <aside className="roulette-sidebar">
          <div className="roulette-card">
            <div className="roulette-card-header">
              <h3>Entradas</h3>
              <span className="entry-badge">{entries.length}</span>
            </div>
            <textarea
              className="form-input"
              placeholder="Separe as entradas por linha ou vírgula&#10;&#10;Ex:&#10;João&#10;Maria&#10;Pedro"
              value={entriesText}
              onChange={(e) => setEntriesText(e.target.value)}
              rows={8}
            />
          </div>

          <div className="roulette-card">
            <div className="roulette-card-header">
              <h3>Cores</h3>
              <span className="color-badge">{colors.length}</span>
            </div>
            <div className="color-list">
              {colors.map((color, idx) => (
                <div key={idx} className="color-item">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => handleColorChange(idx, e.target.value)}
                    className="color-picker"
                  />
                  <span className="color-hex">{color.toUpperCase()}</span>
                  {colors.length > 1 && (
                    <button className="color-remove" onClick={() => removeColor(idx)} aria-label="Remover cor">
                      <FiX size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {colors.length < 20 && (
              <button className="btn-add-color" onClick={addColor}>
                <FiPlus size={14} /> Adicionar cor
              </button>
            )}
          </div>

          {isAuthenticated && (
            <div className="roulette-card">
              {showSave ? (
                <div className="save-form">
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Nome do modelo"
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
                <button className="btn btn-secondary btn-sm btn-block" onClick={() => setShowSave(true)}>
                  <FiSave size={14} /> Salvar como modelo
                </button>
              )}
            </div>
          )}
        </aside>

        {/* Roleta */}
        <div className="roulette-main">
          <div className="roulette-wheel-wrapper">
            <RouletteWheel
              entries={entries.length >= 2 ? entries : ['Item 1', 'Item 2']}
              colors={colors}
              spinning={spinning}
              winnerIndex={winnerIndex}
            />
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {winner && (
            <div className="winner-banner">
              <span className="winner-label">Resultado</span>
              <span className="winner-name">{winner}</span>
            </div>
          )}

          <button
            className="btn btn-primary btn-lg spin-btn"
            onClick={handleSpin}
            disabled={spinning || entries.length < 2}
          >
            {spinning ? 'Girando...' : <><FiPlay size={18} /> Girar Roleta</>}
          </button>
        </div>
      </div>
    </div>
  );
}
