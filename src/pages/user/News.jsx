import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import LoadingSpinner from "../../components/user/LoadingSpinner";
import { v2 } from "../../api/v2";
import { toStorageUrl } from "../../api/axios";

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

function getImageUrl(imagePath) {
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
  }
  return toStorageUrl(imagePath) || imagePath;
}

export default function NewsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "all"; // all | news | events

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const [newsData, eventsData] = await Promise.all([v2.getNews(), v2.getEvents()]);
        if (!mounted) return;
        setNews(Array.isArray(newsData) ? newsData : []);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load news & events");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const availableTabs = useMemo(() => {
    const hasNews = news.length > 0;
    const hasEvents = events.length > 0;
    const tabs = [{ id: "all", label: "All" }];
    if (hasNews) tabs.push({ id: "news", label: "News" });
    if (hasEvents) tabs.push({ id: "events", label: "Events" });
    return tabs;
  }, [news.length, events.length]);

  const activeTab = availableTabs.some((t) => t.id === tab) ? tab : "all";

  const items = useMemo(() => {
    if (activeTab === "news") return news.map((n) => ({ kind: "news", ...n }));
    if (activeTab === "events") return events.map((e) => ({ kind: "event", ...e }));
    return [
      ...news.map((n) => ({ kind: "news", ...n })),
      ...events.map((e) => ({ kind: "event", ...e })),
    ].sort((a, b) => {
      const ad = new Date(a.created_at || a.date || 0).getTime();
      const bd = new Date(b.created_at || b.date || 0).getTime();
      return bd - ad;
    });
  }, [activeTab, news, events]);

  const setTab = (next) => {
    setSearchParams((prev) => {
      const p = new URLSearchParams(prev);
      p.set("tab", next);
      return p;
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-center py-16">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 font-robotoSlab">
      <div className="rounded-3xl overflow-hidden border border-gray-100 bg-white shadow-sm">
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 px-6 py-10 md:px-10 text-white">
          <h1 className="text-3xl md:text-4xl font-extrabold">News & Events</h1>
          <p className="mt-2 text-white/90 max-w-2xl">
            Latest updates, announcements, and campus events.
          </p>
        </div>

        <div className="px-6 py-6 md:px-10">
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-2 mb-6">
            {availableTabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                  activeTab === t.id
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-slate-50 p-10 text-center text-gray-600">
              No data available.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((item) => {
                const title = item.title || item.name || "Untitled";
                const date = item.created_at || item.date;
                const image = item.image || item.thumbnail || item.cover;
                const href =
                  item.kind === "news"
                    ? `/news/${item.slug || item.id}`
                    : "#!";

                const Card = (
                  <div className="group rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-lg transition overflow-hidden">
                    <div className="relative h-52 bg-slate-100 overflow-hidden">
                      <img
                        src={getImageUrl(image)}
                        alt={title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80";
                        }}
                      />
                      <div className="absolute top-3 left-3 rounded-full bg-black/60 text-white text-xs font-semibold px-3 py-1">
                        {item.kind === "news" ? "News" : "Event"}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="text-lg font-extrabold text-gray-900 line-clamp-2">{title}</div>
                      <div className="mt-2 text-sm text-gray-600">{formatDate(date)}</div>
                      {item.kind === "event" && item.location && (
                        <div className="mt-1 text-sm text-gray-600 truncate">{item.location}</div>
                      )}
                      <div className="mt-4 text-sm font-semibold text-emerald-700">
                        {item.kind === "news" ? "Read more →" : "Details coming soon"}
                      </div>
                    </div>
                  </div>
                );

                return item.kind === "news" ? (
                  <Link key={`${item.kind}-${item.id}`} to={href}>
                    {Card}
                  </Link>
                ) : (
                  <div key={`${item.kind}-${item.id}`}>{Card}</div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

