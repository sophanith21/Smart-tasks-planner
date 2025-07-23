import e from "express";
import axios from "axios";
import CORS from "cors";
import taskRouter from "./routes/Tasks.js";

const app = e();

app.use(CORS());
app.use(e.json());
app.use(e.urlencoded({ extended: true }));

app.use((req, res, next) => {
  const method = req.method;
  const path = req.path;
  console.log(method, path);
  next();
});

app.use("/api/", taskRouter);

app.get("/api/ollama", (req, res) => {
  res.send(`<form method="POST" action="/api/ollama" >
                <input type="text" placeholder="Enter your prompt" name="prompt" value="Hello">
                <button type="submit">Submit</button>
            </form>`);
});

app.post("/api/ollama", async (req, res) => {
  try {
    const userPrompt = req.body.prompt;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt:
          'You are an API. Respond ONLY with valid JSON in this format: {"result": "..."}. Do not include any explanations or text outside the JSON. No greetings.' +
          userPrompt,
      },
      {
        responseType: "stream",
        headers: { "Content-Type": "application/json" },
      }
    );

    let finalResponse = "";

    response.data.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter(Boolean);
      for (const line of lines) {
        const parsed = JSON.parse(line);
        if (parsed.response) finalResponse += parsed.response;
      }
    });

    response.data.on("end", () => {
      console.log(finalResponse);
      let firstParse = JSON.parse(finalResponse);

      console.log(firstParse);
      res.json(firstParse);
    });
  } catch (err) {
    console.error("Error:", err.message || err);
    res.status(500).json({ error: "Failed to get response from Ollama" });
  }
});

app.listen(3000, () => {
  console.log("Server is running in http://localhost:3000");
});
