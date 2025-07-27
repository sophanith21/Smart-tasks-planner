import circle from "../../assets/circle.svg";
import circle_click from "../../assets/circle-click.svg";
import DatePicker from "react-datepicker";
import { useCallback, useEffect, useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import "react-datepicker/dist/react-datepicker.css";
import api from "../../api/api";
import Nav from "./Nav-button";
import Suggestion from "./Suggestion";

export default function Body() {
  //================================== Body's States & Variables ==================================

  const [suggestions, setSuggestions] = useState([]);
  const [suggestion, setSuggestion] = useState();
  const [isSuggestionClick, setIsSuggestionClick] = useState(false);
  const [tasksData, setTasksData] = useState([]);

  const softRefresh = useCallback(() => {
    const retrieveData = async () => {
      try {
        let suggestions = await api.get("/history");
        setSuggestions(suggestions.data);
        console.log(suggestions.data);
      } catch (err) {
        console.error(err);
      }
    };
    retrieveData();
  }, []);

  const handleSuggestionClick = async (id, index) => {
    try {
      const result = await api.get(`/history/${id}`);

      const result_suggestion = result.data;
      const tempData = {
        suggestion: result_suggestion,
        title: suggestions[index].title,
        description: suggestions[index].description,
        reason: suggestions[index].reason,
      };
      setSuggestion(tempData);

      const taskResponses = await Promise.all(
        result_suggestion.map((s) => api.get(`/tasks/${s.TaskId}`))
      );

      const tasksData = taskResponses.map((res) => res.data);
      setTasksData(tasksData);

      setIsSuggestionClick(true);
    } catch (err) {
      console.error(err);
    }
  };

  //================================== useEffects ==================================

  // Retrieving tasks from db

  useEffect(() => {
    softRefresh();
  }, [softRefresh]);

  return (
    <>
      <main className="grow relative">
        {isSuggestionClick && (
          <Suggestion
            suggest={suggestion}
            data={tasksData}
            setIsSuggestButtonClick={setIsSuggestionClick}
            setSuggestion={setSuggestion}
            current="history"
            softRefresh={softRefresh}
          ></Suggestion>
        )}
        <div className="flex items-center w-fit gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl ">
          <span>Suggestion History</span>
        </div>

        <div className="task-container">
          {suggestions?.map((t, index) => (
            <Suggest
              key={t.id}
              data={t}
              setSuggestions={setSuggestions}
              handleSuggestionClick={handleSuggestionClick}
              index={index}
            />
          ))}

          <div className="flex relative items-center justify-between w-full">
            <Nav current="history"></Nav>
          </div>
        </div>
      </main>
    </>
  );
}

//================================== Child Component : Suggest ==================================

function Suggest({ data, setSuggestions, handleSuggestionClick, index }) {
  //================================== Task's Event Handlers ==================================
  const onRemove = async (id) => {
    try {
      const result = await api.delete(`/history/${id}`);
      console.log(result.data);
      setSuggestions(
        (s) => s.filter((item) => item.id !== id) // Remove the task
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger asChild>
        <div
          className="flex flex-col w-full h-full cursor-pointer"
          onClick={() => {
            handleSuggestionClick(data.id, index);
          }}
        >
          <div className="task">
            <div className="task-left">
              <img src={data.is_complete ? circle_click : circle} alt="Done" />
              <div className="task-text">
                <input name="title" type="text" value={data.title} readOnly />
                <textarea
                  name="description"
                  value={data.description}
                  readOnly
                />
              </div>
            </div>
            <div className="task-right">
              <div>
                <h3>
                  {new Date(data.createdAt)
                    .toLocaleDateString("en-CA")
                    .replaceAll("-", "/")}{" "}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </ContextMenu.Trigger>

      <ContextMenu.Content className="context-menu">
        <ContextMenu.Item onSelect={() => onRemove(data.id)}>
          Delete Suggestion
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu.Root>
  );
}
