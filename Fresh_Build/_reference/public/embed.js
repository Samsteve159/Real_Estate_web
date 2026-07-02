/**
 * Manifest Real Estate — embeddable widget loader.
 *
 * Drop one tag on any site (e.g. the WordPress theme), then a placeholder div
 * per tool:
 *
 *   <div data-manifest-embed="valuation"></div>
 *   <div data-manifest-embed="concierge"></div>
 *   <script src="https://YOUR-MANIFEST-HOST/embed.js" async></script>
 *
 * The script injects a responsive iframe pointing at this host's chrome-less
 * /embed/<tool> route. Because the iframe runs on the Manifest origin, its API
 * calls stay same-origin (no CORS) and its styles/fonts are isolated. The
 * valuation iframe auto-resizes via postMessage as its content grows.
 *
 * Optional attributes on the placeholder:
 *   data-height="640"   initial / fixed pixel height
 */
(function () {
  var script = document.currentScript;
  var origin = script ? new URL(script.src).origin : window.location.origin;

  function titleFor(tool) {
    return tool === "valuation"
      ? "Manifest Real Estate — instant home valuation"
      : "Manifest Real Estate — AI buyer concierge";
  }

  function mount(el) {
    var tool = el.getAttribute("data-manifest-embed");
    if (tool !== "valuation" && tool !== "concierge") return;
    if (el.getAttribute("data-mounted")) return;
    el.setAttribute("data-mounted", "1");

    var iframe = document.createElement("iframe");
    iframe.src = origin + "/embed/" + tool;
    iframe.title = titleFor(tool);
    iframe.loading = "lazy";
    iframe.style.cssText = "width:100%;border:0;display:block;background:transparent;";

    if (tool === "concierge") {
      // Fixed-height chat panel that fills the iframe.
      iframe.style.height = (el.getAttribute("data-height") || "560") + "px";
      iframe.style.maxHeight = "80vh";
      iframe.setAttribute("scrolling", "no");
    } else {
      // Grows with the form/result; height is then driven by postMessage below.
      iframe.style.height = (el.getAttribute("data-height") || "640") + "px";
      iframe.setAttribute("scrolling", "no");
    }

    el.appendChild(iframe);
    el._manifestIframe = iframe;
  }

  function mountAll() {
    var nodes = document.querySelectorAll("[data-manifest-embed]");
    for (var i = 0; i < nodes.length; i++) mount(nodes[i]);
  }

  // Resize the matching iframe when its embedded tool reports a new height.
  window.addEventListener("message", function (e) {
    if (e.origin !== origin) return;
    var data = e.data;
    if (!data || data.type !== "manifest-embed:height" || !data.height) return;
    var nodes = document.querySelectorAll("[data-manifest-embed]");
    for (var i = 0; i < nodes.length; i++) {
      var f = nodes[i]._manifestIframe;
      if (f && f.contentWindow === e.source) {
        f.style.height = data.height + "px";
      }
    }
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountAll);
  } else {
    mountAll();
  }
})();
