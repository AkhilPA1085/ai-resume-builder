// features/builder/components/ResumeChangesSummary.jsx
"use client";

import { Box, Typography, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";

export default function ResumeChangesSummary({ changes }) {
  if (!changes || changes.length === 0) return null;

  return (
    <Box
      sx={{
        width: "210mm",
        maxWidth: "100%",
        margin: "16px auto 0",
        padding: "16px 20px",
        borderRadius: 1,
        border: "1px solid #e0e0e0",
        background: "#fafafa",
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        What the AI changed
      </Typography>
      <List dense disablePadding>
        {changes.map((change, i) => (
          <ListItem key={i} disableGutters sx={{ alignItems: "flex-start", py: 0.5 }}>
            <ListItemIcon sx={{ minWidth: 28, mt: 0.3 }}>
              {/* <CheckCircleOutlineIcon fontSize="small" color="success" /> */}
              *
            </ListItemIcon>
            <ListItemText
              primary={change}
              primaryTypographyProps={{ variant: "body2" }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}