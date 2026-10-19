// Samostavby – drobné skripty webu (web funguje i bez nich)
(function () {
  "use strict";

  // Předvyplnění služby ve formuláři podle odkazu, např. /kontakt?sluzba=obklady
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
  var canAjax = !!(window.fetch && window.FormData && window.URLSearchParams);

  var forms = document.querySelectorAll("form[data-poptavka]");
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    var label = button ? button.textContent : "";
    var box = form.parentNode;
    var done = box.querySelector(".form-done:not(.form-fail)"); // „Děkujeme, poptávka je odeslaná“
    var fail = box.querySelector(".form-fail");                // „Poptávku se nepodařilo odeslat“

    function show(el) {
      form.hidden = el !== form;
      if (done) done.hidden = el !== done;
      if (fail) fail.hidden = el !== fail;
      if (el && el !== form) el.focus();
    }

    // Klasické odeslání formuláře (FormSubmit pak přesměruje na /dekujeme)
    function sendClassic() {
      if (button) { button.disabled = true; button.textContent = "Odesílám…"; }
      HTMLFormElement.prototype.submit.call(form);
    }

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
      if (!canAjax || !done || !fail) {
        if (button) { button.disabled = true; button.textContent = "Odesílám…"; }
        return; // starý prohlížeč: klasické odeslání
      }
      event.preventDefault();

      var data = new URLSearchParams();
      new FormData(form).forEach(function (value, key) {
        if (key !== "_next") data.append(key, value);
      });

      // Potvrzení ukážeme hned, poptávka se dosílá na pozadí.
      show(done);
      if (data.get("_honey")) return; // vyplnil to robot – nic neposílat

      // Jednoduchý požadavek bez předběžného dotazu prohlížeče; keepalive
      // ho doručí, i když návštěvník mezitím stránku zavře.
      var url = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: data,
        keepalive: true
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) {
            var failed = !res.ok || json.success === false || json.success === "false";
            if (failed) show(fail);
          });
        })
        .catch(function () { show(fail); });
    });

    // „Poslat další poptávku“
    var again = done && done.querySelector("[data-form-again]");
    if (again) {
      again.addEventListener("click", function () {
        form.reset();
        show(form);
        var first = form.querySelector("input:not([type=hidden]):not([tabindex='-1'])");
        if (first) first.focus();
      });
    }

    // „Odeslat znovu“ po chybě: klasické odeslání s vyplněnými údaji
    var retry = fail && fail.querySelector("[data-form-retry]");
    if (retry) retry.addEventListener("click", sendClassic);

    // Po návratu tlačítkem Zpět znovu povolit odeslání
    window.addEventListener("pageshow", function () {
      if (button) { button.disabled = false; button.textContent = label; }
    });
  });
})();
