/* Общее для всех демо-сайтов.
   - demoSend(text): вместо настоящей отправки показывает, какое сообщение
     получил бы владелец бизнеса (номера в демо выдуманные).
   - лента «Beispiel von Schop Studio», если демо открыто отдельно, а не в
     просмотрщике на главной.
   - .rv → плавное появление при прокрутке. */
(function () {
  var css = document.createElement("style");
  css.textContent =
    ".sd-toast{position:fixed;left:12px;right:12px;bottom:calc(14px + env(safe-area-inset-bottom));z-index:9999;max-width:520px;margin:0 auto;" +
    "background:#111;color:#fff;border-radius:16px;padding:14px 16px;font:14px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif;" +
    "box-shadow:0 12px 40px rgba(0,0,0,.35);transform:translateY(140%);transition:transform .35s cubic-bezier(.2,.8,.2,1)}" +
    ".sd-toast.on{transform:none}.sd-toast b{display:block;margin-bottom:6px;color:#7CE0A3}" +
    ".sd-toast pre{white-space:pre-wrap;margin:0;font:inherit;color:#ddd;max-height:40vh;overflow:auto}" +
    ".sd-toast button{margin-top:10px;background:#2a2a2a;color:#fff;border:0;border-radius:10px;padding:8px 12px;font:700 13px system-ui;cursor:pointer}" +
    ".sd-rib{position:fixed;top:0;left:0;right:0;z-index:9998;display:block;box-sizing:border-box;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:7px 10px;" +
    "background:#C8552B;color:#fff;font:700 12.5px system-ui,-apple-system,Segoe UI,Roboto,sans-serif;text-decoration:none}" +
    ".rv{opacity:0;transform:translateY(22px);transition:opacity .7s ease,transform .7s ease}.rv.in{opacity:1;transform:none}" +
    "@media (prefers-reduced-motion:reduce){.rv{opacity:1;transform:none;transition:none}}";
  document.head.appendChild(css);

  var toast;
  window.demoSend = function (text, title) {
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "sd-toast";
      toast.innerHTML = "<b></b><pre></pre><button type=button>OK</button>";
      toast.querySelector("button").onclick = function () { toast.classList.remove("on"); };
      document.body.appendChild(toast);
    }
    toast.querySelector("b").textContent = title || "✓ So käme Ihre Anfrage per WhatsApp an:";
    toast.querySelector("pre").textContent = text;
    requestAnimationFrame(function () { toast.classList.add("on"); });
  };

  // ?n=Firmenname: демо показывается с названием клиента. Логотипы помечены
  // data-brand (там имя разбито на теги), в остальном тексте меняется полное
  // имя из <title> до « – » — короткие слова вроде «Morgenrot» не трогаем.
  var firm = (new URLSearchParams(location.search).get("n") || "").trim().slice(0, 60);
  if (firm) {
    var orig = document.title.split(" – ")[0];
    document.title = document.title.replace(orig, firm);
    document.querySelectorAll("[data-brand]").forEach(function (el) {
      el.textContent = el.dataset.brand === "upper" ? firm.toUpperCase() : firm;
      el.style.overflowWrap = "anywhere";
      // Огромный логотип рассчитан на 5 букв «KINGS» — длинное имя ужимаем.
      if (firm.length > 8 && parseFloat(getComputedStyle(el).fontSize) > 40) el.style.fontSize = "clamp(30px,10vw,48px)";
    });
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.indexOf(orig) >= 0) node.nodeValue = node.nodeValue.split(orig).join(firm);
    }
  }

  var inViewer = false;
  try { inViewer = window.top !== window.self; } catch (e) { inViewer = true; }
  if (!inViewer) {
    var r = document.createElement("a");
    r.className = "sd-rib";
    r.href = "../index.html#beispiele";
    r.textContent = "Nur ein Beispiel – alles anpassbar · Schop Studio →";
    document.body.appendChild(r);
    document.body.style.paddingTop = "32px";
    document.body.classList.add("sd-std"); // фиксированные шапки демо сдвигаются под ленту
  }

  function reveal() {
    var els = document.querySelectorAll(".rv");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -6% 0px" });
    els.forEach(function (e) { io.observe(e); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", reveal); else reveal();
})();
