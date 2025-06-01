import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Navbar from './components/Navbar';
import MyRecipes from './pages/MyRecipes';
import LoginPage from './pages/LoginPage';
import RecipeDetail from './pages/RecipeDetail';
import Favorites from './pages/Favorites';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/me" element={<MyRecipes />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
