import { OpenAI } from "ai";
import env from env;
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
console.log("API Key: " + process.env.OPENAI_API_KEY);
export default async function handler(req, res) {
  const { messages } = req.body;
  const response = await openai.chat({ messages });
  res.status(200).json({ output: response.output }); // streams supported!
}
