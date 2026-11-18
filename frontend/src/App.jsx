
import { useState, useEffect } from "react";
import Auth from "./Auth";
import "./App.css";

// ADMIN DASHBOARD
function AdminDashboard({ user, token, onLogout }) {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [studentSearch, setStudentSearch] = useState("");
  const [submissionSearch, setSubmissionSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState(null);

  // LOAD SUBMISSIONS
  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/admin/submissions",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Unable to load submissions.");
        return;
      }

      if (!Array.isArray(data)) {
        setError("Invalid submission data received.");
        return;
      }

      setSubmissions(data);
    } catch (err) {
      setError("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadSubmissions();
    }
  }, [token]);

  // STATISTICS
  const validCount = submissions.filter(
    (item) => item.success === true
  ).length;

  const invalidCount = submissions.filter(
    (item) => item.success === false
  ).length;

  const incompleteCount = submissions.filter(
    (item) =>
      typeof item.success !== "boolean" ||
      !item.message ||
      !item.message.trim()
  ).length;

  // GROUP STUDENTS
  const studentGroups = (() => {
    const groups = {};

    submissions.forEach((item) => {
      if (!item.userId) return;

      const studentKey = `user-${item.userId}`;

      if (!groups[studentKey]) {
        groups[studentKey] = {
          id: studentKey,
          name:
            item.registeredName ||
            item.studentName ||
            "Unknown Student",
          email: item.studentEmail || "Not available",
          submissions: []
        };
      }

      if (
        item.studentEmail &&
        item.studentEmail !== "Not available"
      ) {
        groups[studentKey].email = item.studentEmail;
      }

      groups[studentKey].submissions.push(item);
    });

    submissions.forEach((item) => {
      if (item.userId) return;

      const oldName = (item.studentName || "Unknown Student")
        .trim()
        .toLowerCase();

      const matchingGroups = Object.values(groups).filter(
        (group) =>
          group.name.trim().toLowerCase() === oldName
      );

      if (matchingGroups.length === 1) {
        matchingGroups[0].submissions.push(item);
      } else {
        const oldKey = `old-${oldName}`;

        if (!groups[oldKey]) {
          groups[oldKey] = {
            id: oldKey,
            name: item.studentName || "Unknown Student",
            email: "Not available",
            submissions: []
          };
        }

        groups[oldKey].submissions.push(item);
      }
    });

    return Object.values(groups);
  })();

  // STUDENT SEARCH
  const filteredStudents = studentGroups.filter((student) =>
    student.name
      .toLowerCase()
      .includes(studentSearch.toLowerCase())
  );

  // SUBMISSION SEARCH AND FILTER
  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch = (
      item.studentName || ""
    )
      .toLowerCase()
      .includes(submissionSearch.toLowerCase());

    const isIncomplete =
      typeof item.success !== "boolean" ||
      !item.message ||
      !item.message.trim();

    let matchesFilter = true;

    if (filter === "Valid") {
      matchesFilter = item.success === true;
    } else if (filter === "Invalid") {
      matchesFilter = item.success === false;
    } else if (filter === "Incomplete") {
      matchesFilter = isIncomplete;
    }

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="app admin-app">

      {/* NAVBAR */}
      <header className="navbar">
        <h2>
          Code<span>Check</span> Admin
        </h2>

        <div className="user-info">
          <p>
            Welcome, <strong>{user.name}</strong>
          </p>

          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <main className="container">

        {/* WELCOME */}
        <section className="welcome">
          <h1>Admin Dashboard</h1>
          <p>
            Monitor student code submissions and syntax reports.
          </p>
        </section>

        {/* STATISTICS */}
        <section className="admin-stats">

          <div className="stat-card total-stat">
            <p>Total Submissions</p>
            <h2>{loading && submissions.length === 0 ? "..." : submissions.length}</h2>
          </div>

          <div className="stat-card valid-stat">
            <p>Valid Submissions</p>
            <h2>{validCount}</h2>
          </div>

          <div className="stat-card invalid-stat">
            <p>Invalid Submissions</p>
            <h2>{invalidCount}</h2>
          </div>

          <div className="stat-card incomplete-stat">
            <p>Incomplete Records</p>
            <h2>{incompleteCount}</h2>
          </div>

        </section>

        {error && <p className="error admin-error">{error}</p>}

        {/* STUDENT DETAILS */}
        <section className="history-section admin-section">

          <div className="section-heading">
            <div>
              <h2>Student Details</h2>
              <p className="section-subtitle">
                View individual student submission records.
              </p>
            </div>

            <span className="student-count">
              Total Students: {studentGroups.length}
            </span>
          </div>

          {/* STUDENT SEARCH */}
          <div className="search-wrapper">
            <span className="search-icon">⌕</span>
            <input
              type="text"
              placeholder="Search student by name..."
              value={studentSearch}
              onChange={(e) => {
                setStudentSearch(e.target.value);
                setSelectedStudent(null);
              }}
            />
          </div>

          {/* STUDENT GRID */}
          {filteredStudents.length === 0 ? (
            <p className="empty-message">No students found.</p>
          ) : (
            <div className="student-grid">
              {filteredStudents.map((student) => {
                const studentValid = student.submissions.filter(
                  (item) => item.success === true
                ).length;

                const studentInvalid = student.submissions.filter(
                  (item) => item.success === false
                ).length;

                return (
                  <div className="student-card" key={student.id}>

                    <div className="student-card-top">
                      <div className="student-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>

                      <div className="student-name-area">
                        <h3>{student.name}</h3>
                        <p>{student.email}</p>
                      </div>
                    </div>

                    <div className="student-card-stats">
                      <div>
                        <strong>{student.submissions.length}</strong>
                        <span>Total</span>
                      </div>

                      <div>
                        <strong className="green-text">
                          {studentValid}
                        </strong>
                        <span>Valid</span>
                      </div>

                      <div>
                        <strong className="red-text">
                          {studentInvalid}
                        </strong>
                        <span>Invalid</span>
                      </div>
                    </div>

                    <button
                      className="view-details-btn"
                      onClick={() =>
                        setSelectedStudent(
                          selectedStudent?.id === student.id
                            ? null
                            : student
                        )
                      }
                    >
                      {selectedStudent?.id === student.id
                        ? "Hide Details"
                        : "View Details"}
                    </button>

                  </div>
                );
              })}
            </div>
          )}

          {/* SELECTED STUDENT HISTORY */}
          {selectedStudent && (
            <div className="student-history">

              <div className="section-heading">
                <div>
                  <h2>{selectedStudent.name}'s History</h2>
                  <p className="section-subtitle">
                    {selectedStudent.email}
                  </p>
                </div>

                <button
                  className="close-details-btn"
                  onClick={() => setSelectedStudent(null)}
                >
                  Close
                </button>
              </div>

              {selectedStudent.submissions.map((item, index) => (
                <div
                  className="submission-card"
                  key={item._id || `${selectedStudent.id}-${index}`}
                >
                  <div className="submission-top">
                    <strong>{item.studentName}</strong>

                    <span
                      className={
                        item.success === true
                          ? "status-badge valid"
                          : item.success === false
                            ? "status-badge invalid"
                            : "status-badge incomplete"
                      }
                    >
                      {item.success === true
                        ? "Valid"
                        : item.success === false
                          ? "Invalid"
                          : "Incomplete"}
                    </span>
                  </div>

                  <div className="submission-info">
                    <p>
                      <strong>Language:</strong>{" "}
                      {item.language || "Not specified"}
                    </p>

                    <p>
                      <strong>Syntax Report:</strong>{" "}
                      {item.message || "No syntax report available."}
                    </p>

                    <small>
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleString()
                        : "Date unavailable"}
                    </small>
                  </div>

                  <details className="code-details">
                    <summary>View Submitted Code</summary>
                    <pre>{item.code || "No source code available."}</pre>
                  </details>
                </div>
              ))}

            </div>
          )}

        </section>

        {/* ALL SUBMISSIONS */}
        <section className="history-section admin-section">

          <div className="section-heading">
            <div>
              <h2>All Student Submissions</h2>
              <p className="section-subtitle">
                Monitor all submitted C programs and syntax reports.
              </p>
            </div>

            <button
              className="refresh-btn"
              onClick={loadSubmissions}
              disabled={loading}
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>
          </div>

          {/* SEARCH AND FILTER */}
          <div className="admin-controls">

            <div className="search-wrapper submission-search">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search submissions by student name..."
                value={submissionSearch}
                onChange={(e) =>
                  setSubmissionSearch(e.target.value)
                }
              />
            </div>

            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="submission-filter"
            >
              <option value="All">All Submissions</option>
              <option value="Valid">Valid</option>
              <option value="Invalid">Invalid</option>
              <option value="Incomplete">Incomplete</option>
            </select>

          </div>

          <div className="submission-summary">
            Showing <strong>{filteredSubmissions.length}</strong> of{" "}
            <strong>{submissions.length}</strong> submissions
          </div>

          {loading && submissions.length === 0 && (
            <p className="empty-message">Loading submissions...</p>
          )}

          {!loading && filteredSubmissions.length === 0 && (
            <p className="empty-message">
              No matching submissions found.
            </p>
          )}

          {/* SUBMISSION LIST */}
          <div className="submission-list">
            {filteredSubmissions.map((item) => {
              const isValid = item.success === true;
              const isInvalid = item.success === false;

              return (
                <div className="submission-card" key={item._id}>

                  <div className="submission-top">
                    <strong>
                      {item.studentName || "Unknown Student"}
                    </strong>

                    <span
                      className={
                        isValid
                          ? "status-badge valid"
                          : isInvalid
                            ? "status-badge invalid"
                            : "status-badge incomplete"
                      }
                    >
                      {isValid
                        ? "Valid"
                        : isInvalid
                          ? "Invalid"
                          : "Incomplete"}
                    </span>
                  </div>

                  <div className="submission-info">

                    <p>
                      <strong>Language:</strong>{" "}
                      {item.language || "Not specified"}
                    </p>

                    <p>
                      <strong>Syntax Report:</strong>{" "}
                      {item.message
                        ? item.message
                        : "No syntax report available for this old record."}
                    </p>

                    <small>
                      {item.submittedAt
                        ? new Date(item.submittedAt).toLocaleString()
                        : "Date unavailable"}
                    </small>

                  </div>

                  <details className="code-details">
                    <summary>View Submitted Code</summary>
                    <pre>
                      {item.code || "No source code available."}
                    </pre>
                  </details>

                </div>
              );
            })}
          </div>

        </section>
      </main>

      <footer>
        CodeCheck © 2026 | Admin Dashboard
      </footer>
    </div>
  );
}


// STUDENT + APP
function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState("");
  const [studentName, setStudentName] = useState("");
  const [language, setLanguage] = useState("C");
  const [code, setCode] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleLogin = (loggedInUser, authToken) => {
    setUser(loggedInUser);
    setToken(authToken);
    setStudentName(loggedInUser.name);
  };

  const handleLogout = () => {
    setUser(null);
    setToken("");
    setStudentName("");
    setCode("");
    setResult(null);
    setHistory([]);
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/history",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok && Array.isArray(data)) {
        setHistory(data);
      }
    } catch (error) {
      console.log("Unable to load submission history.");
    }
  };

  useEffect(() => {
    if (user && token && user.role === "student") {
      loadHistory();
    }
  }, [user, token]);

  const handleSubmit = async () => {
    if (!code.trim()) {
      setResult({
        success: false,
        message: "Please enter your source code."
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            studentName,
            language,
            code
          })
        }
      );

      const data = await response.json();

      setResult({
        success: response.ok && data.success === true,
        message: data.message || "Validation completed."
      });

      if (response.ok) {
        await loadHistory();
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Unable to connect to the validation server."
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Auth onLogin={handleLogin} />;
  }

  if (user.role === "admin") {
    return (
      <AdminDashboard
        user={user}
        token={token}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <h2>
          Code<span>Check</span>
        </h2>

        <div className="user-info">
          <p>
            Welcome, <strong>{user.name}</strong>
          </p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <main className="container">
        <section className="welcome">
          <h1>Write. Submit. Validate.</h1>
          <p>
            Submit your C program and check its syntax easily.
          </p>
        </section>

        <section className="editor-card">
          <h2>Submit Your Code</h2>

          <label>Student Name</label>
          <input type="text" value={studentName} readOnly />

          <label>Programming Language</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="C">C</option>
          </select>

          <label>Source Code</label>
          <textarea
            placeholder="Write your C program here..."
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows="12"
          />

          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Validating..." : "Submit & Validate"}
          </button>

          {result && (
            <div
              className={`result ${
                result.success ? "success" : "error"
              }`}
            >
              <h3>
                {result.success ? "Syntax Valid" : "Syntax Error"}
              </h3>
              <p>{result.message}</p>
            </div>
          )}
        </section>

        <section className="history-section">
          <h2>My Submission History</h2>

          {history.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            history.map((item) => (
              <div className="history-card" key={item._id}>
                <div className="history-header">
                  <strong>{item.studentName}</strong>

                  <span className={item.success ? "valid" : "invalid"}>
                    {item.success ? "Valid" : "Invalid"}
                  </span>
                </div>

                <p>Language: {item.language}</p>
                <p>{item.message}</p>

                <small>
                  {new Date(item.submittedAt).toLocaleString()}
                </small>
              </div>
            ))
          )}
        </section>
      </main>

      <footer>
        CodeCheck © 2026 | Online Syntax Validation System
      </footer>
    </div>
  );
}

export default App;
