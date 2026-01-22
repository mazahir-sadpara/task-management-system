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
    const confirmDelete = window.confirm("Delete this task?");
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
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Task Dashboard</h1>

        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + New Task
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <TaskFilters
        status={statusFilter}
        priority={priorityFilter}
        search={search}
        setStatus={setStatusFilter}
        setPriority={setPriorityFilter}
        setSearch={setSearch}
      />

      <TaskList
        tasks={filteredTasks}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

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
  );
};

export default Dashboard;
