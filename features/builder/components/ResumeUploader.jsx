import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export default function ResumeUploader({ files, onChange }) {

  const handleFileChange = (e) => {
    const fileList = e?.target?.files;
    if (fileList?.length === 0) return;
    const fileArray = Array.from(fileList);
    onChange(fileArray);
  }

  if (files?.length > 0) return (
    <div>
      {
        files?.map((file, i) => (
          <p>{file?.name}</p>
        ))
      }
    </div>
  )
  return (
    <Button
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleFileChange}
        multiple
      />
    </Button>
  );
}