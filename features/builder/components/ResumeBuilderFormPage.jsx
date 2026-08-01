"use client"
import { Alert, Box, Divider } from '@mui/material'
import React, { useState, useTransition } from 'react'
import ResumeUploader from './ResumeUploader'
import ResumePreview from './ResumePreview'
import { JobDescriptionField } from './JobDescriptionField'
import ActionButton from '@/components/ui/ActionButton'
import { generateResumeAction } from '../actions/generate-resume'

export function ResumeBuilderFormPage() {
  const [files, setFiles] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isPending, startTransition] = useTransition();
  const [newResume,setNewResume] = useState();
  const [error,setError] = useState();

  const handleResumeUpload = (fileArray) => {
    setFiles(fileArray)
  }

  const handleDescriptionChange = (e) => {
    setJobDescription(e.target.value)
  }

  const handleReset = () => {
    setFiles(null);
    setJobDescription("");
  }

  const handleSubmit = () => {
    const formData = new FormData();
    console.log('typeOfFile', typeof files[0])
    formData.append('resumeFile',files[0]);
    formData.append('jobDescription',jobDescription);

    startTransition(async()=>{
      const result = await generateResumeAction(formData);
      console.log('result',result)
      if(result?.error){
        setError(result);
      }else{
        setNewResume(result?.data);
      }
    })
  }

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "baseline",
      flexWrap: { xs: "wrap", sm: "nowrap" },
      gap: "20px",
      padding: "40px 60px",
      width: "100%"
    }}>
      <Box sx={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        width: "50%",
        position:"sticky"
      }}>

        <ResumeUploader onChange={handleResumeUpload} files={files} />
        <JobDescriptionField onChange={handleDescriptionChange} rows={10} value={jobDescription} />
        {/* {error ?? (
          <Alert>{error?.message}</Alert>
        )} */}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          gap: "20px"
        }}>
          <ActionButton variant="text" onClick={handleReset}>Reset</ActionButton>
          <ActionButton variant="contained" onClick={handleSubmit} loading={isPending}>Submit</ActionButton>
        </Box>
      </Box>
      <Divider orientation="vertical" flexItem />
      <ResumePreview data={newResume} onChange={setNewResume}/>
      
    </Box>
  )
}