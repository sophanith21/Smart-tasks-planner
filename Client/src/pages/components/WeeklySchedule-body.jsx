import { useEffect, useState, useCallback, useMemo } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";

import api from "../../api/api";
import Nav from "./Nav-button";

export default function WeeklyScheduleBody() {
  const [scheduleData, setScheduleData] = useState();
  const [WeeklyScheduleId, setWeeklyScheduleId] = useState();
  const tempNewDay = {
    id: null,
    day: "",
    content: "",
    WeeklyScheduleId,
  };

  const days = useMemo(
    () => [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    []
  );

  const handleNewRow = () => {
    let days = [];
    days.map((day) => {
      days.push({ id: null, day: day, content: "", WeeklyScheduleId: 1 });
    });
    setScheduleData((prev) => [...prev, { "": days }]);
  };

  const retrieveData = useCallback(async () => {
    try {
      const result = await api.get("/weekly-schedule");
      const data = result.data.constructedData;
      setWeeklyScheduleId(result.data.WeeklyScheduleId);
      setScheduleData(
        data.map((timeSlotObj) => {
          const time = Object.keys(timeSlotObj)[0];
          const events = timeSlotObj[time];

          const newRow = days.map((day) => {
            let event = events.find((e) => e?.day === day);
            if (event) {
              return event;
            } else {
              return {
                id: events.length + 1,
                day: day,
                content: "",
                WeeklyScheduleId,
              };
            }
          });
          return { [time]: newRow };
        })
      );
    } catch (err) {
      console.error(err);
    }
  }, [days, WeeklyScheduleId]);

  const handleNewSchedule = async () => {
    try {
      const result = await api.post("/weekly-schedule");
      console.log(result.data);
      retrieveData();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    retrieveData();
  }, [retrieveData]);

  return (
    <>
      <main className="flex flex-col grow align-middle">
        <section className="flex justify-between m-4">
          <div className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl ">
            <span>Weekly Schedule</span>
          </div>
          {scheduleData && (
            <button
              type="button"
              className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
              onClick={handleNewRow}
            >
              <svg
                width="35"
                height="35"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11 17H13V13H17V11H13V7H11V11H7V13H11V17ZM12 22C10.6167 22 9.31667 21.7417 8.1 21.225C6.88333 20.6917 5.825 19.975 4.925 19.075C4.025 18.175 3.30833 17.1167 2.775 15.9C2.25833 14.6833 2 13.3833 2 12C2 10.6167 2.25833 9.31667 2.775 8.1C3.30833 6.88333 4.025 5.825 4.925 4.925C5.825 4.025 6.88333 3.31667 8.1 2.8C9.31667 2.26667 10.6167 2 12 2C13.3833 2 14.6833 2.26667 15.9 2.8C17.1167 3.31667 18.175 4.025 19.075 4.925C19.975 5.825 20.6833 6.88333 21.2 8.1C21.7333 9.31667 22 10.6167 22 12C22 13.3833 21.7333 14.6833 21.2 15.9C20.6833 17.1167 19.975 18.175 19.075 19.075C18.175 19.975 17.1167 20.6917 15.9 21.225C14.6833 21.7417 13.3833 22 12 22ZM12 20C14.2333 20 16.125 19.225 17.675 17.675C19.225 16.125 20 14.2333 20 12C20 9.76667 19.225 7.875 17.675 6.325C16.125 4.775 14.2333 4 12 4C9.76667 4 7.875 4.775 6.325 6.325C4.775 7.875 4 9.76667 4 12C4 14.2333 4.775 16.125 6.325 17.675C7.875 19.225 9.76667 20 12 20Z"
                  fill="#F3F3F3"
                />
              </svg>

              <span>Add row</span>
            </button>
          )}
        </section>
        <section className="flex justify-center">
          {scheduleData ? (
            <ScheduleTable
              scheduleData={scheduleData}
              setScheduleData={setScheduleData}
              tempNewDay={tempNewDay}
              days={days}
              softRefresh={retrieveData}
            ></ScheduleTable>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
              onClick={handleNewSchedule}
            >
              <svg
                width="44"
                height="44"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M32 8H36C37.0609 8 38.0783 8.42143 38.8284 9.17157C39.5786 9.92172 40 10.9391 40 12V40C40 41.0609 39.5786 42.0783 38.8284 42.8284C38.0783 43.5786 37.0609 44 36 44H12C10.9391 44 9.92172 43.5786 9.17157 42.8284C8.42143 42.0783 8 41.0609 8 40V12C8 10.9391 8.42143 9.92172 9.17157 9.17157C9.92172 8.42143 10.9391 8 12 8H16M18 4H30C31.1046 4 32 4.89543 32 6V10C32 11.1046 31.1046 12 30 12H18C16.8954 12 16 11.1046 16 10V6C16 4.89543 16.8954 4 18 4Z"
                  stroke="#F3F3F3"
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>

              <h1>Create a weekly schedule</h1>
            </button>
          )}
        </section>
        <div className="flex items-center justify-between w-full mb-5 relative">
          <Nav current="weekly-schedule"></Nav>
          <div className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-transparent border-4 rounded-2xl "></div>
        </div>
      </main>
    </>
  );
}

function ScheduleTable({
  scheduleData,
  setScheduleData,
  tempNewDay,
  days,
  softRefresh,
}) {
  const handleRemoveRow = async (time) => {
    console.log(time);
    setScheduleData((prev) =>
      prev.filter((item) => Object.keys(item)[0] !== time)
    );
    try {
      const result = await api.delete(`/weekly-schedule/row?time=${time}`);
      console.log(result.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteSchedule = async () => {
    try {
      const result = await api.delete(`/weekly-schedule`);
      console.log(result.data);
      setScheduleData(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleContentChange = async (e, time, rowIndex, scheduleIndex) => {
    const newContent = e.target.value;
    let WeeklyScheduleId;
    let id;
    let day;
    await setScheduleData((prev) => {
      const newSchedule = prev.map((timeSlotObj, i) => {
        if (i !== scheduleIndex) {
          return timeSlotObj;
        }

        const newTimeSlotObj = { ...timeSlotObj };
        const events = newTimeSlotObj[time];
        WeeklyScheduleId = events[0].WeeklyScheduleId;

        const newEvents = events.map((event, j) => {
          if (j !== rowIndex) {
            return event;
          }
          id = event.id;
          day = event.day;
          return { ...event, content: newContent };
        });

        newTimeSlotObj[time] = newEvents;
        return newTimeSlotObj;
      });

      return newSchedule;
    });
    try {
      const result = await api.patch("/weekly-schedule", {
        id: id,
        day,
        time,
        WeeklyScheduleId,
        content: newContent,
      });
      console.log(result.data);
      if (result.data.id) {
        setScheduleData((prev) => {
          const newSchedule = prev.map((timeSlotObj, i) => {
            if (i !== scheduleIndex) {
              return timeSlotObj;
            }

            const newTimeSlotObj = { ...timeSlotObj };
            const events = newTimeSlotObj[time];
            WeeklyScheduleId = events[0].WeeklyScheduleId;

            const newEvents = events.map((event, j) => {
              if (j !== rowIndex) {
                return event;
              }
              return { ...event, id: result.data.id };
            });
            newTimeSlotObj[time] = newEvents;
            return newTimeSlotObj;
          });

          return newSchedule;
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTimeChange = async (e, scheduleIndex) => {
    const newKey = e.target.value;
    let oldKey;
    let WeeklyScheduleId;
    await setScheduleData((prev) =>
      prev.map((item, oldIndex) => {
        if (oldIndex === scheduleIndex) {
          oldKey = Object.keys(item)[0];
          const value = item[oldKey];
          WeeklyScheduleId = value[0].WeeklyScheduleId;

          return { [newKey]: value };
        }
        return item;
      })
    );
    try {
      const result = await api.patch("/weekly-schedule", {
        oldTime: oldKey,
        time: newKey,
        WeeklyScheduleId,
      });

      console.log(result.data);
      if (result.data.id) {
        await softRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="overflow-x-auto mb-5  ml-5 mr-5">
      <table className="table-auto border-gray-300 border-4   bg-black rounded-[0.5rem] border-collapse  lg:w-full md:w-fit ">
        <thead>
          <tr>
            <th className="border p-2 border-gray-300 bg-gray-300 text-black">
              Time
            </th>
            {days.map((day) => (
              <th
                key={day}
                className="border p-2 border-gray-300 bg-gray-300 text-black"
              >
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scheduleData.map((timeSlotObj, index) => {
            const time = Object.keys(timeSlotObj)[0];
            const events = timeSlotObj[time];

            return (
              <tr key={index}>
                <td className="border border-r-4 border-l-4 border-b-4 border-gray-300 p-2 font-bold text-sm">
                  <ContextMenu.Root>
                    <ContextMenu.Trigger asChild>
                      <input
                        type="text"
                        value={time}
                        onChange={(e) => {
                          handleTimeChange(e, index);
                        }}
                        className="!text-white !font-light focus:!text-black"
                      />
                    </ContextMenu.Trigger>
                    <ContextMenu.Content className="context-menu">
                      <ContextMenu.Item onSelect={() => handleRemoveRow(time)}>
                        Delete row
                      </ContextMenu.Item>
                      <ContextMenu.Item onSelect={handleDeleteSchedule}>
                        Delete the schedule
                      </ContextMenu.Item>
                    </ContextMenu.Content>
                  </ContextMenu.Root>
                </td>

                {days.map((day) => {
                  let rowIndex = -1;
                  let event = events.find((e, index) => {
                    if (e?.day === day) {
                      rowIndex = index;
                      return true;
                    }
                    return false;
                  });
                  if (!event) {
                    tempNewDay.day = day;
                    tempNewDay.id = days.length + 1;
                    events.push(tempNewDay);
                    setScheduleData((prev) => {
                      const newSchedule = [...prev];
                      newSchedule[index][time] = events;
                      return newSchedule;
                    });
                    event = tempNewDay;
                    rowIndex = tempNewDay.id - 1;
                  }
                  return (
                    <td
                      key={day}
                      className="border-gray-300 border-b-4 border-r-4 p-2"
                    >
                      {" "}
                      <ContextMenu.Root>
                        <ContextMenu.Trigger asChild>
                          <input
                            type="text"
                            value={event.content}
                            onChange={(e) => {
                              handleContentChange(e, time, rowIndex, index);
                            }}
                            className="!text-white !font-light focus:!text-black !text-sm"
                          />
                        </ContextMenu.Trigger>
                        <ContextMenu.Content className="context-menu">
                          <ContextMenu.Item
                            onSelect={() => handleRemoveRow(time)}
                          >
                            Delete row
                          </ContextMenu.Item>
                          <ContextMenu.Item onSelect={handleDeleteSchedule}>
                            Delete the schedule
                          </ContextMenu.Item>
                        </ContextMenu.Content>
                      </ContextMenu.Root>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
