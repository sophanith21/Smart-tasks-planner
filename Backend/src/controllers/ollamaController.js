import axios from "axios";

export async function getSuggestion(req, res) {
  try {
    const userPrompt = req.body.prompt;
    console.log("userPrompt:", userPrompt);
    const prompt = `
        You are an API. Respond ONLY with valid JSON in this format:
        {
            "result":{ 
                suggestion:[
                    {"taskId": ..., "suggested_time": "YYYY-MM-DDTHH:MM"}
                ],
                "title":...,
                "description":...,
                "reason":...,
            } 
        }
        No extra text.

        Analyze the schedule and tasks below and assign the best times to start doing those task, title (Suggestion title), description(keep it short) and reason .
        NOTE: If the provided schedule has time slots that are missing days (Monday, etc), it means the time slot at that day is "Free Time"

        Your goal is to find the best possible time to schedule each task. The ideal 'suggested_time' is one that is:
        1. Before the task's deadline.
        2. As soon as possible, but not in the past.
        3. Fits reasonably within the user's existing schedule without causing conflicts.

        If you cannot find a time that meets these criteria, it's better to return 'null' for the 'suggested_time' than to suggest a time that is after the deadline.

        The current date is ${new Date().toISOString()}.

        Here is the input:
        ${JSON.stringify(userPrompt)}

        
    `;

    const response = await axios.post(
      "http://localhost:11434/api/generate",
      {
        model: "llama3",
        prompt: prompt,
        stream: false,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    const generatedText = response.data.response;

    try {
      const parsed = JSON.parse(generatedText);
      console.log(parsed);
      res.json(parsed);
    } catch (err) {
      console.error("Failed JSON parse:", err);
      res
        .status(500)
        .json({ error: "Invalid JSON response from the AI model." });
    }
  } catch (err) {
    console.error("Error:", err.message || err);
    res.status(500).json({ error: "Failed to get response from Ollama" });
  }
}
