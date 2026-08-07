import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Shipyard
        </Link>

        {user && (
          <div className="navbar-right">
            <span className="navbar-user">{user.username}</span>
            <button onClick={() => logout()} className="navbar-logout">
              Log out
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
