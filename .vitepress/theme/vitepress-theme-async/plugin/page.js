// plugin/page.ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

// utils/shared.ts
var dataPath = (data, paths) => {
  const keys = paths.split(".");
  if (!isObject(data))
    return;
  const len = keys.length;
  for (let index = 0; index < len; index++) {
    const key = keys[index];
    if (!isObject(data[key]) && index < len - 1) {
      return;
    } else {
      data = data[key];
    }
  }
  return data;
};
var groupBy = (data, path2, convert) => {
  const map = /* @__PURE__ */ new Map();
  convert = convert ?? ((key) => key);
  const setMap = (key) => {
    const id = convert(key);
    if (map.has(id)) {
      map.set(id, map.get(id) + 1);
    } else {
      map.set(id, 1);
    }
  };
  data.forEach((item) => {
    const val = dataPath(item, path2);
    if ((val ?? "") !== "") {
      if (Array.isArray(val)) {
        for (let index = 0; index < val.length; index++) {
          setMap(val[index]);
        }
      } else {
        setMap(val);
      }
    } else {
      setMap("");
    }
  });
  return Array.from(map);
};
var parseArgs = (orderby) => {
  const result = [];
  if (typeof orderby === "string") {
    const arr = orderby.split(" ");
    for (let i = 0, len = arr.length; i < len; i++) {
      const key = arr[i];
      switch (key[0]) {
        case "+":
          result.push([key.slice(1), 1]);
          break;
        case "-":
          result.push([key.slice(1), -1]);
          break;
        default:
          result.push([key, 1]);
      }
    }
  } else {
    result.push(
      ...Object.keys(orderby).map((key) => {
        return [key, orderby[key]];
      })
    );
  }
  return result;
};
var sortBy = (data, orderby) => {
  const sort = parseArgs(orderby);
  const len = sort.length;
  return data.sort((a, b) => {
    for (let index = 0; index < len; index++) {
      const [key, order] = sort[index];
      if (a[key] === b[key]) {
        continue;
      } else {
        return order > 0 ? a[key] - b[key] : b[key] - a[key];
      }
    }
    return 0;
  });
};
var joinPath = (base, ...paths) => `${base}/${paths.join("/")}`.replace(/\/+/g, "/");
var isString = (value) => Object.prototype.toString.call(value) === "[object String]";
var isObject = (val) => Object.prototype.toString.call(val) === "[object Object]";
var formatDate = (d, fmt = "yyyy-MM-dd HH:mm:ss") => {
  if (!(d instanceof Date)) {
    if (isString(d)) {
      d = d.replace(/-/gs, "/");
    }
    d = d ? new Date(d) : /* @__PURE__ */ new Date();
  }
  const o = {
    "M+": d.getMonth() + 1,
    "(d|D)+": d.getDate(),
    "(h|H)+": d.getHours(),
    "m+": d.getMinutes(),
    "s+": d.getSeconds(),
    "q+": Math.floor((d.getMonth() + 3) / 3),
    S: d.getMilliseconds()
  };
  if (/((Y|y)+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substring(4 - RegExp.$1.length));
  }
  for (const k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      const val = o[k].toString();
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? val : ("00" + val).substring(val.length));
    }
  }
  return fmt;
};

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

// plugin/page.ts
import { normalizePath } from "vite";
var cache = /* @__PURE__ */ new Map();
var getFiles = (dir) => {
  let results = [];
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      if (file !== "node_modules" && file !== "dist") {
        results = results.concat(getFiles(filePath));
      }
    } else {
      if (/\.md$/.test(file)) {
        results.push(path.resolve(filePath));
      }
    }
  }
  return results;
};
var getMeta = (files, timeZone) => {
  const raw = [];
  for (const file of files) {
    const { mtimeMs: timestamp, birthtimeMs } = fs.statSync(file);
    const cached = cache.get(file);
    if (cached && timestamp === cached.timestamp) {
      raw.push(cached.data);
      continue;
    }
    const fileContent = fs.readFileSync(file, "utf-8");
    const { data: meta } = matter(fileContent);
    timeZone = timeZone ?? 8;
    if (!meta.date) {
      meta.date = getFileBirthTime(file);
      if (!meta.date) {
        meta.date = birthtimeMs;
      }
    } else {
      meta.date = (/* @__PURE__ */ new Date(`${new Date(meta.date).toUTCString()}+${timeZone}`)).getTime();
    }
    meta.tags = typeof meta.tags === "string" ? [meta.tags] : meta.tags || [];
    meta.categories = typeof meta.categories === "string" ? [meta.categories.trim()] : meta.categories || [];
    raw.push(meta);
    cache.set(file, { data: meta, timestamp });
  }
  return raw;
};
var generatePages = (len, pageSize, paramKey, otherPageName, fitstPageName) => {
  otherPageName = otherPageName.replace(/^\//, "");
  fitstPageName = fitstPageName.replace(/^\//, "");
  const count = Math.ceil(len / pageSize);
  return new Array(count).fill(null).map((_, i) => {
    return i === 0 ? {
      params: {
        [paramKey]: fitstPageName,
        index: fitstPageName
      }
    } : {
      params: {
        [paramKey]: joinPath(otherPageName, (i + 1).toString()),
        index: joinPath(otherPageName, (i + 1).toString())
      }
    };
  });
};
var generatePagesByType = async (files, config, pageType, processFn) => {
  const raw = getMeta(files, config.themeConfig?.timeZone || 8);
  const pageSize = (pageType === "index" ? config.themeConfig?.indexGenerator?.perPage : config.themeConfig?.archiveGenerator?.perPage) || 10;
  const type = pageType;
  const paramKey = pageType;
  const baseName = config.themeConfig?.page?.[pageType] || pageType;
  const basePageName = baseName.replace(/(\/index$|^index$)/, "");
  let firstPageName = baseName;
  if (/\/$/.test(firstPageName) || firstPageName === "") {
    firstPageName = joinPath(firstPageName, "index");
  }
  const len = ["index", "archives"].includes(pageType) ? files.length : raw.filter((item) => item[type].length).length;
  const defpage = generatePages(len, pageSize, paramKey, joinPath(basePageName, "page"), firstPageName);
  if (processFn) {
    const childPage = processFn(raw, config).map(([key, val]) => {
      const childrFirstName = joinPath(basePageName, key);
      const childOtherName = joinPath(childrFirstName, "page");
      return generatePages(val, pageSize, paramKey, childOtherName, childrFirstName);
    }).flat(1);
    defpage.push(...childPage);
  }
  return [...defpage];
};
var pageIndex = async (files, config, pageType) => {
  return generatePagesByType(files, config, pageType);
};
var tagPageIndex = async (files, config, pageType) => {
  const processFn = (raw) => sortBy(groupBy(raw, "tags"), { 1: -1 });
  return generatePagesByType(files, config, pageType, processFn);
};
var categoriePageIndex = async (files, config, pageType) => {
  const processFn = (raw) => sortBy(groupBy(raw, "categories"), { 1: -1 });
  return generatePagesByType(files, config, pageType, processFn);
};
var archivePageIndex = async (files, config, pageType) => {
  const processFn = (raw) => sortBy(
    groupBy(raw, "date", (date) => formatDate(date, config.themeConfig?.archiveGenerator?.dateFmt || "YYYY")),
    { 0: -1 }
  );
  return generatePagesByType(files, config, pageType, processFn);
};
var dynamicPages = async (config, pageType, root) => {
  if (!root) {
    const argv = process.argv.slice(2);
    const command = argv[0];
    const dir = argv[command ? 1 : 0] || process.cwd();
    root = normalizePath(path.resolve(dir));
  }
  const srcDir = normalizePath(path.resolve(root, config.srcDir || "."));
  const files = getFiles(normalizePath(`${srcDir}/${config.themeConfig?.postDir ?? "posts"}`));
  let paths = [];
  switch (pageType) {
    case "index":
      paths = await pageIndex(files, config, pageType);
      break;
    case "tags":
      paths = await tagPageIndex(files, config, pageType);
      break;
    case "archives":
      paths = await archivePageIndex(files, config, pageType);
      break;
    case "categories":
      paths = await categoriePageIndex(files, config, pageType);
      break;
    default:
      break;
  }
  return paths;
};
export {
  dynamicPages
};
