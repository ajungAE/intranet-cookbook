import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const CreateRecipe = () => {
  // Lokale Zustände für Formularfelder
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);

  // Rückmeldung bei Erfolg oder Fehler
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // React Router: Programmatische Navigation (Redirects) z.B. nach dem Speichern
  const navigate = useNavigate();

  // Kategorien vom Server laden
  const [categories, setCategories] = useState([]);

  // Vom User ausgewählte Kategorien
  const [selectedCategories, setSelectedCategories] = useState([]);

  // JWT aus dem lokalen Speicher lesen (für geschützte API-Aufrufe)
  const token = localStorage.getItem("token");

  // Lade Kategorien aus dem Backend bei Erstaufruf
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://ajubuntu:3000/categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Fehler beim Laden der Kategorien", err);
      }
    };

    fetchCategories(); // Nur wenn der Server erfolgreich antwortet, Kategorien setzen

  }, []);

  // Formular absenden (mit Bild und Kategorien)
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
    formData.append("categoryIds", JSON.stringify(selectedCategories)); // Ausgewählte Kategorien als JSON im FormData mitsenden

    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch("http://ajubuntu:3000/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Erstellen");

      // Erfolgsnachricht und Formularfelder zurücksetzen
      setSuccess("Rezept erfolgreich erstellt!");
      setTitle("");
      setIngredients("");
      setInstructions("");
      setImage(null);

      // Weiterleitung nach "Meine Rezepte"
      setTimeout(() => navigate("/me"), 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Neues Rezept erstellen</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
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

        <div className="mb-3">
          <label className="form-label">Bild (optional)</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Mehrfachauswahl für Kategorien */}
        <div className="mb-3">
          <label htmlFor="categories" className="form-label">
            Kategorien
          </label>
          <select
            multiple
            className="form-select"
            id="categories"
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
          Rezept speichern
        </button>
      </form>
    </div>
  );
};

export default CreateRecipe;
