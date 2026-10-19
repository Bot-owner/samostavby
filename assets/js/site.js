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
  var canAjax = !!(window.fetch && window.FormData && window.JSON);

  var forms = document.querySelectorAll("form[data-poptavka]");
  Array.prototype.forEach.call(forms, function (form) {
    var status = form.querySelector(".form-status");
    var button = form.querySelector("button[type=submit]");
    var label = button ? button.textContent : "";
    // potvrzení „Děkujeme…“ je hned za formulářem (<div class="form-done">)
    var done = form.nextElementSibling && form.nextElementSibling.classList.contains("form-done") ? form.nextElementSibling : null;
    var sending = false;

    function setSending(on) {
      sending = on;
      if (!button) return;
      button.disabled = on;
      button.textContent = on ? "Odesílám…" : label;
    }

    // Záloha: klasické odeslání formuláře (FormSubmit pak přesměruje na /dekujeme)
    function sendClassic() {
      HTMLFormElement.prototype.submit.call(form);
    }

    function showDone() {
      setSending(false);
      if (!done) { sendClassic(); return; }
      form.hidden = true;
      done.hidden = false;
      done.focus();
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
      if (!canAjax || !done) {
        setSending(true);
        return; // starý prohlížeč: klasické odeslání
      }
      event.preventDefault();
      if (sending) return;
      setSending(true);
      if (status) status.hidden = true;

      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });
      if (data._honey) { showDone(); return; } // vyplnil to robot – nic neposílat
      delete data._next;

      // Odeslání na pozadí, návštěvník zůstane na webu
      var url = form.action.replace("formsubmit.co/", "formsubmit.co/ajax/");
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          return res.json().catch(function () { return {}; }).then(function (json) {
            var ok = json.success === true || json.success === "true";
            if (res.ok && (ok || json.success === undefined)) showDone();
            else sendClassic();
          });
        })
        .catch(sendClassic);
    });

    // Tlačítko „Poslat další poptávku“ v potvrzení
    if (done) {
      var again = done.querySelector("[data-form-again]");
      if (again) {
        again.addEventListener("click", function () {
          form.reset();
          done.hidden = true;
          form.hidden = false;
          var first = form.querySelector("input:not([type=hidden]):not([tabindex='-1'])");
          if (first) first.focus();
        });
      }
    }

    // Po návratu tlačítkem Zpět znovu povolit odeslání
    window.addEventListener("pageshow", function () { setSending(false); });
  });
})();
