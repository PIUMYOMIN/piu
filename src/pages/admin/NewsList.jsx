import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState([
    {
      id: 1,
      title: "University Announces New Research Center",
      description: "Groundbreaking research facility to open next semester",
      content: "<p>Welcome to our new research center focused on AI and machine learning!</p>",
      author: "Admin",
      category: "Research",
      date: "2025-01-10",
      image: "https://images.unsplash.com/photo-1584697964358-3e14ca57658b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      status: "published",
      views: 1250
    },
    {
      id: 2,
      title: "Annual Science Fair Results",
      description: "Students showcase innovative projects at science fair",
      content: "<p>Congratulations to all participants in our annual science fair!</p>",
      author: "Editor",
      category: "Events",
      date: "2025-02-05",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      status: "published",
      views: 890
    },
    {
      id: 3,
      title: "New Scholarship Opportunities",
      description: "University introduces new scholarship programs for 2025",
      content: "<p>Apply now for our newly announced scholarship opportunities.</p>",
      author: "Admin",
      category: "Admissions",
      date: "2025-01-25",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80",
      status: "draft",
      views: 0
    }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this news article?")) {
      setNews(news.filter((newsItem) => newsItem.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setNews(news.map(newsItem => 
      newsItem.id === id 
        ? { ...newsItem, status: newsItem.status === "published" ? "draft" : "published" } 
        : newsItem
    ));
  };

  // Filter news based on search and filters
  const filteredNews = news.filter(newsItem => {
    const matchesSearch = newsItem.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          newsItem.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || newsItem.category === categoryFilter;
    const matchesStatus = statusFilter === "all" || newsItem.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Get unique categories for filter
  const categories = [...new Set(news.map(newsItem => newsItem.category))];

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-8xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">News Management</h2>
        <p className="text-blue-100 mt-1">Manage news articles and announcements</p>
      </div>

      <div className="p-6">
        {/* Search and Add Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search news..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-40">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-tag text-gray-400"></i>
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
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
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <i className="fas fa-chevron-down text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/piu/admin/add-news")}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap w-full lg:w-auto"
          >
            <i className="fas fa-plus-circle mr-2"></i>
            Add News
          </button>
        </div>

        {/* News Table */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Article
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stats
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
              {filteredNews.map((newsItem) => (
                <tr key={newsItem.id} className="hover:bg-gray-50 transition-colors">
                  {/* Article Info */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <img
                          className="h-12 w-12 rounded-lg object-cover"
                          src={newsItem.image}
                          alt={newsItem.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {newsItem.title}
                        </div>
                        <div className="text-sm text-gray-500 line-clamp-2">
                          {newsItem.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  {/* Details */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <i className="fas fa-user mr-2 text-blue-500"></i>
                      {newsItem.author}
                    </div>
                    <div className="text-sm text-gray-500">
                      <i className="fas fa-tag mr-2 text-blue-500"></i>
                      {newsItem.category}
                    </div>
                    <div className="text-sm text-gray-500">
                      <i className="fas fa-calendar mr-2 text-blue-500"></i>
                      {formatDate(newsItem.date)}
                    </div>
                  </td>
                  
                  {/* Stats */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      <i className="fas fa-eye mr-2 text-blue-500"></i>
                      {newsItem.views.toLocaleString()} views
                    </div>
                  </td>
                  
                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      newsItem.status === "published" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {newsItem.status === "published" ? "Published" : "Draft"}
                    </span>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => toggleStatus(newsItem.id)}
                        className={`text-xs px-3 py-1 rounded ${
                          newsItem.status === "published"
                            ? "text-gray-700 bg-gray-100 hover:bg-gray-200"
                            : "text-green-700 bg-green-100 hover:bg-green-200"
                        }`}
                      >
                        {newsItem.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                      <button
                        onClick={() => navigate(`/piu/admin/add-news/edit/${newsItem.id}`, { state: newsItem })}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-md transition-colors"
                        title="Edit news"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(newsItem.id)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-md transition-colors"
                        title="Delete news"
                      >
                        <i className="fas fa-trash-alt mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Empty State */}
          {filteredNews.length === 0 && (
            <div className="px-6 py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <i className="fas fa-newspaper text-2xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No news articles found</h3>
              <p className="text-gray-500">
                {searchTerm || categoryFilter !== "all" || statusFilter !== "all" 
                  ? "Try adjusting your search or filters" 
                  : "Get started by adding your first news article"
                }
              </p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredNews.length} of {news.length} articles
        </div>
      </div>
    </div>
  );
};

export default NewsList;