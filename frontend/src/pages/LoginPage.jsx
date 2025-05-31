import Login from '../components/Login';

const LoginPage = () => {
  const handleLogin = () => {
    window.location.href = '/'; // Weiterleitung nach Login
  };

  return (
    <div>
      <Login onLoginSuccess={handleLogin} />
    </div>
  );
};

export default LoginPage;
