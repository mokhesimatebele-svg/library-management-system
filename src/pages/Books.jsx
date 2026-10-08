import { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState(() => {
    const savedBooks = localStorage.getItem("libraryBooks");
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [isbn, setIsbn] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!title || !author || !genre || !isbn || !quantity) {
      setError("Please complete all book details.");
      return;
    }

    if (Number(quantity) < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    const duplicateISBN = books.some(
      (book) => book.isbn === isbn && book.id !== editId
    );

    if (duplicateISBN) {
      setError("A book with this ISBN already exists.");
      return;
    }

    if (editId) {
      const updatedBooks = books.map((book) =>
        book.id === editId
          ? {
              ...book,
              title,
              author,
              genre,
              isbn,
              quantity: Number(quantity),
            }
          : book
      );

      setBooks(updatedBooks);
      setEditId(null);
    } else {
      const newBook = {
        id: Date.now(),
        title,
        author,
        genre,
        isbn,
        quantity: Number(quantity),
      };

      setBooks([...books, newBook]);
    }

    clearForm();
  }

  function handleEdit(book) {
    setTitle(book.title);
    setAuthor(book.author);
    setGenre(book.genre);
    setIsbn(book.isbn);
    setQuantity(book.quantity);
    setEditId(book.id);
    setError("");
  }

  function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (confirmDelete) {
      setBooks(books.filter((book) => book.id !== id));
    }
  }

  function clearForm() {
    setTitle("");
    setAuthor("");
    setGenre("");
    setIsbn("");
    setQuantity("");
    setError("");
  }

  function cancelEdit() {
    setEditId(null);
    clearForm();
  }

  return (
    <div className="books-page">

      <div className="page-heading">
        <div>
          <h1>Books</h1>
          <p>Add and manage books in the library.</p>
        </div>

        <div className="book-count">
          <span>TOTAL BOOKS</span>
          <strong>{books.length}</strong>
        </div>
      </div>

      <div className="books-layout">

        <section className="book-form-panel">
          <h2>{editId ? "Update Book" : "Add New Book"}</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Book title"
              />
            </div>

            <div className="form-group">
              <label>Author</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Author"
              />
            </div>

            <div className="form-group">
              <label>Genre</label>
              <input
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="Genre"
              />
            </div>

            <div className="form-group">
              <label>ISBN</label>
              <input
                type="text"
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                placeholder="ISBN"
              />
            </div>

            <div className="form-group">
              <label>Initial Quantity</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Quantity"
              />
            </div>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="add-book-button">
              {editId ? "Save Changes" : "Add Book"}
            </button>

            {editId && (
              <button
                type="button"
                className="cancel-button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}

          </form>
        </section>

        <section className="book-list-panel">

          <h2>Book List</h2>

          {books.length === 0 ? (
            <div className="books-empty">
              <p>No books have been added yet.</p>
            </div>
          ) : (
            <div className="book-table-wrapper">

              <table className="book-table">

                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Genre</th>
                    <th>ISBN</th>
                    <th>Qty</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>

                      <td>{book.title}</td>
                      <td>{book.author}</td>
                      <td>{book.genre}</td>
                      <td>{book.isbn}</td>

                      <td>
                        <span
                          className={
                            book.quantity < 2
                              ? "stock-low"
                              : "stock-good"
                          }
                        >
                          {book.quantity}
                        </span>
                      </td>

                      <td className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() => handleEdit(book)}
                        >
                          Update
                        </button>

                        <button
                          className="delete-button"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>
                  ))}
                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>

    </div>
  );
}

export default Books;