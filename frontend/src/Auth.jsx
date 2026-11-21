
import { useState } from "react";
import "./Auth.css";

function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);

    if (!email.trim() || !password.trim()) {
      setMessage("Please enter email and password.");
      return;
    }

    if (!isLogin && !name.trim()) {
      setMessage("Please enter your name.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "login" : "register";

      const response = await fetch(
        `https://codecheck-backend-wfdc.onrender.com/api/auth/${endpoint}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            password
          })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        setMessage(data.message || "Something went wrong.");
        return;
      }

      if (isLogin) {
        setSuccess(true);
        setMessage("Login successful!");

        onLogin(data.user, data.token);
      } else {
        setSuccess(true);
        setMessage("Registration successful! Please login.");

        setIsLogin(true);
        setName("");
        setPassword("");
      }

    } catch (error) {
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          Code<span>Check</span>
        </div>

        <h1>{isLogin ? "Welcome Back!" : "Create Account"}</h1>

        <p className="auth-subtitle">
          {isLogin
            ? "Login to continue to CodeCheck"
            : "Register to start validating your code"}
        </p>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <>
              <label>Full Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </>
          )}

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <div className={success ? "auth-success" : "auth-error"}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Register"}
          </button>

        </form>

        <div className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setSuccess(false);
            }}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

      </div>
    </div>
  );
}

export default Auth;

