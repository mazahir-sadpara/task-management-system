import { useEffect, useState } from "react";
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

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { useMemo } from "react";
import TaskFilters from "../components/tasks/TaskFilters";

const Dashboard = () => {
  const { logout } = useAuth(); // ✅ inside component
  const navigate = useNavigate(); // ✅ inside component

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      const data = await getTasks();
      setTasks(data);
      setLoading(false);
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
    setTasks((prev) => prev.map((t) => (t.id === task.id ? updated : t)));
    closeModal();
  };

  const handleDelete = async (id) => {
    const taskTitle = tasks.find(t => t.id === id)?.title || "this task";
    const confirmDelete = window.confirm(`Are you sure you want to delete "${taskTitle}"? This action cannot be undone.`);
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
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchStatus = !statusFilter || task.status === statusFilter;

      const matchPriority = !priorityFilter || task.priority === priorityFilter;

      const matchSearch = task.title
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchStatus && matchPriority && matchSearch;
    });
  }, [tasks, statusFilter, priorityFilter, search]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
              <p className="text-gray-600">Manage your tasks efficiently</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-gray-50 border border-gray-200 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === "In Progress").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {tasks.filter(t => t.status === "Done").length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <TaskFilters
          status={statusFilter}
          priority={priorityFilter}
          search={search}
          setStatus={setStatusFilter}
          setPriority={setPriorityFilter}
          setSearch={setSearch}
        />

        {/* Tasks Section */}
        <TaskList
          tasks={filteredTasks}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        {/* Modal */}
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
