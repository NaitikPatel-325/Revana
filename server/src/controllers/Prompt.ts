import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

type Comment = string | { text: string };

function extractCommentText(comments: Comment[]): string {
  return comments
    .map((comment) => (typeof comment === "string" ? comment : comment.text))
    .join("\n");
}

export async function generateCommentsDescription(
  positiveComments: Comment[],
  negativeComments: Comment[]
): Promise<{ Pd: string; Nd: string }> {
  try {

    const positiveText = extractCommentText(positiveComments);
    const negativeText = extractCommentText(negativeComments);

    console.log("Positive Text:", positiveText);
    console.log("Negative Text:", negativeText);

    const positivePrompt = `Analyze the following positive and neutral comments and generate a brief, insightful description summarizing their overall sentiment:\n\n${positiveText}`;
    const negativePrompt = `Analyze the following negative comments and generate a brief, insightful description summarizing their overall sentiment:\n\n${negativeText}`;

    const [positiveResponse, negativeResponse] = await Promise.all([
      client.chat.completions.create({
        model: "google/gemini-2.0-pro-exp-02-05:free",
        messages: [{ role: "user", content: positivePrompt }],
      }),
      client.chat.completions.create({
        model: "google/gemini-2.0-pro-exp-02-05:free",
        messages: [{ role: "user", content: negativePrompt }],
      }),
    ]);

    const pd = positiveResponse.choices[0]?.message?.content ?? "No positive description available.";
    const nd = negativeResponse.choices[0]?.message?.content?.includes("Please provide the negative comments") 
    ? "No negative description available." 
    : negativeResponse.choices[0]?.message?.content ?? "No negative description available.";

    //console.log("Positive Description:", pd);
    //console.log("Negative Description:", nd);

    return {
      Pd: pd,
      Nd: nd,
    };
  } catch (error) {
    console.error("Error generating descriptions:", error);
    return {
      Pd: "Error generating positive description.",
      Nd: "Error generating negative description.",
    };
  }
}
