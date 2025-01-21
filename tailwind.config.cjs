const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import("tailwindcss").Config} */
module.exports = {
  plugins: [require("@tailwindcss/typography")],
  content: [
    "./src/**/*.{js,jsx,mdx}",
    "./components/**/*.{js,jsx}",
    "./public/**/*.svg",
  ],
  theme: {
    colors: {
      base03: "#002b36",
      base02: "#073642",
      base01: "#586e75",
      base00: "#657b83",
      base0: "#839496",
      base1: "#93a1a1",
      base2: "#eee8d5",
      base3: "#fdf6e3",
      yellow: "#b58900",
      orange: "#cb4b16",
      red: "#dc322f",
      magenta: "#d33682",
      violet: "#6c71c4",
      blue: "#268bd2",
      cyan: "#2aa198",
      green: "#859900",
    },

    fontFamily: {
      mona: ["Mona Sans", ...fontFamily.sans],
      hubot: ["Hubot Sans", ...fontFamily.sans],
    },

    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            "maxWidth": "42rem",
            "--tw-prose-body": theme("colors.base00"),
            "--tw-prose-headings": theme("colors.base01"),
            "--tw-prose-links": theme("colors.blue"),
            "--tw-prose-bold": theme("colors.base00"),
            "--tw-prose-counters": theme("colors.base01"),
            "--tw-prose-bullets": theme("colors.base01"),
            "--tw-prose-hr": theme("colors.base2"),
            "--tw-prose-quotes": theme("colors.base00"),
            "--tw-prose-quote-borders": theme("colors.base2"),
            "--tw-prose-captions": theme("colors.base1"),
            "--tw-prose-code": theme("colors.base00"),
            "--tw-prose-pre-code": theme("colors.base00"),
            "--tw-prose-pre-bg": theme("colors.base2"),
            "--tw-prose-th-borders": theme("colors.base2"),
            "--tw-prose-td-borders": theme("colors.base2"),
            "--tw-prose-invert-body": theme("colors.base0"),
            "--tw-prose-invert-headings": theme("colors.base1"),
            "--tw-prose-invert-links": theme("colors.blue"),
            "--tw-prose-invert-bold": theme("colors.base0"),
            "--tw-prose-invert-counters": theme("colors.base1"),
            "--tw-prose-invert-bullets": theme("colors.base1"),
            "--tw-prose-invert-hr": theme("colors.base02"),
            "--tw-prose-invert-quotes": theme("colors.base0"),
            "--tw-prose-invert-quote-borders": theme("colors.base02"),
            "--tw-prose-invert-captions": theme("colors.base01"),
            "--tw-prose-invert-code": theme("colors.base0"),
            "--tw-prose-invert-pre-code": theme("colors.base0"),
            "--tw-prose-invert-pre-bg": theme("colors.base02"),
            "--tw-prose-invert-th-borders": theme("colors.base02"),
            "--tw-prose-invert-td-borders": theme("colors.base02"),

            "h1": { fontFamily: theme("fontFamily.hubot").join(",") },
            "h2": { fontFamily: theme("fontFamily.hubot").join(",") },
            "h3": { fontFamily: theme("fontFamily.hubot").join(",") },
            "h4": { fontFamily: theme("fontFamily.hubot").join(",") },
            "p": { fontFamily: theme("fontFamily.mona").join(",") },
            "a": {
              fontFamily: theme("fontFamily.mona").join(","),
              textUnderlineOffset: "4px",
            },
            "strong": {
              fontFamily: theme("fontFamily.mona").join(","),
            },
            "figcaption": {
              fontFamily: theme("fontFamily.mona").join(","),
              textAlign: "center",
            },
            "code": { fontFamily: "monospace" },
            "th": { fontFamily: theme("fontFamily.hubot").join(",") },
            "td": { fontFamily: theme("fontFamily.mona").join(",") },
            "blockquote": {
              fontFamily: theme("fontFamily.hubot").join(","),
            },
            "img": {
              width: "100%",
            },
          },
        },
      }),
    },
  },
};
