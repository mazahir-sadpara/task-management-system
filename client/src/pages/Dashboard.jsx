import { useEffect, useState, useMemo } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../services/tasksApi";
import TaskList from "../components/tasks/TaskList";
import Modal from "../components/common/Modal";
import TaskForm from "../components/tasks/TaskForm";
import Loader from "../components/common/Loader";
import TaskFilters from "../components/tasks/TaskFilters";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState([]); // ✅ always array
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await getTasks();

        // ✅ SAFETY: handle all API response shapes
        const safeTasks = Array.isArray(response)
          ? response
          : response?.data || [];

        setTasks(safeTasks);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]); // prevent crash
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

  const handleCreate = async (task) => {
    const newTask = await createTask(task);
    setTasks((prev) => [...prev, newTask]);
    closeModal();
  };

  const handleEdit = async (task) => {
    const updated = await updateTask(task.id, task);
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? updated : t))
    );
    closeModal();
  };

  const handleDelete = async (id) => {
    const taskTitle =
      tasks.find((t) => t.id === id)?.title || "this task";

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`
    );
    if (!confirmDelete) return;

    await deleteTask(id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  // ✅ SAFE filtering
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus =
        !statusFilter || task.status === statusFilter;

      const matchPriority =
        !priorityFilter || task.priority === priorityFilter;

      const matchSearch =
        task.title?.toLowerCase().includes(search.toLowerCase());

      return matchStatus && matchPriority && matchSearch;
    });
  }, [tasks, statusFilter, priorityFilter, search]);

  if (loading) return <Loader />;

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress").length;
  const completedTasks = tasks.filter((t) => t.status === "Done").length;
  const todoTasks = tasks.filter((t) => t.status === "Todo").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fadeIn">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
              Task Dashboard
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Manage and track all your tasks in one place
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button 
              onClick={openCreateModal} 
              className="btn-primary w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </button>
            <button 
              onClick={handleLogout} 
              className="btn-secondary w-full sm:w-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <div className="card group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-800">{totalTasks}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Total Tasks</h3>
          </div>

          <div className="card group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-800">{inProgressTasks}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">In Progress</h3>
          </div>

          <div className="card group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-800">{completedTasks}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Completed</h3>
          </div>

          <div className="card group cursor-default">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-gradient-to-br from-gray-500 to-slate-600 rounded-lg shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <span className="text-3xl font-bold text-gray-800">{todoTasks}</span>
            </div>
            <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">To Do</h3>
          </div>
        </div>

        {/* FILTERS */}
        <TaskFilters
          status={statusFilter}
          priority={priorityFilter}
          search={search}
          setStatus={setStatusFilter}
          setPriority={setPriorityFilter}
          setSearch={setSearch}
        />

        {/* TASK LIST */}
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        {/* MODAL */}
        <Modal
          isOpen={isModalOpen}
          title={editingTask ? "Edit Task" : "Create Task"}
          onClose={closeModal}
        >
          <TaskForm
            initialData={editingTask}
            onSubmit={editingTask ? handleEdit : handleCreate}
            onCancel={closeModal}
          />
        </Modal>
      </div>
    </div>
  );
};

export default Dashboard;
