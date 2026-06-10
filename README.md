# KamiLimu Cohort 10 — Month 2 Interactive Presentation

An immersive, highly polished, and interactive web-based presentation detailing curriculum modules and storytelling concepts for KamiLimu Cohort 10. The application features retro-futuristic styling, terminal logging animations, a custom 3D hologram globe, and responsive animations.

---

## 📽️ Presentation Slides

The presentation is organized into a cohesive, interactive timeline:

1. **Boot Screen (`BootSection`)**:
   - Features a custom vertical **Matrix Code Rain** digital backdrop.
   - Interactive **`[ EXECUTE ]`** prompt with subtle glitch text and glow-pulse animations to initialize the presentation.

2. **Cybersecurity Track (`TerminalSection`)**:
   - Interactive CLI log simulation outputting system scan routines.
   - **OSI Model & TCP/IP Layer Comparisons**: Staggered text reveals detailing protocol differences (Application, Transport, Network, Link, etc.).
   - Interactive **Hacker Archetypes Showcase**: Interactive rotation of Black Hat, Grey Hat, and White Hat descriptions.

3. **Git & Open Source (`GitSection`)**:
   - Real-time animation depicting a git repository fork, interactive rebase (`git rebase -i`), and commit-history cleanups.
   - Simulated pull request approval and merge status indicator.
   - Explores open-source career pathways (Outreachy, Google Summer of Code) and contribution goals.

4. **Mozilla Democracy & AI (`MozillaSection`)**:
   - Includes a scanning synthetic deepfake voice detection face with active scanlines.
   - Synthesizes synthetic warnings via the HTML5 Web Speech API (with transcript fallbacks).
   - **Interactive 3D Hologram Globe**: Built natively on HTML5 Canvas using simplified Ramer-Douglas-Peucker spatial polygon boundaries. Features:
     - Drag-to-spin rotation control.
     - Front/back depth wireframe opacity separation.
     - Dramatic cinematic auto-zoom sequence: *Scanning Globe* ➔ *Africa* ➔ *Kenya* ➔ *Nairobi* ➔ *Target User*.

5. **Principles of Innovation (`InnovationSection`)**:
   - Features an HTML5 Canvas drawing animation rendering a sketch-styled pencil.
   - Slowly type-writes the core design maxim: *"Innovation is not the next big thing. It is the pencil."*

6. **The Art of Storytelling (`StorytellingSection`)**:
   - A distinct light-themed slide representing the shift from tech concepts to communicative storytelling.
   - Features:
     - Scrolling left photostrip of cohort images.
     - Dynamic height bars illustrating the **Mehrabian Communication Formula** (Words vs. Voice vs. Body Language).
     - Interactive SVG diagram highlighting **Stage Presence Zones** (Power, Connection, Transition).
     - Candid photography and detailed cards explaining the **P.R.E.P. Framework** (Point, Reason, Example, Point).

7. **Outro (`OutroSection`)**:
   - Simulated shell exit routine (`$ exit`).
   - Fades into clean KamiLimu brand identity slides, showing logos, wordmarks, and a candid cohort assembly photo.

---

## 🛠️ Key Mechanics & Controls

- **Slide Transition System**: Replaced abrupt display toggles (`hidden` / `display: none`) with hardware-accelerated CSS opacity cross-fades (`opacity-100` / `opacity-0`) over a `1000ms` duration.
- **Global Navigation**: Advance slides globally by pressing the **Spacebar** or clicking anywhere on the screen (non-button areas).
- **Presentation Timer**: A global persistent countdown timer in the header tracks the remaining presentation duration. Turns warning-red and flashes when under 60 seconds.
- **Scanlines Layer**: A global CSS overlay mimics retro-futuristic CRT scanline panels moving continuously.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org) installed on your machine.

### Installation

Install dependencies using npm:

```bash
npm install
```

### Run Development Server

Launch the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or the port specified in the console output) in your web browser.

### Build and Start for Production

To build the static application bundle:

```bash
npm run build
```

To run the production build locally:

```bash
npm run start
```
