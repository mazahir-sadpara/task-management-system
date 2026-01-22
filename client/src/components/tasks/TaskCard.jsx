const statusColors = {
  Todo: "bg-gray-200 text-gray-800",
  "In Progress": "bg-yellow-200 text-yellow-800",
  Done: "bg-green-200 text-green-800",
};

const priorityColors = {
  Low: "text-green-600",
  Medium: "text-yellow-600",
  High: "text-red-600",
};

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{task.title}</h3>
        <span
          className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}
        >
          {task.status}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-3">{task.description}</p>

      <div className="flex justify-between items-center text-sm">
        <span className={priorityColors[task.priority]}>
          Priority: {task.priority}
        </span>
        <span className="text-gray-500">
          Due: {task.dueDate}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
