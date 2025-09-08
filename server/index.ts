import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const model = new ChatOpenAI({
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message, persona = "default" } = req.body;

  const systemPrompts: Record<string, string> = {
    default: "You are a helpful assistant.",
    friendly: "You are a cheerful and friendly assistant who loves emojis.",
    sarcastic: "You respond with witty sarcasm and dry humor.",
    teacher: "You explain things clearly like a patient teacher.",
  };

  const systemMessage = new SystemMessage(systemPrompts[persona] || systemPrompts.default);

  try {
    const response = await model.invoke([
      systemMessage,
      new HumanMessage(message),
    ]);
    res.json({ reply: response.content });
  } catch (err) {
    console.error("❌ LangChain error:", err);
    res.status(500).json({ reply: "Something went wrong. Please try again." });
  }
});

app.listen(3001, () => console.log("🚀 LangChain server running on port 3001"));
