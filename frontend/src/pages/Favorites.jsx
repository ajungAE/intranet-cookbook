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

  return (
    <div className="container mt-5">
      <h2>Meine Favoriten</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {favorites.length === 0 && <p>Du hast noch keine Favoriten gespeichert.</p>}
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
