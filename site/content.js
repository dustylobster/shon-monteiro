// Everything on the page comes from this file. Edit text here; the layout updates itself.
// Videos live in site/media/. Run tools/prepare_videos.py to add new ones (it prints the entry to paste below).

window.PORTFOLIO = {
  name: "Shon Jamson Monteiro",
  shortName: "Shon Monteiro", // used in the top bar, where the full name is too long on phones
  role: "Video Editor & CGI Artist",
  location: "", // shown after your role in the hero; left empty on purpose

  // Hero headline. Each line break (\n) becomes its own animated line; the last line gets the accent gradient.
  headline: "Edits that\nkeep you\nwatching.",
  intro: "Brand films, product reels and CGI. Cut for rhythm, built to hold attention.",
  available: "Available for freelance projects", // small green status line in the hero; "" hides it

  // Shown under the hero as "Selected clients". Only list clients you're allowed to name.
  clients: ["Venuum", "Atmos Perfumes", "Afterburn Originals"],

  // Work is shown in these groups, in this order. key matches each video's category.
  groups: [
    { key: "client", title: "Client work", note: "Brand films and product reels made for clients." },
    { key: "personal", title: "Personal · CGI", note: "Fully CGI samples and teaser trailers, rendered in Blender and Unreal Engine 5." },
    { key: "experiment", title: "Experiments", note: "Edits where I try new styles, transitions and pacing." },
  ],

  // The big full-width video that grows as you scroll. Leave file empty to skip the section.
  // kicker = the small label above the title (default "Showreel").
  showreel: {
    file: "media/car-1.mp4",
    poster: "media/car-1.jpg",
    kicker: "Featured",
    title: "Venuum",
    client: "Venuum",
    year: 2026,
  },

  // Long-form feature, shown right after the showreel. teaser = short silent loop that plays in the section;
  // clicking plays the full file with sound. Leave file empty to hide the section.
  feature: {
    file: "media/motion-graphics-and-yt-long-form.mp4",
    teaser: "media/longform-teaser.mp4",
    poster: "media/motion-graphics-and-yt-long-form.jpg",
    kicker: "Long-form · Motion graphics",
    title: "Bugatti Active Aero, Explained",
    client: "Venuum",
    role: "Motion graphics & edit",
    format: "YouTube long-form",
    length: "3:55",
    year: 2026,
    description:
      "A YouTube explainer on how Bugatti's active aerodynamics work and what a fixed-wing kit changes, with interview footage cut against custom motion-graphics breakdowns.",
  },

  // category: "client", "personal" (CGI projects) or "experiment".
  // client: shown under the title; "" hides it. aspect: "16/9" landscape, "9/16" vertical.
  // role (optional): what you did, shown in the player, e.g. "Edit, colour & sound design".
  videos: [
    {
      file: "media/bike-2.mp4",
      poster: "media/bike-2.jpg",
      title: "The Fall",
      client: "Afterburn Originals",
      category: "client",
      year: 2026,
      aspect: "16/9",
      description: "Dirt-bike short: title open, slow motion and a warm grade.",
    },
    {
      file: "media/atmos-perfumes.mp4",
      poster: "media/atmos-perfumes.jpg",
      title: "Wild Berry",
      client: "Atmos Perfumes",
      category: "client",
      year: 2026,
      aspect: "9/16",
      description: "Vertical product film for a fragrance launch: macro texture, red light and a clean packshot.",
    },
    {
      file: "media/podcast.mp4",
      poster: "media/podcast.jpg",
      title: "Venuum Mastodon",
      client: "Venuum",
      category: "client",
      year: 2026,
      aspect: "9/16",
      description: "Presenter-led vertical walkaround of a custom G-Wagon build: road, lighting and interior details.",
    },
    {
      file: "media/cgi-blender-personal.mp4",
      poster: "media/cgi-blender-personal.jpg",
      title: "GT Sunset Run",
      client: "CGI · Blender",
      category: "personal",
      year: 2026,
      aspect: "16/9",
      description: "Fully CGI sample: a race car at golden hour, rendered in Blender.",
    },
    {
      file: "media/cgi-unrealengine5-personal.mp4",
      poster: "media/cgi-unrealengine5-personal.jpg",
      title: "Sián",
      client: "CGI · Unreal Engine 5",
      category: "personal",
      year: 2026,
      aspect: "9/16",
      description: "Fully CGI teaser trailer, rendered in Unreal Engine 5.",
    },
    {
      file: "media/cdi-bledner-personal.mp4",
      poster: "media/cdi-bledner-personal.jpg",
      title: "M4 Chase",
      client: "CGI · Blender",
      category: "personal",
      year: 2026,
      aspect: "16/9",
      description: "Fully CGI sample chase, rendered in Blender, with the clay and wireframe breakdown cut in.",
    },
    {
      file: "media/food.mp4",
      poster: "media/food.jpg",
      title: "Food & Beverages",
      client: "",
      category: "client",
      year: 2026,
      aspect: "9/16",
      description: "Vertical product reel built around the reveal.",
    },
    {
      file: "media/bike-1.mp4",
      poster: "media/bike-1.jpg",
      title: "All I Wanted",
      client: "Experiment",
      category: "experiment",
      year: 2026,
      aspect: "16/9",
      description: "Superbike edit with kinetic titles.",
    },
    {
      file: "media/car-2.mp4",
      poster: "media/car-2.jpg",
      title: "Golf GTI, show floor",
      client: "Experiment",
      category: "experiment",
      year: 2026,
      aspect: "16/9",
      description: "Car show edit: speed ramps and whip transitions.",
    },
    {
      file: "media/edit-2.mp4",
      poster: "media/edit-2.jpg",
      title: "Storm",
      client: "Experiment",
      category: "experiment",
      year: 2026,
      aspect: "16/9",
      description: "A moody, experimental piece: lightning, texture and close-ups.",
    },
  ],

  // About: one statement that lights up word by word as you scroll.
  about:
    "I'm Shon, a video editor and CGI artist. I cut brand and product films for clients, build cars in Blender and Unreal Engine 5, and experiment with new styles on the side. I care about rhythm, clean colour and the first three seconds.",
  tools: ["Premiere Pro", "After Effects", "DaVinci Resolve", "Blender", "Unreal Engine 5", "Photoshop"],

  // Contact. Leave a link empty ("") to hide it.
  email: "shonjamsonmonteiro31@gmail.com",
  links: {
    Instagram: "",
    YouTube: "",
  },
};
