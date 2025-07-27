import circle from "../../assets/circle.svg";
import circle_click from "../../assets/circle-click.svg";
import task from "../../assets/Add_task.svg";
import chevronDown from "../../assets/Chevron down.svg";
import chevronDown_Dark from "../../assets/Chevron down_black.svg";
import { formatDistanceToNow } from "date-fns";
import DatePicker from "react-datepicker";
import { useCallback, useEffect, useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/api";
import Nav from "./Nav-button";
import Suggestion from "./Suggestion";
import { getAuthUser } from "../../utils/auth";

export default function Body() {
  //================================== Body's States & Variables ==================================

  const [tasksData, setTasksData] = useState([]);
  const [suggestion, setSuggestion] = useState();
  const [isLoading, setIsloading] = useState();

  // UI state for sorting and toggling views
  const [isDataChange, setIsDataChange] = useState(false);
  const [isAllTaskClick, setAllTaskClick] = useState(false);
  const [isSortByDeadline, setIsSortedByDeadline] = useState(false);
  const [isSortedByImportance, setIsSortedByImportance] = useState(false);
  const [isSuggestButtonClick, setIsSuggestButtonClick] = useState(false);

  // Template for a new task
  const [newTaskFormat, setNewTaskFormat] = useState({
    id: null,
    title: "new task",
    description: "description",
    deadline: null,
    suggested_time: null,
    is_complete: false,
    is_important: false,
    UserId: null,
  });

  const softRefresh = useCallback(() => {
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

  const texts = [
    "The more descriptive the better!",
    "I'm not perfect!",
    "You can also modified the suggested time by clicking on them",
  ];

  const getRandomText = () => texts[Math.floor(Math.random() * texts.length)];

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
    let tempData = newTaskFormat;
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
    setIsDataChange((prev) => !prev);
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
    setIsDataChange((prev) => !prev);
  };

  const updateTaskSuggestTime = async (taskId, newDate) => {
    setTasksData((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, suggested_time: newDate } : task
      )
    );
    try {
      let updateField = { deadline: newDate };
      const result = await api.patch(`/tasks/${taskId}`, { updateField });
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
    setIsDataChange((prev) => !prev);
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

  const handleGetTimeSuggestion = async () => {
    setSuggestion(null);
    let prompt = {};
    setIsSuggestButtonClick(true);
    try {
      setIsloading(true);
      const weekly = await api.get("/weekly-schedule");
      prompt.constructedData = weekly.data.constructedData;
      prompt.tasks = tasksData.filter((e) => e.is_complete == false);
      const result = await api.post("/ollama", { prompt });
      setSuggestion(result.data.result);
    } catch (err) {
      console.error(err);
    } finally {
      setIsloading(false);
    }
  };

  //================================== useEffects ==================================

  // Retrieving tasks from db

  useEffect(() => {
    softRefresh();
    const user = getAuthUser();
    setNewTaskFormat((prev) => ({ ...prev, UserId: user.id }));
  }, [softRefresh]);

  // Re-sort whenever the sorting state changes
  useEffect(() => {
    sortTasks(); // Re-sort whenever the sorting state changes
  }, [isSortByDeadline, isSortedByImportance, isDataChange]);

  return (
    <>
      <main className="grow relative">
        {isLoading && (
          <div className="bg-gray-300/70 fixed flex-col inset-0 w-[100vw] h-[100vh] z-1 flex justify-center items-center ">
            <svg
              className="animate-spin"
              width="50"
              height="50"
              viewBox="0 0 40 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M38.0215 22.7912C39.075 23.1234 39.6597 24.2466 39.3276 25.3001L38.8291 26.881L38.1613 28.4931L37.3556 30.0409L36.4181 31.5126L35.3558 32.8969L34.1769 34.1834L32.8904 35.3623L31.5061 36.4245L30.0344 37.3621L28.5641 38.1275C27.5843 38.6375 26.3766 38.2567 25.8666 37.277C25.3565 36.2972 25.7373 35.0895 26.7171 34.5794L28.0325 33.8947L29.2096 33.1448L30.3168 32.2952L31.3458 31.3523L32.2887 30.3233L33.1383 29.2161L33.8882 28.039L34.5327 26.801L35.0668 25.5116L35.5127 24.0973C35.8448 23.0438 36.9681 22.4591 38.0215 22.7912Z"
                fill="black"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M38.1933 18.8674C37.1149 19.1064 36.0469 18.426 35.8078 17.3476L35.4868 15.8998L35.0671 14.5688L34.533 13.2793L33.8886 12.0414L33.1387 10.8643L32.2891 9.75705L31.3462 8.72807L30.3172 7.78518L29.21 6.93556L28.0329 6.18567L26.7949 5.54123L25.5055 5.00714L24.1745 4.58746L22.8119 4.28538L21.4282 4.10321L20.0338 4.04234L18.6395 4.10321L17.2558 4.28538L15.8932 4.58746L14.5622 5.00714L13.2727 5.54124L12.0348 6.18567L10.8577 6.93556L9.75046 7.78519L8.72148 8.72807L7.77859 9.75706L6.92897 10.8643L6.17909 12.0414L5.53464 13.2793L5.00056 14.5687L4.58087 15.8998L4.2788 17.2624L4.09663 18.6461L4.03575 20.0405L4.09662 21.4348L4.2788 22.8185L4.58087 24.181L5.00055 25.5121L5.53464 26.8015L6.17909 28.0395L6.92897 29.2166L7.77859 30.3238L8.72149 31.3528L9.75047 32.2957L10.8577 33.1453L12.0348 33.8952L13.2728 34.5396L14.5621 35.0737L15.8932 35.4934L17.2558 35.7955L18.6395 35.9776L20.1211 36.0423C21.2246 36.0905 22.0801 37.0242 22.0319 38.1277C21.9838 39.2312 21.0501 40.0867 19.9466 40.0385L18.2906 39.9662L16.5605 39.7385L14.857 39.3608L13.1928 38.8361L11.5807 38.1683L10.0329 37.3626L8.56122 36.425L7.17687 35.3628L5.89036 34.1839L4.7115 32.8974L3.64924 31.513L2.71169 30.0414L1.90596 28.4936L1.2382 26.8815L0.713489 25.2173L0.335812 23.5137L0.10805 21.7837L0.0319377 20.0404L0.108055 18.2971L0.335814 16.5671L0.71349 14.8636L1.2382 13.1994L1.90596 11.5873L2.71169 10.0395L3.64924 8.56781L4.7115 7.18346L5.89036 5.89695L7.17687 4.71808L8.56122 3.65583L10.0329 2.71827L11.5807 1.91255L13.1928 1.24479L14.857 0.720075L16.5605 0.3424L18.2906 0.114639L20.0338 0.0385256L21.7771 0.114638L23.5071 0.3424L25.2107 0.720073L26.8749 1.24479L28.487 1.91255L30.0348 2.71827L31.5065 3.65583L32.8908 4.71808L34.1773 5.89695L35.3562 7.18345L36.4184 8.56781L37.356 10.0395L38.1617 11.5873L38.8295 13.1994L39.3542 14.8636L39.713 16.4819C39.952 17.5603 39.2716 18.6283 38.1933 18.8674Z"
                fill="white"
              />
            </svg>
            <h3 className="text-black font-bold">{getRandomText()}</h3>
          </div>
        )}
        {suggestion && isSuggestButtonClick && (
          <Suggestion
            suggest={suggestion}
            data={tasksData.filter((e) =>
              suggestion.suggestion.some((s) => s.taskId === e.id)
            )}
            setIsSuggestButtonClick={setIsSuggestButtonClick}
            setSuggestion={setSuggestion}
            softRefresh={softRefresh}
          ></Suggestion>
        )}
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
              className="w-7"
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
            <ul className="absolute z-1000 top-full left-40  shadow-lg">
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
              updateTaskSuggestTime={updateTaskSuggestTime}
            />
          ))}

          <div className="add-task">
            <button onClick={handleAddNewTask}>
              <img src={task} alt="add-task" />
              <h2>Add new task</h2>
            </button>
          </div>
          <div className="flex relative items-center justify-between w-full">
            <Nav current="tasks"></Nav>
            <button
              type="button"
              className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
              onClick={handleGetTimeSuggestion}
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

export function Task({
  data,
  onEdit,
  updateDeadline,
  onRemove,
  updateTaskSuggestTime,
}) {
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

            <div>
              <h3 className=" text-[#696969]" onClick={handleDateChanging}>
                {!datePickerState &&
                  (data.suggested_time
                    ? formatDistanceToNow(new Date(data.suggested_time), {
                        addSuffix: true,
                      })
                    : "No suggestion")}
              </h3>
              <h3>
                {datePickerState && (
                  <DatePicker
                    name="suggested_time"
                    showTimeSelect
                    selected={
                      data.suggested_time ? new Date(data.suggested_time) : null
                    }
                    onChange={(e) =>
                      updateTaskSuggestTime(data, e.toISOString())
                    }
                    onClickOutside={() => setDatePickerState(false)}
                    onSelect={() => setDatePickerState(false)}
                  />
                )}
              </h3>
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
