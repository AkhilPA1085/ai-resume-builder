// features/builder/components/EditableField.jsx
"use client";

import { Typography } from "@mui/material";

export default function EditableField({
  value,
  onSave,
  editable,
  variant = "body2",
  component = "span",
  sx = {},
  ...rest
}) {
  const handleBlur = (e) => {
    const newValue = e.currentTarget.innerText.trim();
    if (newValue !== value) onSave(newValue);
  };

  return (
    <Typography
      variant={variant}
      component={component}
      contentEditable={editable}
      suppressContentEditableWarning
      onBlur={editable ? handleBlur : undefined}
      sx={{
        outline: "none",
        ...(editable && {
          cursor: "text",
          borderRadius: "4px",
          px: 0.5,
          "&:hover": { background: "rgba(25, 118, 210, 0.06)" },
          "&:focus": { background: "rgba(25, 118, 210, 0.1)" },
        }),
        ...sx,
      }}
      {...rest}
    >
      {value}
    </Typography>
  );
}