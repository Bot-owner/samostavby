# samostavby.cz

Web stavební firmy Samostavby (František Sádovský, DiS.). Je to obyčejný statický web: HTML stránky, jeden soubor se styly a pár řádků JavaScriptu. Běží zdarma na GitHub Pages na adrese https://samostavby.cz.

## Jak upravit text

1. Na GitHubu otevřete stránku, kterou chcete změnit (třeba `obklady.html`).
2. Klikněte na tužku (Edit this file).
3. Přepište text mezi značkami, například mezi `<p>` a `</p>`. Značky samotné nechte být.
4. Dole klikněte na **Commit changes**. Za minutu až dvě je změna na webu.

| Stránka | Soubor |
| --- | --- |
| Úvod (samostavby.cz/home) | `home.html` |
| Služby | `rekonstrukce.html`, `zednicke-prace.html`, `obklady.html`, `sadrokartony.html`, `zatepleni.html`, `pokladka-dlazby.html` |
| Realizace | `realizace.html` |
| Kontakt a formulář | `kontakt.html` |
| Ochrana osobních údajů | `ochrana-osobnich-udaju.html` |
| Poděkování po odeslání formuláře | `dekujeme.html` |

Soubor `index.html` jen přesměruje návštěvníky ze samostavby.cz na samostavby.cz/home, neupravujte ho.

Adresy stránek jsou bez koncovky: soubor `kontakt.html` je na webu jako samostavby.cz/kontakt. V odkazech mezi stránkami se proto píše `/kontakt`, ne `kontakt.html`.

Telefon, e-mail a adresa jsou na každé stránce (hlavička, kontakt, patička). Při jejich změně použijte hledání a nahrazení ve všech souborech.

Každá stránka má nahoře `<title>` a `<meta name="description">`. To je text, který se ukazuje ve výsledcích Googlu a Seznamu. Při úpravě služby je dobré upravit i tyhle dva řádky.

## Jak přidat realizaci

1. Fotky nahrajte do složky `assets/img/realizace/` (Add file → Upload files). Ideálně JPG o šířce kolem 1600 px, každá do 500 kB.
2. V `realizace.html` je v komentáři připravený vzor `<article class="project">`. Zkopírujte ho do `<div class="projects">` a upravte cestu k fotce, popis fotky (`alt`), název a obec s rokem.
3. Po přidání první realizace smažte blok `<div class="empty-state">`. Stejný blok je i na úvodní stránce (`home.html`) v sekci Realizace.

## Kontaktní formulář

Formulář posílá poptávky přes službu FormSubmit na `samostavby@gmail.com`. Po prvním odeslání přijde na tento e-mail aktivační zpráva od FormSubmit, kterou je potřeba jednou potvrdit. Do té doby poptávky nechodí.

## Barvy a písmo

Barvy jsou na začátku souboru `assets/css/site.css` (blok `:root`). Písmo Archivo je uložené přímo na webu v `assets/fonts/` (licence SIL OFL), takže web nenačítá nic od Googlu a nepotřebuje cookie lištu.

## Doména

Doména je u Wedosu. Na GitHub Pages ukazují čtyři A záznamy (185.199.108.153 až .111) a CNAME `www` → `bot-owner.github.io`. Záznamy pro e-mail (MX, imap, pop3, smtp, DKIM) zůstávají u Wedosu beze změny.
