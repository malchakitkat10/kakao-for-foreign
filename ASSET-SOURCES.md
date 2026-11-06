# Kakao World asset sources

The assets in `dist/assets/kakao/` are byte-for-byte copies selected from the two user-supplied archives for this concept design. `sources.json` records original archive paths and hashes.

- `kakaotalk-assets.zip / 01-official-theme`: Kakao official Apeach theme sample 26.9.0, with character illustrations, backgrounds, profile and message bubbles.
- `kakaotalk-assets.zip / 02-official-share-buttons`: Kakao Developers web sharing button SVG assets.
- `kakaotalk-mac-reference.zip`: app icon, UI glyphs, and default profiles extracted from KakaoTalk macOS 26.9.0 as supplied by the user.
- The Chats notice banner now incorporates the supplied Katok UI NoticeBanner under MIT; see assets/katok/LICENSE.txt.

Existing design prototype behavior is preserved. The KakaoTalk action still opens the clearly labeled handoff preview; no live Kakao SDK, messaging, or booking integration is added by this visual update.

## gomjellie/kakaotalk design reference (2026-11-06)

- Reference: https://github.com/gomjellie/kakaotalk/tree/94a962321157a7ffa891b365c131f39853ecd1ae
- Inspected `_variables.scss`, `_friend.scss`, `_sidebar.scss`, `_chatRoom.scss` and `FriendTab.js`.
- Reimplemented the white grouped friend list, 40% profile rounding, green music outline, brown navigation (#423630), blue conversation background (#bdd1dc), yellow bubbles (#fee400), and compact dividers in `dist/reference-design.css`.
- Preserved the mobile five-tab navigation, fourth-tab Kakao One entry, Tokjakso/Hanmadi apps, and community channels. The reference's Electron/React runtime and sample users/photos were not imported.
- Existing official theme and macOS assets remain in use.

## KakaoTalk One hub

- `dist/assets/official/solo-leveling.jpg`: Kakao Entertainment official press image, https://kakaoent.com/pr/detail/186 (image: https://t1.kakaocdn.net/kakaoent_com/admin/editor/8648cb3b019400001.jpg). Used for the private hackathon concept per user instruction.
- `dist/assets/kiwi/`: image assets extracted from the user-provided `KiwiTalk Renewal.fig`.
- Hub service badges are prototype navigation treatments. Page, Webtoon, Melon and Map open their official websites; local experience apps run in this prototype.

## OpenChat entry layout (2026-11-06)

- Official reference: https://www.kakaocorp.com/page/service/service/openchat
- Reference screenshot: https://t1.kakaocdn.net/kakaocorp/kakaocorp/admin/service/f66ee88e018800001.png
- Recreated the entry search field, category pills, white chat list, rounded profile images and last-message alignment. Existing project rooms replace the reference's sample rooms; promotional ads are omitted. The fourth Kakao One entry remains.
- Room interior retains the approved custom channel sidebar, guide, message entry and channel persistence. The proposed themed decorations and sticker feature were reverted before publication.

- 2026-11-06: Per user direction, shared navigation and channel sidebar now use a white surface across Friends, Chats, OpenChat, Kakao One, and More; dark brown navigation is superseded.

## Native icon correction (2026-11-06)

- Friends, Chats and More now use separate original idle and selected SVG assets from the supplied macOS archive. Native opacity is preserved, without applying a second opacity filter.
- Search and Settings use the original 2x PNG assets; Add Chat uses the supplied SVG. The exported stroke-only Search/Settings SVGs omit fill=none and render solid in browsers, so the original PNGs preserve the intended outlines.
- Original 36px icon canvases include optical padding; icon-only CSS corrects the visible glyph size without changing mobile tab spacing.
- The user's PC app was consulted for icons only. Existing mobile layout, Friends/Chats markup and banners are preserved. OpenChat and Kakao One rendering now lives in separate feature files.

## Official logos and app routes

- Page and Map app artwork: Apple App Store official Kakao publisher listings (`com.kakao.page`, `net.daum.maps`).
- Webtoon logo: https://webtoon.kakao.com/ico/icon192_210521.png
- Melon logo: https://cdnimg.melon.co.kr/resource/mobile40/cds/common/image/mobile_apple_180x180.png
- Page app routes verified against https://page.kakao.com/.well-known/apple-app-site-association and https://page.kakao.com/.well-known/assetlinks.json
- Webtoon app link copied from its official web app `/linkapp` implementation.
- Map mobile launcher: https://apis.map.kakao.com/ios_v2/docs/getting-started/urlscheme/
- Melon `melonapp://home` is used by its official mobile homepage.

## Squid Game

- Official Netflix Tudum photograph (Gi-hun and Pink Guard): https://www.netflix.com/tudum/articles/squid-game-season-3-plot-release-date-news
- Image URL: https://dnm.nflximg.net/api/v6/s0XAg4q_jvYbSSbLvySyUsliNSg/AAAAQTPY_5SqlgE-7NQKrLCIQySUSLDLNbfdkLAQN2_4Blv-PDHhgExlNG_w87Gl6j6aKOjtz1KWS_gZS81UHNZjW8oFPRZ3G10cvaHpZuLMNWm_sW0ZhKB0hIbAbd6mkVH1ZYUGoAtx1P9m7pIe6vPHG98H_Kk.jpg?r=fbe
- The 20 international room participants and greetings are fictional local demo data. No real accounts were invited.

## OpenChat navigation icon (2026-11-06)

- `icon-openchat-selected.svg` and `icon-openchat-idle.svg`: custom vectors recreated from the user's supplied screenshot (two overlapping speech bubbles with a rounded play cutout). Not official extracted assets.
- Original mobile layout is preserved. The 36px canvas matches the existing navigation asset contract; selected charcoal and idle gray are separate assets.
- Audit: inspected filenames and text/icon definitions in kakaotalk-assets.zip (416 entries), kakaotalk-mac-reference.zip (157 entries), and the theme-guide archive (158 entries). The theme maps OpenChat to the Apeach Now asset; Katok UI has a different circular OpenChat glyph.
- KiwiTalk Renewal.fig: decoded its compressed schema and canvas, indexed 5,546 nodes, traced all 19 named OpenChat text layers to title groups, and inspected the icon component inventory. This is a targeted icon audit, not a claim to have visually reviewed every vector or every screen in all source files.

## Direct Figma chat component extraction

- Source: user-provided `KiwiTalk Renewal.fig`, active Chat canvas, ChatList frame `734:7526`.
- Decoded canvas.fig and exported original vector fill geometry (not redrawn): incoming/outgoing message surface, message tail, send/menu/back/add/notice icons.
- Per-asset source nodes, original dimensions and colors: `dist/assets/kiwi/components/sources.json`.
- `dist/kiwi-chat.css` uses measured 14px/18px text, 12px/18px message padding, 44px input, 18px input radius and the original dark palette. The desktop surrounding panes are omitted for the existing mobile shell; channels remain accessible through the menu.

## Chats notice banner from supplied source

- Replaced the hand-built game strip with the supplied `03-katok-ui/components/ui/kakao/notice-banner.tsx` geometry, megaphone paths, colors, typography and shadow. Converted React/Tailwind into scoped static HTML/CSS.
- Existing room title and quest action are preserved; Friends markup and banners are unchanged. Source copy, hash and MIT attribution are stored under `dist/assets/katok/`.

## Playground asset reuse

The Playground uses the existing official Kakao Entertainment Solo Leveling press image and Netflix Squid Game image documented above. Cover framing is CSS only. Friends cards reuse the provided Apeach theme artwork. Cafe cards and the creation/empty-state illustrations reuse `KiwiTalk Renewal.fig` image assets (`cafe.png`, `party.png`, `ghost.png`). No generated artwork is used.

## Chat input restored from supplied component

The room participation gate was removed. `dist/chat-input.css` and `features/chat-input.js` adapt `kakaotalk-assets/03-katok-ui/components/ui/kakao/message-input.tsx` from the supplied archive. Original component, tokens and icons are retained under `dist/assets/katok/`, with hash provenance in `message-input-source.json`. The 48px input bar, 24px radius, 32px action buttons, colors and four SVG paths come from that source. This is the supplied Katok UI component, not a claim of official Kakao design-system authorship. Text and image messages are local prototype data.

## Kakao One cover layout

The 2026-11-06 user-supplied webtoon screenshot guides the dark, compact three-column cover layout and underline filters in `one-editorial.css`. All imagery reuses the documented official Squid Game / Solo Leveling images and supplied Kakao/Figma assets. Service logos and their original links are consolidated in the menu; the homepage uses one Squid Game hero and actionable content covers.

## Korean learning path (2026-11-06)

- UI reference: Duolingo official Press Kit / UI Screens / Tabs / `duolingo_uiscreen_path` (PNG, 1470 × 2952), https://duolingopress.lingoapp.com/s/UI-Screens-R316ve .
- Reimplemented the green unit header, winding lesson path, raised buttons, exercise progress and answer feedback in scoped HTML/CSS. This is a UI adaptation, not imported Duolingo source or an API integration.
- Reuses the existing three Korean conversation lessons, completion storage, Kakao Apeach artwork, and Korean OpenChat community. No Duolingo logo or mascot is imported. Pronunciation uses browser Korean text-to-speech.

## Playground official catalogue (2026-11-06)

- Replaced the previous illustrated thumbnails and creation banner with 10 original KakaoPage covers and 6 artist entries (IVE, MONSTA X, IU, KiiiKiii, WOODZ, Dragon Pony).
- Cover originals and the official Kakao Entertainment newsroom photographs are stored in `dist/assets/official/playground/`. Each original image URL and its source article/content page are recorded in `sources.json` in that directory.
- Artist collages are framed using CSS only; the downloaded original files are unchanged. No generated photographs, logos, or decorative illustrations are used in this catalogue.
- The new quiz/playlist/type-test labels describe local prototype content previews, not games offered or endorsed by the source publishers. No internal game screens were added. Existing Solo Leveling and Squid Game demo entries remain accessible.

## Playground home / fan-game catalogue

The former Kakao One brand is now displayed as Playground; the catalogue submenu is 창작마당. Home shortcuts are consolidated in the existing menu. Original official images remain unchanged. The home carousel contains two existing demos and a TOP 3 slide labelled 시연 순위. The 16 catalogue titles and creator handles are fictional fan-game examples for the prototype, not actual user uploads or measured popularity. Their original work/artist names are retained as `ipTitle` for image attribution and search. No new game interiors are implemented.

## Kanana in-chat learning (2026-11-06)

- Supersedes the separate Duolingo-style learning route. Existing learning entries and #learn bookmarks now open the Kanana bot inside the existing Chats view (`?room=kanana#rooms`).
- Question cards, answer messages, explanations, lesson menus and completion summaries remain in one persistent conversation. Includes a new three-question Hangul lesson and the existing three Korean conversation lessons.
- The yellow text avatar is a prototype UI badge, not an official Kanana logo. No external Kanana model/API is connected. Free-text grading only recognizes prepared responses; unknown wording receives guidance without a fabricated assessment.

## Kanana official image and shared chat format (2026-11-06)

- Replaced the placeholder avatar with the unmodified official Kanana image served by https://kanana.kakao.com/ (`kanana-wave-still-hKVQXc0R.webp`). Original URL and SHA-256 are recorded in `dist/assets/official/kanana/sources.json`.
- Removed bespoke learning cards and custom chat/composer styling. Kanana now uses the existing `conversation`, `chat-line`, `bubble`, `message-name`, `message-time`, notice banner and supplied Katok UI MessageInput markup/tokens/icons. Lesson choices are compact existing quick replies beneath standard message bubbles.
- Chat history, grading, lesson continuation and completion storage remain intact. No new backend/model connection is introduced.

## Studio participation entry integrated into Playground (2026-11-06)

- Source: user-provided `/Users/lyj/Downloads/kakao-one-studio/studio.js` and `studio.css`.
- Reused the actual work selector, asset-pack summary, four template previews, draft editors, local saving and preview player. Home entry is now embedded below the ranking hero in `features/one.js`; the editor is available at `#studio`.
- Cover cropping and template UI come from that supplied source. Images resolve to the existing local official/supplied assets instead of duplicating its embedded `assets.js` bundle.
- Removed extra entry-point policy/explanatory text to match the user's compact-copy preference. Existing fan-game catalogue and rank hero remain intact.
- Draft creation uses the source's prepared examples, not a connected generative AI backend. Cards and shared results remain local prototype data.

## First-install Kanana scenarios (2026-11-06)
- Existing KakaoTalk message/profile/input assets and official Kanana wave asset reused.
- TWS: PLEDIS official profile https://www.pledis.co.kr/artist/detail/TWS/profile/ ; official header image saved as `dist/assets/official/onboarding/tws.jpg`.
- Lovely Runner: CJ ENM official programme page https://www.cjenm.com/en/featured-contents/lovely-runner/ ; official still saved as `dist/assets/official/onboarding/lovely-runner.jpg`.
- Exact image URLs retained in `dist/assets/official/onboarding/sources.json`.
- Solo Leveling / Squid Game: existing official Kakao / Netflix images reused.
- All recommendation rankings, group members, conversations and sword upgrades are local hackathon scenarios. The “50 million” invitation wording is the requested concept copy, not a verified live metric. No live AI or matching service is connected.
