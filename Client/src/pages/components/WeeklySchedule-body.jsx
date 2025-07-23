import { useEffect, useState } from "react";
import api from "../../api/api";

function WeeklyScheduleBody() {
  const [scheduleData, setScheduleData] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  let time = new Date(Date.now()).toLocaleTimeString();
  const tempScheduleRow = {
    time: time.split(":")[0] + ":" + time.split(":")[1],
    day: "Monday",
    content: "Hello Monday!!",
  };

  const handleAddRow = async () => {
    setScheduleData((prev) => [...prev, { ...tempScheduleRow }]);
  };

  useEffect(() => {
    let data;
    const retrieveData = async () => {
      try {
        const result = await api.get("/weekly-schedule");
        data = result.data;
        console.log(data);
        setScheduleData(data);
      } catch (err) {
        console.error(err);
      }
    };
    retrieveData();
  }, []);

  return (
    <>
      <main className="flex flex-col relative grow align-middle">
        {isEdit && (
          <section className="absolute inset-0 bg-amber-50 text-black max-w-3xl min-w-2xl rounded-2xl justify-self-center overflow-y-scroll">
            <div className="flex items-center justify-between sticky top-0 bg-amber-50">
              <h2 className="m-5 flex grow justify-center">
                Table Configuration
              </h2>
              <button
                className="flex items-center justify-center gap-2.5 p-5 border-black border-4 rounded-full w-5 h-5 active:scale-95 "
                type="button"
                onClick={() => setIsEdit(false)}
              >
                <span className="font-bold text-black">X</span>
              </button>
            </div>

            <div className="flex flex-col items-baseline pl-10 pr-10 w-full ">
              {scheduleData?.map((row) => (
                <fieldset className="border-4 rounded-2xl border-black">
                  <input type="text" value={Object.keys(row)[0]} className="" />
                  {row[Object.keys(row)[0]].map((i) => (
                    <div key={i.id}>
                      <select name="day" value={i.day}>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                      </select>
                      <input type="text" value={i.content} />
                    </div>
                  ))}
                </fieldset>
              ))}

              <button
                type="button"
                className="flex items-center gap-2.5 pl-2.5 pr-2.5 pt-2 pb-2 border-black border-4 rounded-2xl active:scale-95 w-full font-bold"
                onClick={handleAddRow}
              >
                New Row
              </button>
            </div>
          </section>
        )}
        <section className="flex justify-between m-4">
          <div className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl ">
            <span>Weekly Schedule</span>
          </div>
          {scheduleData.length != 0 && (
            <button
              type="button"
              className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
              onClick={() => setIsEdit(true)}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7187 30.25L12.1687 25.85C11.8708 25.7354 11.5901 25.5979 11.3266 25.4375C11.063 25.2771 10.8052 25.1052 10.5531 24.9219L6.46249 26.6406L2.68124 20.1094L6.22187 17.4281C6.19895 17.2677 6.18749 17.113 6.18749 16.9641V16.0359C6.18749 15.887 6.19895 15.7323 6.22187 15.5719L2.68124 12.8906L6.46249 6.35938L10.5531 8.07812C10.8052 7.89479 11.0687 7.72292 11.3437 7.5625C11.6187 7.40208 11.8937 7.26458 12.1687 7.15L12.7187 2.75H20.2812L20.8312 7.15C21.1292 7.26458 21.4099 7.40208 21.6734 7.5625C21.937 7.72292 22.1948 7.89479 22.4469 8.07812L26.5375 6.35938L30.3187 12.8906L26.7781 15.5719C26.801 15.7323 26.8125 15.887 26.8125 16.0359V16.9641C26.8125 17.113 26.7896 17.2677 26.7437 17.4281L30.2844 20.1094L26.5031 26.6406L22.4469 24.9219C22.1948 25.1052 21.9312 25.2771 21.6562 25.4375C21.3812 25.5979 21.1062 25.7354 20.8312 25.85L20.2812 30.25H12.7187ZM15.125 27.5H17.8406L18.3219 23.8563C19.0323 23.6729 19.6911 23.4036 20.2984 23.0484C20.9057 22.6932 21.4615 22.2635 21.9656 21.7594L25.3687 23.1688L26.7094 20.8313L23.7531 18.5969C23.8677 18.276 23.9479 17.938 23.9937 17.5828C24.0396 17.2276 24.0625 16.8667 24.0625 16.5C24.0625 16.1333 24.0396 15.7724 23.9937 15.4172C23.9479 15.062 23.8677 14.724 23.7531 14.4031L26.7094 12.1687L25.3687 9.83125L21.9656 11.275C21.4615 10.7479 20.9057 10.3068 20.2984 9.95156C19.6911 9.59635 19.0323 9.32708 18.3219 9.14375L17.875 5.5H15.1594L14.6781 9.14375C13.9677 9.32708 13.3088 9.59635 12.7016 9.95156C12.0943 10.3068 11.5385 10.7365 11.0344 11.2406L7.63124 9.83125L6.29062 12.1687L9.24687 14.3687C9.13229 14.7125 9.05208 15.0562 9.00624 15.4C8.96041 15.7437 8.93749 16.1104 8.93749 16.5C8.93749 16.8667 8.96041 17.2219 9.00624 17.5656C9.05208 17.9094 9.13229 18.2531 9.24687 18.5969L6.29062 20.8313L7.63124 23.1688L11.0344 21.725C11.5385 22.2521 12.0943 22.6932 12.7016 23.0484C13.3088 23.4036 13.9677 23.6729 14.6781 23.8563L15.125 27.5ZM16.5687 21.3125C17.8979 21.3125 19.0323 20.8427 19.9719 19.9031C20.9115 18.9635 21.3812 17.8292 21.3812 16.5C21.3812 15.1708 20.9115 14.0365 19.9719 13.0969C19.0323 12.1573 17.8979 11.6875 16.5687 11.6875C15.2167 11.6875 14.0766 12.1573 13.1484 13.0969C12.2203 14.0365 11.7562 15.1708 11.7562 16.5C11.7562 17.8292 12.2203 18.9635 13.1484 19.9031C14.0766 20.8427 15.2167 21.3125 16.5687 21.3125Z"
                  fill="#FEF7FF"
                />
              </svg>
              <span>Edit the table</span>
            </button>
          )}
        </section>
        <section className="flex justify-center">
          {scheduleData.length != 0 ? (
            <table>
              <thead>
                <th>Time</th>
                <th>Monday</th>
                <th>Tuesday</th>
                <th>Wednesday</th>
                <th>Thursday</th>
                <th>Friday</th>
                <th>Saturday</th>
                <th>Sunday</th>
              </thead>
              <tbody>
                <tr></tr>
              </tbody>
            </table>
          ) : (
            <button
              type="button"
              className="flex items-center gap-2.5 ml-5 mr-5 pl-2.5 pr-2.5 pt-2 pb-2 border-white border-4 rounded-2xl active:scale-95"
              onClick={() => setIsEdit(true)}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 33 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.7187 30.25L12.1687 25.85C11.8708 25.7354 11.5901 25.5979 11.3266 25.4375C11.063 25.2771 10.8052 25.1052 10.5531 24.9219L6.46249 26.6406L2.68124 20.1094L6.22187 17.4281C6.19895 17.2677 6.18749 17.113 6.18749 16.9641V16.0359C6.18749 15.887 6.19895 15.7323 6.22187 15.5719L2.68124 12.8906L6.46249 6.35938L10.5531 8.07812C10.8052 7.89479 11.0687 7.72292 11.3437 7.5625C11.6187 7.40208 11.8937 7.26458 12.1687 7.15L12.7187 2.75H20.2812L20.8312 7.15C21.1292 7.26458 21.4099 7.40208 21.6734 7.5625C21.937 7.72292 22.1948 7.89479 22.4469 8.07812L26.5375 6.35938L30.3187 12.8906L26.7781 15.5719C26.801 15.7323 26.8125 15.887 26.8125 16.0359V16.9641C26.8125 17.113 26.7896 17.2677 26.7437 17.4281L30.2844 20.1094L26.5031 26.6406L22.4469 24.9219C22.1948 25.1052 21.9312 25.2771 21.6562 25.4375C21.3812 25.5979 21.1062 25.7354 20.8312 25.85L20.2812 30.25H12.7187ZM15.125 27.5H17.8406L18.3219 23.8563C19.0323 23.6729 19.6911 23.4036 20.2984 23.0484C20.9057 22.6932 21.4615 22.2635 21.9656 21.7594L25.3687 23.1688L26.7094 20.8313L23.7531 18.5969C23.8677 18.276 23.9479 17.938 23.9937 17.5828C24.0396 17.2276 24.0625 16.8667 24.0625 16.5C24.0625 16.1333 24.0396 15.7724 23.9937 15.4172C23.9479 15.062 23.8677 14.724 23.7531 14.4031L26.7094 12.1687L25.3687 9.83125L21.9656 11.275C21.4615 10.7479 20.9057 10.3068 20.2984 9.95156C19.6911 9.59635 19.0323 9.32708 18.3219 9.14375L17.875 5.5H15.1594L14.6781 9.14375C13.9677 9.32708 13.3088 9.59635 12.7016 9.95156C12.0943 10.3068 11.5385 10.7365 11.0344 11.2406L7.63124 9.83125L6.29062 12.1687L9.24687 14.3687C9.13229 14.7125 9.05208 15.0562 9.00624 15.4C8.96041 15.7437 8.93749 16.1104 8.93749 16.5C8.93749 16.8667 8.96041 17.2219 9.00624 17.5656C9.05208 17.9094 9.13229 18.2531 9.24687 18.5969L6.29062 20.8313L7.63124 23.1688L11.0344 21.725C11.5385 22.2521 12.0943 22.6932 12.7016 23.0484C13.3088 23.4036 13.9677 23.6729 14.6781 23.8563L15.125 27.5ZM16.5687 21.3125C17.8979 21.3125 19.0323 20.8427 19.9719 19.9031C20.9115 18.9635 21.3812 17.8292 21.3812 16.5C21.3812 15.1708 20.9115 14.0365 19.9719 13.0969C19.0323 12.1573 17.8979 11.6875 16.5687 11.6875C15.2167 11.6875 14.0766 12.1573 13.1484 13.0969C12.2203 14.0365 11.7562 15.1708 11.7562 16.5C11.7562 17.8292 12.2203 18.9635 13.1484 19.9031C14.0766 20.8427 15.2167 21.3125 16.5687 21.3125Z"
                  fill="#FEF7FF"
                />
              </svg>

              <span>Edit the table</span>
            </button>
          )}
        </section>
      </main>
    </>
  );
}

export default WeeklyScheduleBody;
