import React from "react";

export const STATUS_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
];

export const PUBLISH_FILTER_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Published" },
  { value: "inactive", label: "Draft" },
];

export default function ManagementFilters({
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search...",
  statusValue,
  onStatusChange,
  showStatus = false,
  statusOptions = STATUS_FILTER_OPTIONS,
  filters = [],
  onReset,
  actions,
  summary,
}) {
  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
      <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full lg:flex-1">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="px-4 py-2 w-full sm:w-72 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {showStatus && onStatusChange && (
          <select
            value={statusValue}
            onChange={(e) => onStatusChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 sm:w-auto"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {filters.map((filter) => (
          <select
            key={filter.key}
            value={filter.value}
            onChange={(e) => filter.onChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 sm:w-auto"
          >
            {filter.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ))}

        {onReset && (
          <button
            type="button"
            onClick={onReset}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Reset
          </button>
        )}
      </div>

      {(actions || summary) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto shrink-0">
          {summary && <span className="text-sm text-gray-500 whitespace-nowrap">{summary}</span>}
          {actions}
        </div>
      )}
    </div>
  );
}
