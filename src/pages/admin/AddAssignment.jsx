import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";
import { useFloatingToast } from "../../hooks/useFloatingToast";
import { getApiErrorMessage } from "../../utils/apiErrors";

const AddAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError, Toast } = useFloatingToast();

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

    async function loadMeta() {
      try {
        const [coursesData, modulesData, meta] = await Promise.all([
          adminApi.courses.list(),
          adminApi.modules.list(),
          adminApi.assignments.meta(),
        ]);

        if (!mounted) return;
        setCourses(Array.isArray(coursesData) ? coursesData : []);
        setModules(Array.isArray(modulesData) ? modulesData : []);
        setSubjects(Array.isArray(meta?.subjects) ? meta.subjects : []);
      } catch (err) {
        if (mounted) showError(getApiErrorMessage(err, "Failed to load assignment options"));
      }
    }

    loadMeta();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    async function loadAssignment() {
      setLoading(true);
      try {
        const data = await adminApi.assignments.get(id);
        if (!mounted) return;
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
    return () => {
      mounted = false;
    };
  }, [id]);

  const filteredSubjects = useMemo(() => {
    if (!formData.module_id) return subjects;
    return subjects.filter((subject) => String(subject.module_id) === String(formData.module_id));
  }, [subjects, formData.module_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
      if (formData.subject_id) {
        payload.append("subject_id", formData.subject_id);
      }
      if (formData.attach_file) {
        payload.append("attach_file", formData.attach_file);
      }

      if (id) {
        await adminApi.assignments.update(id, payload);
        showSuccess("Assignment updated successfully!");
      } else {
        await adminApi.assignments.create(payload);
        showSuccess("Assignment added successfully!");
      }

      setTimeout(() => {
        navigate("/piu/admin/assignments");
      }, 900);
    } catch (err) {
      showError(getApiErrorMessage(err, "Failed to save assignment"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md p-8 text-center text-gray-500">
        Loading assignment...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <Toast />
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">{id ? "Edit Assignment" : "Add Assignment"}</h2>
        <p className="text-blue-100 mt-1">
          {id ? "Update assignment details" : "Create an assignment for students in a program"}
        </p>
      </div>

      <div className="p-6">
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
                <option value="">Choose course</option>
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
              >
                <option value="">Choose module</option>
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

          <div className="pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full md:w-auto px-6 py-3 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isSubmitting
                ? id
                  ? "Updating Assignment..."
                  : "Adding Assignment..."
                : id
                ? "Update Assignment"
                : "Add Assignment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAssignment;
