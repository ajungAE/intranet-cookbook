import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await fetch("http://ajubuntu:3000/recipes");
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Fehler beim Laden");
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Alle Rezepte</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-4 mb-4" key={recipe.id}>
            <div className="card h-100 position-relative">
              {recipe.image_path && (
                <img
                  src={`http://ajubuntu:3000/${recipe.image_path}`}
                  className="card-img-top"
                  alt={recipe.title}
                />
              )}
              <div className="card-body">
                <Link
                  to={`/recipes/${recipe.id}`}
                  className="stretched-link text-decoration-none text-dark"
                >
                  <h5 className="card-title">{recipe.title}</h5>
                </Link>
                <p className="card-text">{recipe.ingredients}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
