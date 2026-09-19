import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Clock, FileQuestion } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Chip, Page, PageHeader, Panel } from "@/components/aicp/primitives";
import { assessmentCategories, questionBank } from "@/data/mock";
import { api } from "@/lib/api";
import { getCurrentStudentId } from "@/lib/auth";

export const Route = createFileRoute("/skill-assessment")({
  head: () => ({
    meta: [
      { title: "Skill Assessment — AICP Academia–Industry Portal" },
      {
        name: "description",
        content:
          "Take timed skill assessments in Python, SQL, machine learning, aptitude and communication to update your AICP skill score.",
      },
      { property: "og:title", content: "Skill Assessment — AICP" },
      {
        property: "og:description",
        content: "Assess your technical and soft skills to unlock personalised learning paths.",
      },
    ],
  }),
  component: SkillAssessment,
});

function SkillAssessment() {
  const [category, setCategory] = useState<string | null>(null);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const questions = (category ? questionBank[category] : []) ?? [];
  const meta = assessmentCategories.find((c) => c.id === category);
  const current = questions[index];
  const score = questions.filter((q, i) => answers[i] === q.answer).length;

  function reset() {
    setCategory(null);
    setIndex(0);
    setAnswers({});
    setSubmitted(false);
  }

  return (
    <Page>
      <PageHeader
        title="Skill Assessment"
        subtitle="Choose a category and complete a short assessment. Your results update your skill profile and recommendations."
      />

      {!category && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {assessmentCategories.map((c) => (
            <div key={c.id} className="rounded-lg border border-border bg-card p-5 shadow-card">
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base">{c.name}</h2>
                <Chip tone="brass">{c.level}</Chip>
              </div>
              <p className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <FileQuestion className="h-3.5 w-3.5" /> {c.questions} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {c.minutes} min
                </span>
              </p>
              <button
                onClick={() => setCategory(c.id)}
                className="mt-5 w-full rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Start assessment
              </button>
            </div>
          ))}
        </div>
      )}

      {category && !submitted && (
        <Panel title={meta?.name ?? "Assessment"} action={<span className="text-xs text-muted-foreground">Question {index + 1} of {questions.length}</span>}>
          <div className="p-5 sm:p-6">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-accent">
              <div
                className="h-full rounded-full bg-brass"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>

            <p className="mt-6 text-base font-medium">{current?.q}</p>
            <div className="mt-4 space-y-2">
              {(current?.options ?? []).map((opt, i) => {
                const active = answers[index] === i;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers({ ...answers, [index]: i })}
                    className={`flex w-full items-center gap-3 rounded border px-4 py-3 text-left text-sm transition-colors ${
                      active
                        ? "border-primary bg-secondary font-medium"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-border text-[11px]">
                      {String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                  </button>
                );
              })}
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => (index === 0 ? reset() : setIndex(index - 1))}
                className="rounded border border-border px-4 py-2 text-sm transition-colors hover:bg-secondary"
              >
                {index === 0 ? "Exit" : "Previous"}
              </button>
              {index < questions.length - 1 ? (
                <button
                  onClick={() => setIndex(index + 1)}
                  className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Next question
                </button>
              ) : (
                <button
                  onClick={async () => {
                    const studentId = getCurrentStudentId();
                    if (!studentId || !category || submitting) {
                      if (!studentId) toast.error("Please sign in before submitting an assessment.");
                      return;
                    }
                    setSubmitting(true);
                    try {
                      await api.submitAssessment(studentId, category, score, questions.length);
                      setSubmitted(true);
                      toast.success("Assessment submitted and skill profile updated");
                    } catch (error) {
                      toast.error(error instanceof Error ? error.message : "Could not submit assessment");
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  className="rounded bg-brass px-4 py-2 text-sm font-medium text-brass-foreground transition-colors hover:bg-brass/90"
                >
                  {submitting ? "Submitting…" : "Submit assessment"}
                </button>
              )}
            </div>
          </div>
        </Panel>
      )}

      {category && submitted && (
        <Panel title="Assessment result">
          <div className="p-6 text-center">
            <CheckCircle2 className="mx-auto h-8 w-8 text-success" />
            <p className="mt-4 font-display text-4xl">
              {Math.round((score / questions.length) * 100)}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {score} of {questions.length} correct in {meta?.name}. Your skill profile has been updated.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={reset}
                className="rounded bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Take another assessment
              </button>
            </div>
          </div>
        </Panel>
      )}
    </Page>
  );
}
