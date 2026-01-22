import TaskCard from "./TaskCard";

const TaskList = ({ tasks }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No tasks found
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default TaskList;
