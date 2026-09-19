import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Award,
  Download,
  Mail,
  MapPin,
  Phone,
  Trophy,
  Plus,
  X,
  Pencil,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Chip,
  Page,
  Panel,
  SkillBar,
} from "@/components/aicp/primitives";

import {
  api,
  type Achievement,
  type Certification,
  type Education,
  type Experience,
  type Project,
} from "@/lib/api";

import { getCurrentStudentId } from "@/lib/auth";

export const Route = createFileRoute("/portfolio")({
  component: Portfolio,
});

function Portfolio() {
  const id = getCurrentStudentId();

  const [student, setStudent] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [experience, setExperience] = useState<Experience[]>([]);
  const [certs, setCerts] = useState<Certification[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // PROJECT
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectTechnologies, setProjectTechnologies] = useState("");
  const [projectGithub, setProjectGithub] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [savingProject, setSavingProject] = useState(false);

  // EDUCATION
  const [showEducationForm, setShowEducationForm] = useState(false);
  const [educationInstitution, setEducationInstitution] = useState("");
  const [educationDegree, setEducationDegree] = useState("");
  const [educationField, setEducationField] = useState("");
  const [educationStartYear, setEducationStartYear] = useState("");
  const [educationEndYear, setEducationEndYear] = useState("");
  const [educationGrade, setEducationGrade] = useState("");
  const [savingEducation, setSavingEducation] = useState(false);

  // EXPERIENCE
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [experienceCompany, setExperienceCompany] = useState("");
  const [experienceRole, setExperienceRole] = useState("");
  const [experienceDescription, setExperienceDescription] = useState("");
  const [experienceStartDate, setExperienceStartDate] = useState("");
  const [experienceEndDate, setExperienceEndDate] = useState("");
  const [experienceCurrent, setExperienceCurrent] = useState(false);
  const [savingExperience, setSavingExperience] = useState(false);

  // CERTIFICATION
  const [showCertificationForm, setShowCertificationForm] = useState(false);
  const [certificationName, setCertificationName] = useState("");
  const [certificationOrganization, setCertificationOrganization] =
    useState("");
  const [savingCertification, setSavingCertification] = useState(false);

  // ACHIEVEMENT
  const [showAchievementForm, setShowAchievementForm] = useState(false);
  const [achievementTitle, setAchievementTitle] = useState("");
  const [savingAchievement, setSavingAchievement] = useState(false);

  // PROFILE
  const [editingProfile, setEditingProfile] = useState(false);
  const [profilePhone, setProfilePhone] = useState("");
  const [profileLocation, setProfileLocation] = useState("");
  const [profileEnrollment, setProfileEnrollment] = useState("");
  const [profileAbout, setProfileAbout] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  // LOAD PORTFOLIO DATA
  useEffect(() => {
    if (!id) return;

    Promise.all([
      api.profile(id),
      api.skills(id),
      api.portfolio(id),
      api.education(id),
      api.experience(id),
      api.certifications(id),
      api.achievements(id),
    ])
      .then(([s, sk, p, e, x, c, a]) => {
        setStudent(s);
        setSkills(sk);
        setProjects(p);
        setEducation(e);
        setExperience(x);
        setCerts(c);
        setAchievements(a);

        setProfilePhone(s.phone ?? "");
        setProfileLocation(s.location ?? "");
        setProfileEnrollment(s.enrollment ?? "");
        setProfileAbout(s.about ?? "");
      })
      .catch((e) => toast.error(e.message));
  }, [id]);

  // ADD PROJECT
  const handleAddProject = async () => {
    if (!id || !projectTitle.trim()) {
      toast.error("Project title is required");
      return;
    }

    try {
      setSavingProject(true);

      const newProject = await api.addPortfolioProject(id, {
        title: projectTitle,
        description: projectDescription,
        technologies: projectTechnologies,
        github_url: projectGithub,
        project_url: projectUrl,
      });

      setProjects((prev) => [...prev, newProject]);

      setProjectTitle("");
      setProjectDescription("");
      setProjectTechnologies("");
      setProjectGithub("");
      setProjectUrl("");
      setShowProjectForm(false);

      toast.success("Project added successfully 🎉");
    } catch (e: any) {
      toast.error(e.message || "Failed to add project");
    } finally {
      setSavingProject(false);
    }
  };

  // ADD EDUCATION
  const handleAddEducation = async () => {
    if (!id || !educationInstitution.trim()) {
      toast.error("Institution name is required");
      return;
    }

    try {
      setSavingEducation(true);

      const newEducation = await api.addEducation(id, {
        institution: educationInstitution,
        degree: educationDegree,
        field_of_study: educationField,
        start_year: educationStartYear
          ? Number(educationStartYear)
          : undefined,
        end_year: educationEndYear
          ? Number(educationEndYear)
          : undefined,
        grade: educationGrade,
      });

      setEducation((prev) => [...prev, newEducation]);

      setEducationInstitution("");
      setEducationDegree("");
      setEducationField("");
      setEducationStartYear("");
      setEducationEndYear("");
      setEducationGrade("");
      setShowEducationForm(false);

      toast.success("Education added successfully 🎓");
    } catch (e: any) {
      toast.error(e.message || "Failed to add education");
    } finally {
      setSavingEducation(false);
    }
  };

  // ADD EXPERIENCE
  const handleAddExperience = async () => {
    if (!id || !experienceCompany.trim()) {
      toast.error("Company name is required");
      return;
    }

    try {
      setSavingExperience(true);

      const newExperience = await api.addExperience(id, {
        company_name: experienceCompany,
        role: experienceRole,
        description: experienceDescription,
        start_date: experienceStartDate || undefined,
        end_date: experienceCurrent
          ? undefined
          : experienceEndDate || undefined,
        is_current: experienceCurrent,
      });

      setExperience((prev) => [...prev, newExperience]);

      setExperienceCompany("");
      setExperienceRole("");
      setExperienceDescription("");
      setExperienceStartDate("");
      setExperienceEndDate("");
      setExperienceCurrent(false);
      setShowExperienceForm(false);

      toast.success("Experience added successfully 💼");
    } catch (e: any) {
      toast.error(e.message || "Failed to add experience");
    } finally {
      setSavingExperience(false);
    }
  };

  // ADD CERTIFICATION
  const handleAddCertification = async () => {
    if (!id || !certificationName.trim()) {
      toast.error("Certification name is required");
      return;
    }

    try {
      setSavingCertification(true);

      const newCertification = await api.addCertification(id, {
        name: certificationName,
        issuing_organization: certificationOrganization,
      });

      setCerts((prev) => [...prev, newCertification]);

      setCertificationName("");
      setCertificationOrganization("");
      setShowCertificationForm(false);

      toast.success("Certification added successfully 📜");
    } catch (e: any) {
      toast.error(e.message || "Failed to add certification");
    } finally {
      setSavingCertification(false);
    }
  };

  // ADD ACHIEVEMENT
  const handleAddAchievement = async () => {
    if (!id || !achievementTitle.trim()) {
      toast.error("Achievement title is required");
      return;
    }

    try {
      setSavingAchievement(true);

      const newAchievement = await api.addAchievement(id, {
        title: achievementTitle,
      });

      setAchievements((prev) => [...prev, newAchievement]);

      setAchievementTitle("");
      setShowAchievementForm(false);

      toast.success("Achievement added successfully 🏆");
    } catch (e: any) {
      toast.error(e.message || "Failed to add achievement");
    } finally {
      setSavingAchievement(false);
    }
  };

  // SAVE PROFILE
  const handleSaveProfile = async () => {
    if (!id) return;

    try {
      setSavingProfile(true);

      const updatedStudent = await api.updateProfile(id, {
        phone: profilePhone,
        location: profileLocation,
        enrollment: profileEnrollment,
        about: profileAbout,
      });

      setStudent(updatedStudent);
      setEditingProfile(false);

      toast.success("Profile updated successfully 🎉");
    } catch (e: any) {
      toast.error(e.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  if (!id) {
    return (
      <Page>
        <p className="text-sm text-muted-foreground">
          Please sign in to view your portfolio.
        </p>
      </Page>
    );
  }

  const initials = String(student?.name ?? "Student")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((x: string) => x[0])
    .join("")
    .toUpperCase();

  return (
    <Page>
      {/* HEADER */}
      <section className="rounded-lg border border-border bg-primary p-6 text-primary-foreground sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-5">
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brass/20 font-display text-2xl text-brass">
              {initials}
            </span>

            <div>
              <h1 className="text-3xl">{student?.name}</h1>

              <p className="text-sm text-primary-foreground/75">
                {student?.branch} · {student?.year}
              </p>

              <p className="text-xs text-primary-foreground/60">
                {student?.college}
              </p>
            </div>
          </div>

          <Link
            to="/resume"
            className="inline-flex items-center gap-2 rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground"
          >
            <Download className="h-4 w-4" />
            Resume
          </Link>
        </div>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">

        {/* LEFT COLUMN */}
        <div className="space-y-6">

          {/* ABOUT */}
          <Panel title="About">
            <div className="p-5">
              {editingProfile ? (
                <textarea
                  value={profileAbout}
                  onChange={(e) => setProfileAbout(e.target.value)}
                  placeholder="Tell something about yourself..."
                  rows={5}
                  className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                />
              ) : (
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {student?.about ||
                    "Add an about section to your student profile."}
                </p>
              )}
            </div>
          </Panel>

          {/* PROJECTS */}
          <Panel title="Projects">
            <div className="flex items-center justify-between border-b border-border p-5">
              <p className="text-sm text-muted-foreground">
                Add your projects and showcase your work.
              </p>

              <button
                onClick={() => setShowProjectForm(!showProjectForm)}
                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                {showProjectForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Project
                  </>
                )}
              </button>
            </div>

            {showProjectForm && (
              <div className="border-b border-border bg-muted/30 p-5">
                <div className="grid gap-4">

                  <input
                    type="text"
                    placeholder="Project Title *"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <textarea
                    placeholder="Project Description"
                    value={projectDescription}
                    onChange={(e) =>
                      setProjectDescription(e.target.value)
                    }
                    rows={4}
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Technologies (e.g. React, Python, FastAPI)"
                    value={projectTechnologies}
                    onChange={(e) =>
                      setProjectTechnologies(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="url"
                    placeholder="GitHub URL"
                    value={projectGithub}
                    onChange={(e) =>
                      setProjectGithub(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="url"
                    placeholder="Live Project / Demo URL"
                    value={projectUrl}
                    onChange={(e) =>
                      setProjectUrl(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <button
                    onClick={handleAddProject}
                    disabled={savingProject}
                    className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground disabled:opacity-50"
                  >
                    {savingProject ? "Saving..." : "Save Project"}
                  </button>

                </div>
              </div>
            )}

            <ul className="divide-y divide-border">
              {projects.map((p) => (
                <li key={p.id} className="p-5">

                  <h3 className="text-base">{p.title}</h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {p.description}
                  </p>

                  {p.technologies && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {p.technologies.split(",").map((t) => (
                        <Chip key={t}>{t.trim()}</Chip>
                      ))}
                    </div>
                  )}

                  {(p.github_url || p.project_url) && (
                    <div className="mt-3 flex gap-3 text-xs">

                      {p.github_url && (
                        <a
                          href={p.github_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline"
                        >
                          GitHub
                        </a>
                      )}

                      {p.project_url && (
                        <a
                          href={p.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline"
                        >
                          Live Demo
                        </a>
                      )}

                    </div>
                  )}

                </li>
              ))}

              {!projects.length && (
                <li className="p-5 text-sm text-muted-foreground">
                  No projects added yet.
                </li>
              )}
            </ul>
          </Panel>

          {/* CERTIFICATIONS */}
          <Panel title="Certifications">
            <div className="flex items-center justify-between border-b border-border p-5">
              <p className="text-sm text-muted-foreground">
                Add your certificates and credentials.
              </p>

              <button
                onClick={() =>
                  setShowCertificationForm(!showCertificationForm)
                }
                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                {showCertificationForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Certification
                  </>
                )}
              </button>
            </div>

            {showCertificationForm && (
              <div className="border-b border-border bg-muted/30 p-5">
                <div className="grid gap-4">

                  <input
                    type="text"
                    placeholder="Certification Name *"
                    value={certificationName}
                    onChange={(e) =>
                      setCertificationName(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Issuing Organization"
                    value={certificationOrganization}
                    onChange={(e) =>
                      setCertificationOrganization(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <button
                    onClick={handleAddCertification}
                    disabled={savingCertification}
                    className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground disabled:opacity-50"
                  >
                    {savingCertification
                      ? "Saving..."
                      : "Save Certification"}
                  </button>

                </div>
              </div>
            )}

            <ul className="grid gap-px bg-border sm:grid-cols-2">
              {certs.map((c) => (
                <li key={c.id} className="bg-card p-4">

                  <Award className="h-4 w-4 text-brass" />

                  <p className="mt-2 text-sm font-medium">
                    {c.name}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {c.issuing_organization || "—"}
                  </p>

                </li>
              ))}

              {!certs.length && (
                <li className="bg-card p-5 text-sm text-muted-foreground">
                  No certifications added yet.
                </li>
              )}
            </ul>
          </Panel>

          {/* ACHIEVEMENTS */}
          <Panel title="Achievements">
            <div className="flex items-center justify-between border-b border-border p-5">
              <p className="text-sm text-muted-foreground">
                Showcase your achievements and milestones.
              </p>

              <button
                onClick={() =>
                  setShowAchievementForm(!showAchievementForm)
                }
                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                {showAchievementForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Achievement
                  </>
                )}
              </button>
            </div>

            {showAchievementForm && (
              <div className="border-b border-border bg-muted/30 p-5">
                <div className="grid gap-4">

                  <input
                    type="text"
                    placeholder="Achievement Title *"
                    value={achievementTitle}
                    onChange={(e) =>
                      setAchievementTitle(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <button
                    onClick={handleAddAchievement}
                    disabled={savingAchievement}
                    className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground disabled:opacity-50"
                  >
                    {savingAchievement
                      ? "Saving..."
                      : "Save Achievement"}
                  </button>

                </div>
              </div>
            )}

            <ul className="divide-y divide-border">
              {achievements.map((a) => (
                <li
                  key={a.id}
                  className="flex gap-3 p-4 text-sm"
                >
                  <Trophy className="h-4 w-4 text-brass" />
                  {a.title}
                </li>
              ))}

              {!achievements.length && (
                <li className="p-5 text-sm text-muted-foreground">
                  No achievements added yet.
                </li>
              )}
            </ul>
          </Panel>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* SKILLS */}
          <Panel title="Skills">
            <div className="space-y-4 p-5">
              {skills.map((s) => (
                <SkillBar
                  key={s.skill_id}
                  name={s.name}
                  value={Number(s.score ?? 0)}
                />
              ))}
            </div>
          </Panel>

          {/* EDUCATION */}
          <Panel title="Education">
            <div className="flex items-center justify-between border-b border-border p-5">
              <p className="text-sm text-muted-foreground">
                Add your academic qualifications.
              </p>

              <button
                onClick={() =>
                  setShowEducationForm(!showEducationForm)
                }
                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                {showEducationForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Education
                  </>
                )}
              </button>
            </div>

            {showEducationForm && (
              <div className="border-b border-border bg-muted/30 p-5">
                <div className="grid gap-4">

                  <input
                    type="text"
                    placeholder="Institution *"
                    value={educationInstitution}
                    onChange={(e) =>
                      setEducationInstitution(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Degree (e.g. B.Sc. Hons.)"
                    value={educationDegree}
                    onChange={(e) =>
                      setEducationDegree(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Field of Study"
                    value={educationField}
                    onChange={(e) =>
                      setEducationField(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <input
                      type="number"
                      placeholder="Start Year"
                      value={educationStartYear}
                      onChange={(e) =>
                        setEducationStartYear(e.target.value)
                      }
                      className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                    />

                    <input
                      type="number"
                      placeholder="End Year"
                      value={educationEndYear}
                      onChange={(e) =>
                        setEducationEndYear(e.target.value)
                      }
                      className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                    />

                  </div>

                  <input
                    type="text"
                    placeholder="Grade / CGPA / Percentage"
                    value={educationGrade}
                    onChange={(e) =>
                      setEducationGrade(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <button
                    onClick={handleAddEducation}
                    disabled={savingEducation}
                    className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground disabled:opacity-50"
                  >
                    {savingEducation
                      ? "Saving..."
                      : "Save Education"}
                  </button>

                </div>
              </div>
            )}

            <ul className="divide-y divide-border">
              {education.map((e) => (
                <li key={e.id} className="p-4">

                  <p className="text-sm font-medium">
                    {e.degree || "Education"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {e.institution}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {e.field_of_study} · {e.start_year}–
                    {e.end_year ?? "Present"} · {e.grade}
                  </p>

                </li>
              ))}

              {!education.length && (
                <li className="p-5 text-sm text-muted-foreground">
                  No education added yet.
                </li>
              )}
            </ul>
          </Panel>

          {/* EXPERIENCE */}
          <Panel title="Experience">
            <div className="flex items-center justify-between border-b border-border p-5">
              <p className="text-sm text-muted-foreground">
                Add internships, jobs or work experience.
              </p>

              <button
                onClick={() =>
                  setShowExperienceForm(!showExperienceForm)
                }
                className="inline-flex items-center gap-2 rounded bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                {showExperienceForm ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add Experience
                  </>
                )}
              </button>
            </div>

            {showExperienceForm && (
              <div className="border-b border-border bg-muted/30 p-5">
                <div className="grid gap-4">

                  <input
                    type="text"
                    placeholder="Company Name *"
                    value={experienceCompany}
                    onChange={(e) =>
                      setExperienceCompany(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Role / Position"
                    value={experienceRole}
                    onChange={(e) =>
                      setExperienceRole(e.target.value)
                    }
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <textarea
                    placeholder="Describe your work..."
                    value={experienceDescription}
                    onChange={(e) =>
                      setExperienceDescription(e.target.value)
                    }
                    rows={4}
                    className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                  />

                  <div className="grid grid-cols-2 gap-4">

                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        Start Date
                      </label>

                      <input
                        type="date"
                        value={experienceStartDate}
                        onChange={(e) =>
                          setExperienceStartDate(e.target.value)
                        }
                        className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs text-muted-foreground">
                        End Date
                      </label>

                      <input
                        type="date"
                        value={experienceEndDate}
                        disabled={experienceCurrent}
                        onChange={(e) =>
                          setExperienceEndDate(e.target.value)
                        }
                        className="w-full rounded border border-border bg-background px-3 py-2 text-sm outline-none disabled:opacity-50"
                      />
                    </div>

                  </div>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={experienceCurrent}
                      onChange={(e) =>
                        setExperienceCurrent(e.target.checked)
                      }
                    />
                    Currently working here
                  </label>

                  <button
                    onClick={handleAddExperience}
                    disabled={savingExperience}
                    className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground disabled:opacity-50"
                  >
                    {savingExperience
                      ? "Saving..."
                      : "Save Experience"}
                  </button>

                </div>
              </div>
            )}

            <ul className="divide-y divide-border">
              {experience.map((x) => (
                <li key={x.id} className="p-4">

                  <p className="text-sm font-medium">
                    {x.role || "Experience"}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {x.company_name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {x.description}
                  </p>

                  {(x.start_date ||
                    x.end_date ||
                    x.is_current) && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      {x.start_date || "—"} →{" "}
                      {x.is_current
                        ? "Present"
                        : x.end_date || "—"}
                    </p>
                  )}

                </li>
              ))}

              {!experience.length && (
                <li className="p-5 text-sm text-muted-foreground">
                  No experience added yet.
                </li>
              )}
            </ul>
          </Panel>

          {/* CONTACT */}
          <Panel title="Contact">

            <div className="flex justify-end border-b border-border p-4">
              <button
                onClick={() =>
                  setEditingProfile(!editingProfile)
                }
                className="inline-flex items-center gap-2 rounded border border-border px-3 py-2 text-xs font-medium"
              >
                {editingProfile ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Pencil className="h-4 w-4" />
                    Edit
                  </>
                )}
              </button>
            </div>

            {editingProfile ? (
              <div className="grid gap-4 p-5">

                <input
                  type="text"
                  placeholder="Phone"
                  value={profilePhone}
                  onChange={(e) =>
                    setProfilePhone(e.target.value)
                  }
                  className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                />

                <input
                  type="text"
                  placeholder="Location"
                  value={profileLocation}
                  onChange={(e) =>
                    setProfileLocation(e.target.value)
                  }
                  className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                />

                <input
                  type="text"
                  placeholder="Enrollment ID"
                  value={profileEnrollment}
                  onChange={(e) =>
                    setProfileEnrollment(e.target.value)
                  }
                  className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                />

                <textarea
                  placeholder="About"
                  value={profileAbout}
                  onChange={(e) =>
                    setProfileAbout(e.target.value)
                  }
                  rows={4}
                  className="rounded border border-border bg-background px-3 py-2 text-sm outline-none"
                />

                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground disabled:opacity-50"
                >
                  {savingProfile
                    ? "Saving..."
                    : "Save Profile"}
                </button>

              </div>
            ) : (
              <ul className="space-y-3 p-5 text-sm">

                <li className="flex gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  {student?.email}
                </li>

                <li className="flex gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {student?.phone || "—"}
                </li>

                <li className="flex gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  {student?.location || "—"}
                </li>

                <li className="text-xs text-muted-foreground">
                  Enrollment ID: {student?.enrollment || "—"}
                </li>

              </ul>
            )}

          </Panel>

        </div>
      </div>
    </Page>
  );
}