import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

const RecipeDetail = () => {
  // ID aus der URL extrahieren (/recipes/:id)
  const { id } = useParams();

  // Rezeptdetails, Kommentare und Fehlerzustand als State
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [error, setError] = useState("");

  const [newComment, setNewComment] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  // 🧪 Token aus localStorage holen (wenn vorhanden)
  const token = localStorage.getItem("token");

  // ================================
  // REZEPT LADEN beim ersten Render
  // ================================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`http://ajubuntu:3000/recipes/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Fehler beim Laden");
        setRecipe(data); // Rezeptdaten im State speichern
      } catch (err) {
        setError(err.message); // Fehlertext anzeigen
      }
    };

    fetchRecipe();
  }, [id]); // Abhängig von ID → neu laden, wenn sich die URL ändert

  // =====================================
  // KOMMENTARE LADEN (auch beim Render)
  // =====================================
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`http://ajubuntu:3000/comments/${id}`);
        const data = await res.json();
        setComments(data); // Kommentare in State setzen
      } catch (err) {
        console.error("Fehler beim Laden der Kommentare", err);
      }
    };

    fetchComments();
  }, [id]);

  // Wenn ein Fehler aufgetreten ist → zeige Fehlermeldung
  if (error) {
    return <div className="container mt-5 text-danger">{error}</div>;
  }

  // Wenn noch keine Rezeptdaten geladen wurden → Ladeanzeige
  if (!recipe) {
    return <div className="container mt-5">Lade Rezept...</div>;
  }

  // Kommentar absenden
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");

    if (!newComment.trim()) {
      return setSubmitError("Kommentar darf nicht leer sein.");
    }

    try {
      const res = await fetch(`http://ajubuntu:3000/comments/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: newComment }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Fehler beim Speichern");
      }

      // Kommentar erfolgreich → leeren + neu laden
      setNewComment("");
      setSubmitSuccess("Kommentar wurde gespeichert.");
      setComments((prev) => [...prev, data]); // Optional sofort anzeigen
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  // ===============================
  // Hauptinhalt der Detailseite
  // ===============================
  return (
    <div className="container mt-5">
      {/* Rezepttitel */}
      <h2>{recipe.title}</h2>

      {/* Bild, wenn vorhanden */}
      {recipe.image_path && (
        <img
          src={`http://ajubuntu:3000/${recipe.image_path}`}
          alt={recipe.title}
          className="img-fluid my-3"
        />
      )}

      {/* Zutaten */}
      <h5>Zutaten:</h5>
      <p>{recipe.ingredients}</p>

      {/* Zubereitung */}
      <h5>Zubereitung:</h5>
      <p>{recipe.instructions}</p>

      {/* Kommentarliste */}
      <h5 className="mt-4">Kommentare</h5>
      {comments.length === 0 && <p>Keine Kommentare vorhanden.</p>}

      <ul className="list-group mb-4">
        {comments.map((c) => (
          <li key={c.id} className="list-group-item">
            <strong>{c.username}:</strong> {c.text}
            <br />
            <small className="text-muted">
              {new Date(c.created_at).toLocaleString()}
            </small>
          </li>
        ))}
      </ul>

      {/* Kommentar schreiben */}
      {token ? (
        <form onSubmit={handleCommentSubmit} className="mb-4">
          <div className="mb-3">
            <label htmlFor="comment" className="form-label">
              Kommentar schreiben
            </label>
            <textarea
              id="comment"
              className="form-control"
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
          </div>
          {submitError && (
            <div className="alert alert-danger">{submitError}</div>
          )}
          {submitSuccess && (
            <div className="alert alert-success">{submitSuccess}</div>
          )}
          <button type="submit" className="btn btn-primary">
            Absenden
          </button>
        </form>
      ) : (
        <p>
          <em>
            Bitte <strong>einloggen</strong>, um einen Kommentar zu schreiben.
          </em>
        </p>
      )}
    </div>
  );
};

export default RecipeDetail;
