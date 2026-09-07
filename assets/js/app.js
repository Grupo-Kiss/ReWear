(function () {
  const NAV = [
    { href: "home.html", icon: "home", label: "Inicio", id: "home" },
    { href: "donar.html", icon: "volunteer_activism", label: "Donar", id: "donar" },
    { href: "solicitar.html", icon: "search", label: "Solicitar", id: "solicitar" },
    { href: "impacto.html", icon: "eco", label: "Impacto", id: "impacto" },
    { href: "perfil.html", icon: "account_circle", label: "Perfil", id: "perfil" },
  ];

  function asset(path) {
    const inDesign = /\/design\//.test(location.pathname);
    return (inDesign ? "../" : "") + path;
  }

  function pageId() {
    return document.body.getAttribute("data-page") || "";
  }

  function renderHeader() {
    const el = document.getElementById("app-header");
    if (!el) return;
    const title = el.dataset.title || "Rewear";
    const back = el.dataset.back;
    const hideBrand = el.dataset.brand === "false";
    const left = back
      ? `<a class="icon-btn" href="${back}" aria-label="Volver"><span class="material-symbols-outlined">arrow_back</span></a>`
      : `<a class="icon-btn" href="${asset("nosotros.html")}" aria-label="Nosotros"><span class="material-symbols-outlined">menu</span></a>`;

    el.innerHTML = `
      <div class="header-inner app-stage">
        <div class="brand">
          ${left}
          ${hideBrand ? "" : `<img src="${asset("assets/img/logo.svg")}" alt="Rewear" width="32" height="32">`}
          <span class="brand-name">${title}</span>
        </div>
        <div class="brand">
          <button class="icon-btn" type="button" aria-label="Notificaciones" data-toast="No hay notificaciones nuevas">
            <span class="material-symbols-outlined">notifications</span>
          </button>
          <a class="avatar" href="${asset("perfil.html")}" aria-label="Mi perfil">
            <span class="material-symbols-outlined">person</span>
          </a>
        </div>
      </div>
    `;
  }

  function renderNav() {
    const el = document.getElementById("app-nav");
    if (!el) return;
    const current = pageId();
    el.innerHTML = `
      <div class="bottom-nav-inner app-stage">
        ${NAV.map((item) => {
          const active = item.id === current;
          return `
            <a class="nav-item${active ? " is-active" : ""}" href="${asset(item.href)}" ${active ? 'aria-current="page"' : ""}>
              <span class="material-symbols-outlined${active ? " icon-fill" : ""}">${item.icon}</span>
              <span>${item.label}</span>
            </a>
          `;
        }).join("")}
      </div>
    `;
  }

  function toast(message) {
    document.querySelectorAll(".toast").forEach((n) => n.remove());
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }

  function bindChips() {
    document.querySelectorAll("[data-chip-group]").forEach((group) => {
      group.addEventListener("click", (event) => {
        const chip = event.target.closest(".chip");
        if (!chip || !group.contains(chip)) return;
        group.querySelectorAll(".chip").forEach((c) => {
          c.classList.remove("is-active");
          c.setAttribute("aria-pressed", "false");
        });
        chip.classList.add("is-active");
        chip.setAttribute("aria-pressed", "true");
        group.dispatchEvent(new CustomEvent("rewear:filter", { detail: chip.dataset.filter, bubbles: true }));
      });
    });
  }

  function bindToasts() {
    document.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-toast]");
      if (btn) toast(btn.dataset.toast);
    });
  }

  function bindFavorites() {
    document.querySelectorAll("[data-fav]").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        const on = btn.classList.toggle("is-active");
        const icon = btn.querySelector(".material-symbols-outlined");
        if (icon) icon.classList.toggle("icon-fill", on);
        btn.setAttribute("aria-pressed", String(on));
        toast(on ? "Guardada en favoritas" : "Quitada de favoritas");
      });
    });
  }

  function bindDonation() {
    const root = document.getElementById("donate-flow");
    if (!root) return;
    const panels = [...root.querySelectorAll(".step-panel")];
    const bars = [...root.querySelectorAll(".progress-step")];
    let step = 0;

    function show(next) {
      step = Math.max(0, Math.min(panels.length - 1, next));
      panels.forEach((panel, i) => {
        panel.hidden = i !== step;
      });
      bars.forEach((bar, i) => {
        bar.classList.toggle("is-current", i === step);
        bar.classList.toggle("is-done", i < step);
      });
      const label = root.querySelector("[data-step-label]");
      if (label) label.textContent = `Paso ${step + 1} de ${panels.length}`;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    root.addEventListener("click", (event) => {
      const next = event.target.closest("[data-next]");
      const prev = event.target.closest("[data-prev]");
      const choice = event.target.closest("[data-choice]");
      if (next) {
        event.preventDefault();
        show(step + 1);
      }
      if (prev) {
        event.preventDefault();
        show(step - 1);
      }
      if (choice) {
        root.querySelectorAll("[data-choice]").forEach((c) => c.classList.remove("is-selected"));
        choice.classList.add("is-selected");
      }
    });

    root.querySelectorAll("[data-upload]").forEach((tile) => {
      tile.addEventListener("click", () => {
        tile.classList.add("has-preview");
        tile.style.backgroundImage = `url("${asset("assets/img/photo-prendas.png")}")`;
        toast("Foto agregada");
      });
    });

    show(0);
  }

  function bindRequest() {
    const list = document.getElementById("request-list");
    const search = document.getElementById("request-search");
    if (!list) return;

    const apply = () => {
      const q = (search && search.value.trim().toLowerCase()) || "";
      const group = document.querySelector("[data-chip-group='request']");
      const filter = group && group.querySelector(".chip.is-active");
      const key = (filter && filter.dataset.filter) || "all";
      let visible = 0;
      list.querySelectorAll("[data-item]").forEach((card) => {
        const text = card.textContent.toLowerCase();
        const tags = (card.dataset.tags || "").split(/\s+/);
        const matchText = !q || text.includes(q);
        const matchFilter = key === "all" || tags.includes(key);
        const show = matchText && matchFilter;
        card.classList.toggle("hidden", !show);
        if (show) visible += 1;
      });
      const count = document.getElementById("request-count");
      if (count) count.textContent = `${visible} prenda${visible === 1 ? "" : "s"} disponibles`;
    };

    if (search) search.addEventListener("input", apply);
    document.addEventListener("rewear:filter", apply);
    apply();
  }

  function registerPwa() {
    if (!("serviceWorker" in navigator)) return;
    const sw = /\/design\//.test(location.pathname) ? "../sw.js" : "sw.js";
    navigator.serviceWorker.register(sw, { scope: /\/design\//.test(location.pathname) ? "../" : "./" }).catch(() => {});
  }

  renderHeader();
  renderNav();
  bindChips();
  bindToasts();
  bindFavorites();
  bindDonation();
  bindRequest();
  registerPwa();
})();
