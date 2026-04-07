import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/admin";

const CurriculumList = () => {
  const navigate = useNavigate();

  const [curriculums, setCurriculums] = useState([]);
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [courseFilter, setCourseFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [curData, courseData, yearsData, modulesData] = await Promise.all([
        adminApi.curriculums.list(),
        adminApi.courses.list(),
        adminApi.meta.years(),
        adminApi.modules.list(),
      ]);
      setCurriculums(Array.isArray(curData) ? curData : []);
      setCourses(Array.isArray(courseData) ? courseData : []);
      setYears(Array.isArray(yearsData) ? yearsData : []);
      setModules(Array.isArray(modulesData) ? modulesData : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load curriculums");
      setCurriculums([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const coursesById = useMemo(() => new Map(courses.map((c) => [String(c.id), c])), [courses]);
  const yearsById = useMemo(() => new Map(years.map((y) => [String(y.id), y])), [years]);
  const modulesById = useMemo(() => new Map(modules.map((m) => [String(m.id), m])), [modules]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this curriculum?")) return;
    try {
      await adminApi.curriculums.remove(id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete curriculum");
    }
  };

  // Filter curriculums based on search and filters
  const filteredCurriculums = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return curriculums.filter((curriculum) => {
      const module = modulesById.get(String(curriculum.module_id));
      const course = coursesById.get(String(curriculum.course_id));
      const year = yearsById.get(String(curriculum.year_id));

      const matchesSearch =
        !q ||
        String(curriculum.title || "").toLowerCase().includes(q) ||
        String(module?.module_code || "").toLowerCase().includes(q) ||
        String(module?.name || "").toLowerCase().includes(q);

      const matchesCourse = courseFilter === "all" || String(curriculum.course_id) === String(courseFilter);
      const matchesYear = yearFilter === "all" || String(curriculum.year_id) === String(yearFilter);

      // curriculum doesn't have status column in DB; keep filter for future compatibility.
      const status = curriculum.status || curriculum.is_active;
      const normalizedStatus = status === true ? "active" : status === false ? "inactive" : String(status || "active").toLowerCase();
      const matchesStatus = statusFilter === "all" || normalizedStatus === statusFilter;

      return matchesSearch && matchesCourse && matchesYear && matchesStatus;
    });
  }, [curriculums, searchTerm, courseFilter, yearFilter, statusFilter, modulesById, coursesById, yearsById]);

  const courseOptions = useMemo(() => {
    return courses
      .map((c) => ({ id: String(c.id), title: c.title }))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [courses]);

  const yearOptions = useMemo(() => {
    return years
      .map((y) => ({ id: String(y.id), name: y.name || y.title || `Year ${y.id}` }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [years]);

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">Curriculum Management</h2>
        <p className="text-blue-100 mt-1">Manage academic curricula and course offerings</p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search curricula..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-48">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-graduation-cap text-gray-400"></i>
                </div>
                <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Courses</option>
                  {courseOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              
              <div className="relative w-full sm:w-32">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-calendar-alt text-gray-400"></i>
                </div>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Years</option>
                  {yearOptions.map((y) => (
                    <option key={y.id} value={y.id}>
                      {y.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
              
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-user-check text-gray-400"></i>
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/piu/admin/add-curriculum")}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            New Curriculum
          </button>
        </div>

        {/* Curriculum Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Module
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Course & Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading && (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    Loading curriculums...
                  </td>
                </tr>
              )}

              {!loading &&
                filteredCurriculums.map((curriculum) => {
                  const course = coursesById.get(String(curriculum.course_id));
                  const year = yearsById.get(String(curriculum.year_id));
                  const module = modulesById.get(String(curriculum.module_id));
                  const status = curriculum.status || curriculum.is_active;
                  const isActive =
                    status === true ? true : status === false ? false : String(status || "active").toLowerCase() === "active";
                  return (
                <tr key={curriculum.id} className="hover:bg-gray-50 transition-colors">
                  {/* Module Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {curriculum.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {module?.module_code || module?.code || `Module #${curriculum.module_id ?? "-"}`}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {curriculum.description}
                      </div>
                    </div>
                  </td>
                  
                  {/* Course & Year */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{course?.title || `Course #${curriculum.course_id ?? "-"}`}</div>
                    <div className="text-sm text-gray-500">
                      {year?.name || `Year #${curriculum.year_id ?? "-"}`}
                    </div>
                  </td>
                  
                  {/* Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{module?.credit ?? "—"}</span> Credits
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/piu/admin/add-curriculum/edit/${curriculum.id}`)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        title="Edit curriculum"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(curriculum.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        title="Delete curriculum"
                      >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
                  );
                })}
            </tbody>
          </table>
          
          {/* Empty State */}
          {!loading && filteredCurriculums.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-book-open text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No curricula found</h3>
              <p className="text-gray-500">
                {searchTerm || courseFilter !== "all" || yearFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first curriculum"
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredCurriculums.length} of {curriculums.length} curricula
        </div>
      </div>
    </div>
  );
};

export default CurriculumList;