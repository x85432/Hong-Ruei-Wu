/* ==========================================================================
   build.mjs — 從 src/ 產生中英文靜態頁面（零依賴，Node 18+）

   src/pages/<id>.html     每頁一份模板（中英共用）
   src/partials/<name>.html 共用片段（header / footer / head）
   src/i18n/<id>.json      該頁的中英對照：{ "key": { "zh": "…", "en": "…" } }
   src/i18n/common.json    跨頁共用字串

   模板語法：
     {{t:key}}              目前語言的翻譯（先查該頁，再查 common）
     {{t:common:key}}       只查 common.json
     {{link:id}}            同語言的另一頁；{{link:id:zh}} / {{link:id:en}} 指定語言；
                            {{link:id:other}} 另一種語言。id 可寫 @self 代表目前頁面
     {{root}}               回到網站根目錄的相對路徑（"" 或 "../"）
     {{current:id}}         目前頁面是 id 時輸出 aria-current="page"
     {{> name}}             插入 src/partials/name.html
     {{! 註解 }}            只留在模板裡，不會輸出

   用法：
     node build.mjs          產生 index.html、zh/*.html、en/*.html
     node build.mjs --check  只檢查輸出是否與模板一致（CI 用），不一致時 exit 1
   ========================================================================== */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, relative, join, posix } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const SRC = join(ROOT, "src");
const LANGS = ["zh", "en"];

// 頁面 id → 各語言的輸出路徑（沿用既有網址，不破壞外部連結）
const PAGES = {
    index:      { zh: "index.html",         en: "en/index_en.html" },
    sitemap:    { zh: "zh/sitemap_zh.html", en: "en/sitemap_en.html" },
    introMe:    { zh: "zh/introMe.html",    en: "en/introMe_en.html" },
    contact:    { zh: "zh/contact.html",    en: "en/contact_en.html" },
    nycuCS:     { zh: "zh/nycuCS.html",     en: "en/nycuCS_en.html" },
    cs_life:    { zh: "zh/cs_life.html",    en: "en/cs_life_en.html" },
    nycuAM:     { zh: "zh/nycuAM.html",     en: "en/nycuAM_en.html" },
    am_life:    { zh: "zh/am_life.html",    en: "en/am_life_en.html" },
    tcssh:      { zh: "zh/tcssh.html",      en: "en/tcssh_en.html" },
    tcssh_life: { zh: "zh/tcssh_life.html", en: "en/tcssh_life_en.html" },
};

const BANNER = "<!-- 此檔由 build.mjs 自動產生：請修改 src/ 後執行 node build.mjs，不要直接編輯 -->\n";

const errors = [];
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));

function loadDict(name) {
    const file = join(SRC, "i18n", name + ".json");
    const dict = existsSync(file) ? readJson(file) : {};
    for (const [key, entry] of Object.entries(dict)) {
        for (const lang of LANGS) {
            if (typeof entry[lang] !== "string" || entry[lang].trim() === "") {
                errors.push(`src/i18n/${name}.json: "${key}" 缺少 ${lang} 翻譯`);
            }
        }
    }
    return dict;
}

const common = loadDict("common");
const usedCommon = new Set();

function render(template, ctx, depth = 0) {
    if (depth > 10) throw new Error("模板巢狀過深（partial 或翻譯互相引用？）");
    // 單獨佔一行的 {{! 註解 }} 連同整行一起移除，不留下空白行
    template = template.replace(/^[ \t]*\{\{![^}]*\}\}[ \t]*\n/gm, "");
    return template.replace(/\{\{([^}]*)\}\}/g, (whole, body) => {
        const expr = body.trim();
        if (expr.startsWith("!")) return "";

        if (expr.startsWith(">")) {
            const name = expr.slice(1).trim();
            const file = join(SRC, "partials", name + ".html");
            if (!existsSync(file)) {
                errors.push(`${ctx.where}: 找不到 partial "${name}"`);
                return whole;
            }
            // 去掉結尾換行，讓 {{> name}} 所在那行的換行保留原樣
            return render(readFileSync(file, "utf8").replace(/\n$/, ""), ctx, depth + 1);
        }

        if (expr === "root") return ctx.root;

        const [kind, ...rest] = expr.split(":");

        if (kind === "t") {
            let dict = ctx.dict, used = ctx.used, key = rest.join(":");
            if (rest[0] === "common") {
                dict = common; used = usedCommon; key = rest.slice(1).join(":");
            } else if (!(key in dict) && key in common) {
                dict = common; used = usedCommon;
            }
            if (!(key in dict)) {
                errors.push(`${ctx.where}: 找不到翻譯 "${key}"`);
                return whole;
            }
            used.add(key);
            return render(dict[key][ctx.lang] ?? "", ctx, depth + 1);
        }

        if (kind === "link") {
            const id = rest[0] === "@self" ? ctx.id : rest[0];
            let lang = rest[1] || ctx.lang;
            if (lang === "other") lang = ctx.lang === "zh" ? "en" : "zh";
            const target = PAGES[id]?.[lang];
            if (!target) {
                errors.push(`${ctx.where}: 未知的連結 "${expr}"`);
                return whole;
            }
            return posix.relative(posix.dirname(ctx.out), target) || posix.basename(target);
        }

        if (kind === "current") {
            return rest[0] === ctx.id ? ' aria-current="page"' : "";
        }

        errors.push(`${ctx.where}: 無法辨識的語法 "${whole}"`);
        return whole;
    });
}

const outputs = [];
for (const [id, paths] of Object.entries(PAGES)) {
    const tplFile = join(SRC, "pages", id + ".html");
    const template = readFileSync(tplFile, "utf8");
    const dict = loadDict(id);
    const used = new Set();

    for (const lang of LANGS) {
        const out = paths[lang];
        const depth = out.split("/").length - 1;
        const ctx = { id, lang, out, dict, used, root: "../".repeat(depth), where: `src/pages/${id}.html (${lang})` };
        let html = render(template, ctx);
        html = html.replace(/^(<!DOCTYPE html>\n)/i, "$1" + BANNER);
        outputs.push({ file: out, html });
    }

    for (const key of Object.keys(dict)) {
        if (!used.has(key)) errors.push(`src/i18n/${id}.json: "${key}" 沒有被任何模板使用`);
    }
}
for (const key of Object.keys(common)) {
    if (!usedCommon.has(key)) errors.push(`src/i18n/common.json: "${key}" 沒有被任何模板使用`);
}

if (errors.length) {
    console.error(errors.map((e) => "✗ " + e).join("\n"));
    process.exit(1);
}

const check = process.argv.includes("--check");
const stale = [];
for (const { file, html } of outputs) {
    const abs = join(ROOT, file);
    const current = existsSync(abs) ? readFileSync(abs, "utf8") : null;
    if (current === html) continue;
    if (check) {
        stale.push(file);
    } else {
        mkdirSync(dirname(abs), { recursive: true });
        writeFileSync(abs, html);
        console.log("寫入 " + relative(ROOT, abs));
    }
}

if (check && stale.length) {
    console.error("以下檔案與 src/ 不一致，請執行 node build.mjs 後再 commit：\n" + stale.map((f) => "  " + f).join("\n"));
    process.exit(1);
}
console.log(check ? "✓ 所有頁面都與 src/ 一致" : `✓ 完成（${outputs.length} 頁）`);
