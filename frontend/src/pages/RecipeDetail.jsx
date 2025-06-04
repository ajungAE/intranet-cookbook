import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { API } from "../config";


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
  const [isFavorite, setIsFavorite] = useState(false);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Token aus localStorage holen (wenn vorhanden)
  const token = localStorage.getItem("token");

  // User-ID aus dem JWT-Token extrahieren
  const userId = token ? jwtDecode(token).id : null;

  // ================================
  // REZEPT LADEN beim ersten Render
  // ================================
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`${API.RECIPES}/${id}`);
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
        const res = await fetch(`${API.COMMENTS}/${id}`);
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
      const res = await fetch(`${API.FAVORITES}/${recipe.id}`, {
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
      setNewComment(""); // Formular leeren
      setSubmitSuccess("Kommentar wurde gespeichert.");
      await fetchComments(); // Kommentare vollständig neu laden
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  // Rezept als Favorit markieren
  const handleFavorite = async () => {
    if (!token) return;

    try {
      const res = await fetch(`${API.FAVORITES}/${recipe.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Hinzufügen");

      setIsFavorite(true);
    } catch (err) {
      console.error("Fehler beim Speichern des Favoriten:", err.message);
    }
  };

  // Rezept aus Favoriten entfernen
  const handleUnfavorite = async () => {
    try {
      const res = await fetch(`${API.FAVORITES}/${recipe.id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Fehler beim Entfernen");

      setIsFavorite(false); // UI zurücksetzen
    } catch (err) {
      console.error("Fehler beim Entfernen des Favoriten:", err.message);
    }
  };

  // Kommentar löschen
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Diesen Kommentar wirklich löschen?")) return;

    try {
      const res = await fetch(`${API.COMMENTS}/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Fehler beim Löschen");

      setComments((prev) => prev.filter((c) => c.id !== commentId));
    } catch (err) {
      console.error("Fehler beim Löschen:", err.message);
    }
  };

  // Kommentar bearbeiten vorbereiten
  const handleEditClick = (comment) => {
    setEditCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  // Kommentar aktualisieren
  const handleUpdateComment = async (commentId) => {
    try {
      const res = await fetch(`${API.COMMENTS}/${commentId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: editCommentText }),
      });

      if (!res.ok) throw new Error("Fehler beim Aktualisieren");

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId ? { ...c, text: editCommentText } : c
        )
      );
      setEditCommentId(null);
      setEditCommentText("");
    } catch (err) {
      console.error("Fehler beim Bearbeiten:", err.message);
    }
  };

  if (error) return <div className="container mt-5 text-danger">{error}</div>;
  if (!recipe) return <div className="container mt-5">Lade Rezept...</div>;


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
          src={`${API.UPLOADS}/${recipe.image_path}`}
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

      {/* Kategorie */}
      <h5>Kategorien:</h5>
      {recipe.categories && recipe.categories.length > 0 ? (
        <ul className="list-inline">
          {recipe.categories.map((cat, index) => (
            <li
              key={index}
              className="list-inline-item badge bg-secondary me-2"
            >
              {cat}
            </li>
          ))}
        </ul>
      ) : (
        <p>
          <em>Keine Kategorie zugewiesen</em>
        </p>
      )}

      {/* Als Favorit markieren oder entfernen */}
      {token && (
        <button
          onClick={isFavorite ? handleUnfavorite : handleFavorite}
          className={`btn ${
            isFavorite ? "btn-danger" : "btn-outline-success"
          } mb-4`}
        >
          {isFavorite ? "Aus Favoriten entfernen" : "Zu Favoriten hinzufügen"}
        </button>
      )}

      {/* Kommentarliste */}
      <h5 className="mt-4">Kommentare</h5>
      {comments.length === 0 && <p>Keine Kommentare vorhanden.</p>}

      <ul className="list-group mb-4">
        {comments.map((c) => (
          <li key={c.id} className="list-group-item">
            <strong>{c.username}:</strong>{" "}
            {editCommentId === c.id ? (
              <>
                <textarea
                  className="form-control my-2"
                  rows="2"
                  value={editCommentText}
                  onChange={(e) => setEditCommentText(e.target.value)}
                />
                <button
                  className="btn btn-sm btn-success me-2"
                  onClick={() => handleUpdateComment(c.id)}
                >
                  Speichern
                </button>
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={() => setEditCommentId(null)}
                >
                  Abbrechen
                </button>
              </>
            ) : (
              <>
                {c.text}
                <br />
                <small className="text-muted">
                  {new Date(c.created_at).toLocaleString()}
                </small>
                {userId === c.user_id && (
                  <div className="mt-2">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEditClick(c)}
                    >
                      Bearbeiten
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDeleteComment(c.id)}
                    >
                      Löschen
                    </button>
                  </div>
                )}
              </>
            )}
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
