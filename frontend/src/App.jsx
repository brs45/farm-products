import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import Home from "./pages/Home";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/api/auth/me", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
        setLoading(false);
      })
      .catch(() => {
        setUser(null);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route
          path="/upload"
          element={user ? <Upload user={user} /> : <Navigate to="/signin" />}
        />
        <Route
          path="/signin"
          element={!user ? <Signin setUser={setUser} /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={!user ? <Signup /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

export default App;
