/* Refugio · registro de eventos para validar hipótesis (Lean Startup)
 * Uso: agregar  <script src="tracking.js"></script>  justo antes de </body> en index.html.
 * No modifica la app: escucha los clics (data-action) y guarda eventos anónimos.
 * No guarda textos escritos, apodos ni contraseñas: solo qué botón se tocó y cuándo.
 * Panel de facilitador: abrir el enlace con ?facilitador=1 o tocar 5 veces la hora.
 */
(function () {
  "use strict";

  /* Opcional: URL de un Google Apps Script que reciba los eventos de todos los
     dispositivos y los guarde en una hoja de cálculo. Vacío = solo en este dispositivo. */
  var ENDPOINT = "";

  var KEY = "refugio:events", SID = "refugio:sid", MAX = 5000;
  var MOODS = ["Muy mal", "Mal", "Regular", "Bien", "Muy bien"];

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; } }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(-MAX))); } catch (e) {} }
  function sid() {
    try {
      var s = localStorage.getItem(SID);
      if (!s) { s = Math.random().toString(36).slice(2, 10); localStorage.setItem(SID, s); }
      return s;
    } catch (e) { return "na"; }
  }

  function track(name, detail) {
    var ev = { t: new Date().toISOString(), s: sid(), e: name, d: detail || "" };
    var a = load(); a.push(ev); save(a);
    if (ENDPOINT) {
      try { fetch(ENDPOINT, { method: "POST", mode: "no-cors", headers: { "Content-Type": "text/plain" }, body: JSON.stringify(ev) }); } catch (e) {}
    }
  }
  window.refugioTrack = track;

  /* ---------- Captura de eventos ---------- */
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (el) {
      var d = el.dataset, v;
      switch (d.action) {
        case "go": track("tab", d.tab); break;
        case "mood": track("animo", MOODS[+d.i]); break;
        case "signal": track("semaforo", d.k); break;
        case "clearSignal": track("semaforo", "no_usar"); break;
        case "react": track("reaccion", d.k); break;
        case "like": track("me_gusta"); break;
        case "sendComment": track("comentario", d.text); break;
        case "quickCita": track("cita_confirmar", "un_toque"); break;
        case "publish":
          v = document.getElementById("postText");
          if (v && v.value.trim()) track("publicacion"); break;
        case "survey": track("encuesta", MOODS[+d.i]); break;
        case "cita": track("cita_abrir"); break;
        case "gustos": track("gustos_abrir"); break;
        case "addGusto": track("gusto_agregar"); break;
        case "psiApprove": track("psi_aprobar"); break;
        case "psiReject": track("psi_rechazar"); break;
        case "confirmCita": track("cita_confirmar"); break;
        case "cancelCita": track("cita_cancelar"); break;
        case "chat": track("chat_abrir"); break;
        case "pause": track("pausa"); break;
        case "saveDiary": track("diario_guardar"); break;
        case "guest": track("ingreso", "invitado"); break;
        case "logout": track("cerrar_sesion"); break;
      }
    }
    if (e.target.closest("#chatSend")) {
      v = document.getElementById("chatText");
      if (v && v.value.trim()) track("chat_mensaje");
    }
  }, true);

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target && e.target.id === "chatText" && e.target.value.trim()) track("chat_mensaje");
  }, true);

  document.addEventListener("submit", function (e) {
    var f = e.target.closest && e.target.closest('form[data-form="auth"]');
    if (!f) return;
    var btn = f.querySelector('button[type="submit"]');
    track("ingreso", btn && /crear/i.test(btn.textContent) ? "registro" : "login");
  }, true);

  track("sesion_inicio");

  /* ---------- Resumen por hipótesis ---------- */
  function summary() {
    var all = load(), by = {};
    all.forEach(function (x) { (by[x.s] = by[x.s] || []).push(x); });
    var ids = Object.keys(by), n = ids.length;
    function has(fn) { return ids.filter(function (s) { return by[s].some(fn); }).length; }
    function is(name, det) { return function (x) { return x.e === name && (det === undefined || x.d === det); }; }
    var rojo = has(is("semaforo", "red"));
    var rows = [
      ["H1 · Usa «Yo también» o «Ánimo»", has(is("reaccion")), n],
      ["H2 · Comenta o publica", has(function (x) { return x.e === "comentario" || x.e === "publicacion"; }), n],
      ["H2 · Encuesta: 😐 o mejor", has(function (x) { return x.e === "encuesta" && x.d !== "Muy mal" && x.d !== "Mal"; }), has(is("encuesta"))],
      ["H3 · Elige un color del semáforo", has(function (x) { return x.e === "semaforo" && x.d !== "no_usar"; }), n],
      ["H4 · Confirma cita", has(is("cita_confirmar")), n],
      ["H4 · Confirma cita (de quienes marcaron rojo)", has(is("cita_confirmar")) && rojo ? ids.filter(function (s) { return by[s].some(is("semaforo", "red")) && by[s].some(is("cita_confirmar")); }).length : 0, rojo],
      ["H5 · Escribe en el Chat privado", has(is("chat_mensaje")), n]
    ];
    return { n: n, total: all.length, rows: rows };
  }

  function csv() {
    var lines = ["fecha,sesion,evento,detalle"];
    load().forEach(function (x) { lines.push([x.t, x.s, x.e, '"' + String(x.d).replace(/"/g, '""') + '"'].join(",")); });
    return lines.join("\n");
  }

  /* Vista agregada y anónima para el colegio (sin datos individuales) */
  function colegio() {
    var by = {};
    load().forEach(function (x) { (by[x.s] = by[x.s] || []).push(x); });
    var sem = { green: 0, yellow: 0, red: 0 }, ani = {}, citas = 0, alertas = 0;
    Object.keys(by).forEach(function (k) {
      var ev = by[k], ls = null, la = null;
      ev.forEach(function (x) {
        if (x.e === "semaforo" && x.d !== "no_usar") ls = x.d;
        if (x.e === "animo") la = x.d;
        if (x.e === "alerta_riesgo") alertas++;
      });
      if (ls && sem[ls] !== undefined) sem[ls]++;
      if (la) ani[la] = (ani[la] || 0) + 1;
      if (ev.some(function (x) { return x.e === "cita_confirmar"; })) citas++;
    });
    var am = MOODS.map(function (m) { return m + ": " + (ani[m] || 0); }).join(" · ");
    return "<h4 style='font-size:13px;margin:14px 0 4px'>Vista del colegio (datos anónimos)</h4>" +
      "<p style='line-height:1.6'>Semáforo: 🟢 " + sem.green + " · 🟡 " + sem.yellow + " · 🔴 " + sem.red +
      "<br>Colegios interesados (este dispositivo): " + (function () { try { return (JSON.parse(localStorage.getItem("refugio:leads")) || []).length; } catch (e) { return 0; } })() + "<br>Ánimo: " + am + "<br>Citas pedidas: " + citas + " · Alertas de riesgo: " + alertas + "</p>";
  }

  /* ---------- Panel de facilitador ---------- */
  function panel() {
    var old = document.getElementById("rf-panel"); if (old) { old.remove(); return; }
    var s = summary();
    var box = document.createElement("div");
    box.id = "rf-panel";
    box.setAttribute("role", "dialog");
    box.style.cssText = "position:fixed;inset:0;z-index:99;background:rgba(34,38,74,.45);display:flex;align-items:center;justify-content:center;padding:16px;font-family:Inter,system-ui,sans-serif";
    var rows = s.rows.map(function (r) {
      var pct = r[2] ? Math.round(100 * r[1] / r[2]) : 0;
      return "<tr><td style='padding:6px 4px'>" + r[0] + "</td><td style='text-align:right;padding:6px 4px;white-space:nowrap'>" + r[1] + "/" + r[2] + " (" + pct + " %)</td></tr>";
    }).join("");
    box.innerHTML =
      "<div style='background:#fff;color:#22264a;border-radius:20px;padding:20px;max-width:380px;width:100%;max-height:90vh;overflow:auto;font-size:13px'>" +
      "<h3 style='font-size:16px;margin-bottom:4px'>Panel de facilitador</h3>" +
      "<p style='color:#7b809e;margin-bottom:10px'>Este dispositivo: " + s.n + " sesión(es), " + s.total + " eventos.</p>" +
      "<table style='width:100%;border-collapse:collapse'>" + rows + "</table>" +
      colegio() +
      "<p style='color:#7b809e;font-size:11px;margin:10px 0'>Cada dispositivo guarda sus propios datos. Descarga el CSV de cada uno y súmalos, o configura ENDPOINT en tracking.js.</p>" +
      "<div style='display:flex;gap:8px'>" +
      "<button id='rf-dl' style='flex:1;padding:10px;border-radius:12px;background:#6b6ff2;color:#fff;font-weight:600'>Descargar CSV</button>" +
      "<button id='rf-clr' style='flex:1;padding:10px;border-radius:12px;background:#eceeff;color:#6b6ff2;font-weight:600'>Borrar datos</button>" +
      "<button id='rf-x' style='padding:10px 14px;border-radius:12px;background:#f1f2f9'>✕</button></div></div>";
    document.body.appendChild(box);
    box.querySelector("#rf-x").onclick = function () { box.remove(); };
    box.addEventListener("click", function (ev) { if (ev.target === box) box.remove(); });
    box.querySelector("#rf-dl").onclick = function () {
      var a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob(["\ufeff" + csv()], { type: "text/csv;charset=utf-8" }));
      a.download = "refugio_eventos_" + sid() + ".csv";
      a.click();
    };
    box.querySelector("#rf-clr").onclick = function () {
      if (confirm("¿Borrar los eventos guardados en este dispositivo?")) { save([]); box.remove(); }
    };
  }

  var taps = 0, timer;
  document.addEventListener("click", function (e) {
    if (!e.target.closest("#clock")) return;
    taps++; clearTimeout(timer); timer = setTimeout(function () { taps = 0; }, 1500);
    if (taps >= 5) { taps = 0; panel(); }
  });
  if (/[?&]facilitador=1/.test(location.search)) setTimeout(panel, 400);
})();
