// features/builder/components/ResumePreview.jsx
"use client";

import { useRef, useState } from "react";
import { Box, Typography, Divider, Chip, Stack, Alert } from "@mui/material";
import Button from "@mui/material/Button";
import DownloadIcon from "@mui/icons-material/Download";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import EditableField from "./EditableField";
import ResumeChangesSummary from "./ResumeChangesSummary";

export default function ResumePreview({ data, onChange }) {
  const previewRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleDownload = async () => {
    if (!previewRef.current) return;
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(previewRef.current, {
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`${data?.name?.replace(/\s+/g, "_") || "resume"}.pdf`);
  };

  // Generic helper: update a top-level field (name, title, summary)
  const updateField = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  // Update a bullet inside a specific experience entry
  const updateExperienceBullet = (expIndex, bulletIndex, value) => {
    const updatedExperience = data.experience.map((exp, i) => {
      if (i !== expIndex) return exp;
      const updatedBullets = exp.bullets.map((b, j) => (j === bulletIndex ? value : b));
      return { ...exp, bullets: updatedBullets };
    });
    onChange({ ...data, experience: updatedExperience });
  };

  // Update role/company/dates for an experience entry
  const updateExperienceField = (expIndex, field, value) => {
    const updatedExperience = data.experience.map((exp, i) =>
      i === expIndex ? { ...exp, [field]: value } : exp
    );
    onChange({ ...data, experience: updatedExperience });
  };

  // Update a skill
  const updateSkill = (skillIndex, value) => {
    const updatedSkills = data.skills.map((s, i) => (i === skillIndex ? value : s));
    onChange({ ...data, skills: updatedSkills });
  };

  // Update education field
  const updateEducationField = (eduIndex, field, value) => {
    const updatedEducation = data.education.map((ed, i) =>
      i === eduIndex ? { ...ed, [field]: value } : ed
    );
    onChange({ ...data, education: updatedEducation });
  };

  if (!data) {
    return (
      <Box
        sx={{
          width: "50%",
          minHeight: "600px",
          overflow:"auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #ccc",
          borderRadius: 1,
          color: "text.secondary",
        }}
      >
        <Typography variant="body2">
          Your generated resume preview will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "50%", maxHeight: "600px", overflow: "auto" }}>
      {isEditing && (
        <Alert severity="info" sx={{ mb: 1 }}>
          Click any text to edit it. Click away to save your change.
        </Alert>
      )}

      <Box
        ref={previewRef}
        sx={{
          background: "#fff",
          color: "#000",
          width: "210mm",
          minHeight: "297mm",
          maxWidth: "100%",
          margin: "0 auto",
          padding: "20mm",
          boxShadow: "0 0 12px rgba(0,0,0,0.15)",
          fontFamily: "Georgia, serif",
        }}
      >
        <EditableField
          value={data.name}
          editable={isEditing}
          onSave={(v) => updateField("name", v)}
          variant="h4"
          component="div"
          sx={{ fontWeight: 700 }}
        />
        <EditableField
          value={data.title}
          editable={isEditing}
          onSave={(v) => updateField("title", v)}
          variant="subtitle1"
          component="div"
          sx={{ color: "#555", mb: 2 }}
        />

        {data.summary !== undefined && (
          <EditableField
            value={data.summary}
            editable={isEditing}
            onSave={(v) => updateField("summary", v)}
            variant="body2"
            component="div"
            sx={{ mb: 3, lineHeight: 1.6, display: "block" }}
          />
        )}

        <Divider sx={{ mb: 3 }} />

        {data.experience?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Experience
            </Typography>
            <Stack spacing={2}>
              {data.experience.map((exp, i) => (
                <Box key={i}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <EditableField
                        value={exp.role}
                        editable={isEditing}
                        onSave={(v) => updateExperienceField(i, "role", v)}
                        variant="subtitle2"
                        sx={{ fontWeight: 700 }}
                      />
                      <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>—</Typography>
                      <EditableField
                        value={exp.company}
                        editable={isEditing}
                        onSave={(v) => updateExperienceField(i, "company", v)}
                        variant="subtitle2"
                        sx={{ fontWeight: 700 }}
                      />
                    </Box>
                    <EditableField
                      value={exp.dates}
                      editable={isEditing}
                      onSave={(v) => updateExperienceField(i, "dates", v)}
                      variant="caption"
                      sx={{ color: "#666" }}
                    />
                  </Box>
                  <Box component="ul" sx={{ mt: 0.5, mb: 0, pl: 2.5 }}>
                    {exp.bullets?.map((bullet, j) => (
                      <Box component="li" key={j} sx={{ mb: 0.3 }}>
                        <EditableField
                          value={bullet}
                          editable={isEditing}
                          onSave={(v) => updateExperienceBullet(i, j, v)}
                          variant="body2"
                        />
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        )}

        {data.skills?.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Skills
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
              {data.skills.map((skill, i) =>
                <EditableField
                  value={skill}
                  editable={isEditing}
                  onSave={(v) => updateSkill(i, v)}
                  variant="body2"
                  sx={{ px: 1 }}
                />
              )}
            </Box>
          </Box>
        )}

        {data.education?.length > 0 && (
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>
              Education
            </Typography>
            <Stack spacing={1}>
              {data.education.map((ed, i) => (
                <Box key={i} sx={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <Box sx={{ display: "flex", gap: 0.5 }}>
                    <EditableField
                      value={ed.degree}
                      editable={isEditing}
                      onSave={(v) => updateEducationField(i, "degree", v)}
                      variant="body2"
                    />
                    <Typography variant="body2">,</Typography>
                    <EditableField
                      value={ed.school}
                      editable={isEditing}
                      onSave={(v) => updateEducationField(i, "school", v)}
                      variant="body2"
                    />
                  </Box>
                  <EditableField
                    value={ed.dates}
                    editable={isEditing}
                    onSave={(v) => updateEducationField(i, "dates", v)}
                    variant="caption"
                    sx={{ color: "#666" }}
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
        <Button
          variant={isEditing ? "contained" : "outlined"}
          color={isEditing ? "success" : "primary"}
          startIcon={isEditing ? <CheckIcon /> : <EditIcon />}
          onClick={() => setIsEditing((prev) => !prev)}
        >
          {isEditing ? "Done Editing" : "Edit"}
        </Button>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleDownload}>
          Download PDF
        </Button>
      </Box>

      <ResumeChangesSummary changes={data.changes} />
    </Box>
  );
}