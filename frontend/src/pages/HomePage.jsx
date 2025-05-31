import { useEffect, useState } from 'react';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch('http://ajubuntu:3000/recipes');
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Fehler beim Laden');
        }

        setRecipes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div>
      <h1>Willkommen beim Intranet-Kochbuch</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p>{recipe.ingredients}</p>
            {recipe.image_path && (
              <img
                src={`http://ajubuntu:3000/${recipe.image_path}`}
                alt={recipe.title}
                style={{ width: '200px' }}
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
