const API_URL = (import.meta.env["VITE_API_URL"] ?? "https://bytebrains-cbf5.onrender.com").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  const text = await response.text();
  let data: unknown = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!response.ok) {
    const detail = typeof data === "object" && data && "detail" in data ? (data as {detail?: unknown}).detail : data;
    throw new Error(typeof detail === "string" ? detail : `Request failed (${response.status})`);
  }
  return data as T;
}

export type Student = { id:number; name:string; email:string; branch?:string; college?:string; year?:string; phone?:string; location?:string; enrollment?:string; about?:string };
export type Skill = { id:number; name:string; proficiency?:string; score?:number };
export type Internship = { id:number; company_id?:number; company?:string; title:string; description?:string; location?:string; duration?:string; stipend?:string; mode?:string; deadline?:string; status?:string; match_score?:number; skills?:string[] };
export type Application = { id:number; student_id:number; internship_id:number; status:string; applied_at?:string; internship?:Internship };
export type Course = { id:number; title:string; description?:string; provider?:string; instructor?:string; level?:string; duration?:string; course_url?:string; thumbnail_url?:string; progress?:number };
export type Project = { id:number; student_id:number; title:string; description?:string; project_url?:string; github_url?:string; technologies?:string };
export type Education = { id:number; institution:string; degree?:string; field_of_study?:string; start_year?:number; end_year?:number; grade?:string };
export type Experience = { id:number; company_name:string; role?:string; description?:string; start_date?:string; end_date?:string; is_current?:boolean };
export type Certification = { id:number; name:string; issuing_organization?:string; issue_date?:string; credential_id?:string; credential_url?:string };
export type Achievement = { id:number; title:string; description?:string; achievement_date?:string; issuing_organization?:string };
export type Event = { id:number; title:string; description?:string; event_type?:string; location?:string; event_date:string; registration_deadline?:string };

export const api = {
  profile: (id:number) => request<Student>(`/students/${id}/profile`),
  updateProfile: (
  id: number,
  data: {
    phone?: string;
    location?: string;
    enrollment?: string;
    about?: string;
  }
) =>
  request<Student>(`/students/${id}/profile`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }),
  skills: (id:number) => request<Skill[]>(`/students/${id}/skills`),
  skillProfile: (id:number) => request<{skills:Skill[]; gaps:{skill:string; current:number; target:number; severity:string}[]; overall:number; technical_average:number; soft_average:number}>(`/students/${id}/skill-profile`),
  recommendations: (id:number) => request<Internship[]>(`/students/${id}/recommendations`),
  internships: (id?:number) => request<Internship[]>(id ? `/students/${id}/internships` : "/internships"),
  applications: (id:number) => request<Application[]>(`/students/${id}/applications`),
  apply: (studentId:number, internshipId:number) => request<Application>(`/students/${studentId}/internships/${internshipId}/apply`, { method:"POST" }),
  submitAssessment: (studentId:number, category:string, score:number, total:number) => request<{percentage:number; recommendations_updated:number; attempt_id:number}>(`/students/${studentId}/assessments/submit`, { method:"POST", body:JSON.stringify({category, score, total}) }),
  courses: () => request<Course[]>("/courses"),
  events: () => request<Event[]>("/events"),
  portfolio: (id:number) => request<Project[]>(`/students/${id}/portfolio`),
  addPortfolioProject: (id:number, project: {
  title: string;
  description?: string;
  project_url?: string;
  github_url?: string;
  technologies?: string;
}) =>
  request<Project>(`/students/${id}/portfolio`, {
    method: "POST",
    body: JSON.stringify(project),
  }),
  education: (id:number) => request<Education[]>(`/students/${id}/education`),
  addEducation: (
  id: number,
  education: {
    institution: string;
    degree?: string;
    field_of_study?: string;
    start_year?: number;
    end_year?: number;
    grade?: string;
  }
) =>
  request<Education[]>(`/students/${id}/education`, {
    method: "POST",
    body: JSON.stringify(education),
  }),
  experience: (id:number) => request<Experience[]>(`/students/${id}/experience`),
  addExperience: (
  id: number,
  experience: {
    company_name: string;
    role?: string;
    description?: string;
    start_date?: string;
    end_date?: string;
    is_current?: boolean;
  }
) =>
  request<Experience>(`/students/${id}/experience`, {
    method: "POST",
    body: JSON.stringify(experience),
  }),
  certifications: (id:number) => request<Certification[]>(`/students/${id}/certifications`),
  addCertification: (
  id: number,
  data: {
    name: string;
    issuing_organization?: string;
  }
) =>
  request<Certification>(`/students/${id}/certifications`, {
    method: "POST",
    body: JSON.stringify(data),
  }),
  achievements: (id:number) => request<Achievement[]>(`/students/${id}/achievements`),
  addAchievement: (
  id: number,
  data: {
    title: string;
  }
) =>
  request<Achievement>(`/students/${id}/achievements`, {
    method: "POST",
    body: JSON.stringify(data),
  }),

  resume: (id:number) => request<unknown[]>(`/students/${id}/resume`),
};
