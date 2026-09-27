#!/usr/bin/env node
/*
 * tools/i18n-check.mjs — 驗證 i18n 字典與 HTML 標記的一致性。
 * 規格：docs/I18N-SPEC.md 第 7 節。只 import node:fs 與 node:path。
 *
 * 執行：node tools/i18n-check.mjs
 * 任何一項檢查（1–6）失敗就回傳非 0；第 7 項（空值）只警告，不影響結束碼。
 *
 * 字典檔的解析方式：字典檔是瀏覽器用的 .js（沒有 module.exports，直接寫
 * `window.I18N = ...; Object.assign(window.I18N.zh, {...})`）。這裡不引入
 * npm 套件、也不 import node:vm，改用內建的 Function 建構式，餵一個假的
 * window 物件執行檔案內容，取回填好的物件。字典檔是本 repo 自己的靜態檔案、
 * 不含任何外部輸入，執行它與執行任何其他建置腳本風險相同。
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(new URL(".", import.meta.url).pathname, "..");
const I18N_DIR = path.join(ROOT, "i18n");

const errors = [];
const warnings = [];

function fail(msg) {
    errors.push(msg);
}

function warn(msg) {
    warnings.push(msg);
}

// --- 讀字典 --------------------------------------------------------------

function loadDictFile(fileName) {
    const full = path.join(I18N_DIR, fileName);
    const code = fs.readFileSync(full, "utf8");
    const sandboxWindow = {};
    try {
        const runner = new Function("window", code);
        runner(sandboxWindow);
    } catch (e) {
        fail(`${fileName}: 執行失敗（語法或執行期錯誤）— ${e.message}`);
        return { file: fileName, zh: {}, en: {}, zhKeys: [], enKeys: [] };
    }
    const zh = (sandboxWindow.I18N && sandboxWindow.I18N.zh) || {};
    const en = (sandboxWindow.I18N && sandboxWindow.I18N.en) || {};
    return {
        file: fileName,
        zh,
        en,
        zhKeys: Object.keys(zh),
        enKeys: Object.keys(en),
    };
}

const dictFileNames = fs
    .readdirSync(I18N_DIR)
    .filter((f) => f.endsWith(".js"))
    .sort();

const dicts = dictFileNames.map(loadDictFile);

// --- 檢查 1：每份字典的中英鍵集合一致（含順序）---------------------------

for (const d of dicts) {
    const { file, zhKeys, enKeys } = d;
    const zhSet = new Set(zhKeys);
    const enSet = new Set(enKeys);

    const missingInEn = zhKeys.filter((k) => !enSet.has(k));
    const missingInZh = enKeys.filter((k) => !zhSet.has(k));

    if (missingInEn.length > 0) {
        fail(`${file}: en 缺少鍵 — ${missingInEn.join(", ")}`);
    }
    if (missingInZh.length > 0) {
        fail(`${file}: zh 缺少鍵 — ${missingInZh.join(", ")}`);
    }

    if (missingInEn.length === 0 && missingInZh.length === 0) {
        let divergeAt = -1;
        for (let i = 0; i < zhKeys.length; i++) {
            if (zhKeys[i] !== enKeys[i]) {
                divergeAt = i;
                break;
            }
        }
        if (divergeAt !== -1) {
            fail(
                `${file}: zh/en 鍵順序不一致，第一個分岔在第 ${divergeAt + 1} ` +
                    `個鍵（zh="${zhKeys[divergeAt]}" en="${enKeys[divergeAt]}"）`
            );
        }
    }
}

// --- 檢查 2：無重複鍵（跨字典檔）-----------------------------------------

const keyOwner = new Map(); // key -> file
for (const d of dicts) {
    for (const key of d.zhKeys) {
        if (keyOwner.has(key)) {
            fail(
                `重複鍵 "${key}" 同時出現在 ${keyOwner.get(key)} 與 ${d.file}`
            );
        } else {
            keyOwner.set(key, d.file);
        }
    }
}

// --- 讀 HTML -------------------------------------------------------------

const htmlFileNames = fs
    .readdirSync(ROOT)
    .filter((f) => f.endsWith(".html"))
    .sort();

const htmlDocs = htmlFileNames.map((fileName) => ({
    file: fileName,
    slug: fileName === "index.html" ? "home" : fileName.replace(/\.html$/, ""),
    html: fs.readFileSync(path.join(ROOT, fileName), "utf8"),
}));

// --- 標記解析輔助 ----------------------------------------------------------

// 找出 startIdx（'<' 所在位置）對應的開始標籤結束位置（'>' 的 index），
// 尊重雙引號/單引號內的 '>' 不算數。
function findTagEnd(html, startIdx) {
    let inQuote = null;
    for (let i = startIdx + 1; i < html.length; i++) {
        const c = html[i];
        if (inQuote) {
            if (c === inQuote) inQuote = null;
        } else if (c === '"' || c === "'") {
            inQuote = c;
        } else if (c === ">") {
            return i;
        }
    }
    return -1;
}

function getEnclosingTag(html, matchIndex) {
    const tagStart = html.lastIndexOf("<", matchIndex);
    if (tagStart === -1) return null;
    const tagEnd = findTagEnd(html, tagStart);
    if (tagEnd === -1) return null;
    const tagText = html.slice(tagStart, tagEnd + 1);
    const nameMatch = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec(tagText);
    if (!nameMatch) return null;
    return {
        tagName: nameMatch[1],
        tagText,
        tagStart,
        tagEnd,
    };
}

// 取得 data-i18n / data-i18n-html 標籤的內容（textContent / innerHTML）。
function getTagContent(html, tag) {
    const closeTag = `</${tag.tagName}>`;
    const closeIdx = html.indexOf(closeTag, tag.tagEnd + 1);
    if (closeIdx === -1) return null;
    return html.slice(tag.tagEnd + 1, closeIdx);
}

// 取得同一個開始標籤內某屬性的值。
// 注意：前面必須是字串開頭或空白，不能直接比對 `attrName="`——否則
// `data-i18n-content="key"` 這種標記屬性本身就含有子字串 `content="key"`，
// 會被誤認成真正的 `content="..."` 屬性（把鍵名當成屬性值）。
function getAttrValue(tagText, attrName) {
    const escaped = attrName.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const re = new RegExp("(?:^|\\s)" + escaped + '="([^"]*)"');
    const m = re.exec(tagText);
    return m ? m[1] : null;
}

// --- 每份 HTML 收集 data-i18n* 使用情況 -----------------------------------

// usedKeys: key -> [{file, kind}], 用於檢查 3/4/5
const usageByFile = new Map(); // file -> Set(keys)
const allUsages = []; // {file, key, kind, ok/fallbackMismatch info}

for (const doc of htmlDocs) {
    const { file, html } = doc;
    const used = new Set();
    usageByFile.set(file, used);

    // data-i18n="key"（精確比對，不吃到 -html 或 -<attr> 變體）
    let re = /data-i18n="([^"]+)"/g;
    let m;
    while ((m = re.exec(html))) {
        const key = m[1];
        used.add(key);
        const tag = getEnclosingTag(html, m.index);
        let content = null;
        if (tag) content = getTagContent(html, tag);
        allUsages.push({ file, key, kind: "text", content });
    }

    // data-i18n-html="key"
    re = /data-i18n-html="([^"]+)"/g;
    while ((m = re.exec(html))) {
        const key = m[1];
        used.add(key);
        const tag = getEnclosingTag(html, m.index);
        let content = null;
        if (tag) content = getTagContent(html, tag);
        allUsages.push({ file, key, kind: "html", content });
    }

    // data-i18n-<attr>="key"（排除 html，上面已處理過）
    re = /data-i18n-([a-zA-Z-]+)="([^"]+)"/g;
    while ((m = re.exec(html))) {
        const attrName = m[1];
        if (attrName === "html") continue;
        const key = m[2];
        used.add(key);
        const tag = getEnclosingTag(html, m.index);
        let attrValue = null;
        if (tag) attrValue = getAttrValue(tag.tagText, attrName);
        allUsages.push({ file, key, kind: "attr", attrName, attrValue });
    }
}

// --- 檢查 6：載入宣告正確 --------------------------------------------------
//
// 這批頁面是分批遷移到 i18n 架構的（見 docs/I18N-SPEC.md、AI_GUIDELINES §1.3
// 的平行分工）。還沒被任何 agent 改寫的 *.html（例如目前的 index.html）
// 完全沒有 <script src="i18n/…">，這不是 bug，是「還沒輪到它」。用「完全沒有
// 任何 i18n/*.js 宣告」當作「尚未遷移，此頁略過本項檢查」的判斷依據——
// 真正遷移過的頁面至少會宣告 i18n/common.js。

const loadedDictsByFile = new Map(); // file -> [basenames without .js, in order]
const skippedNotMigrated = [];

for (const doc of htmlDocs) {
    const { file, slug, html } = doc;
    const scriptRe = /<script src="i18n\/([^"]+)\.js"><\/script>/g;
    const loaded = [];
    let m;
    while ((m = scriptRe.exec(html))) {
        loaded.push(m[1]);
    }
    loadedDictsByFile.set(file, loaded);

    if (loaded.length === 0) {
        skippedNotMigrated.push(file);
        continue;
    }

    const expected = ["common", slug];
    const sameSet =
        loaded.length === expected.length &&
        expected.every((e) => loaded.includes(e));

    if (!sameSet) {
        fail(
            `${file}: <script src="i18n/…"> 宣告應恰好是 [${expected.join(
                ", "
            )}]，實際為 [${loaded.join(", ") || "(無)"}]`
        );
    } else {
        const commonIdx = loaded.indexOf("common");
        const slugIdx = loaded.indexOf(slug);
        if (commonIdx > slugIdx) {
            fail(`${file}: i18n/common.js 必須在 i18n/${slug}.js 之前載入`);
        }
    }

    const i18nJsIdx = html.indexOf('<script src="script/i18n.js"></script>');
    if (i18nJsIdx === -1) {
        fail(`${file}: 找不到 <script src="script/i18n.js"></script>`);
    } else {
        for (const name of loaded) {
            const srcIdx = html.indexOf(`<script src="i18n/${name}.js">`);
            if (srcIdx !== -1 && srcIdx > i18nJsIdx) {
                fail(`${file}: script/i18n.js 必須在所有 i18n/*.js 之後載入`);
            }
        }
    }
}

// --- 檢查 3：無孤鍵 --------------------------------------------------------

const allDefinedKeys = new Set(keyOwner.keys());

for (const doc of htmlDocs) {
    const { file } = doc;
    const used = usageByFile.get(file);
    const loaded = loadedDictsByFile.get(file) || [];
    const availableKeys = new Set();
    for (const dictBase of loaded) {
        const d = dicts.find((x) => x.file === `${dictBase}.js`);
        if (d) {
            for (const k of d.zhKeys) availableKeys.add(k);
        }
    }

    for (const key of used) {
        if (!allDefinedKeys.has(key)) {
            fail(`${file}: 使用了不存在於任何字典的鍵 "${key}"`);
        } else if (!availableKeys.has(key)) {
            fail(
                `${file}: 使用了鍵 "${key}"，但該鍵定義在此頁未載入的字典檔（${keyOwner.get(
                    key
                )}）`
            );
        }
    }
}

// --- 檢查 4：無死鍵 --------------------------------------------------------

const usedAnywhere = new Set();
for (const used of usageByFile.values()) {
    for (const k of used) usedAnywhere.add(k);
}

for (const key of allDefinedKeys) {
    if (!usedAnywhere.has(key)) {
        fail(`死鍵："${key}"（定義在 ${keyOwner.get(key)}，沒有任何 HTML 使用）`);
    }
}

// --- 檢查 5：fallback 相符（HTML 寫死文字與 zh 值逐字相同）----------------

function dictZhValueFor(key) {
    const owner = keyOwner.get(key);
    if (!owner) return undefined;
    const d = dicts.find((x) => x.file === owner);
    return d ? d.zh[key] : undefined;
}

for (const usage of allUsages) {
    const zhValue = dictZhValueFor(usage.key);
    if (zhValue === undefined) continue; // 已在檢查 3 報過

    if (usage.kind === "text" || usage.kind === "html") {
        if (usage.content === null) {
            fail(
                `${usage.file}: 找不到鍵 "${usage.key}" 對應標籤的內容（可能是 ` +
                    `找不到對應的結束標籤）`
            );
            continue;
        }
        const htmlContent = usage.content.trim();
        const dictContent = zhValue.trim();
        if (htmlContent !== dictContent) {
            fail(
                `${usage.file}: 鍵 "${usage.key}" 的 HTML 內容與 zh 字典值不一致\n` +
                    `    HTML: ${JSON.stringify(htmlContent)}\n` +
                    `    zh:   ${JSON.stringify(dictContent)}`
            );
        }
    } else if (usage.kind === "attr") {
        if (usage.attrValue === null) {
            fail(
                `${usage.file}: 找不到鍵 "${usage.key}" 對應的 ${usage.attrName} 屬性值`
            );
            continue;
        }
        if (usage.attrValue !== zhValue) {
            fail(
                `${usage.file}: 鍵 "${usage.key}"（屬性 ${usage.attrName}）的 HTML ` +
                    `值與 zh 字典值不一致\n` +
                    `    HTML: ${JSON.stringify(usage.attrValue)}\n` +
                    `    zh:   ${JSON.stringify(zhValue)}`
            );
        }
    }
}

// --- 檢查 7：無空值（警告）-------------------------------------------------

for (const d of dicts) {
    for (const key of d.zhKeys) {
        if (d.zh[key] === "") {
            warn(`${d.file}: 鍵 "${key}" 的 zh 值為空字串`);
        }
    }
    for (const key of d.enKeys) {
        if (d.en[key] === "") {
            warn(`${d.file}: 鍵 "${key}" 的 en 值為空字串`);
        }
    }
}

// --- 輸出 ------------------------------------------------------------------

console.log(`i18n-check: ${dicts.length} 份字典檔、${htmlDocs.length} 份 HTML`);

if (skippedNotMigrated.length > 0) {
    console.log(
        `\n尚未套用 i18n（沒有任何 i18n/*.js 宣告，視為還沒遷移，略過檢查）：`
    );
    for (const f of skippedNotMigrated) console.log(`  - ${f}`);
    console.log(
        `  略過不等於通過——這裡只是還沒輪到它們。等全部頁面遷移完成後，用\n` +
            `  \`grep -l 'script/i18n.js' *.html | wc -l\`（docs/I18N-SPEC.md 第 7 節）\n` +
            `  確認數字等於 *.html 總數，確保沒有頁面被漏掉遷移卻被這裡靜靜放過。`
    );
}

if (warnings.length > 0) {
    console.log("\n警告：");
    for (const w of warnings) console.log(`  - ${w}`);
}

if (errors.length > 0) {
    console.log(`\n失敗（${errors.length} 項）：`);
    for (const e of errors) console.log(`  - ${e}`);
    process.exit(1);
} else {
    console.log("\n所有檢查通過。");
    process.exit(0);
}
