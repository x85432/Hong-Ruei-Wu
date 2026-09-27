> **狀態**：本規格已於 2026-09-27 全數實作完成並通過驗收。
> §1 圖片對照表的「原檔」欄位是改版前的舊檔名，那些檔案已刪除（內容仍在 git 歷史中）。
> 設計系統層的規格見 `UIUX-SPEC.md`。

# 逐頁規格與圖片對照表

搭配 `SPEC.md` 一起讀。`SPEC.md` 定的是系統，本檔定的是每一頁要長什麼樣。

---

## 0. 關於文案的鐵律

**使用者寫的每一句個人敘述，原文照搬，不得改寫、潤飾、精簡或翻譯。**
包含錯字（例如首頁「孕育我成長的收栽」的「收栽」、`hackthon` 檔名拼字、introMe 裡的「sysytem.println()」）都**保留原樣**——那是他的文字，不是 bug。有疑慮的地方最後彙整成清單交給使用者自己決定，不要動手改。

唯一可以新增的文字是：
- `.page-header__lead`（本檔逐頁指定，照抄即可）
- 圖片的 `alt`
- `aria-label` / `.sr-only` 等無障礙標籤
- `meta description`

唯一可以刪除的文字是：
- 檔頭 `111652049 吳弘叡 第三次作業 11/1` 註解
- 首頁道歉 popup 的「由於目前還在製作中…請見諒~」
- 首頁 HTML/CSS 標籤清單彈窗的全部內容
- sitemap 廣告「在非洲過60秒等於在新竹過了1分鐘。」與計時器

---

## 1. 圖片對照表

**格式決策**
- 照片（`.jpg` / `.JPG`）→ **WebP**。
- favicon 與品牌 logo（`mylogo.png`）→ **維持 PNG**（favicon 相容性），只就地縮圖壓縮。
- 社群圖示 → 統一轉 96×96 WebP 並改成語意化檔名。
- 動畫 GIF（`百年校慶.gif`）→ **保留 GIF 不轉檔**，只改檔名。
- 全部檔名小寫、連字號、純 ASCII。

**轉檔方式**：用 Python + PIL（環境已有 PIL 12.3.0，沒有 cwebp / ImageMagick）。
等比縮放到指定「長邊上限」，**原圖比上限小就不要放大**。WebP 品質見下表。

**原檔處置**：被取代的原檔**刪除**（內容已在 git HEAD，`git checkout -- resource/` 可完整復原）。
未被任何頁面引用的檔案**一律不要動、不要刪**：`nycu_icon.png`、`pizza.jpg`、`present.jpg`、`台中二中logo.jpg`。
新導覽不再使用 `home.png` / `bunny_icon.png` / `contact_icon.png`，它們會變成沒人引用——**同樣保留不刪**，只在報告中列出。

| 原檔 | 原尺寸／體積 | 新檔 | 輸出尺寸 | 品質 |
|---|---|---|---|---|
| `back1.jpg` | 5712×4284・6.1M | `hero-1.webp` | 長邊 1920 | q78 |
| `back2.jpg` | 4032×3024・1.1M | `hero-2.webp` | 長邊 1920 | q78 |
| `back3.jpg` | 5712×4284・3.1M | `hero-3.webp` | 長邊 1920 | q78 |
| `清交聯合制服日-第一屆.jpg` | 2940×1955・4.3M | `uniform-day-joint.webp` | 長邊 1600 | q80 |
| `spike.JPG` | 3984×2656・2.1M | `spike.webp` | 長邊 1200 | q80 |
| `signature.png` | 1936×795・1.2M | `signature.webp` | 長邊 480 | q85（**保留透明度**） |
| `二中校門.jpg` | 2048×1536・436K | `tcssh-gate.webp` | 長邊 1600 | q80 |
| `cs_college.jpg` | 803×406・340K | `cs-college.webp` | 原尺寸 | q80 |
| `am_college.jpg` | 944×707・96K | `am-college.webp` | 原尺寸 | q80 |
| `intro1.jpg` | 1108×1477・144K | `intro-portrait.webp` | 長邊 1200 | q80 |
| `internship.jpg` | 869×1487・172K | `internship.webp` | 長邊 1200 | q80 |
| `ddl.jpg` | 869×1884・200K | `ddl.webp` | 長邊 1200 | q80 |
| `hackthon.jpg` | 960×1706・340K | `hackathon.webp` | 長邊 1200 | q80 |
| `github.jpg` | 960×1706・156K | `github-commit.webp` | 長邊 1200 | q80 |
| `bigmath.jpg` | 869×1519・260K | `bigmath.webp` | 長邊 1200 | q80 |
| `graduate.jpg` | 960×1706・164K | `graduate.webp` | 長邊 1200 | q80 |
| `math.jpg` | 873×477・76K | `math.webp` | 原尺寸 | q80 |
| `tomyuan.jpg` | 960×1706・300K | `tomyuan.webp` | 長邊 1200 | q80 |
| `win.jpg` | 960×1563・256K | `win.webp` | 長邊 1200 | q80 |
| `mess.jpg` | 960×1706・288K | `mess.webp` | 長邊 1200 | q80 |
| `volleyball_class.jpg` | 858×1481・176K | `volleyball-class.webp` | 長邊 1200 | q80 |
| `105水啦.jpg` | 869×1509・224K | `relay-race.webp` | 長邊 1200 | q80 |
| `最新制服日.jpg` | 869×1473・120K | `uniform-day.webp` | 長邊 1200 | q80 |
| `二中衫.jpg` | 474×474・24K | `tcssh-shirt.webp` | 原尺寸 | q82 |
| `二中褲.jpg` | 474×266・12K | `tcssh-pants.webp` | 原尺寸 | q82 |
| `二中書包.jpg` | 330×248・20K | `tcssh-bag.webp` | 原尺寸 | q82 |
| `tcssh_icon.png` | 960×864・120K | `tcssh-logo.webp` | 長邊 480 | q85（保留透明） |
| `百年校慶.gif` | 900×584・300K | `centennial.gif` | 不轉檔，只改名 | — |
| `mail.jpg` | 474×474・16K | `icon-mail.webp` | 96×96 | q85 |
| `linkin.jpg` | 474×474・20K | `icon-linkedin.webp` | 96×96 | q85 |
| `ig.jpg` | 474×474・20K | `icon-instagram.webp` | 96×96 | q85 |
| `fb.png` | 1200×1200・32K | `icon-facebook.webp` | 96×96 | q85（保留透明） |
| `line.png` | 868×883・24K | `icon-line.webp` | 96×96 | q85（保留透明） |
| `mylogo.png` | 730×730・300K | `mylogo.png`（就地） | 256×256 | PNG `optimize=True` |

**驗收**：`du -sh resource` 扣掉未引用的 4 個檔後，被引用的圖片總和必須 **< 3MB**。
改名後全站不得殘留舊路徑：
```bash
grep -rn "back1\|back2\|back3\|spike\.JPG\|hackthon\|intro1\|105水啦\|二中\|最新制服日\|清交聯合\|百年校慶\|mail\.jpg\|ig\.jpg\|linkin\.jpg\|fb\.png\|line\.png\|cs_college\|am_college\|volleyball_class\|tcssh_icon\|signature\.png" --include='*.html' --include='*.css' . | grep -v volleyball
# 應為 0 筆
```

**alt 文字**（取代原本「生活照片1」這類無意義文字）
| 新檔 | alt |
|---|---|
| `internship.webp` | 中研院實習期間的工作照 |
| `ddl.webp` | 趕作業到深夜的桌面 |
| `hackathon.webp` | 台北通黑客松在台大的參賽現場 |
| `github-commit.webp` | 第一次把作品推上 GitHub 的畫面 |
| `intro-portrait.webp` | 吳弘叡的個人照 |
| `signature.webp` | 吳弘叡的手寫簽名 |
| `spike.webp` | 在排球場上跳起扣球 |
| `relay-race.webp` | 高一大隊接力的比賽照 |
| `volleyball-class.webp` | 班際排球比賽的隊伍合照 |
| `mess.webp` | 回二中拜訪美術老師的合照 |
| `uniform-day.webp` | 制服日與同學的合照 |
| `uniform-day-joint.webp` | 第一屆清交聯合制服日活動照 |
| `tcssh-gate.webp` | 臺中二中校門 |
| `tcssh-shirt.webp` | 臺中二中制服上衣 |
| `tcssh-pants.webp` | 臺中二中制服長褲 |
| `tcssh-bag.webp` | 臺中二中書包 |
| `tcssh-logo.webp` | 臺中二中校徽 |
| `centennial.gif` | 臺中二中百年校慶活動動畫 |
| `bigmath.webp` / `graduate.webp` / `math.webp` / `tomyuan.webp` / `win.webp` | 依 `am_life.html` 原本的 `figcaption` 內容自行撰寫對應描述 |
| `cs-college.webp` / `am-college.webp` | 裝飾性背景，用 `alt=""`（若改成 CSS 背景圖則無需 alt） |
| 社群 `icon-*.webp` | `alt=""`（因為旁邊已有文字標籤） |

---

## 2. 逐頁規格

### 2.1 `index.html`（首頁・`css/home.css`）

路徑注意：這頁在根目錄，所有資源路徑**不帶 `../`**，站內連結帶 `zh/` 或 `en/`。

- `<title>`：`吳弘叡 — 個人網站`
- `meta description`：`陽明交大資訊工程系與應用數學系雙主修、應數系排球隊隊長吳弘叡的個人網站。`
- 導覽的「首頁」加 `aria-current="page"`。

**結構**
1. **Hero**（全寬，**放在 `.container` 之外**）
   - 底圖：`.hero` 自身 `background-image: url(resource/hero-1.webp)`；內部三個 `.hero__slide` 分別是 hero-1/2/3，照 `SPEC.md` §7.1 的 keyframes 與 delay。
   - `.hero__scrim` 漸層遮罩。
   - `.hero__content`（包在 `.container` 內）：
     - eyebrow 小字：`Welcome to 弘叡's Home`（保留原本 h1 文案，降級為 `.hero__eyebrow`）
     - `<h1>吳弘叡</h1>`
     - `.hero__lead`：`陽明交大資訊工程系 × 應用數學系雙主修・應數系排球隊隊長`
     - `.hero__actions`：`.btn` →「認識我」`zh/introMe.html`、`.btn--ghost` →「網站導覽」`zh/sitemap_zh.html`
2. **個人簡介 section**（`.container--narrow`）
   原首頁三段文字，**原文照搬**，各配一個 `<h2>`：
   - `個人簡介`：我是吳弘叡，土生土長的臺中霧峰人。／興趣是打排球，目前擔任本校應用數學系排球隊隊長。／資工雙主修應數
   - `我的系所`：轉系前: … 目前: …（整段照搬）
   - `我的高中`：臺中二中，歷史悠久的校園，孕育我成長的收栽。
   原本的 `<br>` 換行可以保留，或改成獨立 `<p>`，兩者皆可。
   **關鍵字強調**：把這些詞**首次出現**處用 `<mark class="kw">` 包起來（不做動畫）：
   `吳弘叡`、`排球`、`陽明交大`、`資工`、`應數`、`臺中二中`、`轉系`、`隊長`、`雙主修`
   （原 JS 的 keywords 陣列含「收栽」，那是錯字，不要 mark 它。）
   `.kw` 樣式：`background: var(--brand-soft); color: var(--brand-dark); padding: 0 .2em; border-radius: var(--radius-sm); font-weight: 500;`
3. **求學歷程 section**（`.card-grid`，3 張 `.card`）
   **卡片內不要放任何自己編的描述文字**，只有標題與連結：
   | 卡片標題 | 連結 |
   |---|---|
   | 陽明交大資訊工程系 | 系所介紹 `zh/nycuCS.html`／資工系生活 `zh/cs_life.html` |
   | 陽明交大應用數學系 | 系所介紹 `zh/nycuAM.html`／應數系生活 `zh/am_life.html` |
   | 市立臺中第二高級中學 | 我看到的二中 `zh/tcssh.html`／開心高中生活 `zh/tcssh_life.html` |

**刪除**：`#popup`、`#overlay`、`#elements`、nav 裡的 `#button`、`.slide4`、`.highlight` / `bounce` 動畫、`script/index.js` 全部 highlight 邏輯。
`script/index.js` 若清空後無事可做就**刪檔**（首頁 hero 是純 CSS，不需要 JS）。

---

### 2.2 `zh/sitemap_zh.html`（`css/sitemap.css` + `script/sitemap.js`）

- `<title>`：`網站導覽 — 吳弘叡`
- `.page-header__lead`：`這個站的所有頁面都在這裡。`
- 四個分組改成 `.card-grid` 裡的 4 張 `.card`，標題**沿用原文**：`了解我`／`資訊工程學系`／`應用數學系`／`市立臺中第二高級中學`，連結文字也沿用原文。
- **所有 `<a onclick="openNewTab(...)">` 改成真正的 `<a href="...">`，同頁開啟**（站內連結不要開新分頁）。`openNewTab()` 函式刪除。
- **拔蘿蔔（保留）**：蘿蔔移到連結**之後**，且是獨立按鈕，不在 `<a>` 裡：
  ```html
  <li>
      <a href="introMe.html">自我介紹</a>
      <button class="carrot" type="button" aria-label="拔一根蘿蔔">🥕</button>
  </li>
  ```
  `script/sitemap.js` 重寫規格：
  - 用 **Pointer Events**（`pointerdown` / `pointermove` / `pointerup` + `setPointerCapture`），滑鼠與觸控都能拖。`touch-action: none` 放在拖曳元素上。
  - 點按鈕 → 按鈕文字變 `🕳️` 並加 `.is-empty`（成為可放回的洞）；在 `document.body` 建立 `.carrot-drag`（`position: fixed`）掉到視窗底部。
  - 拖曳位移用 `transform: translate()`，**不要**改 `left` / `top`。
  - 放手時若與任一 `.is-empty` 的洞重疊 → 洞恢復 `🥕`、移除 `.is-empty`、拖曳元素消失；否則掉回視窗底部。
  - 拖曳中的蘿蔔加 `aria-hidden="true"`（純裝飾，不需要螢幕閱讀器讀）。
  - `prefers-reduced-motion` 時不播掉落動畫，直接定位。
  - 視窗 resize 後不能讓蘿蔔跑到畫面外。
- **標題 hover**：原本 JS 寫 inline style 做 -5°/+5° 旋轉 → 刪掉那段 JS，改 CSS `.card--link:hover { transform: translateY(-2px) }`（已在 `layout.css`）。
- **刪除**：`#timer` 與其計時 JS、`#ad` 與 `showAd/closeAd`（含「在非洲過60秒…」文案）、`#close`。

---

### 2.3 `zh/introMe.html`（`css/profile.css`）

- `<title>`：`自我介紹 — 吳弘叡`
- `.page-header__lead`：`從霧峰到交大——興趣、學習歷程，以及接下來想做的事。`
- **移除**：`.container` 的 `overflow-y: scroll`、`scroll-snap-type`、`height: 100vh`、`.section` 的 `height: 100vh` / `scroll-snap-align`、`.content` 的 `min-height: 80vh` / `max-width: 25vw`。改成正常的整頁滾動。
- 5 個 `<section>` 改成時間軸：
  ```html
  <ol class="timeline">
      <li class="timeline__item reveal">
          <div class="timeline__marker" aria-hidden="true">簡介</div>
          <div class="timeline__body"> …原本的 .content 內容，用 .card 包… </div>
      </li>
  </ol>
  ```
  - 垂直線用 `.timeline::before`（`--border-strong` 色），marker 是 `--brand-soft` 底 + `--brand-dark` 字的圓形（原本黃底藍字 + 灰框，改成品牌色系）。
  - **≤768px**：線移到左側 `var(--space-4)`，marker 縮小並改成方形標籤，`.timeline__body` 全寬。
- 照片：`intro-portrait.webp`（stage1，`width="900" height="1200"`，但用 CSS 限制 `max-height: 480px`）、`signature.webp`、`spike.webp`。全部加 `loading="lazy" decoding="async"`。
- **修正原始碼的不合法嵌套**（`<p>` 裡包 `<h3>`、`<ul>`）：拆成兄弟元素。**文字一個字都不能改**。stage4 結尾多餘的 `</p>` 清掉。
- 外部連結（music.youtube.com、minecraft.net、youtube.com）加 `target="_blank" rel="noopener"`。
- **刪除 `script/intro.js`**，改用 `site.js` 的 `.reveal`。

---

### 2.4 `zh/nycuCS.html`／`zh/nycuAM.html`（共用 `css/dept.css`）

`css/csStyle.css` 與 `css/amStyle.css` 合併成一個 `css/dept.css`，兩頁差異只有 banner 背景圖，用 body 的 class 區分：`<body class="dept dept--cs">` / `dept--am`。

- `<title>`：`陽明交大資訊工程學系 — 吳弘叡` / `陽明交大應用數學系 — 吳弘叡`
- **這兩頁不要 `.page-header__lead`**（只有 `<h1>`）——避免替使用者編造系所描述。
- **Banner**（取代原本 `height: 100vh` 的背景圖容器）：
  ```css
  .dept-banner { min-height: clamp(180px, 28vh, 320px); background-size: cover; background-position: center;
                 position: relative; display: grid; align-items: end; }
  .dept-banner::after { content: ''; position: absolute; inset: 0;
                        background: linear-gradient(to top, var(--scrim-strong), transparent 70%); }
  .dept--cs .dept-banner { background-image: url('../resource/cs-college.webp'); }
  .dept--am .dept-banner { background-image: url('../resource/am-college.webp'); }
  ```
  banner 上用白字放系所名稱（`z-index` 要在 `::after` 之上）。
- 四個 `.box` 改成 `.card`（`.card-grid`），`<h3>` → `.card__title`，`<div class="content">` → `.card__body`。
  **內文一律直接顯示**，移除 `max-height: 0` / `.box:hover .content { max-height: 150px }`。
- 移除 `.box:hover` 的 `background: #4CAF50` 變綠與 `transform: scale(1.1)`，改用 `layout.css` 的 `.card` hover 陰影。
- 移除 `@keyframes fadeIn` 與 `animation: fadeIn 3s`。

---

### 2.5 `zh/cs_life.html`／`zh/am_life.html`／`zh/tcssh_life.html`（共用 `css/gallery.css`）

- `<title>` / `<h1>`：`資工系生活` / `應數系生活` / `二中生活`（沿用原文）
- `.page-header__lead`：
  - 資工系生活：`實習、黑客松，還有被 deadline 輾過去的日子。`
  - 應數系生活：`大學前兩年在應數系留下的紀錄。`
  - 二中生活：`大隊接力、班際排球，還有那些制服日。`
- **`zh/am_life.html` 的整段 inline `<style>`（約 170 行）全部刪除**，改用 `gallery.css`。
- 三頁 `<main calss="container">` 的 **typo 修正**為 `<main id="main">`（照 `SPEC.md` §4.2 骨架）。
- `.photo-wall` 保留 `grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))`。
- 每個 `<figure>` 改成：
  ```html
  <figure class="photo-card reveal">
      <button class="lightbox-trigger" type="button">
          <img src="../resource/xxx.webp" alt="<見圖片對照表>" width="…" height="…" loading="lazy" decoding="async">
      </button>
      <figcaption>…原本的說明文字，原文照搬…</figcaption>
  </figure>
  ```
  `.photo-wall` 加 `data-lightbox` 屬性。
- **移除 `scale(3)` 滑鼠放大鏡**（`.spotlight` 與 `script/life.js` 一起刪），改 lightbox。
- 移除 `figure:nth-child(n)` 的硬寫 `animation-delay`，改 `.reveal`（`site.js` 會依序觸發）。
- `cs_life` 的 GitHub 那張：`window.open(...)` 與 `openGitHub()` 刪掉，改在 `figcaption` 裡放
  `<a href="https://github.com/kuwaai/genai-os#user-content-----------kuwa-genai-os--" target="_blank" rel="noopener">`，圖片本身仍走 lightbox。
- `body li { list-style-type: "🥕" }` 這條全域規則**不要**帶進 `gallery.css`（原 `life.css` 的遺留）。

---

### 2.6 `zh/tcssh.html`（`css/school.css` + `script/school.js`）

- `<title>`：`臺中二中介紹 — 吳弘叡`，`<h1>`：`臺中二中介紹`（沿用原文）
- `.page-header__lead`：`創校於 1922 年的校園。`
- 輪播照 `SPEC.md` §7.2 重做：
  - `input[type="radio"]` 用 `.sr-only`（**不要 `display: none`**，要能聚焦）。
  - `label for` **指向自己那一張**（修掉原本指向下一張的怪機制）。
  - `.carousel__dots` 圓點指示器，每顆 ≥44×44 觸控區，`aria-label` 寫「第 N 張，共 4 張」。
  - 每張 slide 的說明文字**永遠可見**（原本藏在 label 裡）。
  - `script/school.js`：左右方向鍵切換、切換時更新 `aria-current`。
- slide 內容沿用原檔 4 張（校門＋校徽、制服上衣／長褲、書包、百年校慶 GIF），圖片換成新檔名。
- 校門那張的校徽疊圖連結 `https://tcssh.tc.edu.tw/` 保留，加 `rel="noopener"`。
- 制服／書包／校徽的 hover 放大保留，但包在 `@media (hover: hover) and (min-width: 768px)` 裡（觸控裝置不做）。
- 疊圖定位原本用 `top: 20%; left: 50%` 這類百分比 + 固定 `width: 300px`，改成用相對容器的百分比寬度，確保手機不會疊出畫面。

---

### 2.7 `zh/contact.html`（`css/contact.css`）

原本這頁**完全沒有 header / footer / 返回路徑**，是死路。

- `<title>`：`聯絡我 — 吳弘叡`
- 補完整 `SPEC.md` §4.2 骨架（header + footer + skip link）。
- `.page-header__lead`：`歡迎用任何方式找我。`
- `.contact-list`：5 張 `.card--link`，每張整塊可點（`<a>` 包住內容），內含 icon（顯示 40×40）+ 名稱 + 帳號文字：
  | 名稱 | 顯示文字 | href | icon |
  |---|---|---|---|
  | Email | `x85432.sc11@nycu.edu.tw` | `mailto:x85432.sc11@nycu.edu.tw` | `icon-mail.webp` |
  | LinkedIn | `Hung-Ruei Wu` | 原連結 | `icon-linkedin.webp` |
  | Instagram | `@x85432` | 原連結 | `icon-instagram.webp` |
  | Facebook | `吳弘叡` | 原連結 | `icon-facebook.webp` |
  | Line | `加我好友` | 原連結 | `icon-line.webp` |
- `mailto:` **不要**加 `target="_blank"`；其餘四個 `target="_blank" rel="noopener"`。
- icon 用 `alt=""`（旁邊已有文字），`width="40" height="40"`。

---

### 2.8 `en/` 全部 9 頁

`en/introMe_en.html`、`nycuCS_en.html`、`nycuAM_en.html`、`cs_life_en.html`、`am_life_en.html`、`tcssh_en.html`、`tcssh_life_en.html`、`sitemap_en.html`、`contact_en.html`

規則：
1. **先讀原檔，把英文文案原封不動取出**，不得改寫或重譯。
2. 套用與中文版**完全相同**的結構與 CSS（同一份 `dept.css` / `gallery.css` / …）。
3. `<html lang="en">`；skip link 文字 `Skip to main content`；`aria-label="Main navigation"`。
4. 導覽文字：`Home` / `Sitemap` / `About Me` / `Contact`；`.lang-switch` 顯示 `中`，連回對應中文頁（對照表見 `SPEC.md` §4.3），屬性 `hreflang="zh-Hant" lang="zh-Hant"`。
   注意「Home」指向 `../index.html`（中文首頁，站上沒有英文首頁）。
5. footer：`© 2024–2026 Hong-Ruei Wu` + `Sitemap / About Me / Contact` 三個英文連結。
6. `.page-header__lead` 由中文版的 lead 翻成英文。
7. `en/contact_en.html` 要補上原本缺少的 favicon，以及 header / footer。
8. `en/nycuCS_en.html` 等頁的 `<title>` 沿用原檔英文標題，後面接 ` — Hong-Ruei Wu`。

---

## 3. 交付時要回報的內容

1. 改了哪些檔、刪了哪些檔（清單）。
2. `SPEC.md` §9 驗收清單每一條的實際執行結果（貼指令輸出）。
3. `du -sh resource` 前後對比。
4. **發現但沒有動手改的問題清單**（例如使用者文案的錯字、未被引用的圖片、內容事實可疑處），留給使用者自己決定。
