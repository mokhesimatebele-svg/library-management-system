import { useEffect, useState } from "react";

function Transactions() {
  const [books, setBooks] = useState(() =>
    JSON.parse(localStorage.getItem("libraryBooks")) || []
  );

  const [users] = useState(() =>
    JSON.parse(localStorage.getItem("libraryUsers")) || []
  );

  const [transactions, setTransactions] = useState(() =>
    JSON.parse(localStorage.getItem("libraryTransactions")) || []
  );

  const [selectedBook, setSelectedBook] = useState("");
  const [selectedMember, setSelectedMember] = useState("");
  const [quantity, setQuantity] = useState("");
  const [type, setType] = useState("Add Stock");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    localStorage.setItem("libraryBooks", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem(
      "libraryTransactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  function showMessage(text, error = false) {
    setMessage(text);
    setIsError(error);
  }

  function handleTransaction(e) {
    e.preventDefault();

    const amount = Number(quantity);

    if (!selectedBook || !Number.isInteger(amount) || amount < 1) {
      showMessage("Select a book and enter a valid quantity.", true);
      return;
    }

    const book = books.find(
      (item) => String(item.id) === selectedBook
    );

    if (!book) {
      showMessage("Book not found.", true);
      return;
    }

    let member = null;

    if (type === "Borrow Book") {
      if (!selectedMember) {
        showMessage("Please select a member.", true);
        return;
      }

      member = users.find(
        (user) => String(user.id) === selectedMember
      );

      if (!member) {
        showMessage("Member not found.", true);
        return;
      }

      if (amount !== 1) {
        showMessage("Borrow one copy per transaction.", true);
        return;
      }

      if (Number(book.quantity) < 1) {
        showMessage("No copies available.", true);
        return;
      }

      const alreadyBorrowed = transactions.some(
        (transaction) =>
          String(transaction.bookId) === String(book.id) &&
          transaction.memberId === member.membershipId &&
          transaction.type === "Borrow Book" &&
          !transaction.returned
      );

      if (alreadyBorrowed) {
        showMessage("This member already borrowed this book.", true);
        return;
      }
    }

    const updatedBooks = books.map((item) =>
      item.id === book.id
        ? {
            ...item,
            quantity:
              type === "Add Stock"
                ? Number(item.quantity) + amount
                : Number(item.quantity) - amount,
          }
        : item
    );

    const newTransaction = {
      id: crypto.randomUUID(),
      bookId: book.id,
      bookTitle: book.title,
      type,
      quantity: amount,
      date: new Date().toLocaleString(),
      memberName: member ? member.name : "",
      memberId: member ? member.membershipId : "",
      returned: false,
    };

    setBooks(updatedBooks);
    setTransactions([newTransaction, ...transactions]);

    setSelectedBook("");
    setSelectedMember("");
    setQuantity("");
    showMessage("Transaction completed successfully.");
  }

  function handleReturn(transaction) {
    if (transaction.returned) {
      showMessage("This book has already been returned.", true);
      return;
    }

    const bookExists = books.some(
      (book) => String(book.id) === String(transaction.bookId)
    );

    if (!bookExists) {
      showMessage("This book no longer exists in the collection.", true);
      return;
    }

    const confirmReturn = window.confirm(
      `Confirm return of "${transaction.bookTitle}" from ${transaction.memberName}?`
    );

    if (!confirmReturn) return;

    const updatedBooks = books.map((book) =>
      String(book.id) === String(transaction.bookId)
        ? {
            ...book,
            quantity:
              Number(book.quantity) + Number(transaction.quantity),
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

    showMessage(`"${transaction.bookTitle}" returned successfully.`);
  }

  return (
    <div className="transactions-page">
      <div className="page-heading">
        <div>
          <h1>Transactions</h1>
          <p>Manage book stock, borrowing and returns.</p>
        </div>
      </div>

      <div className="transaction-layout">
        <section className="transaction-form">
          <h2>New Transaction</h2>

          <form onSubmit={handleTransaction}>
            <div className="form-group">
              <label>Select Book</label>

              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                required
              >
                <option value="">Select a book</option>

                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} ({book.quantity} available)
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Transaction Type</label>

              <select
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setSelectedMember("");
                  setMessage("");
                }}
              >
                <option value="Add Stock">Add Stock</option>
                <option value="Borrow Book">Borrow Book</option>
              </select>
            </div>

            {type === "Borrow Book" && (
              <div className="form-group">
                <label>Select Member</label>

                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  required
                >
                  <option value="">Select member</option>

                  {users
                    .filter((user) => user.role === "Member")
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.membershipId})
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div className="form-group">
              <label>Quantity</label>

              <input
                type="number"
                min="1"
                max={type === "Borrow Book" ? 1 : undefined}
                step="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            {message && (
              <p className={isError ? "form-error" : "transaction-message"}>
                {message}
              </p>
            )}

            <button type="submit" className="add-book-button">
              Save Transaction
            </button>
          </form>
        </section>

        <section className="transaction-history">
          <h2>Transaction History</h2>

          {transactions.length === 0 ? (
            <div className="simple-empty">
              No transactions recorded yet.
            </div>
          ) : (
            <div className="book-table-wrapper">
              <table className="book-table">
                <thead>
                  <tr>
                    <th>Book</th>
                    <th>Transaction</th>
                    <th>Member</th>
                    <th>Quantity</th>
                    <th>Borrowed / Added</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td>{transaction.bookTitle}</td>
                      <td>{transaction.type}</td>

                      <td>
                        {transaction.memberName ||
                          (transaction.type === "Add Stock"
                            ? "Library"
                            : "Not recorded")}
                      </td>

                      <td>{transaction.quantity}</td>
                      <td>{transaction.date}</td>

                      <td>
                        {transaction.type === "Add Stock" ? (
                          <span className="stock-good">
                            Stock Added
                          </span>
                        ) : transaction.returned ? (
                          <span className="stock-good">
                            Returned
                          </span>
                        ) : (
                          <span className="stock-low">
                            Borrowed
                          </span>
                        )}
                      </td>

                      <td>
                        {transaction.type === "Borrow Book" &&
                        !transaction.returned &&
                        transaction.memberId ? (
                          <button
                            type="button"
                            className="member-return-button"
                            onClick={() => handleReturn(transaction)}
                          >
                            Return
                          </button>
                        ) : (
                          "—"
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
    </div>
  );
}

export default Transactions;