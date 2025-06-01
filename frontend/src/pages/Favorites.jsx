import { useEffect, useState } from "react";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await fetch("http://ajubuntu:3000/favorites/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Fehler beim Laden");
        setFavorites(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemoveFavorite = async (recipeId) => {
    try {
      const res = await fetch(`http://ajubuntu:3000/favorites/${recipeId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Entfernen");

      // Rezept lokal aus Liste entfernen
      setFavorites((prev) => prev.filter((r) => r.id !== recipeId));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Meine Favoriten</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {favorites.length === 0 && (
        <p>Du hast noch keine Favoriten gespeichert.</p>
      )}
      <div className="row">
        {favorites.map((recipe) => (
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
                <button
                  className="btn btn-sm btn-outline-danger mt-2"
                  onClick={() => handleRemoveFavorite(recipe.id)}
                >
                  Aus Favoriten entfernen
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
