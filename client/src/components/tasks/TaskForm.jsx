import { useEffect, useState } from "react";

const emptyTask = {
  title: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  dueDate: "",
};

const TaskForm = ({ initialData, onSubmit, onCancel }) => {
  const [task, setTask] = useState(emptyTask);

  useEffect(() => {
    if (initialData) {
      setTask(initialData);
    } else {
      setTask(emptyTask);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(task);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        required
        value={task.title}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <textarea
        name="description"
        placeholder="Description"
        value={task.description}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <select
        name="status"
        value={task.status}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option>Todo</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <select
        name="priority"
        value={task.priority}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <input
        type="date"
        name="dueDate"
        value={task.dueDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
      />

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Save
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
