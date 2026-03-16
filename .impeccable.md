## Design Context

### Users
Designers building design systems. They're crafting type scales for projects, teams, or clients — they care about precision, visual harmony, and export-ready output. They expect a tool that feels like a creative instrument, not a form.

### Brand Personality
**Gritty, Analog, Creative.** TypeStax is a hands-on creative tool that embraces the physicality of analog hardware. It's expressive and opinionated — not sterile or corporate. The interface itself is part of the creative experience.

### Emotional Goals
- **Creative flow** — lose yourself in exploration, experiment without friction
- **Delight & surprise** — moments of joy; the tool itself is enjoyable to use
- **Satisfaction & control** — the feeling of turning a perfectly weighted knob

### Aesthetic Direction
**Dark-mode skeuomorphic, inspired by vintage audio equipment and hi-fi hardware.** The interface uses backlit amber displays, knurled grips, rotary dials, VU meters, surface noise textures, corner bolts, and module grooves. Every surface has physical depth — inset wells, beveled edges, diffuse glows.

**References:**
- Analog synth UIs (Moog, Arturia) — realistic hardware emulation
- Teenage Engineering — playful industrial design that's fun and functional

**Anti-references:**
- Generic SaaS dashboards
- Flat Material Design
- Cookie-cutter admin panels

**Theme:** Dark mode is the primary experience. Light mode exists and should be maintained but dark mode gets priority design attention.

### Color System
OKLch-based palette. Warm amber accents (`oklch(0.72 0.12 65)`) for LEDs, glows, and active states. Deep dark backgrounds (`oklch(0.22 0.005 60)`). No cold blues or generic grays — everything stays warm.

### Typography
- Geist Sans / Geist Mono as the system fonts
- Host Grotesk and Oswald 200 for display/label elements
- The app itself is a typography tool — type rendering quality matters everywhere

### Design Principles
1. **Physical over flat** — Every control should feel like it has weight, depth, and texture. Prefer skeuomorphic detail over minimalist abstraction.
2. **Instrument, not form** — The interface is a creative instrument. Controls should invite exploration and feel satisfying to manipulate.
3. **Warm and analog** — Amber glows, surface noise, warm neutrals. Reject cold, clinical, or sterile aesthetics.
4. **Opinionated but usable** — Strong visual identity that never sacrifices usability. The aesthetic serves the workflow, not the other way around.
5. **Craft over convention** — Don't default to standard SaaS patterns. Every element should feel intentionally designed for this specific tool.

### Accessibility
Sensible defaults — good contrast, keyboard navigation (via Radix), screen reader support — but don't sacrifice the aesthetic for strict compliance checklists. Prioritize real usability over checkbox compliance.

### Component Language
Hardware-inspired CSS primitives: `.hw-btn`, `.hw-display`, `.module-groove`, `.surface-noise`, `.hw-bolt`, `.hw-selector-led`. These form the design vocabulary — use them consistently and extend them as React components (`hw-primitives.tsx`) to reduce repetition.
