import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GalleryList = () => {
  const navigate = useNavigate();

  // Simulated gallery list
  const [gallery, setGallery] = useState([
    { id: 1, tag: "Banner 1", link1: "#", link2: "#", active: true },
    { id: 2, tag: "Event Photo", link1: "#", link2: "#", active: false },
  ]);

  const handleEdit = (id) => {
    navigate(`/piu/admin/gallery/add/${id}`);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      setGallery(gallery.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Gallery List</h2>
        <button
          onClick={() => navigate("/piu/admin/gallery/add")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Image
        </button>
      </div>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-2 py-1">#</th>
            <th className="border px-2 py-1">Tag</th>
            <th className="border px-2 py-1">Image</th>
            <th className="border px-2 py-1">Link 1</th>
            <th className="border px-2 py-1">Link 2</th>
            <th className="border px-2 py-1">Active</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {gallery.map((item, index) => (
            <tr key={item.id} className="text-center">
              <td className="border px-2 py-1">{index + 1}</td>
              <td className="border px-2 py-1">{item.tag}</td>
              <td className="border px-2 py-1">[Image]</td>
              <td className="border px-2 py-1">{item.link1}</td>
              <td className="border px-2 py-1">{item.link2}</td>
              <td className="border px-2 py-1">
                <input type="checkbox" checked={item.active} readOnly />
              </td>
              <td className="border px-2 py-1">
                <button
                  onClick={() => handleEdit(item.id)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {gallery.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center py-4 text-gray-500">
                No gallery images found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GalleryList;
