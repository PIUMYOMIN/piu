import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const NewsList = () => {
  const navigate = useNavigate();

  const [news, setNews] = useState([
    {
      id: 1,
      title: "First news",
      description: "Introduction to our website",
      content: "<p>Welcome to our site!</p>",
      author: "Admin",
      category: "General",
      date: "2025-01-10",
      image: "https://via.placeholder.com/50"
    },
    {
      id: 2,
      title: "Second news",
      description: "Updates and news",
      content: "<p>Latest updates here</p>",
      author: "Editor",
      category: "News",
      date: "2025-02-05",
      image: "https://via.placeholder.com/50"
    }
  ]);

  const handleDelete = (id) => {
    setnewss(news.filter((news) => news.id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">News</h2>
        <button
          className="bg-green-600 text-white px-3 py-2 rounded text-sm"
          onClick={() => navigate("/piu/admin/add-news")}
        >
          + Add News
        </button>
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm">
              <th className="border p-2">Image</th>
              <th className="border p-2">Title</th>
              <th className="border p-2">Author</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Edit</th>
              <th className="border p-2">Delete</th>
            </tr>
          </thead>
          <tbody>
            {news.map((news) => (
              <tr key={news.id} className="text-sm">
                <td className="border p-2">
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-10 h-10 rounded"
                  />
                </td>
                <td className="border p-2">{news.title}</td>
                <td className="border p-2">{news.author}</td>
                <td className="border p-2">{news.category}</td>
                <td className="border p-2">{news.date}</td>
                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-blue-600 text-white rounded text-xs"
                    onClick={() =>
                      navigate(`/piu/admin/add-news/edit/${news.id}`, {
                        state: news
                      })
                    }
                  >
                    Edit
                  </button>
                </td>
                <td className="border p-2">
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded text-xs"
                    onClick={() => handleDelete(news.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NewsList;
