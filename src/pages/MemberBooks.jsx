import { useEffect, useState } from "react";

function MemberBooks({ currentUser }) {
  const [books, setBooks] = useState(() =>
    JSON.parse(localStorage.getItem("libraryBooks")) || []
  );

  const [transactions, setTransactions] = useState(() =>
    JSON.parse(localStorage.getItem("libraryTransactions")) || []
  );

  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [sort, setSort] = useState("AZ");
  const [message, setMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(
      "libraryTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  const genres = [
    "All",
    ...new Set(books.map((book) => book.genre).filter(Boolean)),
  ];

  const filteredBooks = books
    .filter((book) => {
      const searchText = search.trim().toLowerCase();

      const matchesSearch = [
        book.title,
        book.author,
        book.genre,
        book.isbn,
      ].some((value) =>
        String(value || "").toLowerCase().includes(searchText)
      );

      const matchesGenre =
        genre === "All" || book.genre === genre;

      const matchesAvailability =
        availability === "All" ||
        (availability === "Available" &&
          Number(book.quantity) > 0) ||
        (availability === "Unavailable" &&
          Number(book.quantity) === 0);

      return (
        matchesSearch &&
        matchesGenre &&
        matchesAvailability
      );
    })
    .sort((a, b) => {
      if (sort === "ZA") {
        return b.title.localeCompare(a.title);
      }

      return a.title.localeCompare(b.title);
    });

  const myBorrowedBooks = transactions.filter(
    (transaction) =>
      transaction.memberId === currentUser.membershipId &&
      transaction.type === "Borrow Book"
  );

  function borrowBook(book) {
    if (Number(book.quantity) < 1) {
      setMessage("This book is currently unavailable.");
      return;
    }

    const alreadyBorrowed = myBorrowedBooks.some(
      (transaction) =>
        String(transaction.bookId) === String(book.id) &&
        !transaction.returned
    );

    if (alreadyBorrowed) {
      setMessage("You have already borrowed this book.");
      return;
    }

    const updatedBooks = books.map((item) =>
      String(item.id) === String(book.id)
        ? {
            ...item,
            quantity: Number(item.quantity) - 1,
          }
        : item
    );

    const newTransaction = {
      id: crypto.randomUUID(),
      bookId: book.id,
      bookTitle: book.title,
      memberId: currentUser.membershipId,
      memberName: currentUser.name,
      type: "Borrow Book",
      quantity: 1,
      date: new Date().toLocaleString(),
      returned: false,
    };

    setBooks(updatedBooks);
    setTransactions([newTransaction, ...transactions]);

    setMessage(`You borrowed "${book.title}" successfully.`);
  }

  function returnBook(transaction) {
    if (transaction.returned) {
      return;
    }

    const bookExists = books.some(
      (book) =>
        String(book.id) === String(transaction.bookId)
    );

    if (!bookExists) {
      setMessage("This book is no longer in the collection.");
      return;
    }

    const updatedBooks = books.map((book) =>
      String(book.id) === String(transaction.bookId)
        ? {
            ...book,
            quantity: Number(book.quantity) + 1,
          }
        : book
    );

    const updatedTransactions = transactions.map((item) =>
      item.id === transaction.id
        ? {
            ...item,
            returned: true,
            returnDate: new Date().toLocaleString(),
          }
        : item
    );

    setBooks(updatedBooks);
    setTransactions(updatedTransactions);

    setMessage(`You returned "${transaction.bookTitle}".`);
  }

  function clearFilters() {
    setSearch("");
    setGenre("All");
    setAvailability("All");
    setSort("AZ");
  }

  return (
    <div className="member-books">
      <div className="page-heading">
        <div>
          <h1>Browse Books</h1>
          <p>Search, borrow and return library books.</p>
        </div>
      </div>

      <div className="book-filter-panel">
        <h2>Find a Book</h2>

        <div className="form-group">
          <label>Search Books</label>
          <input
            type="text"
            placeholder="Search title, author, genre or ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="book-filter-grid">
          <div className="form-group">
            <label>Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
            >
              {genres.map((item) => (
                <option key={item} value={item}>
                  {item === "All" ? "All Genres" : item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Availability</label>
            <select
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
            >
              <option value="All">All Books</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sort By</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="AZ">Title: A to Z</option>
              <option value="ZA">Title: Z to A</option>
            </select>
          </div>
        </div>

        <div className="book-filter-footer">
          <p>
            Showing <strong>{filteredBooks.length}</strong> of{" "}
            <strong>{books.length}</strong> books
          </p>

          <button
            type="button"
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </div>

      {message && (
        <p className="member-message">{message}</p>
      )}

      <section className="member-section">
        <h2>Library Books</h2>

        {filteredBooks.length === 0 ? (
          <p>No books match your search.</p>
        ) : (
          <div className="book-table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {filteredBooks.map((book) => (
                  <tr key={book.id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.genre}</td>
                    <td>{book.isbn}</td>
                    <td>{book.quantity}</td>
                    <td>
                      <button
                        type="button"
                        className="member-borrow-button"
                        disabled={Number(book.quantity) < 1}
                        onClick={() => borrowBook(book)}
                      >
                        {Number(book.quantity) < 1
                          ? "Unavailable"
                          : "Borrow"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="member-section">
        <h2>My Borrowed Books</h2>

        {myBorrowedBooks.length === 0 ? (
          <p>You have not borrowed any books yet.</p>
        ) : (
          <div className="book-table-wrapper">
            <table className="book-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Borrowed On</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {myBorrowedBooks.map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.bookTitle}</td>
                    <td>{transaction.date}</td>
                    <td>
                      {transaction.returned
                        ? "Returned"
                        : "Borrowed"}
                    </td>
                    <td>
                      {transaction.returned ? (
                        "Completed"
                      ) : (
                        <button
                          type="button"
                          className="member-return-button"
                          onClick={() => returnBook(transaction)}
                        >
                          Return Book
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default MemberBooks;