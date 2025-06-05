// // This is a placeholder for the Gemini AI integration
// // Replace with actual Gemini API implementation when available

// export async function generateAIResponse(message: string): Promise<string> {
//   try {
//     // This is a placeholder response
//     // In a real implementation, you would call the Gemini API here
//     return `AI response to: "${message}"`;

//     // Example implementation with Gemini API:
//     // const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
//     //   method: 'POST',
//     //   headers: {
//     //     'Content-Type': 'application/json',
//     //     'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`
//     //   },
//     //   body: JSON.stringify({
//     //     contents: [{ parts: [{ text: message }] }]
//     //   })
//     // });
//     // const data = await response.json();
//     // return data.candidates[0].content.parts[0].text;
//   } catch (error) {
//     console.error('Error generating AI response:', error);
//     return 'Sorry, I encountered an error processing your request.';
//   }
// }

import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Make sure this is set in your .env
});

export async function generateAIResponse(message: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or 'gpt-3.5-turbo' if you prefer
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
    });

    const reply = response.choices[0]?.message?.content;
    return reply ?? "Sorry, I couldn’t generate a response.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Sorry, I encountered an error processing your request.";
  }
}
