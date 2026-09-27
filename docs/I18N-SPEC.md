# I18N-SPEC — 中英雙語單一 HTML 架構

**決策日期：** 2026-09-27
**取代：** `docs/UIUX-SPEC.md` 第 1 節的 `zh/` + `en/` 雙目錄架構、第 4.3 節的 `lang-switch`
對照表（第 256–265 行）。該文件其餘部分（色彩、字級、元件規格）不受影響，仍然有效。

**目標：** 把 18 份平行的 HTML（`zh/` 9 + `en/` 9）收斂成 10 份單一來源的 HTML，
文字抽進 `i18n/zh.js` 與 `i18n/en.js` 兩份字典。改一次結構，兩個語言同時生效；
翻譯脫鉤變成可用指令偵測的錯誤，而不是要靠肉眼比對兩個目錄。

**動機（實測）：** 目前 `zh/introMe.html` 193 行、`en/introMe_en.html` 125 行，英文版少了
「求學歷程」「Programming」「未來展望」三個 `.timeline__item`。其餘 8 對頁面標籤骨架差異為
0～2 行。也就是說雙目錄架構已經開始脫鉤，而且沒有任何機制會告訴我們。

---

## 1. 檔案架構（新舊對照）

### 刪除

```
zh/am_life.html          zh/introMe.html      zh/nycuCS.html       zh/tcssh_life.html
zh/contact.html          zh/nycuAM.html       zh/sitemap_zh.html
zh/cs_life.html          zh/tcssh.html
en/am_life_en.html       en/introMe_en.html   en/nycuCS_en.html    en/tcssh_life_en.html
en/contact_en.html       en/nycuAM_en.html    en/sitemap_en.html
en/cs_life_en.html       en/tcssh_en.html
```

`zh/` 與 `en/` 兩個目錄整個移除。

### 新增

```
introMe.html      nycuCS.html    cs_life.html    tcssh.html         sitemap.html
                  nycuAM.html    am_life.html    tcssh_life.html    contact.html

i18n/common.js        跨頁共用字串（header / nav / footer / skip-link）
i18n/home.js          index.html 的字串
i18n/introMe.js       i18n/sitemap.js     i18n/contact.js
i18n/nycuCS.js        i18n/nycuAM.js      i18n/cs_life.js     i18n/am_life.js
i18n/tcssh.js         i18n/tcssh_life.js
script/i18n.js        套用字典、切換語言、改寫站內連結
tools/i18n-check.mjs  驗證工具（Node 執行，不是網頁資源）
docs/I18N-KEYS.md     鍵值清冊（由實作者產出，見第 7 節）

字典切成「共用 + 每頁一份」而不是「每語言一份」，有兩個理由：每頁只下載自己需要的
字串；以及平行實作時每個 agent 只寫自己那一份，檔案集合零重疊（AI_GUIDELINES §1.3）。
```

### 修改

```
index.html        改為 i18n 版本（本來就在根目錄，路徑不用動）
```

### 不得觸碰

```
css/**            所有 class 名稱維持原樣，i18n 不改任何樣式
script/site.js    僅一處例外，見第 6.4 節
script/school.js  與語言無關
script/sitemap.js 與語言無關
resource/**
volleyball/**     AI_GUIDELINES §1.6 明定範圍外
docs/UIUX-SPEC.md docs/UIUX-PAGES.md docs/IMAGE-SIZES.md
```

### 頁面來源對照

新檔案的 **結構** 取自 `zh/` 版本（較完整），**英文字串** 取自 `en/` 版本。

| 新檔案 | 結構來源 | 中文字串來源 | 英文字串來源 |
|---|---|---|---|
| `index.html` | `index.html` | `index.html` | 無（需新譯，見第 8 節） |
| `introMe.html` | `zh/introMe.html` | `zh/introMe.html` | `en/introMe_en.html`（缺 3 段，見第 8 節） |
| `sitemap.html` | `zh/sitemap_zh.html` | 同左 | `en/sitemap_en.html` |
| `nycuCS.html` | `zh/nycuCS.html` | 同左 | `en/nycuCS_en.html` |
| `nycuAM.html` | `zh/nycuAM.html` | 同左 | `en/nycuAM_en.html` |
| `cs_life.html` | `zh/cs_life.html` | 同左 | `en/cs_life_en.html` |
| `am_life.html` | `zh/am_life.html` | 同左 | `en/am_life_en.html` |
| `tcssh.html` | `zh/tcssh.html` | 同左 | `en/tcssh_en.html` |
| `tcssh_life.html` | `zh/tcssh_life.html` | 同左 | `en/tcssh_life_en.html` |
| `contact.html` | `zh/contact.html` | 同左 | `en/contact_en.html` |

**路徑調整：** 所有頁面從 `zh/` 移到根目錄，因此檔案內每一個 `../` 前綴都要去掉
（`../css/base.css` → `css/base.css`、`../resource/spike.webp` → `resource/spike.webp`、
`../index.html` → `index.html`）。`sitemap_zh.html` → `sitemap.html` 的檔名變更要一併
更新所有指向它的連結。完成後根目錄任何 `.html` 都不該再出現 `../`。

**已知代價：** 舊網址 `zh/introMe.html`、`en/introMe_en.html` 會失效。這是個人網站、
沒有外部反向連結壓力，接受。若日後需要，再補 `zh/` 轉址頁。

---

## 2. 語言判定

`zh` 是預設語言，也是 HTML 原始碼裡直接寫死的那一份文字。這一點是整個架構的地基：
**沒有 JS 的情況下，每一頁都是一份完整、可讀的中文頁面。** 與 `css/base.css` 既有的
`.js` class 策略一致（漸進增強）。

語言來源依序判定，第一個命中的就採用：

1. **查詢字串** `?lang=en` — 主要形式，可分享、可被搜尋引擎分別索引
2. **雜湊** `#lang=en` — 備援，給查詢字串失效的 `file://` 環境
3. **`localStorage.getItem('site-lang')`** — 記住使用者上次的選擇
4. **`navigator.language`** — 首次到訪，開頭不是 `zh` 就給 `en`
5. **`'zh'`** — 以上皆不可得

合法值只有 `zh` 與 `en`。任何其他值（`?lang=fr`、`?lang=<script>`）一律當作未指定，
往下一層 fallback，不可直接拿來查字典或寫進 DOM。

### 相容性要求

- **不得使用 `URLSearchParams`。** 用 `location.search` 搭配正規表達式解析，理由是
  避免對 Baseline 2017 的依賴，而這裡的收益只是省幾行字串處理。
- **`localStorage` 的讀與寫都必須包 `try/catch`。** Safari 無痕模式寫入會丟
  `QuotaExceededError`；失敗時安靜降級成只靠網址，不可讓例外中斷整支 script。
- 寫入網址用 `history.replaceState`，失敗（`file://` 某些環境會丟 `SecurityError`）
  就退回 `location.hash`。

---

## 3. 標記方式

### 3.1 `data-i18n` — 取代 textContent

```html
<a class="nav-link" href="index.html" data-i18n="common.nav.home">首頁</a>
```

HTML 裡留著的中文是 `zh` 的值，同時也是無 JS 時的 fallback。**中文不寫進 `i18n/zh.js`
以外的地方就會失去 fallback，所以兩邊都要有，且必須逐字一致**（第 7 節有檢查指令）。

### 3.2 `data-i18n-html` — 取代 innerHTML

只用於字串本身含標記的情況：`<br>`、`<mark class="kw">`、行內 `<a>`。

```html
<p data-i18n-html="home.intro.p1">我是<mark class="kw">吳弘叡</mark>，土生土長的臺中霧峰人。</p>
```

字典值會直接寫進 `innerHTML`。字典是我們自己的靜態檔案、不含任何使用者輸入，
所以這裡沒有 XSS 面；但也因此 **字典值永遠不得由網址、`localStorage` 或任何外部來源組出來**。

含 `<img>` 的段落不要用 `data-i18n-html`（會重新觸發圖片下載）。改把文字部分包進
`<span data-i18n-html>`，讓 `<img>` 留在 span 外面。

### 3.3 `data-i18n-<屬性名>` — 取代屬性

規則：`data-i18n-` 後面接的就是目標屬性名，連字號原樣保留。

```html
<img data-i18n-alt="introMe.portrait.alt" alt="吳弘叡的個人照">
<meta name="description" data-i18n-content="page.introMe.desc" content="吳弘叡的自我介紹：…">
<nav data-i18n-aria-label="common.nav.aria" aria-label="主要導覽">
<button data-i18n-aria-label="sitemap.carrot.aria" aria-label="拔一根蘿蔔">🥕</button>
```

實作方式是遍歷 `el.attributes`、比對 `/^data-i18n-(.+)$/`，取 `$1` 當屬性名。
`html` 是唯一的保留字，走 3.2 的路徑，不當屬性處理。

**必須先把該元素要套用的 (屬性名, 鍵) 全部蒐集成陣列，再開始 `setAttribute`。**
（2026-09-27 補充）`el.attributes` 是 live 的 `NamedNodeMap`，在用索引遍歷它的同時
`setAttribute` 一個**原本不存在**的屬性會改變它的長度與索引，導致後面的屬性被跳過。
目前每個 `data-i18n-<attr>` 旁邊都有對應的 fallback 屬性（第 7 節第 5 項會強制），
所以實際上只會是取代、不會插入；但這份程式碼會被 9 個頁面沿用，
不該留這種只在「哪天有人加了沒有 fallback 的屬性」時才爆的隱患。

`<title>` 用 3.1 的 `data-i18n`（`title` 元素的 textContent 就是標題）。

### 3.4 不加標記的東西

- `aria-hidden="true"` 的純裝飾元素（`.nav-toggle__bar`、`.hero__slide`）
- `alt=""` 的裝飾圖（`.brand__mark`、`.contact-card__icon`）
- 語言中立的內容：email 位址、`@x85432`、YouTube 網址、`&copy; 2024–2026`、
  `.carrot` 的 🥕 字元、`resource/` 路徑
- `aria-current="page"` — 標示「目前在哪一頁」，與語言無關，維持各頁寫死
- `.contact-card__name`（Email／LinkedIn／Instagram／Facebook／Line）是專有名詞，不譯

`zh/contact.html` 唯一需要譯的 handle 是 Line 的「加我好友」。

---

## 4. 鍵值命名

三層，小駝峰，以點分隔：

| 前綴 | 用途 | 範例 |
|---|---|---|
| `common.*` | 出現在兩頁以上的字串（header、nav、footer、skip-link） | `common.nav.home` |
| `page.<slug>.*` | `<head>` 的 metadata，固定只有 `title` 與 `desc` | `page.nycuCS.title` |
| `<slug>.*` | 該頁 `<main>` 內的內容 | `nycuCS.card.history.title` |

`<slug>` 是去掉 `.html` 的檔名，`index.html` 的 slug 是 `home`。

`og:title` 重用 `page.<slug>.title`，`og:description` 重用 `page.<slug>.desc`——
它們目前的內容本來就與 `<title>` / `<meta name=description>` 逐字相同，不要另開鍵。

`common.brand.name`（吳弘叡／Hong-Ruei Wu）在 header 品牌、footer 版權、
以及 `index.html` 的 `<h1>` 三處重用：

```html
<p class="site-footer__copy">&copy; 2024–2026 <span data-i18n="common.brand.name">吳弘叡</span></p>
```

### 完整範例：`nycuCS.html`

這一頁是最單純的一頁，作為命名的參考實作。

```
page.nycuCS.title          陽明交大資訊工程學系 — 吳弘叡
page.nycuCS.desc           吳弘叡個人網站中，陽明交大資訊工程學系的系所介紹頁面，…
nycuCS.banner.title        陽明交大資訊工程學系
nycuCS.card.history.title  歷史沿革
nycuCS.card.history.body   陽明交大資訊工程學系成立於1970年，…
nycuCS.card.faculty.title  人員組成
nycuCS.card.faculty.body   系上擁有50多位教授與研究員，…
nycuCS.card.research.title 研究領域
nycuCS.card.research.body  涵蓋人工智慧、數據科學、嵌入式系統等多個前沿研究領域，…
nycuCS.card.awards.title   傑出成就
nycuCS.card.awards.body    多名校友在國際科技公司擔任要職，…
```

卡片鍵名取語意（`history` / `faculty` / `research` / `awards`），不要用 `card1`…`card4`
——順序調動時 `card2` 會變成謊言。

---

## 5. 字典檔格式

每一份字典同時帶中英兩種語言，這樣同一個鍵的兩個值就在相鄰的兩行，
「一步對照」是檔案結構本身給的保證，不需要跨檔案比對。

`i18n/nycuCS.js`：

```js
/* i18n/nycuCS.js — nycuCS.html 的字串。鍵值規則見 docs/I18N-SPEC.md 第 4 節。 */
window.I18N = window.I18N || { zh: {}, en: {} };

Object.assign(window.I18N.zh, {
    "page.nycuCS.title": "陽明交大資訊工程學系 — 吳弘叡",
    "nycuCS.banner.title": "陽明交大資訊工程學系",
    // …
});

Object.assign(window.I18N.en, {
    "page.nycuCS.title": "NYCU Department of Computer Science — Hong-Ruei Wu",
    "nycuCS.banner.title": "NYCU Department of Computer Science",
    // …
});
```

`i18n/common.js` 同構，放 `common.*` 開頭的鍵。

**兩個 `Object.assign` 的鍵集合必須完全相同，順序也必須相同。**
這是「同步中英文」的核心保證，由第 7 節的檢查工具強制。值可以是空字串
（代表刻意留空），但鍵不能缺、順序不能亂。

**為什麼是 `.js` 而不是 `.json`：** `fetch()` 讀取 `file://` 下的 JSON 會被 CORS 擋掉，
用 `.js` 讓 `file://` 直開也能正常運作，而且 `<script>` 是同步載入的，
不需要處理非同步時序。代價是字典會進全域，接受。

**第一行的 `window.I18N = window.I18N || { zh: {}, en: {} };` 每一份字典都要有**，
這樣字典檔之間沒有載入順序依賴，任何一份都能獨立第一個被載入。

## 6. `script/i18n.js`

載入位置：**`<head>` 內、所有 CSS 之後**，順序是

```html
<script src="i18n/common.js"></script>
<script src="i18n/nycuCS.js"></script>
<script src="script/i18n.js"></script>
```

每頁只載入 `i18n/common.js` 與自己那一份。`script/i18n.js` 必須最後，
因為它假設 `window.I18N` 已經齊全。

放 `<head>` 是為了在第一次繪製前就決定語言、避免閃動（見 6.2）。

### 6.1 職責

1. 判定語言（第 2 節）
2. 設定 `document.documentElement.lang`（`zh` → `zh-Hant`、`en` → `en`）與 `data-lang`
3. `DOMContentLoaded` 後套用字典到所有 `[data-i18n]`、`[data-i18n-html]`、`[data-i18n-*]`
4. 設定 `.lang-switch` 的 `href` / 文字 / `hreflang` / `lang`
5. 把 `?lang=` 補到站內連結上（6.3）
6. 注入 `<link rel="alternate" hreflang>`

### 6.2 避免語言閃動

`zh` 是 HTML 原始碼裡的文字，所以中文使用者不會閃動、也不該被隱藏任何東西。
只有 `en` 需要遮蓋替換過程：

在 `<head>` 判定出語言的那一刻（`DOMContentLoaded` 之前），若語言是 `en`，
在 `<html>` 上加 `i18n-pending` class，並由同一支 script 注入這段樣式：

```css
html.i18n-pending body { visibility: hidden; }
```

字典套用完成後移除 `i18n-pending`。樣式由 JS 注入而非寫進 `css/`，理由是
**JS 掛掉時這條規則必須不存在**——否則頁面會永久空白。這與 `.reveal` 用 `.js` class
把關的理由相同（`docs/UIUX-SPEC.md` 已記錄該次修正）。

**移除 `i18n-pending` 必須放在 `try`/`finally` 的 `finally` 裡。**（2026-09-27 補充）

`DOMContentLoaded` 處理函式裡任何一步丟出例外——字典有問題、某個
`querySelectorAll` 出乎意料、`history` 被環境限制——都會讓 `classList.remove()`
永遠執行不到，英文頁就**永久空白**。這正是本節一開始要避開的失效模式，
只是換成從 JS 內部觸發而不是 JS 沒載入。

```js
document.addEventListener("DOMContentLoaded", function () {
    try {
        applyDictionary(currentLang);
        setupLangSwitch(currentLang);
        rewriteInternalLinks(currentLang);
        injectAlternateLinks();
    } finally {
        document.documentElement.classList.remove("i18n-pending");
    }
});
```

不要加 `catch` 把錯誤吞掉——例外要讓它照常浮到 console，方便除錯。
`finally` 的唯一職責是保證頁面看得見。

### 6.3 語言切換與站內連結

`.lang-switch` 在 HTML 裡只留一個沒有 `href` 的骨架，由 JS 填：

```html
<a class="lang-switch" data-lang-switch>EN</a>
```

JS 依當前語言決定：

| 當前語言 | 顯示文字 | `href` | `hreflang` | `lang` |
|---|---|---|---|---|
| `zh` | `EN` | 當前路徑 `?lang=en` | `en` | `en` |
| `en` | `中` | 當前路徑 `?lang=zh` | `zh-Hant` | `zh-Hant` |

**`?lang=zh` 必須明確寫出來，不可以只是「去掉 `lang` 參數」。**（2026-09-27 修正）

原本的規定是錯的，用 stub 環境實際執行 `script/i18n.js` 驗證出來的失效路徑：

```
使用者在 nycuCS.html?lang=en      → 判定 en，localStorage 寫入 "en"
按下「中」，href 是乾淨的 nycuCS.html
到達 nycuCS.html                  → 查詢字串無、雜湊無
                                  → localStorage 讀到 "en"
                                  → 判定 en，頁面還是英文
                                  → syncUrl 還把網址 replaceState 回 ?lang=en
```

使用者按了「中」卻拿到英文，而且網址被改回英文。根本原因是**預設語言沒有明確
形式可以表達**：乾淨網址的語意是「我沒有指定」，而不是「我要中文」，
所以它贏不過 `localStorage` 裡記著的 `en`。

`?lang=zh` 同時修好三件事：判定時走第 1 層（查詢字串）而不是第 3 層（localStorage）、
`explicit` 為 true 所以會把 `"zh"` 寫回 `localStorage` 蓋掉舊值、
以及 `syncUrl` 因為語言不是 `en` 而直接跳過、不會亂改網址。

中文的乾淨網址（不帶任何參數）仍然完全有效，而且是 `hreflang` 宣告的 canonical
形式；`?lang=zh` 只在按下切換鈕的那一次出現，之後站內連結不會帶著它跑
（`rewriteInternalLinks` 只在 `en` 時改寫）。

切換按鈕顯示的是**目標**語言，不是當前語言，所以這兩個標籤（`EN` / `中`）
是 `i18n.js` 裡的設定，不進字典——放進字典會需要「zh 字典裡的 EN」這種反直覺的條目。

**站內連結改寫：** 語言是 `en` 時，把所有指向站內 `.html` 的相對連結補上 `?lang=en`，
這樣點進下一頁不會掉回中文，複製出去的網址也是對的。

排除：`http(s)://` 開頭的外部連結、`mailto:`、`#` 開頭的頁內錨點、
`.lang-switch` 本身、以及已經有 `lang=` 參數的連結。

`volleyball/` 底下的頁面不在 i18n 範圍內，若有連結指向它，不改寫。

### 6.4 `script/site.js` 的唯一修改

`initLightbox()` 目前用 `document.documentElement.lang` 判斷 lightbox 的
`aria-label`（第 116–118 行附近）。`i18n.js` 會在 `<head>` 就把 `lang` 設好，
而 `site.js` 在 body 結尾才執行，所以**這段邏輯照原樣就會繼續正確運作，不需要修改**。

需要修改的是同一個函式裡寫死的中文：

```js
closeButton.innerHTML = '<span aria-hidden="true">&times;</span><span class="sr-only">關閉</span>';
```

這個「關閉」在英文頁沒有被翻譯——是既有缺陷。改成與 `aria-label` 相同的
`isEnglish` 判斷，英文給 `Close`。這是 `script/site.js` 唯一被授權的改動。

---

## 7. 驗收

`tools/i18n-check.mjs` 是本次的交付物之一，不是鷹架——它是「同步中英文」這個目標的
執行機制。以 `node tools/i18n-check.mjs` 執行，任何一項失敗回傳非 0。

必須檢查：

1. **每份字典的中英鍵集合一致** — 同一個 `i18n/<slug>.js` 裡兩個 `Object.assign`
   的鍵完全相同、順序相同；不一致時指出檔名、缺少的鍵、以及順序第一個分岔的位置
2. **無重複鍵** — 同一個鍵不得在兩份字典檔裡都出現（`common.*` 與 `<slug>.*` 撞名）
3. **無孤鍵** — 每一份 HTML 用到的 `data-i18n*` 鍵都找得到，且來自該頁實際載入的字典檔
   （`nycuCS.html` 不得使用 `i18n/tcssh.js` 的鍵，即使那個鍵存在）
4. **無死鍵** — 每個鍵都至少被一份 HTML 用到
5. **fallback 相符** — HTML 裡寫死的文字與該鍵的 `zh` 值逐字相同
   （這條會抓到「改了 HTML 忘了改字典」，是雙語不脫鉤的主要防線）
6. **載入宣告正確** — 每頁的 `<script src="i18n/…">` 恰好是 `common.js` 加自己那一份
7. **無空值** — 列出值為空字串的鍵，警告而非錯誤（刻意留空是合法的）

檢查工具讀 HTML 用正規表達式即可，不要引入任何 npm 套件——這個 repo 沒有 `package.json`，
也不該為了驗證工具而新增。`node:fs` 與 `node:path` 之外不得 import。

實作者要另外產出 `docs/I18N-KEYS.md`，內容是**實際跑出來的**鍵值清冊
（總數、每頁鍵數、每個鍵的中英文值），不是估計值。依據 AI_GUIDELINES §2.2。

### 結構檢查指令

```bash
# 舊目錄已清除
test ! -d zh && test ! -d en && echo "OK: zh/ en/ 已移除"

# 根目錄 10 份 HTML
ls -1 *.html | wc -l                      # 應為 10

# 沒有 ../ 殘留
grep -rn '\.\./' *.html                   # 應無輸出

# 舊檔名沒有殘留
grep -rn 'sitemap_zh\|_en\.html' *.html   # 應無輸出

# 每頁都有必要元素
grep -l 'skip-link' *.html | wc -l        # 10
grep -l 'data-lang-switch' *.html | wc -l # 10
grep -l 'script/i18n.js' *.html | wc -l   # 10
grep -l 'meta name="description"' *.html | wc -l  # 10

# aria-current="page" 只出現在導覽列裡的那 4 頁
# （index / sitemap / introMe / contact）。實測原始 zh/ 檔案：
#   contact 1、introMe 1、sitemap_zh 1、index 1，其餘 5 頁為 0。
# 系所頁與生活頁不在導覽列，本來就不該有，不要「補齊」。
grep -l 'aria-current="page"' *.html | wc -l      # 4

# 字典檔數量與 JS 語法
ls -1 i18n/*.js | wc -l                   # 應為 11（common + 10 頁）
for f in script/*.js i18n/*.js; do node --check "$f" || echo "FAIL $f"; done
node --check tools/i18n-check.mjs

# 沒有 inline onclick（UIUX-SPEC 既有規則）
grep -rn 'onclick=' *.html                # 應無輸出

# 字典與鍵值
node tools/i18n-check.mjs

# 標籤骨架沒被改動（逐頁比對新檔與原 zh/ 檔）
skel() { grep -oE '</?[a-zA-Z][a-zA-Z0-9]*' "$1" | tr 'A-Z' 'a-z'; }
diff <(skel zh/nycuCS.html) <(skel nycuCS.html)
```

**骨架比對指令的陷阱（2026-09-27 修正）：** 這條指令原本寫成
`grep -o '<[a-zA-Z/][^>]*>' | sed 's/>.*//' | tr -d ' ' | grep -o '^<[a-zA-Z/]*'`，
其中 `tr -d ' '` 會把 `<title data-i18n=...>` 裡 `title` 與 `data-i18n` 之間的空白吃掉，
變成 `<titledata`，於是「`<title>` 多了一個屬性」被誤報成「標籤改變」。
上面的 `grep -oE` 版本直接只抓標籤名、不碰屬性，沒有這個問題。

預期的合理差異只有三類，其他任何差異都要當成錯誤追查：

1. `<head>` 多出三對 `<script>`（`i18n/common.js`、`i18n/<slug>.js`、`script/i18n.js`）
2. footer 版權列多出一對 `<span>`（包 `common.brand.name`，見第 4 節）
3. 該頁若有需要拆出文字的 `<img>` 段落，多出 `<span>`（見第 3.2 節）

### 不可要求的驗收

依 AI_GUIDELINES §3.3：**不得要求實作 agent「用瀏覽器實際看」或執行 `open`**。
視覺驗收（語言閃動、切換後版面、無 JS 時的中文頁）由擁有者本人或真正的
瀏覽器自動化工具負責，不算在 agent 的交付範圍內。

---

## 8. 需要新譯的內容

> **譯文已定案。** 本節說明「哪些地方需要新譯、為什麼」；實際的英文譯文與每一個
> 判斷取捨都寫在 `docs/I18N-TRANSLATION-NOTES.md`，實作時**直接照抄那份文件，
> 不要自行意譯**。本節與該文件衝突時，以該文件為準。


AI_GUIDELINES §1.5 禁止 AI 改寫擁有者自己的文字。**翻譯是新增，不是改寫**，
所以以下內容由 AI 產出英文版；中文原文一字不動，含既有錯字。
擁有者已於 2026-09-27 明確授權此項，但仍須驗收。

### 8.1 `en/introMe_en.html` 缺少的三段

英文版少了三個 `.timeline__item`，需依 `zh/introMe.html` 新譯：

| 中文 `timeline__marker` | 內容 |
|---|---|
| 學習歷程 | 「自古英數不兩立」＋小學／國高中／大學 |
| 學習歷程 | 「Programming」＋啟蒙運動／文藝復興／巴洛克時期 |
| 未來展望 | 「展翅翱翔」三條列 |

翻譯注意：

- 「啟蒙運動 / 文藝復興 / 巴洛克時期」是刻意的歷史時期借喻，英文要保留這個玩法
  （Enlightenment / Renaissance / Baroque Period），不要改成 Stage 1／2／3。
- 「自古英數不兩立」是「自古忠孝不兩立」的仿作，指英文與數學。直譯會失去梗，
  需意譯並在交付報告中說明取捨。
- 「民國93年3月」→ 西元 2004 年 3 月。
- 「學測數學前標、分科數學均標」是台灣升學考試的級分術語，英文需補最小必要說明。
- 『理想混蛋 《不是因為天氣晴朗才愛你》』沿用 `en/introMe_en.html` 既有譯法
  `Ideal Idiot - "I Love You Not Because It's Sunny"`，不要另譯。

### 8.2 `index.html` 的英文版

原本沒有英文首頁（舊架構的 `index.html` 的 EN 連結是指向 `en/sitemap_en.html`）。
合併後 `index.html?lang=en` 就是英文首頁，所以首頁全部字串都需要新譯。

可重用既有譯文的部分（**必須逐字沿用，不要重譯**）：

| 中文 | 既有英文出處 |
|---|---|
| 系所名稱、系所介紹連結文字 | `en/sitemap_en.html` |
| 「自我介紹」「網站導覽」「聯絡我」 | `en/sitemap_en.html` 的 nav |
| 「陽明交大資訊工程學系」等標題 | `en/nycuCS_en.html` 等 banner |

真正需要新譯的只有 `.hero` 與 `.intro-section`：hero eyebrow／lead／兩顆按鈕、
「個人簡介」「我的系所」「我的高中」三個 `<h2>` 及其段落。

`.intro-section` 的段落含 `<mark class="kw">`，英文版要保留同樣的 `<mark>` 包法
（關鍵字標記是設計的一部分，見 `docs/UIUX-SPEC.md`）。

### 8.3 交付要求

新譯內容在報告中單獨列出，標明「這是 AI 新譯、待擁有者驗收」，
不要混在結構性改動的清單裡。依 AI_GUIDELINES §2.4，任何意譯取捨都要說明。

---

## 9. 已知取捨

1. **SEO 變弱。** 英文內容由 JS 產生，爬蟲若不執行 JS 只會看到中文。
   `?lang=en` 讓英文版至少有獨立網址、`<link rel="alternate" hreflang>` 讓兩個版本互相
   宣告，但比不上兩份靜態 HTML。個人網站規模下接受；若日後在意，正解是加建置步驟
   把兩個語言預先產出成靜態檔，而字典架構正好是那一步的前提。
2. **英文首次載入會有短暫遮蓋。** 見 6.2。中文（預設語言）零成本。
3. **無 JS 時只有中文。** 這是「HTML 只有一坨」的直接代價，且中文頁是完整可讀的。
4. **舊網址失效。** 見第 1 節。
