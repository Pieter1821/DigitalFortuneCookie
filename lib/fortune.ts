"use server"

import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export interface FortuneData {
  message: string
  interpretation: string
  luckyNumbers: string
  luckyColor: string
  luckyElement: string
  timeframe: string
}

export async function getFortune(): Promise<FortuneData> {
  try {
    const { text } = await generateText({
      model: groq("llama-3.1-8b-instant"),
      prompt: `Generate a detailed fortune cookie response in JSON format with the following fields:
      1. message: A short, insightful fortune cookie message (under 100 characters)
      2. interpretation: A brief explanation of what this fortune means (1-2 sentences)
      3. luckyNumbers: 3-5 lucky numbers separated by commas
      4. luckyColor: A color that will bring good fortune
      5. luckyElement: One of the five Chinese elements (Wood, Fire, Earth, Metal, Water)
      6. timeframe: When this fortune is most relevant (e.g., "Coming week", "Next month", "This season")
      
      Make the fortune sound authentic, mystical and positive. Format the response as valid JSON.`,
      temperature: 0.8,
      maxTokens: 500,
    })

    // Parse the JSON response
    try {
      // Extract JSON from the text (in case there's any extra text)
      const jsonMatch = text.match(/\{[\s\S]*\}/)
      const jsonString = jsonMatch ? jsonMatch[0] : text

      const parsedFortune = JSON.parse(jsonString)

      return {
        message: parsedFortune.message || "The path to wisdom begins with a single step.",
        interpretation:
          parsedFortune.interpretation ||
          "Your journey toward understanding is just beginning. Each decision you make now will shape your future.",
        luckyNumbers: parsedFortune.luckyNumbers || "3, 7, 9",
        luckyColor: parsedFortune.luckyColor || "Red",
        luckyElement: parsedFortune.luckyElement || "Fire",
        timeframe: parsedFortune.timeframe || "Coming days",
      }
    } catch (parseError) {
      console.error("Error parsing fortune JSON:", parseError)

      // Fallback fortune if parsing fails
      return {
        message: "Fortune favors the prepared mind.",
        interpretation:
          "Success will come to those who are ready for opportunity. Stay vigilant and open to possibilities.",
        luckyNumbers: "8, 12, 24",
        luckyColor: "Gold",
        luckyElement: "Metal",
        timeframe: "This month",
      }
    }
  } catch (error) {
    console.error("Error generating fortune:", error)
    throw new Error("Failed to generate fortune")
  }
}
