import { useEffect, useState } from "react";
import { authFetch } from "./api";
import { useNavigate } from "react-router-dom";
import "./Stats.css";

function Stats() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await authFetch("http://localhost:5000/stats");
        
        if (!res.ok) {
          throw new Error('Failed to fetch statistics');
        }
        
        const data = await res.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError('Eroare la încărcarea statisticilor');
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const handleBackToApp = () => {
    navigate("/app");
  };

  if (loading) {
    return (
      <div className="stats-container">
        <div className="loading-card">
          <div className="loading-spinner-large">⏳</div>
          <h2>Se încarcă statisticile...</h2>
          <p>Te rog așteaptă câteva momente</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stats-container">
        <div className="error-card">
          <div className="error-icon">❌</div>
          <h2>Oops! Ceva nu a mers bine</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            🔄 Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="stats-container">
        <div className="error-card">
          <div className="error-icon">📊</div>
          <h2>Nu există statistici disponibile</h2>
          <p>Nu s-au găsit date pentru afișare</p>
        </div>
      </div>
    );
  }

  // Calculează statistici suplimentare
  const totalOperations = Object.values(stats.by_operation || {}).reduce((sum, count) => sum + count, 0);
  const mostUsedOperation = Object.entries(stats.by_operation || {}).reduce((max, [op, count]) => 
    count > (max[1] || 0) ? [op, count] : max, ['', 0]);

  return (
    <div className="stats-container">
      {/* Header */}
      <div className="stats-header">
        <button onClick={handleBackToApp} className="back-button">
          ← Înapoi la operatii
        </button>
        <h1 className="stats-title">📊 Dashboard Statistici</h1>
      </div>

      {/* Navigation Tabs */}
      <div className="stats-tabs">
        <button 
          className={`tab-button ${selectedTab === 'overview' ? 'active' : ''}`}
          onClick={() => setSelectedTab('overview')}
        >
          📈 Prezentare Generală
        </button>
        <button 
          className={`tab-button ${selectedTab === 'operations' ? 'active' : ''}`}
          onClick={() => setSelectedTab('operations')}
        >
          🔢 Operații
        </button>
        <button 
          className={`tab-button ${selectedTab === 'performance' ? 'active' : ''}`}
          onClick={() => setSelectedTab('performance')}
        >
          ⚡ Performance
        </button>
      </div>

      {/* Content based on selected tab */}
      <div className="stats-content">
        {selectedTab === 'overview' && (
          <div className="overview-section">
            {/* Summary Cards */}
            <div className="summary-cards">
              <div className="summary-card total">
                <div className="card-icon">🎯</div>
                <div className="card-content">
                  <h3>Total Cereri</h3>
                  <p className="big-number">{stats.total || 0}</p>
                  <span className="card-subtitle">Toate operațiile</span>
                </div>
              </div>

              <div className="summary-card operations">
                <div className="card-icon">🔢</div>
                <div className="card-content">
                  <h3>Tipuri Operații</h3>
                  <p className="big-number">{Object.keys(stats.by_operation || {}).length}</p>
                  <span className="card-subtitle">Funcții disponibile</span>
                </div>
              </div>

              <div className="summary-card popular">
                <div className="card-icon">⭐</div>
                <div className="card-content">
                  <h3>Cea mai populară</h3>
                  <p className="operation-name">{mostUsedOperation[0] || 'N/A'}</p>
                  <span className="card-subtitle">{mostUsedOperation[1]} utilizări</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {selectedTab === 'operations' && (
          <div className="operations-section">
            <div className="operations-card">
              <h3>🔢 Statistici pe Operații</h3>
              <div className="operations-list">
                {Object.entries(stats.by_operation || {}).map(([operation, count]) => {
                  const percentage = totalOperations > 0 ? ((count / totalOperations) * 100).toFixed(1) : 0;
                  const operationIcons = {
                    'pow': '🔺',
                    'power': '🔺',
                    'fibonacci': '🌀',
                    'factorial': '❗',
                    'fib': '🌀',
                    'fact': '❗'
                  };
                  
                  return (
                    <div key={operation} className="operation-item">
                      <div className="operation-header">
                        <span className="operation-icon">
                          {operationIcons[operation.toLowerCase()] || '🔢'}
                        </span>
                        <span className="operation-name">{operation}</span>
                        <span className="operation-count">{count}</span>
                      </div>
                      <div className="operation-bar">
                        <div 
                          className="operation-progress" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="operation-percentage">{percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'performance' && (
          <div className="performance-section">
            {stats.avg_duration ? (
              <div className="performance-card">
                <h3>⚡ Performanță Operații</h3>
                <div className="performance-list">
                  {Object.entries(stats.avg_duration).map(([operation, duration]) => {
                    const performanceLevel = duration < 10 ? 'excellent' : duration < 50 ? 'good' : 'average';
                    const performanceIcons = {
                      'excellent': '🚀',
                      'good': '✅',
                      'average': '⚠️'
                    };
                    
                    return (
                      <div key={operation} className={`performance-item ${performanceLevel}`}>
                        <div className="performance-header">
                          <span className="performance-icon">
                            {performanceIcons[performanceLevel]}
                          </span>
                          <span className="performance-operation">{operation}</span>
                          <span className="performance-time">{duration} ms</span>
                        </div>
                        <div className="performance-status">
                          {performanceLevel === 'excellent' && 'Excelent'}
                          {performanceLevel === 'good' && 'Bun'}
                          {performanceLevel === 'average' && 'Mediu'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="no-performance-card">
                <div className="no-data-icon">📊</div>
                <h3>Nu există date de performanță</h3>
                <p>Datele de performanță vor fi disponibile după executarea unor operații.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Stats;