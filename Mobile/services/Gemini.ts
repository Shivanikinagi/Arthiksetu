import { Alert } from 'react-native';

const API_KEY = "AIzaSyBOmRJQ8Q21Ln5FvpHx8sglC6CsyeTqcPA"; // User's Key from ChatbotScreen
const MODEL_NAME = "gemini-1.5-flash";

export const GeminiService = {

    // 1. Text Only Generation (Chatbot, Decoder, Schemes Recommender)
    generateText: async (prompt: string): Promise<string | null> => {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }]
                })
            });

            const data = await response.json();
            if (data.candidates && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
            return null;
        } catch (error) {
            console.error("Gemini Text Error:", error);
            return null;
        }
    },

    // 2. Vision/Image Analysis (Verify Documents)
    analyzeImage: async (base64Image: string, prompt: string): Promise<string | null> => {
        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: prompt },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image
                                }
                            }
                        ]
                    }]
                })
            });

            const data = await response.json();
            if (data.favorites || data.error) {
                console.log("Gemini API Error details:", data.error);
                return null;
            }

            if (data.candidates && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            }
            return null;
        } catch (error) {
            console.error("Gemini Vision Error:", error);
            return null;
        }
    }
};
