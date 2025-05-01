var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// utils/shared.ts
var EXTERNAL_URL_RE, withBase, joinPath, isString, isObject;
var init_shared = __esm({
  "utils/shared.ts"() {
    "use strict";
    EXTERNAL_URL_RE = /^[a-z]+:/i;
    withBase = (base, path2) => {
      return EXTERNAL_URL_RE.test(path2) || !path2.startsWith("/") ? path2 : joinPath(base, path2);
    };
    joinPath = (base, ...paths) => `${base}/${paths.join("/")}`.replace(/\/+/g, "/");
    isString = (value) => Object.prototype.toString.call(value) === "[object String]";
    isObject = (val) => Object.prototype.toString.call(val) === "[object Object]";
  }
});

// utils/node/index.ts
import { spawnSync } from "node:child_process";
function getFileBirthTime(url) {
  try {
    const infoStr = spawnSync("git", ["log", '--pretty="%ci"', url]).stdout?.toString().replace(/["']/g, "").trim();
    const timeList = infoStr.split("\n").filter((item) => Boolean(item.trim()));
    if (timeList.length > 0) {
      return new Date(timeList.pop()).getTime();
    }
  } catch (error) {
    return void 0;
  }
}
var init_node = __esm({
  "utils/node/index.ts"() {
    "use strict";
  }
});

// config/rss.ts
var rss_exports = {};
__export(rss_exports, {
  genFeed: () => genFeed
});
import fs from "node:fs";
import matter from "gray-matter";
import path from "node:path";
import { Feed } from "feed";
import { normalizePath } from "vite";
var genFeed;
var init_rss = __esm({
  "config/rss.ts"() {
    "use strict";
    init_node();
    init_shared();
    genFeed = async (config) => {
      const { themeConfig, base, title, description } = config.site;
      const { rss } = themeConfig;
      const posts = [];
      const postDir = ((themeConfig.postDir ?? "posts") + "/").replace(/\/+/, "/");
      const files = config.pages.filter((item) => item.startsWith(postDir));
      const { createMarkdownRenderer } = await import("vitepress");
      const mdRender = await createMarkdownRenderer(config.srcDir, config.markdown, base, config.logger);
      for (const file of files) {
        const filePath = config.root + "/" + file;
        const fileContent = fs.readFileSync(filePath, "utf-8");
        let excerpt = "";
        const { data: meta } = matter(fileContent, {
          //@ts-ignore
          excerpt: ({ content }) => {
            const reg = /<!--\s*more\s*-->/gs;
            const rpt = reg.exec(content);
            excerpt = rpt ? content.substring(0, rpt.index) : "";
          }
        });
        if (!meta.title) {
          const title2 = /^#\s(.+)/gm.exec(fileContent);
          if (title2) {
            meta.title = title2[1].trim();
          } else {
            meta.title = path.basename(file).replace(new RegExp(`${path.extname(file)}$`), "");
          }
        }
        const timeZone = themeConfig.timeZone ?? 8;
        if (!meta.date) {
          meta.date = getFileBirthTime(file);
          if (!meta.date) {
            const { birthtimeMs } = fs.statSync(filePath);
            meta.date = birthtimeMs;
          }
        } else {
          meta.date = (/* @__PURE__ */ new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)).getTime();
        }
        meta.description = meta.description ? meta.description : excerpt ? mdRender.render(excerpt) : void 0;
        const cover = themeConfig.cover;
        if (Array.isArray(meta.cover)) {
          meta.cover = meta.cover[0];
        }
        if (!isString(meta.cover)) {
          meta.cover = isString(cover?.default) ? cover?.default : "";
        }
        const html = mdRender.render(fileContent);
        const url = config.site.base + normalizePath(path.relative(config.srcDir, filePath)).replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, config.cleanUrls ? "" : ".html");
        posts.push({
          url,
          filepath: filePath,
          html,
          description: meta.description,
          date: meta.date,
          title: meta.title,
          meta
        });
      }
      posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));
      if (void 0 !== rss?.limit && rss?.limit > 0) {
        posts.splice(rss.limit);
      }
      const feed = new Feed({
        id: rss?.baseUrl ?? "",
        link: rss?.baseUrl,
        title,
        description,
        copyright: "",
        ...rss?.feedOptions ?? {}
      });
      for (const post of posts) {
        const { title: title2, html, description: description2, date, meta, url } = post;
        const author = meta?.author || themeConfig.author || "";
        const link = `${themeConfig?.rss?.baseUrl}${url}`;
        let cover = meta?.cover;
        if (cover && !/^http|^\/\//.test(cover)) {
          cover = `${rss?.baseUrl}${(config.site.base + cover).replace("//", "/")}`;
        }
        feed.addItem({
          title: title2,
          id: link,
          link,
          description: description2,
          content: html,
          author: [
            {
              name: author
            }
          ],
          image: cover,
          date: new Date(date)
        });
      }
      const RSSFilename = rss?.fileName || "feed.rss";
      const RSSFilepath = path.join(config.outDir, RSSFilename);
      fs.writeFileSync(RSSFilepath, /\.rss$/.test(RSSFilename) ? feed.rss2() : /\.xml$/.test(RSSFilename) ? feed.atom1() : /\.json$/.test(RSSFilename) ? feed.json1() : feed.rss2());
      console.log();
      console.log("\u{1F389} RSS generated", RSSFilename);
      console.log("\u2705 rss filepath:", RSSFilepath);
      console.log("\u2705 rss url:", `${rss?.baseUrl}${config.site.base + RSSFilename}`);
      console.log("\u2705 include", posts.length, "posts");
      console.log();
    };
  }
});

// config/index.ts
init_shared();
import { mergeConfig as mergeViteConfig } from "vite";

// package.json
var version = "0.0.23";
var homepage = "https://vitepress-theme-async.imalun.com";

// config/languages.ts
var languages_default = {
  "zh-Hans": {
    site: {
      title: "\u672C\u7AD9\u4FE1\u606F",
      webmaster: "\u7F51\u7AD9\u540D\u79F0",
      domain: "\u7F51\u7AD9\u94FE\u63A5",
      avatar: "\u7F51\u7AD9\u5934\u50CF",
      describe: "\u7F51\u7AD9\u7B80\u4ECB",
      ruleText: "\u53CB\u94FE\u8981\u6C42",
      contactMe: "\u8054\u7CFB\u6211"
    },
    title: {
      links: "\u53CB\u60C5\u94FE\u63A5",
      newPublish: "\u6700\u8FD1\u53D1\u5E03",
      comment: "\u7559\u8A00\u677F",
      author: "\u4F5C\u8005",
      blog: "\u535A\u5BA2",
      privacy: "\u9690\u79C1\u6743\u53CA\u8BC4\u8BBA",
      more: "\u67E5\u770B\u5206\u7C7B",
      allArchives: "\u6240\u6709\u5F52\u6863",
      yearArchives: "{0} \u5E74\u7684\u5F52\u6863",
      otherArticles: "\u5176\u4ED6\u6587\u7AE0",
      unclassified: "\u672A\u5206\u7C7B"
    },
    menu: {
      home: "\u9996\u9875",
      archives: "\u5F52\u6863",
      categorys: "\u5206\u7C7B",
      tags: "\u6807\u7B7E",
      links: "\u53CB\u94FE",
      about: "\u5173\u4E8E"
    },
    favicon: {
      showText: "(/\u2267\u25BD\u2266/)\u54A6\uFF01\u53C8\u597D\u4E86\uFF01",
      hideText: "(\u25CF\u2014\u25CF)\u5594\u54DF\uFF0C\u5D29\u6E83\u5566\uFF01"
    },
    post: {
      sticky: "\u7F6E\u9876",
      noticeOutdateMessage: "\u8DDD\u79BB\u4E0A\u6B21\u66F4\u65B0\u5DF2\u7ECF {0} \u5929\u4E86, \u6587\u7AE0\u5185\u5BB9\u53EF\u80FD\u5DF2\u7ECF\u8FC7\u65F6\u3002",
      rewardComment: "\u6211\u5F88\u53EF\u7231\uFF0C\u8BF7\u7ED9\u6211\u94B1",
      copyright: {
        author: "\u672C\u6587\u4F5C\u8005",
        link: "\u672C\u6587\u94FE\u63A5",
        licenseTitle: "\u7248\u6743\u58F0\u660E",
        licenseContent: "\u672C\u535A\u5BA2\u6240\u6709\u6587\u7AE0\u9664\u7279\u522B\u58F0\u660E\u5916\uFF0C\u5747\u9ED8\u8BA4\u91C7\u7528 {0} \u8BB8\u53EF\u534F\u8BAE\u3002"
      }
    },
    rightside: {
      search: "\u641C\u7D22",
      backToTop: "\u8FD4\u56DE\u9876\u90E8",
      toc: "\u6587\u7AE0\u76EE\u5F55",
      theme: {
        dark: "\u5207\u6362\u5230\u6697\u9ED1\u6A21\u5F0F",
        light: "\u5207\u6362\u5230\u660E\u4EAE\u6A21\u5F0F"
      },
      aside: {
        open: "\u5207\u6362\u5355\u680F\u6A21\u5F0F",
        exit: "\u9000\u51FA\u5355\u680F\u6A21\u5F0F"
      },
      readMode: {
        open: "\u8FDB\u5165\u9605\u8BFB\u6A21\u5F0F",
        exit: "\u9000\u51FA\u9605\u8BFB\u6A21\u5F0F"
      }
    },
    footer: {
      powered: "\u7531 {0} \u9A71\u52A8",
      theme: "\u4E3B\u9898",
      tips: "\u535A\u5BA2\u5DF2\u840C\u840C\u54D2\u8FD0\u884C {0} \u5929",
      day: "\u5929",
      hour: "\u65F6",
      minute: "\u5206",
      seconds: "\u79D2"
    },
    symbol: {
      comma: "\uFF0C",
      period: "\u3002",
      colon: "\uFF1A"
    },
    notFound: {
      title: "404 \u672A\u627E\u5230\u9875\u9762",
      text: "\u60A8\u6B63\u5728\u67E5\u627E\u7684\u9875\u9762\u4E0D\u5B58\u5728\u3002\u60A8\u662F\u600E\u4E48\u5230\u8FD9\u91CC\u6765\u7684\u662F\u4E2A\u8C1C,\u4F46\u662F\u60A8\u53EF\u4EE5\u70B9\u51FB\u4E0B\u9762\u7684\u6309\u94AE\u8FD4\u56DE\u4E3B\u9875\u3002",
      name: "\u9996\u9875"
    }
  },
  en: {
    site: {
      title: "Site Information",
      webmaster: "Webmaster",
      domain: "Domain",
      avatar: "Avatar",
      describe: "Describe",
      ruleText: "Friend chain requirements",
      contactMe: "Contact Me"
    },
    title: {
      links: "Friendly Link",
      newPublish: "Newest Publications",
      comment: "Message",
      author: "Author",
      blog: "Blog Application",
      privacy: "Privacy and Comments",
      more: "Read More",
      allArchives: "All Archives",
      yearArchives: "Archive for {0}",
      otherArticles: "Other Articles",
      unclassified: "Unclassified"
    },
    menu: {
      home: "Home",
      archives: "Archives",
      categorys: "Categorys",
      tags: "Tags",
      links: "Links",
      about: "About"
    },
    favicon: {
      showText: "(/\u2267\u25BD\u2266/)Hey! Good again!",
      hideText: "(\u25CF\u2014\u25CF)Oh, crash!"
    },
    post: {
      sticky: "TOP",
      rewardComment: "I'm so cute. Please give me money.",
      noticeOutdateMessage: "It has been {0} days since the last update, the content of the article may be outdated.",
      copyright: {
        author: "Post author",
        link: "Post link",
        licenseTitle: "Copyright notice",
        licenseContent: "All articles in this blog are licensed under {0} unless otherwise stated."
      }
    },
    rightside: {
      search: "Search",
      backToTop: "Back To Top",
      toc: "Article table of contents",
      theme: {
        dark: "Switch to dark mode",
        light: "Switch to light mode"
      },
      aside: {
        open: "Enter single column mode",
        exit: "Exit single column mode"
      },
      readMode: {
        open: "Enter reading mode",
        exit: "Exit reading mode"
      }
    },
    footer: {
      powered: "Powered by {0}",
      theme: "Theme",
      tips: "The blog has been lovely to run {0} day",
      day: "day",
      hour: "hour",
      minute: "minute",
      seconds: "seconds"
    },
    symbol: {
      comma: ", ",
      period: ". ",
      colon: ": "
    },
    notFound: {
      title: "404 Not Found",
      text: "The requested page does not exist. The method of arrival is unknown, but you can click the button below to navigate back to the homepage.",
      name: "Home"
    }
  }
};

// config/less.ts
var less_default = (config) => {
  if (config.vite?.css?.preprocessorOptions?.less.globalVars) {
    config.vite.css.preprocessorOptions.less.globalVars.isReadmode = Boolean(config.themeConfig?.rightside?.readmode);
    config.vite.css.preprocessorOptions.less.globalVars.isAside = Boolean(config.themeConfig?.rightside?.aside);
    config.vite.css.preprocessorOptions.less.globalVars.isReward = Boolean(config.themeConfig?.reward?.enable);
    config.vite.css.preprocessorOptions.less.globalVars.isSearch = Boolean(config.themeConfig?.search?.provider === "local");
    config.vite.css.preprocessorOptions.less.globalVars.isCustomMdStyle = Boolean(config.themeConfig?.customMdStyle);
    config.vite.css.preprocessorOptions.less.globalVars.isFancybox = Boolean(config.themeConfig?.plugin?.plugins?.fancybox?.js);
  }
};

// config/markdown.ts
var mdCustomAttrPugin = (md, type, mdOptions) => {
  const defaultRenderer = md.renderer.rules[type];
  if (defaultRenderer) {
    md.renderer.rules[type] = function(tokens, idx, options, env, self) {
      const token = tokens[idx];
      if (mdOptions) {
        for (const i in mdOptions) {
          typeof mdOptions[i] === "function" ? mdOptions[i](token) : token.attrSet(i, mdOptions[i]);
        }
      }
      return defaultRenderer(tokens, idx, options, env, self);
    };
  }
};
var markdown_default = (config) => {
  const mdConfig = config.markdown?.config;
  config.markdown.config = (md) => {
    mdCustomAttrPugin(md, "image", {
      "data-tag": "post-image",
      loading: "lazy",
      onload: "this.onload=null;this.style.opacity=1;"
    });
    mdConfig?.(md);
  };
};

// config/index.ts
var defaultConfig = {
  lang: "zh-Hans",
  vite: {
    css: {
      preprocessorOptions: {
        less: {
          globalVars: {
            isReadmode: true,
            isAside: true,
            isReward: true,
            isSearch: true,
            isNoticeOutdate: true,
            isCustomMdStyle: false
          }
        }
      }
    }
  },
  markdown: {},
  themeConfig: {
    pageLoading: true,
    themeLoading: true,
    customMdStyle: false,
    author: "async",
    postDir: "posts",
    indexGenerator: {
      perPage: 10,
      orderBy: "-date"
    },
    archiveGenerator: {
      perPage: 10,
      orderBy: "-date",
      dateFmt: "YYYY-MM"
    },
    page: {
      archives: "/archives",
      categories: "/categories",
      tags: "/tags",
      index: "/"
    },
    user: {
      name: "ThemeAsync",
      firstName: "Theme",
      lastName: "Async",
      email: void 0,
      domain: "\u7AD9\u70B9\u57DF\u540D",
      describe: "\u7F51\u7AD9\u7B80\u4ECB\u3002",
      ruleText: "\u6682\u4E0D\u63A5\u53D7\u4E2A\u4EBA\u535A\u5BA2\u4EE5\u5916\u7684\u53CB\u94FE\u7533\u8BF7\uFF0C\u786E\u4FDD\u60A8\u7684\u7F51\u7AD9\u5185\u5BB9\u79EF\u6781\u5411\u4E0A\uFF0C\u6587\u7AE0\u81F3\u5C1130\u7BC7\uFF0C\u539F\u521B70%\u4EE5\u4E0A\uFF0C\u90E8\u7F72HTTPS\u3002"
    },
    favicon: {
      visibilitychange: true,
      showText: "favicon.showText",
      hideText: "favicon.hideText"
    },
    banner: {
      type: "img",
      bannerTitle: "\u6811\u6DF1\u65F6\u89C1\u9E7F\uFF0C<br>\u6EAA\u5348\u4E0D\u95FB\u949F\u3002",
      bannerText: "Hi my new friend!",
      position: "top",
      fit: "cover"
    },
    sidebar: {
      typedTextPrefix: "I`m",
      typedText: void 0
    },
    footer: {
      powered: {
        enable: true
      },
      beian: {
        enable: false,
        icp: void 0
      },
      copyrightYear: void 0,
      liveTime: {
        enable: false,
        prefix: "footer.tips",
        startTime: "04/10/2022 17:00:00"
      }
    },
    cover: {
      type: "img"
    },
    about: {
      title: "\u5982\u679C\u4E00\u5207\u90FD\u662F\u955C\u82B1\u6C34\u6708\uFF0C\u90A3\u5C31\u8BA9\u8FD9\u4E07\u7269\u8D70\u5411\u7EC8\u7ED3\u3002\u5982\u679C\u4E00\u5207\u7686\u662F\u547D\u4E2D\u6CE8\u5B9A\uFF0C\u90A3\u5C31\u8BA9\u8FD9\u4E16\u754C\u6D88\u5931\u6B86\u5C3D\u3002",
      introduction: "\u5927\u5BB6\u597D\uFF0C\u6211\u662F <strong>Async</strong>\uFF0C\u5F88\u9AD8\u5174\u60A8\u80FD\u5728\u6D69\u701A\u5982\u70DF\u7684\u4E92\u8054\u7F51\u4E16\u754C\u91CC\u53D1\u73B0\u8FD9\u4E2A\u535A\u5BA2\uFF0C\u66F4\u611F\u8C22\u60A8\u80FD\u591F\u9976\u6709\u5174\u81F4\u5730\u6D4F\u89C8\u8FD9\u4E2A\u9875\u9762\u3002\u5EFA\u7ACB\u8FD9\u4E2A Blog \u662F\u51FA\u4E8E\u5174\u8DA3\u7231\u597D\uFF0C\u6211\u5C06\u5728\u6B64\u5206\u4F1A\u5206\u4EAB\u4E00\u4E9B\u5B66\u4E60\u7B14\u8BB0\uFF0C\u53EF\u80FD\u8FD8\u4F1A\u5206\u4EAB\u5C11\u8BB8\u56FE\u7247\u3001\u89C6\u9891\u4EE5\u53CA\u5176\u4ED6\u6709\u8DA3\u4E1C\u897F\u7684\u94FE\u63A5\u3002",
      blog: `<ul class="trm-list">
				<li>\u7A0B\u5E8F\uFF1AVitepress </li>
				<li>\u4E3B\u9898\uFF1Avitepress-theme-async </li>
			</ul>`,
      privacy: "\u672C\u7F51\u7AD9\u4E0D\u4F1A\u8FFD\u8E2A\u8BBF\u5BA2\u884C\u4E3A\uFF0C\u4E14\u4E0D\u8981\u6C42\u8BBF\u5BA2\u63D0\u4F9B\u4EFB\u4F55\u654F\u611F\u4FE1\u606F\uFF08\u6BD4\u5982\u771F\u5B9E\u59D3\u540D\u3001\u8EAB\u4EFD\u8BC1\u53F7\u7801\u3001\u624B\u673A\u53F7\u7B49\uFF09\uFF0C\u56E0\u800C\u4E5F\u4E0D\u5B58\u5728\u4EFB\u4F55\u9690\u79C1\u6CC4\u6F0F\u95EE\u9898\u3002\u8BBF\u5BA2\u53C2\u4E0E\u8BC4\u8BBA\uFF0C\u5FC5\u987B\u9075\u5B88\u6CD5\u5F8B\u6CD5\u89C4\u548C\u57FA\u672C\u9053\u5FB7\u89C4\u8303\uFF0C\u6587\u660E\u793C\u8C8C\u3002\u4E25\u7981\u53D1\u5E03\u4EFB\u4F55\u6709\u5173\u6DEB\u79FD\u3001\u53CD\u52A8\u3001\u66B4\u529B\u3001\u535A\u5F69\u3001\u6050\u5413\u3001\u4F4E\u4FD7\u7684\u5185\u5BB9\u6216\u8FDD\u6CD5\u4FE1\u606F\uFF0C\u5728\u5C0A\u91CD\u8A00\u8BBA\u81EA\u7531\u7684\u540C\u65F6\u8BF7\u4FDD\u6301\u548C\u5E73\u4E0E\u7406\u6027\u3002\u8BF7\u52FF\u5BF9\u4ED6\u4EBA\u91C7\u53D6\u4E0D\u53CB\u597D\u7684\u8BC4\u8BBA\u6216\u5176\u5B83\u8FC7\u6FC0\u884C\u4E3A\u3002"
    },
    postPagination: {
      enable: true,
      type: "small"
    },
    creativeCommons: {
      license: "by-nc-sa",
      language: "deed.zh-hans",
      post: true,
      clipboard: true
    },
    outline: {
      level: [2, 3],
      label: "\u76EE\u5F55\u5217\u8868"
    },
    noticeOutdate: {
      style: "simple",
      limitDay: 365,
      position: "top"
    },
    rss: {
      baseUrl: "",
      enable: false,
      limit: 20
    },
    categorieCard: {
      enable: true,
      len: 2
    },
    notFound: {
      title: "notFound.title",
      text: "notFound.text",
      path: "/",
      name: "notFound.name"
    },
    languages: languages_default,
    plugin: {
      thirdPartyProvider: "https://npm.elemecdn.com",
      plugins: {
        fancybox: {
          css: "/@fancyapps/ui@4.0/dist/fancybox.css",
          js: "/@fancyapps/ui@4.0/dist/fancybox.umd.js"
        },
        flickrJustifiedGallery: "/flickr-justified-gallery@latest/dist/fjGallery.min.js"
      }
    }
  }
};
var defineConfig = (config) => {
  if (Array.isArray(config.themeConfig?.outline?.level)) {
    defaultConfig.themeConfig.outline.level = [];
  }
  if (config.themeConfig?.page?.categorys && !config.themeConfig?.page?.categories) {
    config.themeConfig.page.categories = config.themeConfig.page.categorys;
  }
  config = mergeConfig(defaultConfig, config);
  config.head = config.head ?? [];
  if (config.themeConfig?.favicon?.icon16) {
    config.head.push([
      "link",
      {
        href: withBase(config.base ?? "", config.themeConfig.favicon.icon16),
        rel: "icon",
        type: "image/png",
        sizes: "16x16"
      }
    ]);
  }
  if (config.themeConfig?.favicon?.icon32) {
    config.head.push([
      "link",
      {
        href: withBase(config.base ?? "", config.themeConfig.favicon.icon32),
        rel: "icon",
        type: "image/png",
        sizes: "32x32"
      }
    ]);
  }
  if (config.themeConfig?.favicon?.appleTouchIcon) {
    config.head.push([
      "link",
      {
        href: withBase(config.base ?? "", config.themeConfig.favicon.appleTouchIcon),
        rel: "apple-touch-icon",
        sizes: "180x180"
      }
    ]);
  }
  if (config.themeConfig?.favicon?.webmanifest) {
    config.head.push([
      "link",
      {
        href: withBase(config.base ?? "", config.themeConfig.favicon.webmanifest),
        rel: "manifest"
      }
    ]);
  }
  if (config.themeConfig?.rewritePost) {
    config.rewrites = {
      ...config.rewrites ?? {},
      [`${config.themeConfig.postDir}/(.*)`]: "(.*)"
    };
  }
  const selfBuildEnd = config.buildEnd;
  config.buildEnd = async (siteConfig) => {
    console.log();
    console.log(`\u{1F496} Vitepress-Theme-Async. ${version}  Guide: ${homepage}`);
    console.log();
    if (config?.themeConfig?.rss?.enable) {
      await selfBuildEnd?.(siteConfig);
      (await Promise.resolve().then(() => (init_rss(), rss_exports)))?.genFeed(siteConfig);
    }
  };
  less_default(config);
  setFancybox(config);
  markdown_default(config);
  return config;
};
var setFancybox = (config) => {
  const { thirdPartyProvider, plugins } = config.themeConfig?.plugin ?? {};
  if (plugins?.fancybox?.js) {
    config.head = config.head ?? [];
    config.head.push(["link", { rel: "stylesheet", href: `${thirdPartyProvider}${plugins.fancybox.css}` }]);
  }
};
var mergeConfig = (a, b, isRoot = true) => {
  const merged = { ...a };
  for (const key in b) {
    const value = b[key];
    if (value == null) {
      continue;
    }
    const existing = merged[key];
    if (Array.isArray(existing) && Array.isArray(value)) {
      merged[key] = [...existing, ...value];
      continue;
    }
    if (isObject(existing) && isObject(value)) {
      if (isRoot && key === "vite") {
        merged[key] = mergeViteConfig(existing, value);
      } else {
        merged[key] = mergeConfig(existing, value, false);
      }
      continue;
    }
    merged[key] = value;
  }
  return merged;
};
export {
  defaultConfig,
  defineConfig
};
