import e from "express";
import CORS from "cors";
import signUpRouter from "./routes/SignUp.js";
import userRouter from "./routes/User..js";
import loginRouter from "./routes/login.js";
import taskRouter from "./routes/Tasks.js";
import weeklyScheduleRouter from "./routes/WeeklySchedule.js";
import historyRouter from "./routes/History.js";
import ollamaRouter from "./routes/ollama.js";
import authMiddleware from "./midldewares/authMiddleware.js";

const app = e();

app.use(CORS());
app.use(e.json());

app.use("/api", signUpRouter);

app.use("/api", loginRouter);

app.use(authMiddleware);

//Logging middleware

app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  console.log(method, path);
  next();
});

app.use("/api/", userRouter);
app.use("/api/", taskRouter);
app.use("/api/", weeklyScheduleRouter);
app.use("/api/", historyRouter);

app.use("/api/", ollamaRouter);

app.listen(3000, "0.0.0.0", () => {
  console.log("Server is running in http://localhost:3000");
});
