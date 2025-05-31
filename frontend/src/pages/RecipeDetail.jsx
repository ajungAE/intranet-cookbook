import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://ajubuntu:3000/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Fehler beim Laden');
        setRecipe(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipe();
  }, [id]);

  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  if (!recipe) {
    return <div className="container mt-5">Lade Rezept...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>{recipe.title}</h2>
      {recipe.image_path && (
        <img
          src={`http://ajubuntu:3000/${recipe.image_path}`}
          alt={recipe.title}
          className="img-fluid my-3"
        />
      )}
      <h5>Zutaten:</h5>
      <p>{recipe.ingredients}</p>
      <h5>Zubereitung:</h5>
      <p>{recipe.instructions}</p>
    </div>
  );
};

export default RecipeDetail;
