# ScriptFlow - UserScript Manager

## What This Actually Is

ScriptFlow is a **userscript manager for people who want to write real code**, not shove 5,000 lines into one file and pray.

You get:

* Real folders
* Real imports
* Real editing
* Instant injection into the browser

No Node. No Webpack. No copy-paste ritual every time you change a line.

You write code. You save. It runs.

That’s it.

---

## Browser Support

**Works on:**
- Chrome (v120+)
- Edge
- Brave
- Opera
- Arc
- Vivaldi

**Does NOT work on:**
- Firefox (different APIs)
- Safari (different extension system)

ScriptFlow uses Chrome's userScripts API.
Firefox and Safari don't have it.

If you're on Firefox, this isn't for you (yet).

---

## What Makes This Different

ScriptFlow is not trying to be “Tampermonkey but prettier”.

It’s closer to:

> *“What if userscripts didn’t force you to code like it’s 2009?”*

The big difference:

* You **don’t build** anything
* You **don’t bundle** anything yourself
* You **don’t flatten your project** into one cursed file

You keep your project structure.
ScriptFlow handles the rest **at runtime**.

---

## Why Most UserScript Setups Suck

Let’s be honest.

### Tampermonkey / Violentmonkey

* One file
* No imports
* No structure
* Editing in a tiny textarea or copy-pasting from an editor like a caveman

People end up with:

```js
// utils
// ui
// helpers
// everything
```

in one file. It’s unreadable garbage.

### “Just use Webpack bro”

Sure, if you enjoy:

* Node installs
* Build configs
* Babel drama
* Rebuilding just to test a DOM change

For **userscripts**, that’s insane overhead.

ScriptFlow exists because both of these options are bad.

---

## How It Actually Works

ScriptFlow does **everything in the browser**.

### High-level flow

1. You write files (`.js`, `.json`, `.css`)
2. ScriptFlow reads them (local folder or Git repo)
3. It **transpiles imports at runtime**
4. It bundles modules **in memory**
5. The final output gets injected using the User Scripts API

No disk builds.
No external tools.
No background Node process.

---

### The Module System

ScriptFlow has its own lightweight module loader.

It:

* Resolves `import` / `export`
* Supports `require()` if you want it
* Loads JSON as actual objects
* Tracks dependencies
* Detects circular imports (and warns you)

Example:

```js
// main.js
import { render } from './ui/render.js';
import config from './config.json';

render(config);
```

That’s it.
No config file.
No build step.

---

## Core features (only the ones that matter)

### Multi-file projects

Folders work. Imports work. Relative paths work.

If you can structure a normal JS project, you can use ScriptFlow.

---

### Live editing

You save a file.
The script updates.
No reload dance.

Uses the **File System Access API**, so you’re editing real files — not copies.

---

### Git integration

You can:

* Clone a repo
* Edit files
* Commit
* Push

All inside the extension.

No terminal.
No git install.
It just uses `isomorphic-git` under the hood.

---

### Live Preview

Live Preview lets you **see what your script is doing without constantly reloading pages**.

It opens a small PictureInPicture (PiP) window that:

* Loads your HTML/CSS/JS together
* Resolves imports the same way the script does
* Updates instantly when you save a file

No refresh spam.
No injecting just to see if a div moved 3px.

It’s basically a sandbox:

* Good for UI work
* Good for layout and styling
* Good for testing logic before injecting it into a real site

This is **not** a full browser environment.
No site JS. No extensions. No page-specific APIs.
Just utilizes PictureInPicture API.

It’s for fast feedback — not production testing.

Save → preview updates → move on.

---

### Monaco editor

It’s basically VS Code in the browser.

Autocomplete works.
Syntax highlighting works.
Formatting works.
IntelliSense works.

No surprises here.

---

### CSS and assets

CSS files get injected automatically.
Images and resources can be embedded.

You don’t have to manually shove styles into strings unless you want to.

---

## Getting started

### Install

1. Clone This OR Download as zip.
2. Open `chrome://extensions`
3. Enable developer mode
4. Load unpacked
5. Drag ScriptFlow
6. Enable Allow User Scripts (this is the most important part).

Done.

---

### About that "Allow User Scripts" thing

When you enable ScriptFlow, Chrome will warn you:

> "This extension can run code that hasn't been reviewed by Google"

This is **expected**.

**Why?**
- ScriptFlow uses the userScripts API (same as Tampermonkey)
- You're writing code that runs on websites
- Chrome warns about this because it's powerful

**Is it safe?**
- The code is open source (check it yourself)
- No minification or obfuscation
- No telemetry or tracking
- No external requests

If you don't trust it, read the code first.
Everything is visible.

---

### Minimal script

```js
/*
@ScriptFlow
{
  "name": "Test Script",
  "match": ["https://example.com/*"]
}
*/

console.log('It runs');
```

Save it.
Open the page.
Check the console.

---

### Multi-file example

```js
// main.js
import { greet } from './greet.js';

greet('World');
```

```js
// greet.js
export function greet(name) {
  console.log('Hello', name);
}
```

That’s a real project now.
Not a single-file mess.

---

## Things ScriptFlow is NOT

Let’s be clear.

* ❌ Not a replacement for full browser extensions
* ❌ Not a production build system
* ❌ Not magic CSP bypass
* ❌ Not designed for ancient browsers

It’s for **modern Chromium-based browsers** and **people who know JavaScript**.

---

## Tips to not break it

* Don’t import the same file in five different ways
* Keep one clear entry point
* Don’t fight the module system — use it
* If something breaks, check the console (ScriptFlow is noisy on purpose)
* Large projects? Split them. Lazy loading exists for a reason

---

## Final notes

ScriptFlow exists because:

* Userscripts deserve real tooling
* Copy-pasting is dumb
* Build steps kill iteration speed

If you like clean projects, fast feedback, and not wasting time — this will feel right.

If you’re fine with one giant file and pain — this probably isn’t for you.

That’s okay.

---

## Screenshot Showcase

### Project structure

![Project structure](https://i.ibb.co/23D83vjj/scriptflow4.png)

---

### Monaco editor

![Monaco editor](https://i.ibb.co/VYvqNJJQ/scriptflow3.webp)

---

### Live Preview (PiP)

![Live Preview](https://i.ibb.co/xq646kPK/y281nkoz.webp)

---

### Git integration

![Git integration](https://i.ibb.co/Lh10q6pf/scriptflow5.png)
![Source Control](https://i.ibb.co/Jjc4zb4L/2fmp992i.webp)

---

## Personalization

Make ScriptFlow truly yours with custom backgrounds:
- Upload any image (PNG, JPG, GIF)
- Adjust opacity and blur
- Create your perfect coding environment

![Personalization](https://i.ibb.co/hF8kWJ2N/image.webp)

---

## Support Development

If ScriptFlow makes your life easier, consider buying me a coffee!
> ScriptFlow will **always** remain free and open source.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/kusoi)

Your support helps me:
- Build new features 
- Fix bugs faster 
- Keep it free and open source  

---


**Author:** Kusoi

**License:** Source-available, free to use

**Status:** Actively maintained

**Bug-Reports:** Report in my discord: ouka.js  

**Discord-Server:** https://discord.com/invite/gwC7KW3j7v  

If it saves you time, star it.
If it doesn’t, don’t.