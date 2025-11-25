/** @type {import('next-sitemap').IConfig} */

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://bezlad-frontend.vercel.app";

const sitemapConfig = {
  siteUrl: SITE_URL,
  changefreq: "monthly",
  sitemapSize: 5000,
  priority: 0.7,
  generateIndexSitemap: false,
  exclude: ["/api/*"],
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: "/api/*" },
    ],
  },
  additionalPaths: async (config) => {
    const staticPages = [
      {
        loc: "/",
        changefreq: "weekly",
        priority: 1.0,
      },
      {
        loc: "/confirmation",
        changefreq: "monthly",
        priority: 0.6,
      },
      {
        loc: "/public-offer",
        changefreq: "monthly",
        priority: 0.6,
      },
    ];

    const staticPaths = await Promise.all(
      staticPages.map(async (page) => {
        const transformed = await config.transform(config, page.loc);
        return {
          ...transformed,
          changefreq: page.changefreq,
          priority: page.priority,
        };
      })
    );

    return [...staticPaths];
  },
};

// Експортуємо конфігурацію (CommonJS синтаксис)
module.exports = sitemapConfig;
