# Bijdragen

Verbeteringen aan bestaande modellen en nieuwe landmarks zijn welkom via een
pull request. Lees eerst de afspraken hieronder; een bijdrage die er niet aan
voldoet, kan niet worden opgenomen.

## Toestemming voor gebruik van je bijdrage

Deze repo valt onder CC BY-NC-SA 4.0, maar de modellen worden ook gebruikt in
de commerciële dienst van NederPrint. Door een bijdrage in te dienen (code,
modellen, data of documentatie):

1. stel je je bijdrage beschikbaar onder dezelfde licentie als de repo
   (CC BY-NC-SA 4.0);
2. geef je Edward Niewold (NederPrint) daarnaast een wereldwijde,
   niet-exclusieve, kosteloze, eeuwigdurende en onherroepelijke toestemming om
   je bijdrage te gebruiken, aan te passen, te verveelvoudigen, openbaar te
   maken en in sublicentie te geven, ook voor commerciële doeleinden, zoals het
   verkopen van prints en 3D-modellen;
3. verklaar je dat je dat recht hebt: de bijdrage is je eigen werk, of is
   gebaseerd op bronnen waarvan de licentie dit toestaat (zie hieronder).

Je behoudt het auteursrecht op je eigen bijdrage. Ga je hier niet mee akkoord,
dien dan geen pull request in.

## Bronnen en materiaal van derden

- Gebruik alleen open data die hergebruik toestaat, zoals BAG, BGT en AHN
  (CC0) of de PDOK 3D Basisvoorziening (CC BY 4.0, met naamsvermelding in het
  script en in `sources`).
- Neem geen foto's, renders met foto's, of 3D-modellen van anderen op in de
  repo. Foto's mag je als referentie gebruiken; vermeld ze in `sources`.
- Neem geen materiaal over van modelplatforms of andere bronnen zonder open
  licentie: publiek zichtbaar is niet hetzelfde als vrij te gebruiken.

## Afspraken voor modellen

Het volledige stappenplan staat in [docs/handleiding.md](docs/handleiding.md).
In het kort:

- Eén map per landmark: `models/<slug>/` met `<slug>.json`, `<slug>.glb`,
  de STL's en een `README.md`, volgens het
  [catalogusformaat](docs/catalogus-formaat.md). Maak geen andere submappen in
  `models/`.
- Elk model wordt volledig gebouwd door `scripts/generate-<slug>.mjs` met
  manifold-3d. Vaste invoer (contouren, hoogtes) staat als constante in dat
  script, niet in een los bestand; een grote tabel komt in een functie onderaan
  het script.
- De uitvoer moet reproduceerbaar zijn: commit de bestanden die het script
  oplevert, en controleer dat `node scripts/generate-<slug>.mjs` daarna geen
  verschillen geeft.
- Het model is gesloten en printbaar op de schaal van de STL: onderdelen van
  minimaal 0,9 m op ware grootte en geen overhang boven 45 graden zonder
  ondersteuning.
- Beschrijf het model, de hoofdmaten, de controle en de bronnen in
  `models/<slug>/README.md`.
