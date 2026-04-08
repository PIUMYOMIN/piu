import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import adminApi from "../../api/admin";
import { toStorageUrl } from "../../utils/api";
import { useAuth } from "../../contexts/AuthContext";

export default function MOUList() {
  const { user: authUser } = useAuth();
  const currentRole = String(
    authUser?.role?.name ??
      authUser?.role ??
      (Array.isArray(authUser?.roles) ? authUser.roles[0]?.name || authUser.roles[0] : "")
  ).toLowerCase();
  const isAdmin = currentRole === "admin";
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.partners.list();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to load MOU partners");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        String(i?.name || "").toLowerCase().includes(q) ||
        String(i?.web_address || "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const remove = async (item) => {
    if (!isAdmin) return;
    if (!window.confirm(`Delete "${item?.name}"?`)) return;
    try {
      await adminApi.partners.remove(item.id);
      await load();
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Failed to delete partner");
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="bg-[#002147] p-6 text-white">
        <h2 className="text-2xl font-bold">MOU Management</h2>
        <p className="text-blue-100 mt-1">Manage partner institutions</p>
      </div>

      <div className="p-6">
        {error && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <div className="flex justify-between items-center mb-6 gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search partner..."
            className="px-4 py-2 w-full sm:w-72 border border-gray-300 rounded-lg"
          />
          <Link to="/piu/admin/mou/add" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            Add MOU
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading && <div className="text-gray-500">Loading...</div>}
          {!loading &&
            filtered.map((mou) => (
              <div key={mou.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <img
                  src={toStorageUrl(mou.image) || mou.image || "https://via.placeholder.com/500x250?text=MOU"}
                  alt={mou.name}
                  className="w-full h-44 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{mou.name}</h3>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">{mou.description}</p>
                  <a href={mou.web_address} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline block mt-2">
                    {mou.web_address}
                  </a>
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => navigate("/piu/admin/mou/add", { state: { mou } })}
                      className="px-3 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700"
                    >
                      Edit
                    </button>
                    {isAdmin && (
                      <button onClick={() => remove(mou)} className="px-3 py-1 rounded bg-red-50 hover:bg-red-100 text-red-700">
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {!loading && filtered.length === 0 && <div className="text-center text-gray-500 py-8">No MOU records found</div>}
      </div>
    </div>
  );
}
