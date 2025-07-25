import circle from "../../assets/circle.svg";
import circle_click from "../../assets/circle-click.svg";
import task from "../../assets/Add_task.svg";
import chevronDown from "../../assets/Chevron down.svg";
import chevronDown_Dark from "../../assets/Chevron down_black.svg";
import { formatDistanceToNow } from "date-fns";
import DatePicker from "react-datepicker";
import { useEffect, useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/api";
import Nav from "./Nav";

export default function Body() {
  //================================== Body's States & Variables ==================================

  const [tasksData, setTasksData] = useState([]);

  // UI state for sorting and toggling views
  const [isAllTaskClick, setAllTaskClick] = useState(false);
  const [isSortByDeadline, setIsSortedByDeadline] = useState(false);
  const [isSortedByImportance, setIsSortedByImportance] = useState(false);

  // Template for a new task
  const newTask = {
    id: null,
    title: "new task",
    description: "description",
    deadline: null,
    suggested_time: null,
    is_complete: false,
    is_important: false,
    UserId: 1, // change once auth is implemented
  };

  // Style the selected sort in <li>
  const selectedSortStyle = {
    color: "black",
    backgroundColor: "wheat",
    borderRadius: "0.6rem",
  };

  //================================== Body Event Handlers ==================================

  //Add a new task to the list
  const handleAddNewTask = async (e) => {
    e.preventDefault();
    let tempData = newTask;
    try {
      const result = await api.post("/tasks", tempData);
      tempData.id = result.data.id;
      setTasksData([...tasksData, { ...tempData }]);
    } catch (err) {
      console.log(err);
    }
  };

  // Update a task field (e.g., title, description, importance)
  const handleTaskUpdate = async (taskId, updateField) => {
    setTasksData((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updateField } : task
      )
    );
    try {
      const result = await api.patch(`/tasks/${taskId}`, { updateField });

      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Update the deadline for a specific task
  const updateTaskDeadline = async (taskId, newDate) => {
    setTasksData((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, deadline: newDate } : task
      )
    );
    try {
      let updateField = { deadline: newDate };
      const result = await api.patch(`/tasks/${taskId}`, { updateField });
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Remove a task from the list and reassing IDs
  const removeTask = async (taskId) => {
    setTasksData(
      (prevTasks) => prevTasks.filter((item) => item.id !== taskId) // Remove the task
      // Reassign sequential IDs
    );
    try {
      const result = await api.delete(`/tasks/${taskId}`);
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Sort tasks by deadline (earliest first, undefine is also first)
  const sortByDeadline = (tasks) => {
    return tasks.sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline) : new Date(0);
      const dateB = b.deadline ? new Date(b.deadline) : new Date(0);
      return dateA - dateB;
    });
  };

  //Sort tasks by importance
  const sortByImportance = (tasks) => {
    return tasks.sort((a, b) => b.is_important - a.is_important);
  };

  // Apply sorting based on the selected criteria
  const sortTasks = () => {
    let sortedTasks = [...tasksData];
    if (isSortByDeadline) {
      sortedTasks = sortByDeadline(sortedTasks);
    } else if (isSortedByImportance) {
      sortedTasks = sortByImportance(sortedTasks);
    } else {
      sortedTasks = sortedTasks.sort((a, b) => a.id - b.id); // Default sort by id
    }
    setTasksData(sortedTasks);
  };

  //================================== useEffects ==================================

  // Retrieving tasks from db

  useEffect(() => {
    const retrieveData = async () => {
      try {
        let data = await api.get("/tasks");
        setTasksData(data.data);
        console.log(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    retrieveData();
  }, []);

  // Re-sort whenever the sorting state changes
  useEffect(() => {
    sortTasks(); // Re-sort whenever the sorting state changes
  }, [isSortByDeadline, isSortedByImportance]);

  // Store updated task list in localStorage
  useEffect(() => {
    localStorage.setItem("Tasks", JSON.stringify(tasksData));
  }, [tasksData]);

  return (
    <>
      <main className="grow">
        <div className="list-container">
          <button
            className="all-tasks"
            onClick={() => setAllTaskClick((prev) => !prev)}
            style={
              isAllTaskClick
                ? {
                    backgroundColor: "gray",
                    color: "black",
                    border: "0.3rem solid white",
                  }
                : {
                    border: "0.3rem solid white",
                  }
            }
          >
            <h2>
              {(isSortByDeadline && "Deadline") ||
                (isSortedByImportance && "Important") ||
                "Tasks Priority"}
            </h2>
            <img
              src={isAllTaskClick ? chevronDown_Dark : chevronDown}
              alt="drop-down"
              style={
                isAllTaskClick
                  ? {
                      transform: "rotate(180deg)",
                      transition: "transform 0.3s ease",
                    }
                  : {
                      transition: "transform 0.3s ease",
                    }
              }
            />
          </button>
          {isAllTaskClick && (
            <ul
              style={{
                left: "10%",
                top: "25%",
                position: "absolute",
                zIndex: "1000",
                padding: "1rem 2rem",
              }}
            >
              <li
                onClick={() => {
                  setIsSortedByDeadline((prev) => !prev);
                  setIsSortedByImportance(false);
                  setAllTaskClick((prev) => !prev);
                }}
                style={
                  isSortByDeadline ? selectedSortStyle : { color: "black" }
                }
              >
                Sort By Deadline
              </li>
              <li
                onClick={() => {
                  setIsSortedByImportance((prev) => !prev);
                  setIsSortedByDeadline(false);
                  setAllTaskClick((prev) => !prev);
                }}
                style={
                  isSortedByImportance ? selectedSortStyle : { color: "black" }
                }
              >
                Sort By Importance
              </li>
            </ul>
          )}
        </div>

        <div className="task-container">
          {tasksData?.map((t) => (
            <Task
              key={t.id}
              data={t}
              onEdit={handleTaskUpdate}
              updateDeadline={updateTaskDeadline}
              onRemove={removeTask}
            />
          ))}

          <button className="add-task">
            <button onClick={handleAddNewTask}>
              <img src={task} alt="add-task" />
              <h2>Add new task</h2>
            </button>
          </button>
          <div className="flex relative items-center justify-between w-full">
            <Nav current="tasks"></Nav>
            <button
              type="button"
              className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
            >
              <svg
                width="31"
                height="30"
                viewBox="0 0 47 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M29.825 32.0083L32.5084 29.3249L25.4167 22.2333V13.4166H21.5834V23.7666L29.825 32.0083ZM23.5 42.1666C20.8487 42.1666 18.357 41.6635 16.025 40.6572C13.6931 39.651 11.6646 38.2853 9.93962 36.5603C8.21462 34.8353 6.849 32.8069 5.84275 30.4749C4.8365 28.143 4.33337 25.6513 4.33337 22.9999C4.33337 20.3485 4.8365 17.8569 5.84275 15.5249C6.849 13.193 8.21462 11.1645 9.93962 9.4395C11.6646 7.7145 13.6931 6.34888 16.025 5.34263C18.357 4.33638 20.8487 3.83325 23.5 3.83325C26.1514 3.83325 28.6431 4.33638 30.975 5.34263C33.307 6.34888 35.3355 7.7145 37.0605 9.4395C38.7855 11.1645 40.1511 13.193 41.1573 15.5249C42.1636 17.8569 42.6667 20.3485 42.6667 22.9999C42.6667 25.6513 42.1636 28.143 41.1573 30.4749C40.1511 32.8069 38.7855 34.8353 37.0605 36.5603C35.3355 38.2853 33.307 39.651 30.975 40.6572C28.6431 41.6635 26.1514 42.1666 23.5 42.1666ZM23.5 38.3333C27.7487 38.3333 31.3664 36.8399 34.3532 33.853C37.34 30.8662 38.8334 27.2485 38.8334 22.9999C38.8334 18.7513 37.34 15.1336 34.3532 12.1468C31.3664 9.15999 27.7487 7.66659 23.5 7.66659C19.2514 7.66659 15.6337 9.15999 12.6469 12.1468C9.66011 15.1336 8.16671 18.7513 8.16671 22.9999C8.16671 27.2485 9.66011 30.8662 12.6469 33.853C15.6337 36.8399 19.2514 38.3333 23.5 38.3333Z"
                  fill="#FEF7FF"
                />
              </svg>
              <h1>Get time suggestion</h1>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

//================================== Child Component : Task ==================================

function Task({ data, onEdit, updateDeadline, onRemove }) {
  //================================== Task's States & Variables ==================================

  // Task-specific state for UI interactions
  const [datePickerState, setDatePickerState] = useState(false);

  //================================== Task's Event Handlers ==================================

  // Handle date-picker when clicked (if task is not completed)
  function handleDateChanging() {
    if (!data.is_complete) {
      setDatePickerState((prev) => !prev);
    }
  }

  // Handle text input changes (title & description)
  const handleInput = (e) => {
    onEdit(data.id, { [e.target.name]: e.target.value }); // Update state
  };

  // Handle task completion status
  const handleCircleClick = (e) => {
    e.preventDefault();
    onEdit(data.id, { is_complete: !data.is_complete }); // Pass updated value to parent state
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          className={data.is_complete ? "task-completed" : "task"}
          id={data.is_important ? "important" : ""}
        >
          <div className="task-left">
            <img
              src={data.is_complete ? circle_click : circle}
              alt="Done"
              onClick={handleCircleClick}
            />
            <div className="task-text">
              <input
                name="title"
                type="text"
                value={data.title}
                onChange={handleInput}
              />
              <textarea
                name="description"
                value={data.description}
                onChange={handleInput}
              />
            </div>
          </div>
          <div className="task-right">
            <div>
              <h3
                className="font-bold"
                onClick={handleDateChanging}
                style={{
                  color:
                    data.deadline && new Date(data.deadline) < new Date()
                      ? "red"
                      : "black",
                }}
              >
                {!datePickerState &&
                  (data.deadline
                    ? formatDistanceToNow(new Date(data.deadline), {
                        addSuffix: true,
                      })
                    : "No deadline")}
              </h3>
              <h3>
                {datePickerState && !data.is_complete && (
                  <DatePicker
                    name="deadline"
                    showTimeSelect
                    selected={data.deadline ? new Date(data.deadline) : null}
                    onChange={(e) => updateDeadline(data.id, e.toISOString())}
                    onClickOutside={() => setDatePickerState(false)}
                    onSelect={() => setDatePickerState(false)}
                  />
                )}
              </h3>
            </div>
            {/* To be implemented (suggested_time) */}
            <div>
              <h3 className="text-[#696969]">2 days left</h3>
            </div>
          </div>
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Content className="context-menu">
        <ContextMenu.Item
          onSelect={() => onEdit(data.id, { is_important: !data.is_important })}
        >
          {data.is_important ? "Set as Unimportant" : "Set as Important"}
        </ContextMenu.Item>
        <ContextMenu.Item onSelect={() => onRemove(data.id)}>
          Delete Task
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
