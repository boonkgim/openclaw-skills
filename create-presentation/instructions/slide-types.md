# Slide Types Reference

Each slide is a small HTML fragment file in `slides/`.

**File naming:** `NN-slug.html` (e.g., `01-title.html`, `05-key-metrics.html`)

**Every slide file MUST start with a type comment on line 1.**

## Rules

- NEVER put `<style>` or `<script>` in slide files.
- NEVER use external CDN links (except Google Fonts when user asks).
- Add `class="animate-in"` to elements you want to animate on slide enter.

---

## title — opening slide

```html
<!-- slide-type: title -->
<h1 class="animate-in">Title Here</h1>
<p class="subtitle animate-in">Subtitle here</p>
<p class="author animate-in">Author &middot; Date</p>
```

## content — bullet points (the workhorse)

```html
<!-- slide-type: content -->
<h2 class="animate-in">Heading</h2>
<ul>
  <li class="animate-in">Point one</li>
  <li class="animate-in">Point two</li>
  <li class="animate-in">Point three</li>
</ul>
```

## two-col — side-by-side (MUST use `.columns` wrapper)

```html
<!-- slide-type: two-col -->
<h2 class="animate-in">Heading</h2>
<div class="columns animate-in">
  <div class="col"><h3>Left</h3><p>Content</p></div>
  <div class="col"><h3>Right</h3><p>Content</p></div>
</div>
```

## quote

```html
<!-- slide-type: quote -->
<div class="quote-mark animate-in">&ldquo;</div>
<blockquote class="animate-in">Quote text here.<cite>Author Name</cite></blockquote>
```

## stat — one big number

```html
<!-- slide-type: stat -->
<h2 class="animate-in">Heading</h2>
<div class="stat-number animate-in">73%</div>
<div class="stat-label animate-in">Label</div>
<p class="stat-description animate-in">Description</p>
```

## cards — 2-4 items in grid (MUST use `.card-grid` wrapper)

```html
<!-- slide-type: cards -->
<h2 class="animate-in">Heading</h2>
<div class="card-grid animate-in">
  <div class="card"><h3>Card 1</h3><p>Text</p></div>
  <div class="card"><h3>Card 2</h3><p>Text</p></div>
  <div class="card"><h3>Card 3</h3><p>Text</p></div>
</div>
```

## image

```html
<!-- slide-type: image -->
<h2 class="animate-in">Heading</h2>
<div class="image-container animate-in">
  <img src="path/to/image.png" alt="Description">
</div>
```

## code

```html
<!-- slide-type: code -->
<h2 class="animate-in">Heading</h2>
<pre class="animate-in"><code>your code here</code></pre>
```

## divider — section break

```html
<!-- slide-type: divider -->
<h1 class="animate-in">Section Name</h1>
<p class="animate-in">Brief teaser</p>
```

## end — closing slide

```html
<!-- slide-type: end -->
<h1 class="animate-in">Thank You</h1>
<p class="subtitle animate-in">Questions?</p>
<div class="contact animate-in"><p>email@example.com</p></div>
```

---

## Tips for choosing types

- 5+ bullet points? Split into two `content` slides or use `cards`.
- Comparing two things? Use `two-col`.
- One big number? Use `stat`.
- Section break? Use `divider`.
- Most slides should be `content` type. Use other types for variety.
