import { defineConfig } from "./theme/vitepress-theme-async/config";

export default defineConfig({
  srcDir: "./",
  title: "沐云小站",
  description: "我只喜欢那些喜欢我的人",
  head: [
    // ["link", { rel: "preconnect", href: "https://fonts.googleapis.com" }],
    // [
    //   "link",
    //   { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
    // ],
    // [
    //   "link",
    //   {
    //     href: "https://fonts.googleapis.com/css?family=Noto+Serif+SC",
    //     rel: "stylesheet",
    //   },
    // ],
    [
      "link",
      {
        href: "/main.css",
        rel: "stylesheet",
      },
    ],
    [
      "meta",
      { name: "keywords", content: "沐云小站,NilBrains,何云沐,云沐,Java,JavaScript,灵阵坊工作室,灵阵坊" },
    ],
  ],
  themeConfig: {
    author: "NilBrains",
    topBars: [
      { title: "HOME", url: "/" },
      { title: "ARCHIVES", url: "/archives" },
      { title: "ABOUT", url: "/about" },
    ],
    cover: {
      default: [
        "https://app.nilbrains.com/images/blogs/1.jpg",
        "https://app.nilbrains.com/images/blogs/2.jpg",
        "https://app.nilbrains.com/images/blogs/3.jpg",
        "https://app.nilbrains.com/images/blogs/4.jpg",
        "https://app.nilbrains.com/images/blogs/5.jpg",
      ],
    },
    rss: {
      enable: true,
    },
    banner: {
      type: "img",
      bannerTitle: "",
      bannerText: "",
    },
    postPagination: {
      enable: true,
      type: "small",
    },
    user: {
      name: "沐云小站",
      firstName: "灵阵坊",
      lastName: "沐云小站",
      email: "me@nilbrains.com",
      avatar:
        "http://thirdqq.qlogo.cn/ek_qqapp/AQGHekOgRjEwpUxWsZ86QUyUbk7ic5Psiaz0FfIPNaE7JUyonXNlejbT1kzt3zIfPc2KrfGnMia/100",
    },
    sidebar: {
      typedText: ["Web Developer"],
      social: [
        {
          name: "灵阵坊工作室",
          url: "https://lingzhen.fun/",
          icon: `<svg t="1745401611352" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2523" width="256" height="256"><path d="M946.5 505L560.1 118.8l-25.9-25.9c-12.3-12.2-32.1-12.2-44.4 0L77.5 505c-12.3 12.3-18.9 28.6-18.8 46 0.4 35.2 29.7 63.3 64.9 63.3h42.5V940h691.8V614.3h43.4c17.1 0 33.2-6.7 45.3-18.8 12.1-12.1 18.7-28.2 18.7-45.3 0-17-6.7-33.1-18.8-45.2zM568 868H456V664h112v204z m217.9-325.7V868H632V640c0-22.1-17.9-40-40-40H432c-22.1 0-40 17.9-40 40v228H238.1V542.3h-96l370-369.7 23.1 23.1L882 542.3h-96.1z" p-id="2524"></path></svg>`,
        },
        {
          name: "GITHUB",
          url: "https://github.com/nilbrains/",
          icon: `<svg t="1745401773697" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3502" width="256" height="256"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="3503"></path></svg>`,
        },
      ],
    },
    footer: {
      beian: {
        enable: true,
        icp: "浙ICP备20019719号-2",
      },
      gongan: {
        enable: true,
        code: "浙公网安备33050202001532号",
        href: "https://beian.mps.gov.cn/#/query/webSearch?code=33050202001532",
      },
      /**
       * 版权开始年号
       */
      copyrightYear: "2018",
      /**
       * 运行时长
       */
      liveTime: {
        enable: true,
        /**
         * 前缀
         */
        prefix: "",
        /**
         * 运行计算开始时间
         */
        startTime: "2018-01-01",
      },
    },
    about: {
      title: "年年岁岁花相似，岁岁年年人不同。",
      introduction:
        "大家好，我是 <strong>NilBrains</strong>，很高兴您能在浩瀚如烟的互联网世界里发现这个博客，更感谢您能够饶有兴致地浏览这个页面。",
      blog: `<ul class="trm-list"> <li>程序：Vitepress </li> <li>主题：vitepress-theme-async </li> </ul>`,
      privacy:
        "本网站不会追踪访客行为，且不要求访客提供任何敏感信息（比如真实姓名、身份证号码、手机号等），因而也不存在任何隐私泄漏问题。访客参与评论，必须遵守法律法规和基本道德规范，文明礼貌。严禁发布任何有关淫秽、反动、暴力、博彩、恐吓、低俗的内容或违法信息，在尊重言论自由的同时请保持和平与理性。请勿对他人采取不友好的评论或其它过激行为。",
    },
    links: [
      {
        name: "Vitepress",
        url: "https://vitepress.dev",
        image: "https://vitepress.dev/vitepress-logo-mini.svg",
        desc: "VitePress is a Static Site Generator (SSG) designed for building fast, content-centric websites",
      },
      {
        name: "白云苍狗",
        url: "https://www.imalun.com/",
        image: "https://www.imalun.com/images/avatar.jpg",
        desc: "醒，亦在人间；梦，亦在人间",
      },
    ],
    rightside: {
      readmode: true,
      aside: true,
    },
    outline: {
      level: [2, 6],
    },
    favicon: {
      logo: "/favicon.ico",
      icon16: "/favicon-16x16.png",
      icon32: "/favicon-32x32.png",
      visibilitychange: true,
    },
  },
});
