import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API } from "../config";


const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await fetch(`${API.RECIPES}/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 204 || res.status === 404) {
          console.log("Keine Inhalte erhalten (204 oder 404)");
          setRecipes([]);
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Fehler beim Laden");
        setRecipes(data);
      } catch (err) {
        console.error("Fehler in fetchMyRecipes:", err.message);
        setError(err.message);
      }
    };

    fetchMyRecipes();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Willst du dieses Rezept wirklich löschen?")) return;

    try {
      const res = await fetch(`${API.RECIPES}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Löschen");

      setRecipes((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Meine Rezepte</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {recipes.length === 0 && <p>Du hast noch keine Rezepte erstellt.</p>}
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <div className="card h-100 d-flex flex-column">
              {recipe.image_path && (
                <img
                  src={`${API.UPLOADS}/${recipe.image_path}`}
                  className="card-img-top"
                  alt={recipe.title}
                />
              )}
              <div className="card-body flex-grow-1">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.ingredients}</p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => navigate(`/edit/${recipe.id}`)}
                >
                  Bearbeiten
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(recipe.id)}
                >
                  Löschen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecipes;
