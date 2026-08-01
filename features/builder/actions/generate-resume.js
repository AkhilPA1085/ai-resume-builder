"use server"

import { generateTailerdResume } from "../services/openAiMainService";
import { parseResumeFile } from "../services/parseResumeFile";


export const generateResumeAction = async(formData)=>{
    const file = formData.get("resumeFile");
    const jobDescription = formData.get("jobDescription");

    if(!file || !jobDescription){
        return {error:"Resume and Job Description is required"}
    }

    try {
        const resumeText = await parseResumeFile(file);
        const taileredResume = await generateTailerdResume({resumeText,jobDescription});
        console.log('resumeText',resumeText)
        return {data:taileredResume}
    } catch (error) {
        console.log('generateResumeActionError',error)
        return { error: error || "Failed to generate Resume" }
    }
}