import { useState } from "react";
import { authFetch } from "./api";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [powBase, setPowBase] = useState("");
  const [powExp, setPowExp] = useState("");
  const [powResult, setPowResult] = useState(null);

  const [fibN, setFibN] = useState("");
  const [fibResult, setFibResult] = useState(null);

  const [factN, setFactN] = useState("");
  const [factResult, setFactResult] = useState(null);

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const name = sessionStorage.getItem("name") || "Utilizator";
  const initial = name.charAt(0).toUpperCase();
  const email = sessionStorage.getItem("email") || "user@example.com";
  const navigate = useNavigate();
  const API_URL = "http://localhost:5000";

  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  const handleLogout = () => {
    setShowUserDropdown(false);
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("email");
    window.location.reload();
  };

  const cancelLogout = () => {
    setShowLogoutConfirm(false);
  };

  const handlePow = async () => {
  const base = Number(powBase);
  const exp = Number(powExp);

  if (isNaN(base) || isNaN(exp)) {
    alert("Te rog introdu valori numerice valide pentru bază și exponent.");
    return;
  }

  const res = await authFetch(`${API_URL}/pow`, {
    method: "POST",
    body: JSON.stringify({ base, exp }),
  });

  const data = await res.json();
  setPowResult(data.result);
};
const handleClearPow = () => {
  setPowBase("");
  setPowExp("");
  setPowResult(null);
};

const handleClearFib = () => {
  setFibN("");
  setFibResult(null);
};

const handleClearFact = () => {
  setFactN("");
  setFactResult(null);
};


  const handleFib = async () => {
    const n = Number(fibN);

    if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
      alert("Te rog introdu un număr întreg pozitiv pentru Fibonacci.");
      return;
    }

    const res = await authFetch(`${API_URL}/fibonacci/${n}`);
    const data = await res.json();
    setFibResult(data.result);
  };

  const handleFact = async () => {
    const n = Number(factN);

    if (isNaN(n) || n < 0 || !Number.isInteger(n)) {
      alert("Te rog introdu un număr întreg pozitiv pentru factorial.");
      return;
    }

    const res = await authFetch(`${API_URL}/factorial/${n}`);
    const data = await res.json();
    setFactResult(data.result);
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Math Microservice</h1>
        <div className="user-profile-container">
          <button 
            onClick={toggleUserDropdown} 
            className="user-profile-button"
            aria-expanded={showUserDropdown}
          >
            <div className="user-avatar">
              <span className="user-initials">{initial}</span>
            </div>
            <span className="user-name">{name}</span>
            <span className={`dropdown-arrow ${showUserDropdown ? 'open' : ''}`}>
              ▼
            </span>
          </button>

          {/* Dropdown Menu */}
          {showUserDropdown && (
            <div className="user-dropdown-menu">
              <div className="dropdown-header">
                <div className="user-info">
                  <div className="user-avatar-large">{initial}</div>
                  <div className="user-details">
                    <span className="user-display-name">{name}</span>
                    <span className="user-email">{email}</span>
                  </div>
                </div>
              </div>
              
              <div className="dropdown-divider"></div>
              
              <div className="dropdown-items">
                <button className="dropdown-item">
                  <span className="item-icon">🌙</span>
                  <span>Mod întunecat</span>
                </button>
                <button className="dropdown-item" onClick={() => navigate("/stats")}>
                  <span className="item-icon">📊</span>
                  <span>Stats</span>
                </button>
                <div className="dropdown-divider"></div>
                
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <span className="item-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlay pentru a închide dropdown-ul */}
      {showUserDropdown && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setShowUserDropdown(false)}
        ></div>
      )}

      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal">
            <div className="modal-icon">⚠️</div>
            <h3>Confirmare Logout</h3>
            <p>Ești sigur că vrei să te deconectezi?</p>
            <div className="modal-buttons">
              <button onClick={confirmLogout} className="confirm-logout-btn">
                ✓ Da, Logout
              </button>
              <button onClick={cancelLogout} className="cancel-logout-btn">
                ✗ Anulează
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <h2>Power</h2>
        <div className="input-group">
          <input
            type="number"
            placeholder="Base"
            value={powBase}
            onChange={(e) => setPowBase(e.target.value)}
          />
          <input
            type="number"
            placeholder="Exponent"
            value={powExp}
            onChange={(e) => setPowExp(e.target.value)}
          />
        </div>
        <div className="btn-group">
          <button onClick={handlePow}>Calculate</button>
          <button className="btn_clear" onClick={handleClearPow}>Clear</button>
        </div>
        {powResult !== null && <p>Result: <strong>{powResult}</strong></p>}
      </div>

      <div className="card">
        <h2>Fibonacci</h2>
        <input
          type="number"
          placeholder="n"
          value={fibN}
          onChange={(e) => setFibN(e.target.value)}
        />
        <div className="btn-group">
          <button onClick={handleFib}>Calculate</button>
          <button className="btn_clear" onClick={handleClearFib}>Clear</button>
        </div>
        {fibResult !== null && <p>Result: <strong>{fibResult}</strong></p>}
      </div>

      <div className="card">
        <h2>Factorial</h2>
        <input
          type="number"
          placeholder="n"
          value={factN}
          onChange={(e) => setFactN(e.target.value)}
        />
        <div className="btn-group">
          <button onClick={handleFact}>Calculate</button>
          <button className="btn_clear" onClick={handleClearFact}>Clear</button>
        </div>
        {factResult !== null && <p>Result: <strong>{factResult}</strong></p>}
      </div>
    </div>
  );
}

export default App;
