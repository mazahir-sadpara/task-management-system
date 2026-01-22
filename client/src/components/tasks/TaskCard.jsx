const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>

      <div className="text-sm mt-2">
        <span>Status: {task.status}</span><br />
        <span>Priority: {task.priority}</span>
      </div>

      <div className="flex gap-3 mt-3">
        <button
          onClick={() => onEdit(task)}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
