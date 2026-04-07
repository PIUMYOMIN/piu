import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { adminApi } from "../../api/admin";

const AddCurriculum = () => {
  const navigate = useNavigate();
  const params = useParams();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course_id: "",
    year_id: "",
    module_id: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [moduleOptions, setModuleOptions] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setLoadError("");
      try {
        const [courseData, yearData, moduleData] = await Promise.all([
          adminApi.courses.list(),
          adminApi.meta.years(),
          adminApi.modules.list(),
        ]);
        if (!mounted) return;
        setCourses(Array.isArray(courseData) ? courseData : []);
        setYears(Array.isArray(yearData) ? yearData : []);
        setModuleOptions(Array.isArray(moduleData) ? moduleData : []);

        if (params.id) {
          const cur = await adminApi.curriculums.get(params.id);
          if (!mounted) return;
          setFormData({
            title: cur?.title || "",
            description: cur?.description || "",
            course_id: cur?.course_id ? String(cur.course_id) : "",
            year_id: cur?.year_id ? String(cur.year_id) : "",
            module_id: cur?.module_id ? String(cur.module_id) : "",
          });
        }
      } catch (e) {
        if (!mounted) return;
        setLoadError(e?.response?.data?.message || e?.message || "Failed to load curriculum form");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [params.id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleDescriptionChange = (value) => {
    setFormData((prev) => ({ ...prev, description: value }));
    
    if (errors.description) {
      setErrors({
        ...errors,
        description: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (!formData.course_id) {
      newErrors.course = "Course is required";
    }
    
    if (!formData.year_id) {
      newErrors.year = "Year is required";
    }
    
    if (!formData.module_id) {
      newErrors.moduleCode = "Module is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        course_id: Number(formData.course_id),
        year_id: Number(formData.year_id),
        module_id: Number(formData.module_id),
      };

      if (params.id) {
        await adminApi.curriculums.update(params.id, payload);
      } else {
        await adminApi.curriculums.create(payload);
      }
      navigate("/piu/admin/curriculum-list");
    } catch (e2) {
      setLoadError(e2?.response?.data?.message || e2?.message || "Failed to save curriculum");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/piu/admin/curriculum-list");
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">
          {params.id ? "Edit Curriculum" : "Add New Curriculum"}
        </h2>
        <p className="text-blue-100 mt-1">
          {params.id 
            ? "Update the curriculum details below" 
            : "Create a new curriculum for academic programs"
          }
        </p>
      </div>

      <div className="p-6">
        {loadError && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {loadError}
          </div>
        )}

        {loading ? (
          <div className="py-10 text-center text-gray-500">Loading form...</div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.title 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                placeholder="Enter curriculum title"
                required
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.title}
                </p>
              )}
            </div>

            {/* Course */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Course <span className="text-red-500">*</span>
              </label>
              <select
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.course 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c.id} value={String(c.id)}>
                    {c.title}
                  </option>
                ))}
              </select>
              {errors.course && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.course}
                </p>
              )}
            </div>

            {/* Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year <span className="text-red-500">*</span>
              </label>
              <select
                name="year_id"
                value={formData.year_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.year 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              >
                <option value="">Select Year</option>
                {years.map((y) => (
                  <option key={y.id} value={String(y.id)}>
                    {y.name || `Year ${y.id}`}
                  </option>
                ))}
              </select>
              {errors.year && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.year}
                </p>
              )}
            </div>

            {/* Module */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Module <span className="text-red-500">*</span>
              </label>
              <select
                name="module_id"
                value={formData.module_id}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
                  errors.moduleCode 
                    ? "border-red-500 focus:ring-red-200" 
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                }`}
                required
              >
                <option value="">Select Module</option>
                {moduleOptions.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.module_code ? `${m.module_code} — ${m.name}` : m.name}
                  </option>
                ))}
              </select>
              {errors.moduleCode && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.moduleCode}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <ReactQuill
              theme="snow"
              value={formData.description}
              onChange={handleDescriptionChange}
              modules={quillModules}
              className="h-48 mb-16"
              placeholder="Enter detailed curriculum description..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <i className="fas fa-exclamation-circle mr-1"></i>
                {errors.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
              }`}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  {params.id ? "Updating..." : "Submitting..."}
                </>
              ) : (
                <>
                  <i className={`fas ${params.id ? "fa-save" : "fa-plus-circle"} mr-2`}></i>
                  {params.id ? "Update Curriculum" : "Add Curriculum"}
                </>
              )}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  );
};

export default AddCurriculum;