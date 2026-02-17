import { GoogleGenerativeAI } from "@google/generative-ai";

// PRO TIP: In a real production app, you should fetch this key from your backend
// or use an environment variable (react-native-dotenv).
// Get your free key at: https://aistudio.google.com/
const GEMINI_API_KEY = "YOUR_GEMINI_API_KEY_HERE";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are 'Divine Assistant', a wise and compassionate theological AI for a Holy Bible app. Answer spiritual questions, provide comfort, and explain Bible verses. If a user asks a question about the world, relate it to spiritual wisdom or Bible principles. Always be respectful and sacred in your tone. Support both English and Telugu languages natively. If you don't know an answer, say you will pray for guidance."
});

export const getAIResponse = async (userPrompt, chatHistory = []) => {
    try {
        if (GEMINI_API_KEY === "YOUR_GEMINI_API_KEY_HERE") {
            return {
                text: "Praise the Lord! To enable my real-time ML wisdom, please add your Gemini API Key in src/services/AIService.js. I am ready to serve you!",
                status: "needs_key"
            };
        }

        const chat = model.startChat({
            history: chatHistory.map(m => ({
                role: m.sender === 'user' ? 'user' : 'model',
                parts: [{ text: m.text }],
            })),
        });

        const result = await chat.sendMessage(userPrompt);
        const response = await result.response;
        return {
            text: response.text(),
            status: "success"
        };
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return {
            text: "I am having trouble connecting to the divine heavens (Network Error). Please check your internet connection.",
            status: "error"
        };
    }
};
