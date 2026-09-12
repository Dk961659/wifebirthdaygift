# Birthday website — quick guide

The page now has an opening gate, then a connected birthday journey:
0. **Gate intro** — two doors that slide open like a gift reveal when she taps "Open your gift"; her name then falls in letter by letter and settles in one smooth stop
1. **Hero** — her name over a twinkling night sky, moon, orbit halo, rain ambience, and a live countdown to September 15
2. **Journey** — a nature-inspired chapter with then / now / always messages
3. **Gallery** — a masonry photo grid, click any photo for a full-size lightbox
4. **Story slider** — a "train" of sliding cards (photo + message), auto-advancing every 2 seconds and also moved with arrows, dots, swipe, or arrow keys
5. **Fireworks celebration** — animated fireworks on a canvas, with "Happy Birthday, Srishti!" popping in letter by letter, plus a "Light the fireworks" button for extra bursts
6. **Letter** + a **cake** you click to blow out the candle (confetti burst)

The floating navigation links every chapter together, and the page respects
reduced-motion preferences for visitors who need less animation.

Everything is responsive — tuned for phones, tablets, and desktop (including
landscape phone orientation), so the URL works well no matter what she opens it on.

## 1. Your photos are already in
Your 18 uploaded photos have been placed and are ready to go:
- `photo1.jpg` … `photo13.jpg` — in the masonry gallery
- `slide1.jpg` … `slide5.jpg` — in the story slider

Want to swap one out or rearrange? Just replace a file in `images/` with a
new one **using the exact same filename**, or open `index.html` to reorder
which photo goes in which slot (each `<figure>`/`<article>` block references
its file directly).

Want more or fewer gallery photos? Open `index.html`, find the `<div class="gallery" id="galleryGrid">`
block, and copy/delete a `<figure class="gallery__item">...</figure>` block for each photo.
Update the caption text inside `<figcaption>`.

Want more or fewer slider cards? Find `<div class="slider__track" id="sliderTrack">` and
copy/delete an `<article class="slide">...</article>` block. Update the chapter tag,
heading, and message inside each one, and add the matching image to `images/`.

## 2. Personalize the text
Open `index.html` in any text editor and change:
- `<h2 class="gate__name">Srishti</h2>` and `<h1 class="hero__name" id="wifeName">Srishti</h1>` → her name
- `<button class="gate__btn" id="gateBtn">Open your gift</button>` → different button wording, if you like
- `<p class="hero__line">...</p>` → your hero message
- The letter inside `<section class="letter-section">` → your own words
- `<span id="signName">Me</span>` → your name
- `<p class="finale__msg" id="finaleMsg">Happy Birthday! I love you. ❤</p>` → your final line

Note: the hero name and the fireworks headline are split into letters by
`script.js` automatically for their animations — just edit the plain text in
the HTML and it will still work.

## 3. Preview it
Just double-click `index.html` to open it in your browser and check everything,
including on your phone's browser (open it locally or after step 4).

## 4. Deploy on Netlify
1. Go to https://app.netlify.com/drop
2. Drag the whole `birthday-site` folder (containing `index.html`, `style.css`,
   `script.js`, and the `images` folder) onto the page.
3. Netlify gives you a live URL right away (something like `random-name-123.netlify.app`).
4. Optional: in Netlify, go to **Site settings → Change site name** to make the
   URL something sweeter, e.g. `for-srishti.netlify.app`.
5. Copy that URL and send it to her. 🎉

That's it — no build step, no dependencies, just static files.
