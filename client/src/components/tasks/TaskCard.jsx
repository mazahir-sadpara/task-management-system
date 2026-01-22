const TaskCard = ({ task, onEdit }) => {
  return (
    <div className="bg-white p-4 rounded-xl border shadow-sm">
      <h3 className="font-semibold">{task.title}</h3>
      <p className="text-sm text-gray-600">{task.description}</p>

      <div className="text-sm mt-2">
        <span>Status: {task.status}</span><br />
        <span>Priority: {task.priority}</span>
      </div>

      <button
        onClick={() => onEdit(task)}
        className="mt-3 text-blue-600 text-sm"
      >
        Edit
      </button>
    </div>
  );
};

export default TaskCard;
