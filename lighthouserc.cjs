/** @type {import('@lhci/cli/src/types/lighthouserc').Lighthouserc} */
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
      },
    },
    assert: {
      assertions: {
        // Keep this gentle so it’s an "audit" not a blocker.
        "categories:seo": ["warn", { minScore: 0.8 }],
        "categories:accessibility": ["warn", { minScore: 0.8 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:performance": ["warn", { minScore: 0.5 }],
      },
    },
    upload: {
      target: "filesystem",
      outputDir: ".lhci",
    },
  },
};

