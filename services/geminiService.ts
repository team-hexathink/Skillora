
import { GoogleGenAI, Type } from "@google/genai";
import type { WorkerProfile, Job } from "../types";

// This is a mock implementation. In a real application, you would make an API call.
// The API key would be handled by the environment as per the instructions.
// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Simulates using the Gemini API to find the best job matches for a worker.
 * @param worker - The worker's profile.
 * @param jobs - A list of all available jobs.
 * @returns A promise that resolves to an array of matched job IDs.
 */
export const findJobMatches = async (worker: WorkerProfile, jobs: Job[]): Promise<number[]> => {
  console.log("Simulating Gemini API call for job matching...");

  const prompt = `
    Based on the following worker profile:
    - Title: ${worker.title}
    - Skills: ${worker.skills.join(', ')}
    - Bio: ${worker.bio}

    And the following list of available jobs:
    ${JSON.stringify(jobs.map(j => ({ id: j.id, title: j.title, description: j.description, skills: j.skills })), null, 2)}

    Analyze the worker's profile against the job descriptions and required skills. 
    Return a JSON object containing a key "matchedJobIds" with an array of the top 3 job IDs that are the best fit.
    The most relevant match should be first in the array.
  `;
  
  // This simulates the structure of a real API call
  // const response = await ai.models.generateContent({
  //   model: "gemini-2.5-flash",
  //   contents: prompt,
  //   config: {
  //     responseMimeType: "application/json",
  //     responseSchema: {
  //       type: Type.OBJECT,
  //       properties: {
  //         matchedJobIds: {
  //           type: Type.ARRAY,
  //           items: {
  //             type: Type.NUMBER,
  //           },
  //         },
  //       },
  //     },
  //   },
  // });
  // const result = JSON.parse(response.text);
  // return result.matchedJobIds;

  // --- MOCK RESPONSE ---
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Mock logic: find jobs where at least two skills match
  const workerSkills = new Set(worker.skills.map(s => s.toLowerCase()));
  const scoredJobs = jobs.map(job => {
    const jobSkills = new Set(job.skills.map(s => s.toLowerCase()));
    const commonSkills = [...workerSkills].filter(skill => jobSkills.has(skill));
    return { id: job.id, score: commonSkills.length };
  });

  scoredJobs.sort((a, b) => b.score - a.score);
  
  const mockResult = {
      matchedJobIds: scoredJobs.slice(0, 3).map(j => j.id)
  };
  
  console.log("Simulated Gemini Response:", mockResult);

  return mockResult.matchedJobIds;
};
