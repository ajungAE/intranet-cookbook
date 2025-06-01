import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <Link className="navbar-brand" to="/">Kochbuch</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <li className="nav-item">
            <Link className="nav-link" to="/">Startseite</Link>
          </li>
          {token && (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/me">Meine Rezepte</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/favorites">Favoriten</Link>
              </li>
            </>
          )}
        </ul>
        <ul className="navbar-nav ms-auto">
          {token ? (
            <li className="nav-item">
              <button className="btn btn-outline-secondary" onClick={handleLogout}>
                Logout
              </button>
            </li>
          ) : (
            <li className="nav-item">
              <Link className="btn btn-primary" to="/login">Login</Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
