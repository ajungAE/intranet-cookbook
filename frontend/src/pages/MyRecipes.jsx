import { useEffect, useState } from "react";

const MyRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchMyRecipes = async () => {
      try {
        const res = await fetch("http://ajubuntu:3000/recipes/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Prüfe explizit auf leere Antwort
        if (res.status === 204 || res.status === 404) {
          console.log("Keine Inhalte erhalten (204 oder 404)");
          setRecipes([]); // explizit leeres Array setzen
          return; // Verarbeitung hier stoppen!
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

  return (
    <div className="container mt-5">
      <h2>Meine Rezepte</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {recipes.length === 0 && <p>Du hast noch keine Rezepte erstellt.</p>}
      <div className="row">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="col-md-4 mb-4">
            <div className="card">
              {recipe.image_path && (
                <img
                  src={`http://ajubuntu:3000/${recipe.image_path}`}
                  className="card-img-top"
                  alt={recipe.title}
                />
              )}
              <div className="card-body">
                <h5 className="card-title">{recipe.title}</h5>
                <p className="card-text">{recipe.ingredients}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyRecipes;
