import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";

import Login from "../src/pages/Login.jsx";
import Dashboard from "../src/pages/Dashboard.jsx";
import NotFound from "../src/pages/NotFound.jsx";
import ProtectedRoute from '../src/routes/ProtectedRoute.jsx'

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Route */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound/>}/>
      </Routes>

    </Router>
  );
};

export default App;
