import { useEffect, useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";

import api from "../../api/api";
import Nav from "./Nav";

export default function WeeklyScheduleBody() {
  const [scheduleData, setScheduleData] = useState([]);
  const tempNewDay = {
    id: null,
    day: "",
    content: "",
    WeeklyScheduleId: 1,
  };

  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const handleNewRow = () => {
    let days = [];
    days.map((day) => {
      days.push({ id: null, day: day, content: "", WeeklyScheduleId: 1 });
    });
    setScheduleData((prev) => [...prev, { "": days }]);
  };

  useEffect(() => {
    let data;
    const retrieveData = async () => {
      try {
        const result = await api.get("/weekly-schedule");
        data = result.data;
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
                  WeeklyScheduleId: 1,
                };
              }
            });
            return { [time]: newRow };
          })
        );
      } catch (err) {
        console.error(err);
      }
    };
    retrieveData();
  }, []);

  return (
    <>
      <main className="flex flex-col grow align-middle">
        <section className="flex justify-between m-4">
          <div className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl ">
            <span>Weekly Schedule</span>
          </div>
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
        </section>
        <section className="flex justify-center">
          <ScheduleTable
            scheduleData={scheduleData}
            setScheduleData={setScheduleData}
            tempNewDay={tempNewDay}
            days={days}
          ></ScheduleTable>
        </section>
        <div className="flex items-center justify-between w-full mb-5 relative">
          <Nav current="weekly-schedule"></Nav>
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
      </main>
    </>
  );
}

function ScheduleTable({ scheduleData, setScheduleData, tempNewDay, days }) {
  const handleRemoveRow = async (time) => {
    console.log(time);
    setScheduleData((prev) =>
      prev.filter((item) => Object.keys(item)[0] !== time)
    );
    try {
      const result = await api.delete(`/weekly-schedule?time=${time}`);
      console.log(result.data);
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

  const handleTimeChange = async (e, index) => {
    const newKey = e.target.value;
    let oldKey;
    let WeeklyScheduleId;
    await setScheduleData((prev) =>
      prev.map((item, oldIndex) => {
        if (oldIndex === index) {
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
