import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png";

export const SITE_NAME = "Phaung Daw Oo International University";
export const SITE_URL = "https://www.piueducation.org";
export const DEFAULT_DESCRIPTION =
  "Explore programs, admissions, faculty, news, and campus updates from Phaung Daw Oo International University in Mandalay, Myanmar.";
export const DEFAULT_IMAGE = new URL(logoImage, SITE_URL).toString();

function normalizePath(pathname = "/") {
  if (!pathname || pathname === "/") return "/";
  return pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
}

function toAbsoluteUrl(value, fallbackPathname = "/") {
  if (!value) {
    return new URL(normalizePath(fallbackPathname), SITE_URL).toString();
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  const normalized = value.startsWith("/") ? value : `/${value}`;
  return new URL(normalized, SITE_URL).toString();
}

function ensureElement(selector, factory) {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = factory();
    document.head.appendChild(element);
  }
  return element;
}

function setMetaByName(name, content) {
  const element = ensureElement(`meta[name="${name}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", name);
    return meta;
  });
  element.setAttribute("content", content);
}

function setMetaByProperty(property, content) {
  const element = ensureElement(`meta[property="${property}"]`, () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", property);
    return meta;
  });
  element.setAttribute("content", content);
}

function setCanonical(href) {
  const link = ensureElement('link[rel="canonical"]', () => {
    const node = document.createElement("link");
    node.setAttribute("rel", "canonical");
    return node;
  });
  link.setAttribute("href", href);
}

function setStructuredData(data) {
  const selector = 'script[data-seo-structured-data="true"]';

  if (!data) {
    document.head.querySelector(selector)?.remove();
    return;
  }

  const script = ensureElement(selector, () => {
    const node = document.createElement("script");
    node.type = "application/ld+json";
    node.setAttribute("data-seo-structured-data", "true");
    return node;
  });

  script.textContent = JSON.stringify(data);
}

export function stripHtml(html = "") {
  return String(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function truncateText(value = "", maxLength = 160) {
  const normalized = String(value).replace(/\s+/g, " ").trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }
  return `${normalized.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function buildTitle(title) {
  if (!title) return SITE_NAME;
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
}

export function applySeo(input = {}, pathname = "/") {
  if (typeof document === "undefined") {
    return;
  }

  const resolvedPath = normalizePath(input.canonicalPath || pathname);
  const title = buildTitle(input.title);
  const description = truncateText(input.description || DEFAULT_DESCRIPTION, 160);
  const canonicalUrl = toAbsoluteUrl(resolvedPath, pathname);
  const image = toAbsoluteUrl(input.image || DEFAULT_IMAGE, pathname);
  const robots = input.robots || (input.noindex ? "noindex,nofollow" : "index,follow");
  const type = input.type || "website";

  document.title = title;

  setCanonical(canonicalUrl);
  setMetaByName("description", description);
  setMetaByName("robots", robots);

  if (input.keywords) {
    setMetaByName("keywords", input.keywords);
  }

  setMetaByProperty("og:site_name", SITE_NAME);
  setMetaByProperty("og:title", title);
  setMetaByProperty("og:description", description);
  setMetaByProperty("og:type", type);
  setMetaByProperty("og:url", canonicalUrl);
  setMetaByProperty("og:image", image);

  setMetaByName("twitter:card", "summary_large_image");
  setMetaByName("twitter:title", title);
  setMetaByName("twitter:description", description);
  setMetaByName("twitter:image", image);

  setStructuredData(input.structuredData || null);
}

export function useSeo(input = {}) {
  const location = useLocation();
  const serialized = JSON.stringify(input);

  useEffect(() => {
    applySeo(input, location.pathname);
  }, [input, location.pathname, serialized]);
}

export function RouteSeo(props) {
  useSeo(props);
  return null;
}
