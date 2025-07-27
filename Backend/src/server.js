import e from "express";
import axios from "axios";
import CORS from "cors";
import taskRouter from "./routes/Tasks.js";
import weeklyScheduleRouter from "./routes/WeeklySchedule.js";
import historyRouter from "./routes/History.js";
import ollamaRouter from "./routes/ollama.js";
import authMiddleware from "./midldewares/authMiddleware.js";

const app = e();

app.use(CORS());
app.use(e.json());
app.use(authMiddleware);

app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  console.log(method, path);
  next();
});

app.use("/api/", taskRouter);
app.use("/api/", weeklyScheduleRouter);
app.use("/api/", historyRouter);

app.use("/api/", ollamaRouter);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running in http://localhost:3000");
});
