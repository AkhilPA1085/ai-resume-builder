import { TextField } from '@mui/material';

export default function Textarea({ onChange, value, rows, label, style }) {
  const textFieldStyle = {
    border: "1px solid #FFFFFF",
    p: 4,
    color:"#fffff",
    ...style
  }
  return (
    <TextField
      aria-label={label}
      placeholder={label}
      style={textFieldStyle}
      onChange={onChange}
      minRows={rows}
      maxRows={rows}
      value={value}
      multiline
    />
  );
}