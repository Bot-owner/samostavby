// Samostavby – drobné skripty webu (web funguje i bez nich)
(function () {
  "use strict";

  // Předvyplnění služby ve formuláři podle odkazu, např. kontakt.html?sluzba=obklady
  try {
    var params = new URLSearchParams(window.location.search);
    var wanted = params.get("sluzba");
    var select = document.getElementById("sluzba");
    if (wanted && select) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].getAttribute("data-slug") === wanted) {
          select.selectedIndex = i;
          break;
        }
      }
    }
  } catch (e) { /* starší prohlížeč – nic se neděje */ }

  // Formulář odesílá službu FormSubmit jen ze skutečného webu.
  // V náhledu (jiná adresa) ukáže vysvětlení místo odeslání.
  var host = window.location.hostname;
  var live = /(^|\.)samostavby\.cz$/.test(host) || /\.github\.io$/.test(host) || host === "localhost" || host === "127.0.0.1";

  var forms = document.querySelectorAll("form[data-poptavka]");
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector(".form-status");
    form.addEventListener("submit", function (event) {
      if (!live) {
        event.preventDefault();
        if (status) {
          status.hidden = false;
          status.setAttribute("data-state", "info");
          status.textContent = "Tohle je náhled. Formulář začne odesílat poptávky po zveřejnění webu na samostavby.cz.";
        }
        return;
      }
      var button = form.querySelector("button[type=submit]");
      if (button) {
        button.disabled = true;
        button.setAttribute("data-label", button.textContent);
        button.textContent = "Odesílám…";
      }
    });
  });

  // Po návratu tlačítkem Zpět znovu povolit odeslání
  window.addEventListener("pageshow", function () {
    var buttons = document.querySelectorAll("form[data-poptavka] button[data-label]");
    Array.prototype.forEach.call(buttons, function (b) {
      b.disabled = false;
      b.textContent = b.getAttribute("data-label");
    });
  });
})();
