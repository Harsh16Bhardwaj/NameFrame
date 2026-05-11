1. Visual Style Breakdown (The "NameFrame" Design System)
The current website utilizes a modern, "dark-mode-first" aesthetic with neon accents and subtle glowing effects. It prioritizes readability and uses selective coloring to guide the user's eye.

Color Palette:

App Background: Very dark grey/black (Approx: #0A0A0A or Tailwind zinc-950).

Surface/Card Background: Dark grey with low opacity or slight elevation (Approx: #171717 to #1E1E1E or Tailwind zinc-900).

Primary Accent (Teal/Cyan): Used for primary buttons, active states, icons, and logo elements (Approx: #2DD4BF or Tailwind teal-400).

Secondary/Warning Accent (Rose/Pink): Used for secondary elements, badges, and the feedback button (Approx: #F43F5E or Tailwind rose-500).

Text - Primary: Pure white (#FFFFFF) for headings and key data.

Text - Secondary: Muted grey (#A1A1AA or Tailwind zinc-400) for paragraphs and less critical info.

Typography:

Clean, geometric sans-serif (e.g., Inter, Roboto, or Plus Jakarta Sans).

Heavy font weights (Bold/Semibold) for high-impact headers.

Regular weight for highly readable body copy.

UI Components & Effects:

Cards: Highly rounded corners (Tailwind rounded-2xl), very subtle 1px borders (often inheriting the accent color at a low opacity, e.g., border-teal-500/20), and no harsh drop shadows.

Ambient Glows: Soft, diffused radial gradients placed behind key cards to create depth and highlight features (like the purple/pink glow behind the "Automated Delivery" card).

Navigation: Floating, pill-shaped navbar with a 1px border, heavily rounded (rounded-full), keeping it distinct from the background.

Buttons: Either solid accent colors with dark text (for primary actions) or dark backgrounds with accent text/borders (for secondary).

2. Instructions for the AI Agent (Copy & Paste)
You can pass the following prompt directly to an AI agent (like v0, Cursor, or ChatGPT) to generate your new pages using React/Next.js and Tailwind CSS.

Prompt for the Agent:

System & Role: You are an expert frontend engineer and UI/UX designer. Your task is to build a [Dashboard / Creation Page] for a web application called "NameFrame".

Design System Constraints (Strict):
Please strictly adhere to the following Tailwind CSS design language to match the existing landing page:

Theme: Strict Dark Mode.

Backgrounds: Use bg-zinc-950 or bg-black for the main application background. Use bg-zinc-900 or bg-zinc-900/50 (with backdrop-blur) for cards, sidebars, and panels.

Typography: Sans-serif. Headings should be text-white and bold (font-bold, font-semibold). Body text, labels, and descriptions should be text-zinc-400.

Accents:

Primary (Teal): Use text-teal-400, bg-teal-400/10, border-teal-500/30. Primary buttons should be bg-teal-400 text-black hover:bg-teal-300 transition-colors.

Secondary (Rose/Pink): Use rose-500 for destructive actions, warnings, or secondary highlights.

Borders & Shapes: Heavily utilize rounded corners. Cards should be rounded-2xl, inputs/buttons should be rounded-lg or rounded-full. Use thin, subtle borders on cards: border border-white/5 or border-zinc-800.

Effects: Use ambient glows behind critical active elements (e.g., a background div with blur-3xl bg-teal-500/10 or bg-fuchsia-500/10).

Functional Requirements for this Implementation:
[Insert your specific page requirements here, e.g., "Build the main dashboard view showing a grid of recent events, a quick stats row, and a sidebar navigation menu."] Ensure the layout is spacious, utilizing ample padding (p-6 or p-8 on containers) to maintain a clean, uncluttered aesthetic.

3. Suggested Enhancements for the Dashboard & Creation Pages
To ensure the new pages don't just look like the landing page, but function beautifully for their specific use cases, here are architectural enhancements to include in your agent prompts:

For the Dashboard:
Shift from Floating Navbar to Sidebar: A landing page benefits from a top navbar, but a heavy-duty dashboard operates better with a fixed left sidebar. It allows for more navigation links without cluttering the top space. Make the sidebar background slightly distinct from the main canvas (e.g., bg-zinc-900 sidebar next to a bg-zinc-950 main area).

Metric Cards with Mini-Charts: Instead of just showing a number for "Total Certificates", use the Teal/Rose accent colors to draw sparklines (mini line charts) inside the metric cards to show trends over time.

Data Tables with Depth: Standard tables can look boring. Enhance them by putting the table inside a rounded-2xl border-zinc-800 container. Make the table header row bg-zinc-900/50 and keep the rows slightly separated visually.

For the Creation Page (Visual Designer):
Studio Layout (Three-Pane Setup): Implement a professional editor layout.

Left Panel: Layers/Elements (Dark, narrow, text-heavy).

Center Canvas: The workspace. Use a slightly lighter background here (e.g., a subtle dot-grid pattern on a bg-zinc-900 base) so the certificate being designed pops out.

Right Panel: Properties/Settings (Context-aware based on what is clicked).

Focus Mode: Remove the main navigation entirely while in the "Create" view. Replace it with a sleek, minimal top bar containing only essential actions (Back to Dashboard, Undo/Redo, Save, Export) to maximize vertical canvas space.

Tool UI: Keep the tool buttons (text, image, shape) very minimalist—just white/grey icons that glow teal (text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]) when actively selected.