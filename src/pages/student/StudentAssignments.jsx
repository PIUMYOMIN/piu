import React, { useEffect, useState } from "react";
import { FaPaperPlane, FaSpinner } from "react-icons/fa";
import { studentApi } from "../../api/student";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, Panel, StatCard, StudentHero } from "../../components/student/StudentUi";

export default function StudentAssignments() {
  const { showSuccess, showError, Toast } = useFloatingToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [submitForm, setSubmitForm] = useState({ body: "", attach_file: null });
  const [submittingId, setSubmittingId] = useState(null);

  const loadAssignments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await studentApi.assignments();
      setAssignments(response?.assignments || []);
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to load assignments"));
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const submitted = assignments.filter((item) => item.is_submitted);
  const pending = assignments.filter((item) => !item.is_submitted);

  const openSubmit = (assignment) => {
    setActiveAssignment(assignment);
    setSubmitForm({ body: assignment.body || "", attach_file: null });
  };

  const closeSubmit = () => {
    setActiveAssignment(null);
    setSubmitForm({ body: "", attach_file: null });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeAssignment) return;

    if (!submitForm.body.trim() && !submitForm.attach_file) {
      showError("Please add a response or attach a file before submitting.");
      return;
    }

    setSubmittingId(activeAssignment.id);
    try {
      const formData = new FormData();
      if (submitForm.body.trim()) {
        formData.append("body", submitForm.body.trim());
      }
      if (submitForm.attach_file) {
        formData.append("attach_file", submitForm.attach_file);
      }

      const response = await studentApi.submitAssignment(activeAssignment.id, formData);
      setAssignments(response?.assignments || []);
      showSuccess("Assignment submitted successfully.");
      closeSubmit();
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to submit assignment"));
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <LoadingState label="Loading assignments..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <Toast />
      <StudentHero
        eyebrow="Assignments"
        title="Course Assignments"
        subtitle="Download briefs, submit your work, and track submission status."
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Assignments" value={assignments.length} tone="blue" />
        <StatCard title="Submitted" value={submitted.length} tone="green" />
        <StatCard title="Pending" value={pending.length} tone="amber" />
      </section>

      <Panel title="Pending Assignments">
        {pending.length ? (
          <div className="space-y-4">
            {pending.map((assignment) => (
              <article
                key={assignment.id}
                className="rounded-lg border border-amber-100 bg-amber-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.name}</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {assignment.module_name || assignment.course || "General"}
                      {assignment.module_code ? ` • ${assignment.module_code}` : ""}
                      {assignment.subject ? ` • ${assignment.subject}` : ""}
                    </p>
                    {assignment.description ? (
                      <p className="mt-2 text-sm text-gray-700">{assignment.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {assignment.attach_file ? (
                      <a
                        href={assignment.attach_file}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex rounded-lg border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-50"
                      >
                        Download brief
                      </a>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openSubmit(assignment)}
                      className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2 text-sm font-medium text-white hover:bg-[#003366]"
                    >
                      <FaPaperPlane />
                      Submit work
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="You have no pending assignments." />
        )}
      </Panel>

      <Panel title="Submitted Assignments">
        {submitted.length ? (
          <div className="space-y-4">
            {submitted.map((assignment) => (
              <article
                key={assignment.id}
                className="rounded-lg border border-green-100 bg-green-50 p-4"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{assignment.name}</h3>
                    <p className="text-sm text-gray-600">
                      {assignment.module_name || assignment.course || "General"}
                    </p>
                    {assignment.body ? (
                      <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{assignment.body}</p>
                    ) : null}
                  </div>
                  <div className="flex flex-col items-start gap-2 sm:items-end">
                    <span className="text-sm font-medium text-green-700">
                      Submitted{" "}
                      {assignment.submitted_at
                        ? new Date(assignment.submitted_at).toLocaleDateString()
                        : ""}
                    </span>
                    {assignment.submitted_file ? (
                      <a
                        href={assignment.submitted_file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-700 hover:text-blue-900"
                      >
                        View submitted file
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <EmptyState message="No submitted assignments yet." />
        )}
      </Panel>

      {activeAssignment ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">Submit Assignment</h3>
            <p className="mt-1 text-sm text-gray-600">{activeAssignment.name}</p>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Your response</label>
                <textarea
                  value={submitForm.body}
                  onChange={(e) => setSubmitForm((prev) => ({ ...prev, body: e.target.value }))}
                  rows={5}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  placeholder="Write your answer or notes for the lecturer..."
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Attach file</label>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.zip"
                  onChange={(e) =>
                    setSubmitForm((prev) => ({
                      ...prev,
                      attach_file: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeSubmit}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingId === activeAssignment.id}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#002147] px-4 py-2 text-sm font-medium text-white hover:bg-[#003366] disabled:opacity-60"
                >
                  {submittingId === activeAssignment.id ? (
                    <FaSpinner className="animate-spin" />
                  ) : (
                    <FaPaperPlane />
                  )}
                  {submittingId === activeAssignment.id ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
