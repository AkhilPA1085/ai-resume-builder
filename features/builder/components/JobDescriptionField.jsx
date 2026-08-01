import Textarea from "@/components/ui/TextArea";

export function JobDescriptionField({onChange,value,rows}) {
  return <Textarea onChange={onChange} rows={rows} value={value} label='Job Description'/>
}
