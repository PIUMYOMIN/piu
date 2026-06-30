import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { teacherApi } from "../../api/teacher";
import { useAuth } from "../../contexts/AuthContext";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";
import { EmptyState, LoadingState, StudentHero } from "../../components/student/StudentUi";

/**
 * Shared assignment create/edit form.
 * scope="teacher" limits program/module options to the teacher's assigned programs.
 */
export default function AssignmentForm({ scope = "admin" }) {
  const isTeacherScope = scope === "teacher";
  const listPath = isTeacherScope ? "/piu/teacher/assignments" : "/piu/admin/assignments";

  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showSuccess, showError, Toast } = useFloatingToast();

  const [ownerUserId, setOwnerUserId] = useState(null);

  const [courses, setCourses] = useState([]);
  const [modules, setModules] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    course_id: "",
    module_id: "",
    subject_id: "",
    attach_file: null,
  });

  useEffect(() => {
    let mounted = true;

    async function loadCourses() {
      try {
        const coursesData = isTeacherScope
          ? await teacherApi.courses()
          : await adminApi.courses.list();
        if (mounted) setCourses(Array.isArray(coursesData) ? coursesData : []);
      } catch (err) {
        if (mounted) showError(getApiErrorMessage(err, "Failed to load programs"));
      }
    }

    async function loadSubjects() {
      try {
        const meta = await adminApi.assignments.meta();
        if (mounted) setSubjects(Array.isArray(meta?.subjects) ? meta.subjects : []);
      } catch {
        if (mounted) setSubjects([]);
      }
    }

    loadCourses();
    loadSubjects();
    return () => { mounted = false; };
  }, [isTeacherScope]);

  useEffect(() => {
    let mounted = true;

    async function loadModules() {
      try {
        const params = formData.course_id ? { course_id: formData.course_id } : {};
        const modulesData = isTeacherScope
          ? await teacherApi.modules(params)
          : await adminApi.modules.list();
        if (!mounted) return;
        let list = Array.isArray(modulesData) ? modulesData : [];
        if (!isTeacherScope && formData.course_id) {
          list = list.filter(
            (m) =>
              String(m.course_id) === String(formData.course_id) ||
              !m.course_id
          );
        }
        setModules(list);
      } catch (err) {
        if (mounted) showError(getApiErrorMessage(err, "Failed to load modules"));
      }
    }

    loadModules();
    return () => { mounted = false; };
  }, [formData.course_id, isTeacherScope]);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function loadAssignment() {
      setLoading(true);
      try {
        const data = await adminApi.assignments.get(id);
        if (!mounted) return;
        setOwnerUserId(data?.user_id ?? null);
        setFormData({
          name: data?.name || "",
          description: data?.description || "",
          course_id: data?.course_id ? String(data.course_id) : "",
          module_id: data?.module_id ? String(data.module_id) : "",
          subject_id: data?.subject_id ? String(data.subject_id) : "",
          attach_file: null,
        });
      } catch (err) {
        if (mounted) showError(getApiErrorMessage(err, "Failed to load assignment"));
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadAssignment();
    return () => { mounted = false; };
  }, [id]);

  const filteredSubjects = useMemo(() => {
    if (!formData.module_id) return subjects;
    return subjects.filter((subject) => String(subject.module_id) === String(formData.module_id));
  }, [subjects, formData.module_id]);

  const isReadOnlyForTeacher =
    isTeacherScope &&
    id &&
    ownerUserId != null &&
    user?.id != null &&
    Number(ownerUserId) !== Number(user.id);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "course_id" ? { module_id: "", subject_id: "" } : {}),
      ...(name === "module_id" ? { subject_id: "" } : {}),
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, attach_file: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("description", formData.description || "");
      payload.append("course_id", formData.course_id);
      payload.append("module_id", formData.module_id);
      if (formData.subject_id) payload.append("subject_id", formData.subject_id);
      if (formData.attach_file) payload.append("attach_file", formData.attach_file);

      if (id) {
        await adminApi.assignments.update(id, payload);
        showSuccess("Assignment updated successfully!");
      } else {
        await adminApi.assignments.create(payload);
        showSuccess("Assignment added successfully!");
      }

      setTimeout(() => navigate(listPath), 900);
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to save assignment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isReadOnlyForTeacher) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Toast />
        <StudentHero
          eyebrow="Assignments"
          title="Edit Assignment"
          subtitle="You can only edit assignments you created."
        />
        <EmptyState message="This assignment was created by another teacher. You can view it in the list but cannot edit it." />
        <button
          type="button"
          onClick={() => navigate(listPath)}
          className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Back to assignments
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <LoadingState label="Loading assignment..." />
      </div>
    );
  }

  if (isTeacherScope && !id && courses.length === 0) {
    return (
      <div className="mx-auto max-w-7xl space-y-6">
        <Toast />
        <StudentHero
          eyebrow="Assignments"
          title="Add Assignment"
          subtitle="Create an assignment for students in your assigned programs."
        />
        <EmptyState message="No programs are assigned to your account. Ask an administrator to assign teaching programs first." />
      </div>
    );
  }

  return (
    <div className={isTeacherScope ? "mx-auto max-w-7xl space-y-6" : "max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden"}>
      <Toast />
      {isTeacherScope ? (
        <StudentHero
          eyebrow="Assignments"
          title={id ? "Edit Assignment" : "Add Assignment"}
          subtitle="Assignments are created only for your assigned programs."
        />
      ) : (
        <div className="bg-[#002147] p-6 text-white">
          <h2 className="text-2xl font-bold">{id ? "Edit Assignment" : "Add Assignment"}</h2>
          <p className="text-blue-100 mt-1">
            {id ? "Update assignment details" : "Create an assignment for students in a program"}
          </p>
        </div>
      )}

      <div className={isTeacherScope ? "rounded-xl border border-gray-100 bg-white p-6 shadow-sm" : "p-6"}>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Title</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter assignment name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Assignment instructions for students"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program / Course</label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose program</option>
                {courses.map((course) => (
                  <option key={course.id} value={String(course.id)}>
                    {course.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Module</label>
              <select
                name="module_id"
                value={formData.module_id}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                required
                disabled={!formData.course_id}
              >
                <option value="">{formData.course_id ? "Choose module" : "Select a program first"}</option>
                {modules.map((module) => (
                  <option key={module.id} value={String(module.id)}>
                    {module.module_code ? `${module.module_code} — ` : ""}
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subject (optional)</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No subject</option>
              {filteredSubjects.map((subject) => (
                <option key={subject.id} value={String(subject.id)}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assignment Brief (PDF/DOC)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(listPath)}
              className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`rounded-lg px-6 py-2.5 text-sm font-medium text-white ${
                isSubmitting ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isSubmitting ? "Saving..." : id ? "Update Assignment" : "Add Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
