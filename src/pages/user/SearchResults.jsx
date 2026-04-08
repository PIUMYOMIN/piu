import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { v1, v2, toStorageUrl } from "../../utils/api";

function containsQuery(value, query) {
  return String(value || "").toLowerCase().includes(query);
}

export default function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = (searchParams.get("q") || "").trim().toLowerCase();
  const type = searchParams.get("type") || "all";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    courses: [],
    news: [],
    events: [],
    faculties: [],
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!query) return;
      setLoading(true);
      setError("");
      try {
        const [courses, news, events, faculties] = await Promise.all([
          v2.getCourses(),
          v2.getNews(),
          v2.getEvents(),
          v1.getTeam(),
        ]);

        if (!mounted) return;
        setData({
          courses: Array.isArray(courses) ? courses : [],
          news: Array.isArray(news) ? news : [],
          events: Array.isArray(events) ? events : [],
          faculties: Array.isArray(faculties) ? faculties : [],
        });
      } catch (e) {
        if (!mounted) return;
        setError("Failed to load search data. Please try again.");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [query]);

  const results = useMemo(() => {
    if (!query) return [];

    const courses = data.courses
      .filter(
        (c) =>
          containsQuery(c.title, query) ||
          containsQuery(c.description, query) ||
          containsQuery(c.category?.name, query)
      )
      .map((item) => ({
        type: "courses",
        title: item.title,
        subtitle: item.category?.name || "Course",
        image: toStorageUrl(item.image) || item.image,
        href: `/courses/${item.slug || item.id}`,
      }));

    const news = data.news
      .filter((n) => containsQuery(n.title, query) || containsQuery(n.body, query))
      .map((item) => ({
        type: "news",
        title: item.title,
        subtitle: "News",
        image: toStorageUrl(item.image) || item.image,
        href: `/news/${item.slug || item.id}`,
      }));

    const events = data.events
      .filter(
        (e) =>
          containsQuery(e.name, query) ||
          containsQuery(e.description, query) ||
          containsQuery(e.location, query)
      )
      .map((item) => ({
        type: "events",
        title: item.name,
        subtitle: item.location || "Event",
        image: toStorageUrl(item.image) || item.image,
        href: "/news?tab=events",
      }));

    const faculties = data.faculties
      .filter(
        (f) =>
          containsQuery(f.name, query) ||
          containsQuery(f.description, query) ||
          containsQuery(f.position?.name, query)
      )
      .map((item) => ({
        type: "faculties",
        title: item.name,
        subtitle: item.position?.name || "Faculty",
        image: toStorageUrl(item.profile) || item.profile,
        href: `/faculties/${item.slug || item.id}`,
      }));

    const combined = [...courses, ...news, ...events, ...faculties];
    if (type === "all") return combined;
    return combined.filter((item) => item.type === type);
  }, [data, query, type]);

  const setType = (nextType) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("q", query);
      p.set("type", nextType);
      return p;
    });
  };

  if (!query) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-gray-600">Enter a keyword to search.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-2">Search Results</h1>
      <p className="text-gray-600 mb-6">
        Query: <span className="font-semibold">{query}</span>
      </p>

      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "courses", "news", "events", "faculties"].map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setType(option)}
            className={`px-4 py-2 rounded-full border text-sm ${
              type === option ? "bg-green-700 text-white border-green-700" : "bg-white text-gray-700"
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : results.length === 0 ? (
        <div className="text-gray-600">No results found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {results.map((item, idx) => (
            <Link key={`${item.type}-${idx}`} to={item.href} className="bg-white rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition">
              <div className="h-40 bg-gray-100 overflow-hidden">
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                  }}
                />
              </div>
              <div className="p-4">
                <div className="text-xs uppercase text-green-700 font-semibold mb-1">{item.type}</div>
                <div className="font-semibold text-gray-900 line-clamp-2">{item.title}</div>
                <div className="text-sm text-gray-600 mt-1 line-clamp-1">{item.subtitle}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

