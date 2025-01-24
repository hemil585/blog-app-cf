import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Blog from "./pages/Blog";
import Home from "./pages/Home";
import WriteBlog from "./pages/WriteBlog";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const App = () => {
  const { isLoggedIn } = useAuth();
  return (
    <div className="font-quicksand font-light">
      {isLoggedIn && (
        <ProtectedRoute>
          <Navbar />
        </ProtectedRoute>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/blog/:id" element={<Blog />} />
        <Route path="/publish" element={<WriteBlog />} />
      </Routes>
    </div>
  );
};

export default App;
