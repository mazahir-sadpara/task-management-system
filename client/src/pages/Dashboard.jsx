import { useEffect, useState } from "react";
import { getTasks } from "../services/tasksApi";
import TaskList from "../components/tasks/TaskList";
import Loader from "../components/common/Loader";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">Task Dashboard</h1>
        <button
          onClick={handleLogout}
          className="text-sm bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      {/* Content */}
      <main className="p-6">
        {loading && <Loader />}

        {error && (
          <p className="text-red-500 text-center">{error}</p>
        )}

        {!loading && !error && <TaskList tasks={tasks} />}
      </main>
    </div>
  );
};

export default Dashboard;
