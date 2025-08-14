import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext"
import "./LoginSignUp.css";

function LoginSignUp({ onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: ""
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const API_URL = "http://localhost:5000";

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleClear = () => {
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: ""
    });
    setMessage("");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setMessage("");

    if (isLogin) {
      if (!formData.email || !formData.password) {
        setMessage("Please fill the form!");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });
        
        const data = await res.json();

        console.log("Răspuns brut:", data);
        if (res.ok) {
          login({ token: data.token, name: data.name, email: data.email });
          setMessage("Login created successfully!");
          onLoginSuccess();
        } else {
          setMessage(data.message || "Erorr!");
        }
      } catch (error) {
        setMessage("Connection error!");
      }
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setMessage("Please fill the form!");
        setIsLoading(false);
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setMessage("Passwords don't match!");
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password
          }),
        });
        
        const data = await res.json();
        
        if (res.ok) {
          setMessage("Account created successfully!");
        } else {
          setMessage(data.message || "Error when creating account!");
        }
      } catch (error) {
        setMessage("Connection error!");
      }
    }

    setIsLoading(false);
  };

  const switchMode = () => {
    setAnimateCard(true);
    setTimeout(() => {
      setIsLogin(!isLogin);
      handleClear();
      setAnimateCard(false);
    }, 200);
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <div className="login-container">
      <h1 className="login-title">Math Application</h1>

      <div className={`login-card ${animateCard ? 'animate' : ''}`}>
        <h2 className="card-title">
          {isLogin ? "Login" : "Create an account"}
        </h2>
        
        <div className="input-group">
          {!isLogin && (
            <div className={`input-container ${animateCard ? 'animate-input' : ''}`}>
              <input
                type="text"
                placeholder="Nume"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                className={`login-input ${focusedField === 'name' ? 'focused' : ''} ${formData.name ? 'filled' : ''}`}
              />
              <div className={`input-label ${focusedField === 'name' || formData.name ? 'active' : ''}`}>
                👤
              </div>
            </div>
          )}
          
          <div className={`input-container ${animateCard ? 'animate-input' : ''}`}>
            <input
              type="email"
              placeholder="Email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              className={`login-input ${focusedField === 'email' ? 'focused' : ''} ${formData.email ? 'filled' : ''}`}
            />
            <div className={`input-label ${focusedField === 'email' || formData.email ? 'active' : ''}`}>
              📧
            </div>
          </div>
          
          <div className={`input-container ${animateCard ? 'animate-input' : ''}`}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Parolă"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              className={`login-input ${focusedField === 'password' ? 'focused' : ''} ${formData.password ? 'filled' : ''}`}
            />
            <div className={`input-label ${focusedField === 'password' || formData.password ? 'active' : ''}`}>
              🔒
            </div>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="password-toggle"
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
          
          {!isLogin && (
            <div className={`input-container ${animateCard ? 'animate-input' : ''}`}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                onFocus={() => setFocusedField('confirmPassword')}
                onBlur={() => setFocusedField(null)}
                className={`login-input ${focusedField === 'confirmPassword' ? 'focused' : ''} ${formData.confirmPassword ? 'filled' : ''}`}
              />
              <div className={`input-label ${focusedField === 'confirmPassword' || formData.confirmPassword ? 'active' : ''}`}>
                🔐
              </div>
            </div>
          )}
        </div>

        <div className="btn-group">
          <button 
            onClick={handleSubmit} 
            disabled={isLoading}
            className={`login-button ${isLoading ? 'loading' : ''}`}
          >
            {isLoading ? (
              <span className="loading-spinner">
                ⏳ Loading...
              </span>
            ) : (
              <span>
                {isLogin ? "🚀 Login" : "✨ Create an account"}
              </span>
            )}
          </button>
          <button 
            onClick={handleClear}
            className="clear-button"
          >
            🧹 Clear
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes("succes") ? 'success' : 'error'}`}>
            <span className="message-icon">
              {message.includes("succes") ? "✅" : "❌"}
            </span>
            <strong>{message}</strong>
          </div>
        )}

        <div className="switch-container">
          <p className="switch-text">
            {isLogin ? "You don't have an account? 🤔" : "Do you already have an account? 😊"}
          </p>
          <button 
            onClick={switchMode}
            className="switch-button"
          >
            {isLogin ? "✨ Create an account here" : "🚀 Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSignUp;