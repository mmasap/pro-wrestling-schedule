// @ts-check

import preact from "@astrojs/preact";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";

import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://pro-wrestling-schedule.pages.dev",
    output: "static",
    integrations: [preact(), sitemap()],

    vite: {
        plugins: [tailwindcss()],
    },
});