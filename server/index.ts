import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { HumanMessage } from "@langchain/core/messages";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const model = new ChatOpenAI({
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;
  const response = await model.invoke([new HumanMessage(message)]);
  res.json({ reply: response.content });
});

app.listen(3001, () => console.log("LangChain server running on port 3001"));
