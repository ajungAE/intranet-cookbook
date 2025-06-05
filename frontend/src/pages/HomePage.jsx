import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API } from "../config";

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);


  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const query =
          selectedCategories.length > 0
            ? `?categories=${selectedCategories.join(",")}`
            : "";
        const res = await fetch(`${API.RECIPES}${query}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Fehler beim Laden");
        setRecipes(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRecipes();
  }, [selectedCategories]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(API.CATEGORIES);
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Fehler beim Laden der Kategorien", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Alle Rezepte</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="mb-4">
        <h5>Filter nach Kategorien:</h5>
        <div className="d-flex flex-wrap gap-3">
          {categories.map((cat) => (
            <div className="form-check" key={cat.id}>
              <input
                className="form-check-input"
                type="checkbox"
                value={cat.id}
                id={`cat-${cat.id}`}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedCategories((prev) =>
                    e.target.checked
                      ? [...prev, id]
                      : prev.filter((cid) => cid !== id)
                  );
                }}
                checked={selectedCategories.includes(cat.id)}
              />
              <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                {cat.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="row">
        {recipes.map((recipe) => (
          <div className="col-md-4 mb-4" key={recipe.id}>
            <div className="card h-100 position-relative">
              {recipe.image_path && (
                <img
                  src={`${API.UPLOADS}/${recipe.image_path}`}
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
