/* Refugio · app de bienestar emocional (demo estática) */
(function () {
  "use strict";

  /* ---------- Iconos (SVG de trazo) ---------- */
  const P = {
    home: '<path d="M3 11l9-8 9 8"/><path d="M5 10v10h5v-6h4v6h5V10"/>',
    users: '<circle cx="9" cy="8" r="3.2"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><path d="M16 5.2a3.2 3.2 0 0 1 0 5.8"/><path d="M18 14.3c1.8.8 3 2.6 3 4.7"/>',
    heart: '<path d="M12 20s-7.5-4.6-9-9.2C2 7.600 4.200 5 7.100 5c1.900 0 3.700 1 4.900 2.800C13.200 6 15 5 16.900 5 19.800 5 22 7.600 21 10.800 19.500 15.400 12 20 12 20z"/>',
    user: '<circle cx="12" cy="8" r="3.6"/><path d="M4.500 20c0-4 3.400-6.500 7.500-6.500s7.500 2.500 7.500 6.500"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.600 7.100L4 20l1-4.600A8 8 0 1 1 21 12z"/>',
    spark: '<path d="M12 3l1.800 5.200L19 10l-5.200 1.800L12 17l-1.800-5.200L5 10l5.200-1.800z"/><path d="M19 16l.7 1.800L21.500 18.500 19.700 19.200 19 21l-.7-1.800-1.800-.7 1.800-.7z"/>',
    edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M14 6l4 4"/>',
    chev: '<path d="M9 6l6 6-6 6"/>',
    pencil: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    shield: '<path d="M12 3l8 3v6c0 4.500-3.200 8-8 9-4.800-1-8-4.500-8-9V6z"/>',
    leaf: '<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-5 6-8 10-10"/>',
    hearthand: '<path d="M12 20s-7-4.200-8.500-8.600C2.600 8.800 4.500 6.500 7 6.500c1.700 0 3.200.9 4.200 2.400.9-1.500 2.500-2.400 4.200-2.400 2.500 0 4.400 2.300 3.500 4.900C17.500 15.800 12 20 12 20z"/>',
    comment: '<path d="M21 12a8 8 0 0 1-11.600 7.100L4 20l1-4.600A8 8 0 1 1 21 12z"/>',
    more: '<circle cx="5" cy="12" r="1.200" fill="currentColor"/><circle cx="12" cy="12" r="1.200" fill="currentColor"/><circle cx="19" cy="12" r="1.200" fill="currentColor"/>',
    check: '<path d="M5 12.500l4.500 4.500L19 7.500"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    send: '<path d="M4 12l16-8-6 16-2.500-6.500z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    bell: '<path d="M6 17V11a6 6 0 0 1 12 0v6l1.500 2h-15z"/>',
    sprout: '<path d="M12 21v-9"/><path d="M12 12C12 8 9 6 5 6c0 4 2 6 7 6z"/><path d="M12 14c0-3 2.500-5 6-5 0 3-2 5-6 5z"/>',
    brand: '<circle cx="7" cy="17" r="2"/><circle cx="17" cy="6" r="2"/><path d="M8.500 15.500C11 13 13 11 15.500 7.500"/><path d="M5 7c2 0 4 1 5 3"/>'
  };
  const icon = (n, s = 18, sw = 1.8, extra = "") =>
    `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" ${extra}>${P[n]}</svg>`;

  /* ---------- Estado ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem("refugio:" + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("refugio:" + k, JSON.stringify(v)); } catch (e) {} }
  };

  const state = {
    tab: "inicio",
    mood: store.get("mood", 2),
    signal: store.get("signal", "red"),
    posts: store.get("posts", [
      { id: 1, animal: "Gato", emoji: "🐱", bg: "#f6e3d6", time: "Hace 15 min", text: "Hoy me costó concentrarme en clase. Salí a caminar un rato y me sentí más tranquilo.", likes: 12, liked: false },
      { id: 2, animal: "Perrito", emoji: "🐶", bg: "#efe0d2", time: "Hace 42 min", text: "A veces siento que todos tienen todo claro menos yo. ¿A alguien más le pasa? Me ayuda saber que no soy el único.", likes: 24, liked: true },
      { id: 3, animal: "Pingüino", emoji: "🐧", bg: "#e3e5f7", time: "Hace 1 h", text: "Le conté a alguien cómo me sentía. Me dio nervios, pero me alegra haber dado ese pequeño paso. 💜", likes: 18, liked: false }
    ])
  };

  const MOODS = [
    { e: "😔", l: "Muy mal" }, { e: "🙁", l: "Mal" }, { e: "😐", l: "Regular" },
    { e: "🙂", l: "Bien" }, { e: "😄", l: "Muy bien" }
  ];
  const SIGNALS = [
    { k: "green", t: "No necesito hablar con nadie", },
    { k: "yellow", t: "Quizá hable con alguien" },
    { k: "red", t: "Quiero hablar con el psicólogo" }
  ];
  const ANIMALS = [
    { n: "Zorrito", e: "🦊", bg: "#fbe3d3" }, { n: "Osito", e: "🐻", bg: "#efe0d2" },
    { n: "Conejo", e: "🐰", bg: "#f3e4ee" }, { n: "Búho", e: "🦉", bg: "#e8e3f7" },
    { n: "Panda", e: "🐼", bg: "#e6ecf4" }
  ];

  /* ---------- Pantallas ---------- */
  const views = {
    inicio() {
      return `
        <div class="header">
          <h1>Inicio</h1>
          <div class="hello">Hola, <div class="avatar" style="background:#f3dccb">🦊</div></div>
        </div>

        <section class="card">
          <h2>¿Cómo te sientes hoy?</h2>
          <p class="desc">Lo que sientes importa. Este es tu espacio.</p>
          <div class="moods">
            ${MOODS.map((m, i) => `
              <button class="mood ${state.mood === i ? "active" : ""}" data-action="mood" data-i="${i}" aria-label="${m.l}">
                <span class="face">${m.e}</span>${m.l}
              </button>`).join("")}
          </div>
        </section>

        <div class="banner">${icon("users", 20, 1.7)} 24 alumnos ya buscaron apoyo esta semana.</div>

        <h3 class="section-title">Un momento para ti</h3>
        <section class="pause">
          <small>PAUSA DE 2 MINUTOS</small>
          <h3>Respira. No hay prisa.</h3>
          <button class="link" data-action="pause">Hacer una pausa ${icon("arrow", 15, 2)}</button>
          <span class="art" aria-hidden="true">🦊</span>
        </section>

        <button class="row-card" data-action="go" data-tab="apoyo" style="margin-top:14px">
          <span class="ico">${icon("hearthand", 20)}</span>
          <span class="txt"><b>No tienes que poder con todo.</b><span>En Apoyo puedes dar el primer paso.</span></span>
          <span class="chev">${icon("chev", 18)}</span>
        </button>`;
    },

    perfil() {
      return `
        <div class="header">
          <h1>Mi espacio</h1>
          <span class="brand">${icon("brand", 16, 1.8)} refugio</span>
        </div>
        <p class="subtle" style="margin:-4px 0 14px 2px">A tu ritmo, sin juicios.</p>

        <section class="card">
          <h2 style="display:flex;gap:8px;align-items:center">
            <span style="color:var(--primary)">${icon("bell", 20, 1.8)}</span> Semáforo de Apoyo
          </h2>
          <p class="desc">Elige cómo te sientes respecto a hablar con alguien hoy.</p>
          <div class="semaforo">
            ${SIGNALS.map(s => `
              <button class="opt ${s.k} ${state.signal === s.k ? "active" : ""}" data-action="signal" data-k="${s.k}">
                <span>${s.t}<i class="dot ${s.k}"></i></span>
                ${state.signal === s.k ? `<span class="check">${icon("check", 14, 2.6)}</span>` : ""}
              </button>`).join("")}
          </div>
          <button class="btn" data-action="chat">${icon("chat", 18, 2)} Iniciar Chat Privado</button>
          <div class="note">${icon("heart", 13, 2)} Puedes cambiar de idea cuando quieras.</div>
        </section>

        <div class="grid2">
          <button class="mini" data-action="toast" data-msg="Pronto podrás guardar lo que te hace bien">
            <span class="ico a">${icon("spark", 18)}</span><b>Lo que me gusta</b>
            <span>Pequeñas cosas que me hacen bien.</span>
          </button>
          <button class="mini" data-action="diary">
            <span class="ico b">${icon("edit", 18)}</span><b>Diario privado</b>
            <span>Un lugar para ordenar lo que siento.</span>
          </button>
        </div>
        <p class="subtle center">No hay una forma correcta de sentirse.</p>`;
    },

    comunidad() {
      return `
        <div class="header">
          <h1>Comunidad</h1>
          <span class="brand">${icon("brand", 16, 1.8)} refugio</span>
        </div>
        <p class="subtle" style="display:flex;gap:6px;align-items:center;margin:-4px 0 14px 2px">
          <span style="color:var(--primary)">${icon("heart", 14, 2)}</span> Aquí nos escuchamos con respeto.
        </p>
        ${state.posts.map(p => `
          <article class="post">
            <div class="post-head">
              <div class="avatar sm" style="background:${p.bg}">${p.emoji}</div>
              <div class="who"><b>Anónimo · ${p.animal}</b><small>${p.time}</small></div>
              <button aria-label="Más opciones" style="color:var(--muted)" data-action="toast" data-msg="Gracias por cuidar la comunidad">${icon("more", 18)}</button>
            </div>
            <p>${p.text.replace(/</g, "&lt;")}</p>
            <div class="post-foot">
              <button class="${p.liked ? "liked" : ""}" data-action="like" data-id="${p.id}">${icon("heart", 15, 1.8)} Me gusta · ${p.likes}</button>
              <button data-action="toast" data-msg="Los comentarios llegarán pronto">${icon("comment", 15, 1.8)} Comentar</button>
            </div>
          </article>`).join("")}
        <div class="share"><button data-action="share">${icon("pencil", 15, 2)} Compartir cómo me siento</button></div>`;
    },

    apoyo() {
      return `
        <div class="header">
          <h1>Apoyo</h1>
          <span class="brand">${icon("brand", 16, 1.8)} refugio</span>
        </div>
        <div class="hero">
          <div class="avatar lg" style="background:#efe0d2">🐻</div>
          <div><h2>No estás a solas.</h2><p class="subtle">Pedir ayuda también es cuidarte.</p></div>
        </div>

        <section class="card">
          <div class="top-row">
            <span class="ico">${icon("chat", 18)}</span>
            <div><b>Habla con el psicólogo</b><span>Apoyo de tu centro educativo</span></div>
          </div>
          <p class="desc" style="margin-bottom:14px">Puedes empezar con un «hola». Comparte solo lo que te resulte cómodo, a tu ritmo.</p>
          <button class="btn" data-action="chat">${icon("chat", 17, 2)} Iniciar Chat Privado</button>
          <p class="subtle" style="font-size:11px;margin-top:12px;line-height:1.45">Antes de empezar, consulta cómo se cuida tu información y los horarios de atención.</p>
        </section>

        <h3 class="section-title">Otras formas de dar el primer paso</h3>
        <button class="row-card" data-action="toast" data-msg="Te ayudaremos a preparar lo que quieres contar">
          <span class="ico">${icon("users", 19)}</span>
          <span class="txt"><b>Alguien de confianza</b><span>Prepara lo que quieres contarle.</span></span>
          <span class="chev">${icon("chev", 18)}</span>
        </button>
        <button class="row-card" data-action="toast" data-msg="Recursos para los días difíciles, muy pronto">
          <span class="ico">${icon("leaf", 19)}</span>
          <span class="txt"><b>Ideas para cuidarte</b><span>Recursos para los días difíciles.</span></span>
          <span class="chev">${icon("chev", 18)}</span>
        </button>

        <div class="urgent"><b>¿Necesitas ayuda urgente?</b>
          Si estás en peligro, contacta con emergencias de tu país o busca a una persona adulta de confianza.</div>`;
    }
  };

  const TABS = [
    { k: "comunidad", l: "Comunidad", i: "users" },
    { k: "inicio", l: "Inicio", i: "home" },
    { k: "apoyo", l: "Apoyo", i: "heart" },
    { k: "perfil", l: "Perfil", i: "user" }
  ];

  /* ---------- Render ---------- */
  const $screen = document.getElementById("screen");
  const $tabbar = document.getElementById("tabbar");
  const $overlay = document.getElementById("overlay");
  const $app = document.getElementById("app");

  function render() {
    $screen.innerHTML = views[state.tab]();
    $tabbar.innerHTML = TABS.map(t => `
      <button class="tab ${state.tab === t.k ? "active" : ""}" data-action="go" data-tab="${t.k}" aria-label="${t.l}">
        <span class="pill">${icon(t.i, 20, 1.8)}</span>${t.l}
      </button>`).join("");
  }

  function go(tab) {
    state.tab = tab;
    render();
    $screen.scrollTop = 0;
  }

  /* ---------- Modales ---------- */
  function sheet(title, body, onMount) {
    $overlay.hidden = false;
    $overlay.innerHTML = `
      <div class="sheet" role="dialog" aria-modal="true" aria-label="${title}">
        <div class="sheet-head"><h3>${title}</h3>
          <button class="close" data-action="close" aria-label="Cerrar">${icon("x", 16, 2)}</button></div>
        ${body}
      </div>`;
    if (onMount) onMount($overlay);
  }
  function closeSheet() { $overlay.hidden = true; $overlay.innerHTML = ""; }

  function toast(msg) {
    const old = $app.querySelector(".toast");
    if (old) old.remove();
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = msg;
    $app.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function openChat() {
    sheet("Chat privado", `
      <div class="chat" id="chat">
        <div class="bubble them">Hola 💜 Qué bueno que escribiste. Comparte solo lo que te resulte cómodo, a tu ritmo.</div>
      </div>
      <div class="chat-input">
        <input class="input" id="chatText" placeholder="Escribe un «hola»..." autocomplete="off" />
        <button class="send" id="chatSend" aria-label="Enviar">${icon("send", 18, 2)}</button>
      </div>
      <p class="subtle" style="font-size:11px;margin-top:10px">Demo: este chat no está conectado a ningún psicólogo real.</p>`,
      root => {
        const chat = root.querySelector("#chat");
        const input = root.querySelector("#chatText");
        const add = (cls, txt) => {
          const b = document.createElement("div");
          b.className = "bubble " + cls;
          b.textContent = txt;
          chat.appendChild(b);
          chat.scrollTop = chat.scrollHeight;
        };
        const send = () => {
          const v = input.value.trim();
          if (!v) return;
          add("me", v);
          input.value = "";
          setTimeout(() => add("them", "Gracias por contármelo. Aquí estoy para escucharte, sin prisa."), 900);
        };
        root.querySelector("#chatSend").addEventListener("click", send);
        input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });
        input.focus();
      });
  }

  function openPause() {
    sheet("Pausa de 2 minutos", `
      <div class="breath"><div class="circle"></div>
        <p>Inhala despacio… y suelta el aire. No hay prisa.</p></div>
      <button class="btn ghost" data-action="close">Listo, me siento mejor</button>`);
  }

  function openDiary() {
    sheet("Diario privado", `
      <textarea id="diaryText" rows="6" placeholder="Escribe lo que sientes. Solo tú lo ves."></textarea>
      <button class="btn" style="margin-top:12px" data-action="saveDiary">Guardar</button>`,
      root => {
        const ta = root.querySelector("#diaryText");
        ta.value = store.get("diary", "");
        ta.focus();
      });
  }

  function openShare() {
    sheet("Compartir cómo me siento", `
      <textarea id="postText" rows="5" maxlength="240" placeholder="Tu mensaje será anónimo y la comunidad lo leerá con respeto."></textarea>
      <button class="btn" style="margin-top:12px" data-action="publish">Publicar de forma anónima</button>`,
      root => root.querySelector("#postText").focus());
  }

  /* ---------- Eventos ---------- */
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-action]");
    if (!el) return;
    const d = el.dataset;
    switch (d.action) {
      case "go": go(d.tab); break;
      case "mood": state.mood = +d.i; store.set("mood", state.mood); render(); break;
      case "signal": state.signal = d.k; store.set("signal", d.k); render(); break;
      case "like": {
        const p = state.posts.find(x => x.id === +d.id);
        p.liked = !p.liked; p.likes += p.liked ? 1 : -1;
        store.set("posts", state.posts); render(); break;
      }
      case "chat": openChat(); break;
      case "pause": openPause(); break;
      case "diary": openDiary(); break;
      case "share": openShare(); break;
      case "saveDiary": {
        store.set("diary", document.getElementById("diaryText").value);
        closeSheet(); toast("Guardado solo para ti"); break;
      }
      case "publish": {
        const v = document.getElementById("postText").value.trim();
        if (!v) return;
        const a = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
        state.posts.unshift({ id: Date.now(), animal: a.n, emoji: a.e, bg: a.bg, time: "Ahora", text: v, likes: 0, liked: false });
        store.set("posts", state.posts);
        closeSheet(); render(); toast("Gracias por compartir 💜"); break;
      }
      case "toast": toast(d.msg); break;
      case "close": closeSheet(); break;
    }
  });

  $overlay.addEventListener("click", e => { if (e.target === $overlay) closeSheet(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeSheet(); });

  /* Reloj de la barra de estado */
  function tick() {
    const n = new Date();
    document.getElementById("clock").textContent = n.getHours() + ":" + String(n.getMinutes()).padStart(2, "0");
  }
  tick(); setInterval(tick, 30000);

  render();
})();
