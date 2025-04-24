import { useState } from "react";
import { useNavigate } from "react-router-dom";  // Use useNavigate from react-router-dom

const LoginForm = () => {
  const [formMode, setFormMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");

  // Hook to redirect user (useNavigate instead of useHistory)
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // For login mode
    if (formMode === "login") {
      if (username === "admin" && password === "password123") {
        console.log("Login successful");
        // Redirect to dashboard after successful login
        navigate("/dashboard");
      } else {
        setError("Invalid credentials!");
      }
    }

    // For signup mode
    if (formMode === "signup") {
      if (username && password && email && retypePassword) {
        if (password === retypePassword) {
          console.log("Sign up successful");
        } else {
          setError("Passwords do not match!");
        }
      } else {
        setError("Please fill in all fields!");
      }
    }
  };

  const handleSwitchMode = () => {
    setFormMode(formMode === "login" ? "signup" : "login");
    setError(""); // Reset error when switching forms
  };

  return (
    <div className="login-container">
      <h2>{formMode === "login" ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>

        {formMode === "signup" && (
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
            />
          </div>
        )}

        <div className="input-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>

        {formMode === "signup" && (
          <div className="input-group">
            <input
              type="password"
              id="retypePassword"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              placeholder="Re-type Password"
            />
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <button
          type="submit"
          disabled={
            !username ||
            !password ||
            (formMode === "signup" &&
              (!email || !retypePassword || password !== retypePassword))
          }
        >
          {formMode === "login" ? "Login" : "Sign Up"}
        </button>
      </form>

      <footer>
        <p>
          {formMode === "login"
            ? "Don't have an account? "
            : "Already have an account? "}
          <button
            onClick={handleSwitchMode}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              textDecoration: "underline",
            }}
          >
            {formMode === "login" ? "Sign up" : "Login"}
          </button>
        </p>
      </footer>
    </div>
  );
};

export default LoginForm;
