import OpenAI from "openai";

const client = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

// features/builder/services/openAiMainService.js

// features/builder/services/openAiMainService.js

const SYSTEM_PROMPT = `You are an expert resume writer. Your job is to tailor a candidate's existing resume to a specific job description — NOT to shorten or simplify it.

STRICT RULES:
1. Preserve ALL experience entries, ALL education entries, and ALL skills from the original resume. Do not drop any job, degree, or skill unless it is clearly irrelevant filler (e.g. unrelated hobbies).
2. Preserve ALL bullet points under each role unless a bullet is genuinely redundant with another bullet in the same role. When in doubt, keep it.
3. Preserve specific details: numbers, metrics, percentages, tool/technology names, company names, and outcomes. Never generalize a specific achievement into a vague statement.
4. You MAY reorder bullets and experience entries to put the most job-relevant items first.
5. You MAY rephrase bullets to better match the job description's language and keywords — but the underlying fact, scope, and detail level must stay the same or richer, never reduced.
6. You MAY tighten wordy phrasing for clarity, but do not cut content just to make bullets shorter. There is no length limit on bullets — a detailed, specific bullet is better than a short, vague one.
7. Only use information present in the original resume. Never invent experience, skills, metrics, or credentials that aren't there.

Also include a "changes" array summarizing what you changed and why (e.g. "Reordered skills to highlight React and Node.js first, matching the job's tech stack"). Do not list omissions as changes, since nothing should be omitted.

Return ONLY valid JSON matching this schema, no markdown, no commentary, no trailing commas:

{
  "name": string,
  "title": string,
  "summary": string,
  "experience": [{ "company": string, "role": string, "dates": string, "bullets": string[] }],
  "skills": string[],
  "education": [{ "school": string, "degree": string, "dates": string }],
  "changes": string[]
}`;

// features/builder/services/openAiMainService.js

const MAX_RETRIES = 2; // slightly higher, since 503s are often brief

export const generateTailerdResume = async ({ resumeText, jobDescription }) => {
    let lastError;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
            const completion = await client.chat.completions.create({
                model: "gemini-3.5-flash",
                temperature: 0.3,
                max_tokens: 6000,
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: `RESUME:\n${resumeText}\n\nJOB DESCRIPTION:\n${jobDescription}` },
                ],
            });

            const rawContent = completion.choices[0]?.message?.content;

            try {
                return JSON.parse(rawContent);
            } catch (parseError) {
                console.error(`JSON parse failed (attempt ${attempt + 1}):`, parseError.message);
                lastError = parseError;
                continue;
            }
        } catch (apiError) {
            console.error(`API call failed (attempt ${attempt + 1}):`, apiError?.status, apiError?.message);

            if (apiError?.status === 404) {
                throw new Error("The AI model is currently unavailable. Please contact support.");
            }
            if (apiError?.status === 429) {
                throw new Error("Too many requests right now — please wait a minute and try again.");
            }
            if (apiError?.status === 503) {
                lastError = apiError;
                if (attempt < MAX_RETRIES) {
                    await new Promise((resolve) => setTimeout(resolve, 1500 * (attempt + 1))); // brief backoff
                    continue; // retry
                }
                throw new Error("The AI service is temporarily overloaded. Please try again in a moment.");
            }

            lastError = apiError;
            continue;
        }
    }

    throw new Error("Failed to generate a valid resume after multiple attempts. Please try again.");
};