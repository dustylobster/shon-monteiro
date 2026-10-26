(() => {
  const P = window.PORTFOLIO;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const easeOut = (t) => 1 - Math.pow(1 - t, 3);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const ratio = (a) => {
    const [w, h] = String(a || "16/9").split("/").map(Number);
    return w && h ? w / h : 16 / 9;
  };
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
  const mailto = P.email ? `mailto:${P.email}?subject=${encodeURIComponent("Project enquiry")}` : "";

  // ---------- Text ----------
  document.title = `${P.name} | ${P.role}`;
  $(".brand").textContent = P.shortName || P.name;
  if (P.available) $(".status-text").textContent = P.available;
  else $(".status").remove();
  $(".eyebrow").textContent = [P.name, P.role, P.location].filter(Boolean).join(" · ");
  $(".hero-title").innerHTML = P.headline
    .split("\n")
    .map((line, i) => `<span class="line"><span style="--i:${i}">${esc(line)}</span></span>`)
    .join("");
  $(".hero-sub").textContent = P.intro;
  if (mailto) $(".hero-mail").href = mailto;
  if (P.clients && P.clients.length) {
    $(".clients-list").innerHTML = P.clients.map((c) => `<li>${esc(c)}</li>`).join("");
  } else {
    $(".clients").remove();
  }
  $(".footer-copy").textContent = `© ${new Date().getFullYear()} ${P.name}. All work shown with permission.`;

  // ---------- Work, grouped ----------
  // Rows are justified: each card grows in proportion to its aspect ratio, so every card in a row
  // ends up the same height whether it is landscape or vertical.
  const videos = P.videos || [];
  const groups = (P.groups || [{ key: "all", title: "Work" }])
    .map((g) => ({ ...g, items: videos.filter((v) => g.key === "all" || v.category === g.key) }))
    .filter((g) => g.items.length);
  const order = groups.flatMap((g) => g.items); // player next/prev follows the page order

  const card = (v, i) => `
    <article class="card reveal${ratio(v.aspect) > 1 ? " is-wide" : ""}" data-a="${ratio(v.aspect).toFixed(4)}" style="--d:${i % 4}">
      <button class="card-media" type="button" data-index="${order.indexOf(v)}" style="aspect-ratio:${esc(v.aspect || "16/9")}" aria-label="Play ${esc(v.title)}">
        ${v.poster ? `<img src="${esc(v.poster)}" alt="" loading="lazy" decoding="async">` : ""}
        <video muted loop playsinline preload="none" data-src="${esc(v.file)}"></video>
        <span class="card-play">${PLAY_ICON}</span>
      </button>
      <h4 class="card-title">${esc(v.title)}</h4>
      <p class="card-sub">${esc([v.client, v.year].filter(Boolean).join(" · "))}</p>
    </article>`;

  $(".groups").innerHTML = groups
    .map((g, gi) => `
      <section class="group" id="work-${esc(g.key)}" aria-labelledby="group-${gi}">
        <header class="group-head reveal">
          <span class="group-index">${String(gi + 1).padStart(2, "0")}</span>
          <h3 class="group-title" id="group-${gi}">${esc(g.title)}</h3>
          ${g.note ? `<p class="group-note">${esc(g.note)}</p>` : ""}
        </header>
        <div class="grid">${g.items.map(card).join("")}</div>
      </section>`)
    .join("");

  // Split each group into rows that fill the width at close to the target height (--h), then size every card
  // so the cards in a row share one height. Tries every split (groups are small) and keeps the cheapest.
  const phone = matchMedia("(max-width: 734px)");
  function layoutGrids() {
    if (phone.matches) return; // phones use the CSS two-column grid
    $$(".grid").forEach((grid) => {
      const cards = $$(".card", grid);
      const aspects = cards.map((c) => +c.dataset.a);
      const cs = getComputedStyle(grid);
      const W = grid.clientWidth;
      const gap = parseFloat(cs.columnGap) || 0;
      const target = parseFloat(cs.getPropertyValue("--h")) || 290;
      const rowHeight = (i, j) => (W - gap * (j - i - 1)) / aspects.slice(i, j).reduce((a, b) => a + b, 0);
      const cost = (H) => ((H - target) / target) ** 2 + (H > target * 1.6 ? 10 : 0);
      const best = [{ cost: 0, from: 0 }];
      for (let j = 1; j <= cards.length; j++) {
        best[j] = { cost: Infinity, from: 0 };
        for (let i = 0; i < j; i++) {
          const c = best[i].cost + cost(rowHeight(i, j));
          if (c < best[j].cost) best[j] = { cost: c, from: i };
        }
      }
      for (let j = cards.length; j > 0; j = best[j].from) {
        const i = best[j].from;
        const H = Math.min(rowHeight(i, j), target * 1.6);
        for (let k = i; k < j; k++) cards[k].style.width = `${Math.floor(aspects[k] * H)}px`;
      }
    });
  }
  layoutGrids();
  let layoutQueued = false;
  addEventListener("resize", () => {
    if (layoutQueued) return;
    layoutQueued = true;
    requestAnimationFrame(() => { layoutQueued = false; layoutGrids(); });
  });
  phone.addEventListener("change", layoutGrids);

  const workNav = $(".work-nav");
  if (groups.length > 1) {
    workNav.innerHTML = groups
      .map((g) => `<a class="pill" href="#work-${esc(g.key)}">${esc(g.title)}<sup>${g.items.length}</sup></a>`)
      .join("");
  } else {
    workNav.remove();
  }

  // Desktop: hovering a card plays a silent preview. Phones skip this to save data; a tap opens the player.
  if (canHover) {
    $$(".card-media").forEach((media) => {
      const vid = $("video", media);
      vid.addEventListener("playing", () => media.classList.add("is-playing"));
      media.addEventListener("mouseenter", () => {
        if (!vid.src) vid.src = vid.dataset.src;
        vid.play().catch(() => {});
      });
      media.addEventListener("mouseleave", () => {
        vid.pause();
        media.classList.remove("is-playing");
      });
    });
  }

  // ---------- About ----------
  $(".statement").innerHTML = P.about
    .split(/\s+/)
    .map((w) => `<span class="w">${esc(w)}</span>`)
    .join(" ");
  const words = $$(".statement .w");
  $(".tools").innerHTML = (P.tools || []).map((t) => `<li>${esc(t)}</li>`).join("");

  // ---------- Contact ----------
  const mail = $(".contact-mail");
  const copyBtn = $(".contact-copy");
  if (P.email) {
    mail.href = mailto;
    mail.textContent = P.email;
  } else {
    mail.remove();
    copyBtn.remove();
  }
  $(".contact-links").innerHTML = Object.entries(P.links || {})
    .filter(([, url]) => url)
    .map(([label, url]) => `<li><a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)}</a></li>`)
    .join("");

  const toast = $(".toast");
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("on"), 2200);
  }
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(P.email);
      showToast("Email copied");
    } catch {
      // Clipboard can be unavailable (old browsers, some in-app browsers): select the address instead
      const range = document.createRange();
      range.selectNodeContents(mail);
      getSelection().removeAllRanges();
      getSelection().addRange(range);
      showToast("Press Ctrl+C to copy");
    }
  });

  // ---------- Showreel ----------
  const reel = $(".reel");
  const reelFrame = $(".reel-frame");
  const reelVideo = $(".reel-video");
  const reelShade = $(".reel-shade");
  const reelCaption = $(".reel-caption");
  const showreel = P.showreel && P.showreel.file ? P.showreel : null;
  if (showreel) {
    reelVideo.src = showreel.file;
    if (showreel.poster) reelVideo.poster = showreel.poster;
    $(".reel-kicker").textContent = showreel.kicker || "Showreel";
    $(".reel-title").textContent = showreel.title || "Showreel";
    // Only play while on screen
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) reelVideo.play().catch(() => {});
      else reelVideo.pause();
    }).observe(reel);
  } else {
    reel.classList.add("is-empty");
    $$('a[href="#reel"]').forEach((a) => a.setAttribute("href", "#work"));
  }

  // ---------- Scroll-driven effects ----------
  const nav = $(".nav");
  let ticking = false;
  function onScroll() {
    ticking = false;
    const vh = innerHeight;
    nav.classList.toggle("scrolled", scrollY > 8);

    if (showreel) {
      const r = reel.getBoundingClientRect();
      const p = clamp(-r.top / Math.max(1, r.height - vh));
      const grow = reduceMotion ? 1 : easeOut(clamp(p / 0.55));
      const scale = 0.6 + 0.4 * grow;
      reelFrame.style.transform = `scale(${scale})`;
      reelFrame.style.borderRadius = `${(40 * (1 - grow)) / scale}px`;
      const cap = reduceMotion ? 1 : clamp((p - 0.5) / 0.2);
      reelShade.style.opacity = cap;
      reelCaption.style.opacity = cap;
      reelCaption.style.transform = `translateY(${24 * (1 - cap)}px)`;
      reelCaption.classList.toggle("on", cap > 0.5);
    }

    if (words.length) {
      const r = $(".statement").getBoundingClientRect();
      const p = reduceMotion ? 1 : clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("lit", i < lit));
    }
  }
  addEventListener("scroll", () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  // ---------- Reveal on scroll ----------
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  // ---------- Player ----------
  const player = $(".player");
  const pVideo = $(".player-video");
  let list = [];
  let current = 0;
  let opener = null;

  function show(i) {
    current = (i + list.length) % list.length;
    const v = list[current];
    pVideo.src = v.file;
    pVideo.poster = v.poster || "";
    $(".player-title").textContent = v.title;
    $(".player-sub").textContent = [v.client, v.year, v.role].filter(Boolean).join(" · ");
    $(".player-desc").textContent = v.description || "";
    $(".player-count").textContent = list.length > 1 ? `${current + 1} / ${list.length}` : "";
    $(".player-prev").hidden = $(".player-next").hidden = list.length < 2;
    pVideo.play().catch(() => {});
  }

  function open(items, i) {
    list = items;
    opener = document.activeElement;
    reelVideo.pause();
    player.hidden = false;
    document.body.classList.add("no-scroll");
    show(i);
    requestAnimationFrame(() => requestAnimationFrame(() => player.classList.add("open")));
    $(".player-close").focus({ preventScroll: true });
  }

  function close() {
    player.classList.remove("open");
    pVideo.pause();
    document.body.classList.remove("no-scroll");
    setTimeout(() => {
      player.hidden = true;
      pVideo.removeAttribute("src");
      pVideo.load();
    }, reduceMotion ? 0 : 400);
    if (opener) opener.focus({ preventScroll: true });
    const r = reel.getBoundingClientRect();
    if (showreel && r.bottom > 0 && r.top < innerHeight) reelVideo.play().catch(() => {});
  }

  $(".groups").addEventListener("click", (e) => {
    const media = e.target.closest(".card-media");
    if (media) open(order, +media.dataset.index);
  });
  $(".reel-play").addEventListener("click", () => open([{ client: P.name, ...showreel }], 0));
  $(".player-prev").addEventListener("click", () => show(current - 1));
  $(".player-next").addEventListener("click", () => show(current + 1));
  player.addEventListener("click", (e) => { if (e.target.closest("[data-close]")) close(); });
  addEventListener("keydown", (e) => {
    if (player.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight" && list.length > 1) show(current + 1);
    else if (e.key === "ArrowLeft" && list.length > 1) show(current - 1);
  });

  // Kick off the hero animation after first paint
  requestAnimationFrame(() => requestAnimationFrame(() => document.body.classList.add("is-loaded")));
})();
