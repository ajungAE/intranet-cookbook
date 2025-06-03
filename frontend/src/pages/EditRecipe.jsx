import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const EditRecipe = () => {
  const { id } = useParams(); // Holt die ID aus der URL (/edit/:id)
  const navigate = useNavigate(); // Ermöglicht Weiterleitung nach dem Speichern

  // Lokale Zustände für Rezeptdaten
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);

  // Zustände für Feedback und Fehlerbehandlung
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Kategorien und ausgewählte Kategorie-IDs
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const token = localStorage.getItem("token"); // JWT-Token für Authentifizierung

  // Lädt Rezeptdaten + Kategorien beim ersten Render
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Holt das aktuelle Rezept
        const res = await fetch(`http://ajubuntu:3000/recipes/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Fehler beim Laden");

        // Setzt die Felder für Titel, Zutaten usw.
        setTitle(data.title);
        setIngredients(data.ingredients);
        setInstructions(data.instructions);

        // Wandelt Kategorieobjekte in ID-Array um
        setSelectedCategories(data.categories.map((cat) => cat.id));

        // Holt alle verfügbaren Kategorien
        const catRes = await fetch("http://ajubuntu:3000/categories");
        const cats = await catRes.json();
        setCategories(cats);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchData();
  }, [id]);

  // Speichert die Änderungen
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title || !ingredients || !instructions) {
      return setError("Alle Felder (außer Bild) sind Pflichtfelder.");
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    formData.append("categoryIds", JSON.stringify(selectedCategories)); // wichtig!

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`http://ajubuntu:3000/recipes/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Aktualisieren");

      setSuccess("Rezept aktualisiert!");
      setTimeout(() => navigate("/me"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Rezept bearbeiten</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Titel */}
        <div className="mb-3">
          <label className="form-label">Titel</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Zutaten */}
        <div className="mb-3">
          <label className="form-label">Zutaten</label>
          <textarea
            className="form-control"
            rows="3"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Zubereitung */}
        <div className="mb-3">
          <label className="form-label">Zubereitung</label>
          <textarea
            className="form-control"
            rows="4"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Bild aktualisieren */}
        <div className="mb-3">
          <label className="form-label">Neues Bild (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Kategorienauswahl */}
        <div className="mb-3">
          <label className="form-label">Kategorien</label>
          <select
            multiple
            className="form-select"
            value={selectedCategories}
            onChange={(e) =>
              setSelectedCategories(
                Array.from(e.target.selectedOptions, (opt) => Number(opt.value))
              )
            }
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-primary">
          Änderungen speichern
        </button>
      </form>
    </div>
  );
};

export default EditRecipe;
