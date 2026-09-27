> **狀態**：本規格已於 2026-09-27 全數實作完成並通過驗收（19 個頁面）。
> 文中的「新增／刪除」指的是當時的改版動作，現在讀起來就是目前的檔案架構說明。
> 搭配 `UIUX-PAGES.md`（逐頁規格）與 `IMAGE-SIZES.md`（圖片實測尺寸）一起看。

# 吳弘叡個人網站 UI/UX 改版規格（設計系統層）

專案根目錄：`/Users/red/Hong-Ruei-Wu`
風格方向：**現代簡約作品集**（白底、單一品牌藍、統一卡片、大量留白）。
語言：所有註解與 UI 文案用繁體中文（英文版頁面用英文）。

---

## 0. 鐵律（違反就算失敗）

1. **不要修改 `css/tokens.css`**。它已定案，是全站唯一色彩／字級／間距來源。
2. **不要修改 `volleyball/` 目錄任何檔案**，也不要從主站導覽連到它。本輪不在範圍內。
3. **不要動 `css/addComment.py`**（使用者的舊腳本），也絕對不要執行它。
4. **所有色值、字級、間距、圓角、陰影都必須用 `var(--token)`**，不准寫死色碼（照片上的漸層遮罩例外，可用 `var(--scrim)`）。
5. **不准用 `position: absolute` 排導覽**，不准再出現 `right: 250px` 這類硬定位。
6. **不准用 `vh` 當內容區塊高度**（hero 例外，且要用 `min-height` + `dvh` fallback）。字級不准用 `vw`，要用 `clamp()`。
7. 每個頁面樣式檔**只放該頁獨有規則**。header / nav / footer / 卡片 / 按鈕一律來自 `layout.css`，不得重複定義。
8. 完成後必須自己用 `grep` 驗證第 9 節的驗收清單。

---

## 1. 檔案架構（新舊對照）

### CSS
| 新檔 | 取代 | 內容 |
|---|---|---|
| `css/tokens.css` | — | **已完成，勿改** |
| `css/base.css` | 新增 | reset、字型、排版、連結、表單、a11y 工具類 |
| `css/layout.css` | 新增 | `.site-header` / `.site-nav` / `.site-footer` / `.container` / `.page-header` / `.card` / `.btn` / `.reveal` |
| `css/home.css` | `css/index.css`（刪） | 首頁 hero + 入口卡 |
| `css/sitemap.css` | 原地重寫 | 網站導覽頁 + 拔蘿蔔 |
| `css/profile.css` | `css/introStyle.css`（刪） | 自我介紹時間軸 |
| `css/dept.css` | `css/csStyle.css` + `css/amStyle.css`（都刪） | 兩個系所頁共用 |
| `css/gallery.css` | `css/life.css`（刪） | 照片牆 + lightbox |
| `css/school.css` | `css/tcsshStyle.css`（刪） | 二中介紹輪播 |
| `css/contact.css` | 原地重寫 | 聯絡頁 |

每個頁面的 `<head>` 載入順序固定為：
```html
<link rel="stylesheet" href="../css/tokens.css">
<link rel="stylesheet" href="../css/base.css">
<link rel="stylesheet" href="../css/layout.css">
<link rel="stylesheet" href="../css/<頁面>.css">
```

### JS
| 新檔 | 取代 | 內容 |
|---|---|---|
| `script/site.js` | 新增 | 漢堡選單、`.reveal` 進場、lightbox。**全站每頁都載入** |
| `script/sitemap.js` | 原地重寫 | 只留拔蘿蔔（改 Pointer Events） |
| `script/school.js` | 新增 | 二中輪播控制 |
| `script/home.js` | 新增（如需要） | 首頁專用 |
| — | `script/intro.js`（刪） | 功能併入 `site.js` 的 reveal |
| — | `script/life.js`（刪） | 功能併入 `site.js` 的 lightbox |

---

## 2. base.css 規格

- `*, *::before, *::after { box-sizing: border-box; }`
- `html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; }`
- `body`：`font-family: var(--font-sans)`、`color: var(--text)`、`background: var(--surface)`、`line-height: var(--leading-normal)`、`margin: 0`、`min-height: 100dvh`、`display: flex; flex-direction: column`（讓 footer 自然沉底，**不要用 fixed**）。
- 標題 `h1`–`h4` 用 `--text-4xl`…`--text-lg`，`line-height: var(--leading-tight)`，`margin-block` 用 token。
- 段落 `p` 最大閱讀寬度 `max-width: 68ch`。
- 連結：`color: var(--brand)`；`:hover { color: var(--brand-dark); text-decoration-thickness: 2px; }`
  **絕對不要出現 `a:hover { color: white }`**（原本 `life.css` / `sitemap.css` 的 bug，白底上 hover 會讓字消失）。
- `img, picture, video { max-width: 100%; height: auto; display: block; }`
- `ul, ol` 預設 `list-style-position: outside`；不要用 `list-style-type: "🥕"`（改由 sitemap 頁自己處理）。
- **焦點樣式**（必須有）：
  ```css
  :focus-visible { outline: 3px solid var(--brand-ring); outline-offset: 2px; border-radius: var(--radius-sm); }
  ```
- **工具類**：`.sr-only`（螢幕閱讀器專用）、`.skip-link`（預設藏在畫面外，`:focus` 時出現在左上角）。
- **動態偏好**：
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important; scroll-behavior: auto !important; }
  }
  ```

---

## 3. layout.css 規格

### 3.1 容器
```css
.container { width: 100%; max-width: var(--container); margin-inline: auto; padding-inline: var(--space-5); }
.container--narrow { max-width: var(--container-narrow); }
```

### 3.2 網站頁首 `.site-header`
- `position: sticky; top: 0; z-index: 50`，白底 + `border-bottom: 1px solid var(--border)`，滾動時不變形。
- 內部 `.site-header__inner`：`display: flex; align-items: center; justify-content: space-between; min-height: var(--header-h); gap: var(--space-4)`。
- `.brand`：logo（`resource/mylogo.png`，32×32）+ 文字「吳弘叡」，`font-weight: 600`，`color: var(--text)`，hover 不變色只加底線。
- `.site-nav__list`：`display: flex; gap: var(--space-1); list-style: none; margin: 0; padding: 0`。
- `.nav-link`：`padding: var(--space-2) var(--space-3)`、`border-radius: var(--radius-sm)`、`color: var(--text-muted)`、`font-size: var(--text-sm)`、`text-decoration: none`；hover → `background: var(--surface-alt); color: var(--text)`。
- **目前頁指示**：用 `aria-current="page"` 屬性，樣式 `.nav-link[aria-current="page"] { color: var(--brand); background: var(--brand-soft); font-weight: 600; }`
- `.lang-switch`：外框按鈕樣式（`border: 1px solid var(--border-strong)`、`border-radius: var(--radius-full)`、`font-size: var(--text-xs)`），顯示「EN」或「中」。
- `.nav-toggle`（漢堡鈕）：**≥768px 隱藏**，<768px 顯示。三條 `span` bar，`aria-expanded` 切換。按鈕尺寸至少 44×44（觸控目標）。

**響應式行為**
```css
@media (max-width: 767px) {
  .nav-toggle { display: inline-flex; }
  .site-nav { position: fixed; inset: var(--header-h) 0 auto 0; background: var(--surface);
              border-bottom: 1px solid var(--border); box-shadow: var(--shadow-lg);
              flex-direction: column; padding: var(--space-4); display: none; }
  .site-nav.is-open { display: flex; }
  .site-nav__list { flex-direction: column; align-items: stretch; }
  .nav-link { padding: var(--space-3) var(--space-4); font-size: var(--text-base); }
}
```

### 3.3 頁面標題區 `.page-header`
原本頁面標題塞在藍色 header 裡（`header div h1`）。**改成**：頁首只放品牌＋導覽，頁面 `<h1>` 移到 `<main>` 最上方的 `.page-header` 裡。
```css
.page-header { padding-block: var(--space-12) var(--space-8); border-bottom: 1px solid var(--border); margin-bottom: var(--space-10); }
.page-header__title { margin: 0 0 var(--space-3); }
.page-header__lead { color: var(--text-muted); font-size: var(--text-lg); margin: 0; max-width: 60ch; }
```

### 3.4 卡片 `.card`
全站唯一卡片語彙（取代原本 `lightgreen` / 半透明橘紅 / `bisque` / `#ddd` 的拼貼）：
```css
.card { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg);
        padding: var(--space-6); box-shadow: var(--shadow-sm);
        transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease); }
.card--link:hover, .card--link:focus-within { box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.card__title { margin: 0 0 var(--space-2); font-size: var(--text-xl); }
.card__body { color: var(--text-muted); margin: 0; }
```
`.card-grid { display: grid; gap: var(--space-6); grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }`

### 3.5 按鈕 `.btn`
`.btn`（品牌藍實心，白字）、`.btn--ghost`（白底外框）、`.btn--danger`（不需要，本輪無）。最小高度 44px。

### 3.6 網站頁尾 `.site-footer`
- `margin-top: auto`（配合 body flex column）、`background: var(--surface-alt)`、`border-top: 1px solid var(--border)`、`padding-block: var(--space-8)`。
- **不要 `position: fixed`，不要 `height: 10vh`，不要 `width: 100vw`**（原本三者都是 bug 來源）。
- 內容：`© 2024–2026 吳弘叡` + 三個次要連結（網站導覽／自我介紹／聯絡我）。文字色 `var(--text-muted)`、`font-size: var(--text-sm)`。

### 3.7 進場動畫 `.reveal`
```css
/* 注意 .js 前綴：沒有 JS 就不要把內容藏起來 */
.js .reveal { opacity: 0; transform: translateY(16px);
              transition: opacity var(--dur-slow) var(--ease), transform var(--dur-slow) var(--ease); }
.js .reveal.is-visible { opacity: 1; transform: none; }

/* 偏好減少動態時直接顯示，不依賴 IntersectionObserver */
@media (prefers-reduced-motion: reduce) {
    .js .reveal { opacity: 1; transform: none; }
}
```
（`prefers-reduced-motion` 由 base.css 的全域規則接手。另外 `site.js` 在不支援 IntersectionObserver 時要直接補上 `is-visible`，避免內容永久隱形。）

---

## 4. 標準 HTML 樣板

### 4.1 `<head>`（zh/ 與 en/ 子目錄版；根目錄 `index.html` 把 `../` 去掉）
```html
<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><頁面標題> — 吳弘叡</title>
    <meta name="description" content="<25–70 字的頁面描述>">
    <meta property="og:title" content="<頁面標題> — 吳弘叡">
    <meta property="og:description" content="<同上>">
    <meta property="og:type" content="website">
    <meta property="og:image" content="../resource/mylogo.png">
    <link rel="icon" href="../resource/mylogo.png" type="image/png">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/tokens.css">
    <link rel="stylesheet" href="../css/base.css">
    <link rel="stylesheet" href="../css/layout.css">
    <link rel="stylesheet" href="../css/<頁面>.css">
    <!-- 標記 JS 可用：.reveal 只在有 JS 時才預先隱藏，避免 JS 失效時內容永久看不見 -->
    <script>document.documentElement.classList.add('js');</script>
</head>
```
- 原本檔頭那段 `111652049 吳弘叡 第三次作業 11/1` 註解**全部移除**。
- `<html lang>` 一律 `zh-Hant`（中文頁）或 `en`（英文頁）。不要再出現 `zh` / `zh-TW` 混用。
- 每頁都要有 favicon（`en/contact_en.html` 原本漏了）。

### 4.2 `<body>` 骨架
```html
<body>
    <a class="skip-link" href="#main">跳到主要內容</a>

    <header class="site-header">
        <div class="site-header__inner container">
            <a class="brand" href="../index.html">
                <img class="brand__mark" src="../resource/mylogo.png" alt="" width="32" height="32">
                <span class="brand__name">吳弘叡</span>
            </a>

            <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
                <span class="nav-toggle__bar" aria-hidden="true"></span>
                <span class="nav-toggle__bar" aria-hidden="true"></span>
                <span class="nav-toggle__bar" aria-hidden="true"></span>
                <span class="sr-only">開關選單</span>
            </button>

            <nav class="site-nav" id="site-nav" aria-label="主要導覽">
                <ul class="site-nav__list">
                    <li><a class="nav-link" href="../index.html">首頁</a></li>
                    <li><a class="nav-link" href="sitemap_zh.html">網站導覽</a></li>
                    <li><a class="nav-link" href="introMe.html">自我介紹</a></li>
                    <li><a class="nav-link" href="contact.html">聯絡我</a></li>
                </ul>
                <a class="lang-switch" href="../en/<對應英文頁>" hreflang="en" lang="en">EN</a>
            </nav>
        </div>
    </header>

    <main id="main">
        <div class="container">
            <div class="page-header">
                <h1 class="page-header__title"><頁面標題></h1>
                <p class="page-header__lead"><一句話說明></p>
            </div>
            <!-- 頁面內容 -->
        </div>
    </main>

    <footer class="site-footer">
        <div class="container site-footer__inner">
            <p class="site-footer__copy">&copy; 2024–2026 吳弘叡</p>
            <ul class="site-footer__links">
                <li><a href="sitemap_zh.html">網站導覽</a></li>
                <li><a href="introMe.html">自我介紹</a></li>
                <li><a href="contact.html">聯絡我</a></li>
            </ul>
        </div>
    </footer>

    <script src="../script/site.js"></script>
</body>
</html>
```
- **目前頁**的 `.nav-link` 要加 `aria-current="page"`。
- 英文頁把導覽文字換成 `Home / Sitemap / About Me / Contact`，`.lang-switch` 顯示「中」並連回對應中文頁，`aria-label="主要導覽"` 換成 `aria-label="Main navigation"`，skip-link 文字換 `Skip to main content`。

### 4.3 語言切換對照表
| 中文頁 | 英文頁 |
|---|---|
| `index.html` | `en/sitemap_en.html`（沒有英文首頁，指向英文網站導覽） |
| `zh/sitemap_zh.html` | `en/sitemap_en.html` |
| `zh/introMe.html` | `en/introMe_en.html` |
| `zh/nycuCS.html` | `en/nycuCS_en.html` |
| `zh/nycuAM.html` | `en/nycuAM_en.html` |
| `zh/cs_life.html` | `en/cs_life_en.html` |
| `zh/am_life.html` | `en/am_life_en.html` |
| `zh/tcssh.html` | `en/tcssh_en.html` |
| `zh/tcssh_life.html` | `en/tcssh_life_en.html` |
| `zh/contact.html` | `en/contact_en.html` |

---

## 5. script/site.js 規格

用原生 JS、無框架、`defer` 不需要（放 body 末端）。三個獨立功能，互不依賴，任一元素不存在就安靜跳過：

1. **漢堡選單**：點 `.nav-toggle` 切換 `.site-nav.is-open` 與 `aria-expanded`；按 `Escape` 關閉並把焦點還給按鈕；點選單外部關閉；視窗放大到 ≥768px 時自動關閉並清掉 inline 狀態。
2. **`.reveal` 進場**：`IntersectionObserver`（`threshold: 0.12`、`rootMargin: "0px 0px -8% 0px"`）加 `.is-visible`，加完就 `unobserve`。**不支援時直接給所有 `.reveal` 加 `.is-visible`**。
3. **Lightbox**：任何 `[data-lightbox]` 容器內的 `img` 可點擊（也要能用鍵盤 Enter/Space 觸發，所以包一層 `<button class="lightbox-trigger">`）。開啟後全螢幕遮罩顯示原圖 + `figcaption` 文字 + 關閉鈕；`Escape` 關閉；遮罩點擊關閉；開啟時 `body` 加 `.has-modal`（`overflow: hidden`）；關閉後焦點回到原觸發元素。lightbox 的 DOM 由 JS 動態建立，樣式放 `layout.css`。

---

## 6. 互動元素處置（使用者已逐項確認）

| 元素 | 處置 |
|---|---|
| 首頁「還在製作中」道歉 popup（`#popup` + `#overlay`） | **刪除**（HTML 與 JS 一起清掉） |
| 首頁「HTML & CSS Elements」清單彈窗（`#elements`） | **刪除**（含 nav 裡的 `#button` 觸發器） |
| 首頁關鍵字隨機跳動高亮 | **改造**：不再用 JS 改 `innerHTML`。改在 HTML 直接用 `<mark class="kw">` 包住關鍵字，CSS 給淡藍底 + 不跳動 |
| 首頁 4 張輪播（`.slide4` 空白、delay 只排 3 個） | **改造**：3 張正確輪播，見 §7 |
| sitemap 拔蘿蔔 | **保留**（使用者指定）。改 Pointer Events 支援觸控；蘿蔔從連結前綴移出，變成獨立可點裝飾，不得影響連結點擊 |
| sitemap 標題 hover 旋轉搖擺 | **改造**：改成 `translateY(-2px)` + 陰影，用 CSS 不用 inline style |
| sitemap 停留計時器 `#timer` | **刪除** |
| sitemap「小知識」廣告 `#ad`（關掉 3 秒自動彈回） | **刪除** |
| introMe 內層 scroll + scroll-snap | **改造**：整頁滾動 + `.reveal` |
| introMe 段落漸顯 | **保留**（改用 `.reveal`） |
| 系所頁卡片 hover 展開內文 | **改造**：內文直接顯示，hover 只做陰影抬升 |
| 系所頁背景照 fadeIn | **改造**：移除 fadeIn，加深色漸層遮罩 |
| tcssh 純 CSS radio 輪播 | **改造**：加圓點指示器 + 左右鍵 + 鍵盤可用，見 §7 |
| tcssh 制服／書包／logo hover 放大 | **保留** |
| 照片牆 `scale(3)` 滑鼠放大鏡 | **改造**：改點擊開 lightbox |
| 照片牆 `nth-child` 依序 fadeIn | **改造**：改 `.reveal` 通用化 |
| header icon hover 陰影位移 | **刪除**（併入新導覽） |
| cs_life GitHub `window.open(800×600)` | **改造**：一般 `target="_blank" rel="noopener"` |

---

## 7. 兩個輪播的實作決策

### 7.1 首頁 hero（CSS 動畫，無 JS）
- `.hero` 容器本身 `background-image` 設為**第一張圖**，三個 `.hero__slide` 疊在上面。
  → 這樣動畫循環接縫處露出的底圖就是第一張圖，視覺上無縫，不會閃黑。
- 3 張，週期 15s，`animation-delay: 0s / 5s / 10s`：
```css
@keyframes heroFade {
    0%     { opacity: 0; }
    6.66%  { opacity: 1; }
    26.66% { opacity: 1; }
    33.33% { opacity: 0; }
    100%   { opacity: 0; }
}
```
- `.hero__scrim`：`linear-gradient(to right, var(--scrim-strong), var(--scrim) 55%, transparent)`，確保文字對比足夠。
- `.hero` 高度：`min-height: clamp(420px, 62vh, 620px)`，**不要**寫死 `60vh`。
- **hero 三張圖是直式手機照（實測 1440×1920）**，桌機寬螢幕用 `cover` 會裁掉上下。
  一律用 `background-position: center 38%`（主體偏上），不要用預設的 `center`。
- 文字區 `.hero__content` 在 `.container` 內，最大寬 `48ch`，手機時遮罩改成上下漸層（文字置中在下半部）。
- `@media (prefers-reduced-motion: reduce)` 由 base.css 全域規則凍結動畫，此時顯示第一張即可。

### 7.2 二中輪播（保留 radio，修好可用性）
- 保留 `input[type="radio"]` + `label` 的無 JS 基礎，但修掉「`label for` 指向下一張」的怪機制。
- 改成：`input#slide1..4`（`.sr-only` 而非 `display:none`，讓鍵盤可聚焦）＋ `.carousel__dots label[for]` 圓點指示器（至少 44×44 觸控區）＋ 目前圖用 `:checked ~ .carousel__track` 平移。
- `script/school.js` 補上：左右方向鍵切換、圓點的 `aria-label`（「第 1 張，共 4 張」）。
- 每張 slide 的說明文字**永遠可見**（不要靠 hover）。

---

## 8. 圖片規格（由圖片 agent 執行，其他 agent 只需照新檔名引用）

見 `PAGES.md` §圖片對照表。所有 HTML 引用圖片時：
- 一律加 `width` 與 `height` 屬性（用對照表的輸出尺寸，避免 CLS）。
- 首屏可見的圖不加 `loading`；其餘**全部**加 `loading="lazy" decoding="async"`。
- 裝飾性圖片（brand logo、純裝飾）用 `alt=""`；有資訊的圖要寫實質 `alt`，不要寫「生活照片1」這種無意義文字。

---

## 9. 驗收清單（實作完必須自己跑過）

```bash
cd /Users/red/Hong-Ruei-Wu

# 1. 不該再存在的東西（每項都應該 0 筆）
grep -rn "第三次作業" --include='*.html' --include='*.css' --include='*.js' . | grep -v volleyball
grep -rn "right: *250px\|right: *150px\|right: *50px" css/
grep -rn "onclick=" --include='*.html' zh/ en/ index.html
grep -rn "><img>" --include='*.html' .
grep -rn "color: *white" css/ | grep -i hover
grep -rn "position: *fixed" css/ | grep -i footer
grep -rEn "font-size: *[0-9.]+vw" css/
grep -rn 'lang="zh"\|lang="zh-TW"' --include='*.html' . | grep -v volleyball

# 2. 應該存在的東西
grep -rln "@media" css/            # 每個頁面 CSS 都要有
grep -rln "meta name=\"description\"" --include='*.html' zh/ en/ index.html   # 19 頁都要有（index + zh 9 + en 9）
grep -rln "skip-link" --include='*.html' zh/ en/ index.html                   # 19 頁都要有（index + zh 9 + en 9）
grep -rln "aria-current=\"page\"" --include='*.html' zh/ en/                  # 18 頁都要有（zh 9 + en 9）

# 3. CSS 變數沒有打錯字（每個 var(--x) 都要在 tokens.css 有定義）
grep -rho "var(--[a-z0-9-]*)" css/ | sort -u
```

**手動檢查**（用 `open` 在瀏覽器看，並用開發者工具縮到 375px 寬）：
- 375px 寬時：沒有橫向捲軸、導覽折成漢堡、所有文字 ≥14px、所有可點目標 ≥44px。
- 鍵盤只用 Tab + Enter 能走完：skip-link → 導覽 → 語言切換 → 主內容所有連結 → lightbox 開關。
- hover 任何連結，文字都不會消失。
