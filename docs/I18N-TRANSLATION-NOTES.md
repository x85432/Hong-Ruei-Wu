# I18N-TRANSLATION-NOTES — 新譯內容的定案譯文

**用途：** `docs/I18N-SPEC.md` 第 8 節指出有兩處內容沒有現成英文版。本文件把那些
翻譯的判斷取捨**先決定好**，實作 agent 直接照抄，不要自行意譯。

**授權：** 擁有者於 2026-09-27 明確同意由 AI 補英文翻譯。AI_GUIDELINES §1.5 禁止 AI
改寫擁有者自己的文字——中文原文一字不動（含錯字），翻譯屬新增，不屬改寫。
**所有譯文仍待擁有者驗收。**

**鐵則：** 本文件沒列到的英文字串，一律從 `en/` 既有檔案逐字複製。不要重譯已經有譯文的東西。

---

## 0. 全站用字慣例（沿用 `en/` 既有選擇，不要改）

| 項目 | 定案 | 依據 |
|---|---|---|
| Math / Maths | **Math**（美式） | `en/introMe_en.html` 的 `#NotGreatAtMath` |
| 系所全稱 | `NYCU Department of Computer Science` / `NYCU Department of Applied Mathematics` | `en/nycuCS_en.html`、`en/nycuAM_en.html` banner |
| 臺中二中全稱 | `Taichung Municipal Second Senior High School` | `en/tcssh_en.html` page-header |
| 臺中二中簡稱 | `TCSSH` | `en/tcssh_life_en.html`、`en/sitemap_en.html` |
| 人名 | `Hong-Ruei Wu` | 全站 header／footer |

註：`en/contact_en.html` 的 LinkedIn handle 是 `Hung-Ruei Wu`（外部帳號原樣，拼法不同），
那是平台上的既有資料，不要「修正」成 `Hong-Ruei Wu`。

---

## 1. `index.html` 的英文版

### 1.1 可重用既有譯文（必須逐字沿用）

| 中文 | 英文 | 出處 |
|---|---|---|
| 首頁 | Home | `en/*` nav |
| 網站導覽 | Sitemap | `en/*` nav |
| 自我介紹 | About Me | `en/*` nav |
| 聯絡我 | Contact | `en/*` nav |
| 陽明交大資訊工程系 | NYCU Department of Computer Science | `en/nycuCS_en.html` |
| 陽明交大應用數學系 | NYCU Department of Applied Mathematics | `en/nycuAM_en.html` |
| 市立臺中第二高級中學 | Taichung Municipal Second Senior High School | `en/tcssh_en.html` |
| 系所介紹 | Department Introduction | `en/sitemap_en.html` |
| 資工系生活 | CS Life | `en/sitemap_en.html` |
| 應數系生活 | AM Life | `en/sitemap_en.html` |
| 我看到的二中 | My View of TCSSH | `en/sitemap_en.html` |
| 開心高中生活 | Happy High School Life | `en/sitemap_en.html` |

### 1.2 `<head>`

| 鍵 | 英文 |
|---|---|
| `page.home.title` | `Hong-Ruei Wu — Personal Website` |
| `page.home.desc` | `The personal website of Hong-Ruei Wu — a double major in Computer Science and Applied Mathematics at NYCU, and captain of the Applied Mathematics volleyball team.` |

### 1.3 `.hero`

| 鍵 | 中文（原文，不動） | 英文（定案） |
|---|---|---|
| `home.hero.eyebrow` | `Welcome to 弘叡's Home` | `Welcome to Hong-Ruei's Home` |
| `home.hero.lead` | `陽明交大資訊工程系 × 應用數學系雙主修・應數系排球隊隊長` | `NYCU Computer Science × Applied Mathematics double major · Captain of the Applied Mathematics volleyball team` |
| `home.hero.cta.about` | `認識我` | `Get to Know Me` |
| `home.hero.cta.sitemap` | `網站導覽` | `Sitemap` |

`home.hero.eyebrow` 的中文原文本來就是中英混寫，保持原樣。英文版把「弘叡」換成
`Hong-Ruei`（名，非全名），因為原文用的是名而非全名。

`home.hero.cta.about` 刻意**不**用 `About Me`——導覽列的「自我介紹」已經是 `About Me`，
首頁按鈕的中文是「認識我」而非「自我介紹」，兩者在中文裡有差別，英文也該有。

`·` 用的是 U+00B7 MIDDLE DOT，中文原文用的是 `・` U+30FB KATAKANA MIDDLE DOT。
英文版換成 U+00B7，因為片假名中點在拉丁字型下間距會壞掉。

### 1.4 `.intro-section`

`<mark class="kw">` 的包法要保留，英文版包對應的關鍵字（`docs/UIUX-SPEC.md` 的關鍵字標記設計）。

| 鍵 | 英文（定案，含 `<mark>`） |
|---|---|
| `home.intro.h2` | `Profile` |
| `home.intro.p1` | `I'm <mark class="kw">Hong-Ruei Wu</mark>, born and raised in Wufeng, Taichung.` |
| `home.intro.p2` | `My hobby is <mark class="kw">volleyball</mark>, and I currently serve as <mark class="kw">captain</mark> of the Applied Mathematics volleyball team at my university.` |
| `home.intro.p3` | `<mark class="kw">Computer Science</mark>, <mark class="kw">double majoring</mark> in <mark class="kw">Applied Mathematics</mark>` |
| `home.dept.h2` | `My Departments` |
| `home.dept.p1` | `<mark class="kw">Before transferring</mark>: <mark class="kw">NYCU</mark> Applied Mathematics — solid foundations and diverse coursework, but the material was a bit too hard.` |
| `home.dept.p2` | `Now: NYCU Computer Science — excellent faculty, well funded, a good place to do research, and honestly the one I'm more interested in.` |
| `home.school.h2` | `My High School` |
| `home.school.p1` | `<mark class="kw">TCSSH</mark> — a campus with a long history, the soil that nurtured my growth.` |
| `home.edu.h2` | `Education` |

中文 `home.intro.p3` 是三個相連的 `<mark>`（`資工` `雙主修` `應數`）沒有間隔文字。
英文無法照做（單字之間必須有空白與 `in`），所以英文版在 `<mark>` 之間補了必要的連接詞。
這是版面上的取捨，已向擁有者申報。

---

## 2. `introMe.html` 缺少的三段

`en/introMe_en.html` 只有前兩個 `.timeline__item`（簡介、興趣）。以下三段是新譯。
結構完全照 `zh/introMe.html`，`<br>` 的位置與數量一併保留。

### 2.1 第三個 timeline item — marker「學習歷程」

`introMe.tl3.marker` → `Education`

#### card 1

| 鍵 | 中文（原文） | 英文（定案） |
|---|---|---|
| `introMe.tl3.title` | `自古英數不兩立` | `English and Math Have Never Gotten Along` |
| `introMe.tl3.birth` | `出生民國93年3月，長於台中市霧峰區。<br>` | `Born in March 2004, raised in Wufeng District, Taichung.<br>` |
| `introMe.tl3.elem.h3` | `小學` | `Elementary School` |
| `introMe.tl3.elem.body` | 見下 | 見下 |

`introMe.tl3.elem.body` 英文定案：

```
I went to Wufu Elementary School right next to my house — a single class of 17 students, and I never placed first in it before third grade.<br><br>Then I set my mind on becoming an engineer, and scored 48 on one English midterm. So I asked my mom whether I could take English cram classes — which is how English became, without exception, my best subject for the rest of my schooling.<br><br>
```

#### card 2

| 鍵 | 中文（原文） | 英文（定案） |
|---|---|---|
| `introMe.tl3.jhs.h3` | `國高中` | `Junior High and High School` |
| `introMe.tl3.uni.h3` | `大學` | `University` |

`introMe.tl3.jhs.body` 英文定案：

```
In junior high I realized my grasp of math just wasn't as good, and hoping to repeat what had worked for English, I started cram classes for math too.<br>Unfortunately not everything goes your way. Understanding that math was a prerequisite for being an engineer made me deeply anxious, and right up through the end of the AST it still hadn't improved<br>(GSAT math: top-quarter benchmark; AST math: median benchmark).
```

`introMe.tl3.uni.body` 英文定案：

```
So I resolutely enrolled in NYCU Applied Mathematics, hoping to shore up my one weak spot.<br>After some twists and turns, in my third year I made it into NYCU Computer Science while double majoring in Applied Mathematics, hoping to make my mark down the road.<br>
```

**翻譯取捨（需擁有者確認）：**

1. **「自古英數不兩立」** 是「自古忠孝不兩立」的仿作，中文讀者會聽出成語的影子。
   英文沒有對應成語，`English and Math Have Never Gotten Along` 保留了「兩者天生衝突」
   的意思與輕鬆語氣，但典故的層次流失了。這是刻意取捨。
2. **「分科測驗(類似指考)」** 英文用 `AST`（Advanced Subjects Test）。原文括號裡的
   「類似指考」是給台灣讀者的對照說明，對英文讀者沒有意義，因此不直譯，
   改由下一條的說明承擔。
3. **「學測數學前標、分科數學均標」** 是台灣升學考試的級分術語：
   「前標」是第 75 百分位、「均標」是第 50 百分位。英文譯為
   `GSAT math: top-quarter benchmark; AST math: median benchmark`。
   刻意不加長篇註解，因為原文也只是一句括號裡的自嘲。
4. **「周周轉轉」** 疑為「兜兜轉轉」的錯字。中文**原樣保留**（§1.5），
   英文照語意譯為 `After some twists and turns`。列入第 4 節錯字清單。
5. **「英文成為我求學歷程最好的科目沒有之一」** 的「沒有之一」是「最好的，
   而且沒有並列第二」的強調用法。譯為 `without exception, my best subject`。

### 2.2 第四個 timeline item — marker「學習歷程」

`introMe.tl4.marker` → `Education`

中文兩個 item 的 marker 都是「學習歷程」，英文兩個都是 `Education`。
這是原文刻意的重複（同一個階段分成兩張卡），不要改成 `Education (cont.)`。

#### card 1

| 鍵 | 中文 | 英文 |
|---|---|---|
| `introMe.tl4.title` | `Programming` | `Programming` |
| `introMe.tl4.enlight.h3` | `啟蒙運動` | `The Enlightenment` |
| `introMe.tl4.renai.h3` | `文藝復興` | `The Renaissance` |

`introMe.tl4.enlight.p1` 英文定案（含行內連結）：

```
Back in elementary and junior high, <a href="https://www.minecraft.net/en-us">Minecraft</a> was the blazing fireball everyone was talking about, and I was hooked too.
```

`introMe.tl4.enlight.p2` 英文定案：

```
Because I wanted to become a true creator from the ground up, Java became my starting line in coding.<br>Even if most of my code back then was public class static void, sysytem.println()...
```

`introMe.tl4.renai.p1` 英文定案（含行內連結）：

```
After the junior high entrance exam, Python was blowing up everywhere, and it made me realize you could actually make real money writing this stuff. I started going to YouTube to learn Python — I even still remember the <a href="https://www.youtube.com/watch?v=wqRlKVRUV_k&list=PL-g0fdC5RMboYEyt6QS2iLb_1m7QcgfHk">playlist</a> from back then, and the instructor replying to my comment.
```

#### card 2

| 鍵 | 中文 | 英文 |
|---|---|---|
| `introMe.tl4.baroque.h3` | `巴洛克時期` | `The Baroque Period` |

`introMe.tl4.baroque.p1` 英文定案：

```
In high school I found out about the ability competition, entered with Python and won an honorable mention. Once I was in the training program my teacher had me start on C/C++ — a thoroughly annoying language where everything has to be declared spelled out in full.<br>Even so, I went and found videos on YouTube on my own, and tested myself on Online Judge. University's Introduction to Computer Science and the department transfer exam forced my Python and C++ up to a whole new level.
```

**翻譯取捨（需擁有者確認）：**

1. **「啟蒙運動 / 文藝復興 / 巴洛克時期」** 是刻意的歷史時期借喻，英文保留這個玩法
   （`The Enlightenment` / `The Renaissance` / `The Baroque Period`），
   **不要**改成 `Stage 1 / 2 / 3`。規格第 8.1 節已明定。
2. **`sysytem.println()` 的拼字原樣保留**，中英兩版都一樣。這是原文引述自己當年的程式碼，
   不是散文；「修正」它會抹掉原意。同時列入第 4 節錯字清單讓擁有者自己決定。
3. **「能力競賽」** 英文用 `the ability competition`，刻意模糊。台灣高中的
   「能力競賽」可能指「學科能力競賽」或「電腦軟體設計競賽」，原文沒說是哪一個，
   AI 不該替擁有者猜。**請擁有者補上確切賽事名稱。**
4. **「國中會考」** 譯為 `the junior high entrance exam`。正式名稱是
   Comprehensive Assessment Program (CAP)，但原文用的是口語簡稱，英文也用口語。

### 2.3 第五個 timeline item — marker「未來展望」

`introMe.tl5.marker` → `Looking Ahead`

| 鍵 | 中文 | 英文 |
|---|---|---|
| `introMe.tl5.title` | `展翅翱翔` | `Spreading My Wings` |

三個 `<li>`：

| 鍵 | 英文（定案） |
|---|---|
| `introMe.tl5.li1` | `Never forget why you started. From that elementary-school dream of becoming an engineer, I have been paving a red-brick road for myself.` |
| `introMe.tl5.li2` | `Accept change. Remembering why you started does not mean locking yourself into one particular path — believe that you can do any of them well.` |
| `introMe.tl5.li3` | `Press forward. With strangers and unfamiliar fields alike, the opportunity is there the moment you are willing to speak up. Widening those openings and seizing them — that, I think, is the skill I need most.` |

**翻譯取捨：** 三條的中文都以四字詞開頭（莫忘初衷／接受改變／勇往直前），
英文用簡短的祈使句開頭（`Never forget why you started.` / `Accept change.` /
`Press forward.`）對應這個節奏。

---

## 3. 不需要翻譯的東西

- `contact.html` 的 `.contact-card__name`：Email、LinkedIn、Instagram、Facebook、Line
  是專有名詞，中英同字。`.contact-card__handle` 只有兩個需要譯，且 `en/contact_en.html`
  **已有現成譯文，逐字沿用即可，本次無新譯**：
  - 「加我好友」→ `Add me on Line`
  - 「吳弘叡」（Facebook）→ `Hong-Ruei Wu`
- email 位址、`@x85432`、`Hung-Ruei Wu`（LinkedIn 帳號名）、所有 YouTube 網址
- `&copy; 2024–2026`、`.carrot` 的 🥕
- `introMe` 前兩個 timeline item 的全部內容（`en/introMe_en.html` 已有，逐字沿用）

---

## 4. 疑似錯字清單（AI 不修，交由擁有者決定）

依 AI_GUIDELINES §1.5，以下是在中文原文裡發現的疑似錯字。**全部原樣保留，一個都沒改。**

| 檔案 | 原文 | 疑似應為 | 備註 |
|---|---|---|---|
| `zh/introMe.html` | `周周轉轉` | `兜兜轉轉` | 英文已按語意譯 |
| `zh/introMe.html` | `sysytem.println()` | `System.out.println()` | 引述當年程式碼，中英兩版都原樣保留 |
| `zh/introMe.html` | `數學為工程師的先要條件` | `必要條件` 或 `先決條件` | 英文譯為 `a prerequisite` |
| `zh/introMe.html` | `我為自己舖足了一條紅磚大道` | `鋪` ；`舖足` 疑為 `鋪設` | `舖` 是 `鋪` 的異體字，可能是刻意用字 |
| `index.html` | `孕育我成長的收栽` | `栽培` 或 `收穫` | 英文意譯為 `the soil that nurtured my growth` |
| `index.html` | `臺中二中` vs `台中市霧峰區` | `臺` / `台` 混用 | 全站不一致，非錯字，是體例問題 |
