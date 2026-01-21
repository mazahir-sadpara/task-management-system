import axiosInstance from "./axiosInstance";

// GET all tasks
export const getTasks = async () => {
  try {
    const response = await axiosInstance.get("/task");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

// CREATE task
export const createTask = async (taskData) => {
  try {
    const response = await axiosInstance.post("/task", taskData);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

// UPDATE task
export const updateTask = async (id, taskData) => {
  try {
    const response = await axiosInstance.put(`/task/${id}`, taskData);
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

// DELETE task
export const deleteTask = async (id) => {
  try {
    await axiosInstance.delete(`/task/${id}`);
    return id;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};
