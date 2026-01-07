import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import "./AdminLogin.css";

export default function AdminLoginButton({ loading, isLogout }) {
  return (
    <button className={`login-btn ${loading ? "loading" : ""}`}>
      {isLogout ? (
        <FaArrowLeft className="arrow slide-left" />
      ) : (
        <FaArrowRight className="arrow slide-right" />
      )}
      <span>{isLogout ? "Logout" : "Login"}</span>
    </button>
  );
}
