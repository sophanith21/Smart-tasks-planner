import { useState } from "react";
import circle from "../../assets/circle.svg";
import { formatDistanceToNow } from "date-fns";
import DatePicker from "react-datepicker";
import api from "../../api/api";

export default function Suggestion({
  suggest,
  setSuggestion,
  data,
  setIsSuggestButtonClick,
  current,
  softRefresh,
}) {
  const handleTasksUpdate = async () => {
    try {
      const result = await Promise.all(
        data.map((e, index) => {
          const updateField = {
            suggested_time: suggest.suggestion[index].suggested_time,
          };
          return api.patch(`/tasks/${e.id}`, { updateField });
        })
      );
      setIsSuggestButtonClick(false);
      if (current == "history") {
        const deleted_suggestion = await api.delete(
          `/history/${suggest.suggestion[0].SuggestionId}`
        );
        console.log(deleted_suggestion.data);
      }

      console.log(result.data);
    } catch (err) {
      console.error(err);
    } finally {
      softRefresh();
    }
  };

  const handleSaveSuggestion = async () => {
    setIsSuggestButtonClick(false);
    try {
      const result = await api.post("/history", suggest);
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="fixed z-5 w-full h-full bg-transparent inset-0">
        <div className="p-5 inset-5 fixed bg-white z-100 rounded-2xl justify-self-center w-fit ml-10 mr-10 flex flex-col h-fit">
          <div className="flex justify-between">
            <h1 className="grow">
              <input value={suggest.title} />
            </h1>
            {current != "history" ? (
              <button
                type="button"
                className=" active:scale-95 flex pl-7 pr-7 pt-2 pb-2 rounded-2xl border-4 border-black w-fit h-10 text-black justify-center items-center "
                onClick={handleSaveSuggestion}
              >
                <span className="text-[1rem]">Save for later</span>
              </button>
            ) : (
              <button
                type="button"
                className=" active:scale-95 rounded-[50%] border-4 border-black text-black p-2 w-10 h-10 flex items-center justify-center"
                onClick={() => setIsSuggestButtonClick(false)}
              >
                X
              </button>
            )}
          </div>

          <section className="flex-1 flex flex-col gap-5 overflow-y-auto my-4 ">
            {suggest.suggestion.map((s, index) => {
              const task = data.find((t) => t.id === (s.TaskId ?? s.taskId));
              if (!task) return null;

              return (
                <Task
                  key={index}
                  data={task}
                  suggest={s}
                  setSuggestion={setSuggestion}
                  current={current}
                />
              );
            })}
            <span className=" text-black h-fit">Reason: {suggest.reason}</span>
          </section>
          <section className="flex m-2 justify-evenly">
            <button
              type="button"
              className="bg-black pl-4 pr-4 pb-2 pt-2 rounded-[0.5rem] active:scale-95"
              onClick={() => handleTasksUpdate()}
            >
              Accept
            </button>
            {current != "history" && (
              <button
                type="button"
                className="border-black border-4 text-black pl-4 pr-4 pb-2 pt-2 rounded-[0.5rem] active:scale-95"
                onClick={() => setIsSuggestButtonClick(false)}
              >
                Reject
              </button>
            )}
          </section>
        </div>
      </div>
    </>
  );
}

function Task({ data, suggest, setSuggestion, current }) {
  const [datePickerState, setDatePickerState] = useState();
  let TaskId = suggest.taskId ?? suggest.TaskId;

  const updateTaskDeadline = async (taskId, newDate) => {
    if (current == "history") {
      setSuggestion((prev) => ({
        suggestion: prev.suggestion.map((task) =>
          task.TaskId === taskId ? { ...task, suggested_time: newDate } : task
        ),
        title: prev.title,
        description: prev.description,
      }));
      try {
        const result = await api.patch(`/history/${suggest.id}`, {
          suggested_time: newDate,
        });
        console.log(result.data);
      } catch (err) {
        console.error(err);
      }
    } else {
      setSuggestion((prev) => ({
        suggestion: prev.suggestion.map((task) =>
          task.taskId === taskId ? { ...task, suggested_time: newDate } : task
        ),
        title: prev.title,
        description: prev.description,
      }));
    }
  };

  function handleDateChanging() {
    if (!data.is_complete) {
      setDatePickerState((prev) => !prev);
    }
  }

  return (
    <div
      className={data.is_complete ? "task-completed" : "task"}
      id={data.is_important ? "important" : ""}
    >
      <div className="task-left">
        <img src={circle} alt="Done" />
        <div className="task-text">
          <input name="title" type="text" value={data.title} readOnly />
          <textarea name="description" value={data.description} readOnly />
        </div>
      </div>
      <div className="task-right">
        <div>
          <h3
            className="font-bold"
            style={{
              color:
                data.deadline && new Date(data.deadline) < new Date()
                  ? "red"
                  : "black",
            }}
          >
            {data.deadline
              ? formatDistanceToNow(new Date(data.deadline), {
                  addSuffix: true,
                })
              : "No suggestion"}
          </h3>
        </div>
        <div>
          <h3 className=" text-[#696969]" onClick={handleDateChanging}>
            {!datePickerState &&
              (suggest.suggested_time
                ? formatDistanceToNow(new Date(suggest.suggested_time), {
                    addSuffix: true,
                  })
                : "No suggestion")}
          </h3>
          <h3>
            {datePickerState && (
              <DatePicker
                name="deadline"
                showTimeSelect
                selected={
                  suggest.suggested_time
                    ? new Date(suggest.suggested_time)
                    : null
                }
                onChange={(e) => updateTaskDeadline(TaskId, e.toISOString())}
                onClickOutside={() => setDatePickerState(false)}
                onSelect={() => setDatePickerState(false)}
              />
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}
