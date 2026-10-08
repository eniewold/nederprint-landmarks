# NederPrint-landmarks

Vereenvoudigde, gesloten 3D-modellen van herkenbare Nederlandse gebouwen en
bouwwerken: kerken, kastelen, bruggen, stadions, molens, musea en meer. Elk
model is gegeorefereerd in RD (EPSG:28992), zodat [NederPrint](https://nederprint.nl)
het op de juiste plek in een 3D-stadskaart kan zetten in plaats van de
automatische PDOK-reconstructie. Daarnaast is er per model een STL om het los te
printen.

## Indeling

```
models/<slug>/           één map per landmark
  <slug>.json            catalogusitem: naam, RD-positie, oriëntatie, bronnen
  <slug>.glb             model in meters, Y omhoog, één node per onderdeel
  <slug>-1-<schaal>.stl  printbestand in millimeters, Z omhoog
  README.md              beschrijving, maten, controle en bronnen
scripts/generate-<slug>.mjs   generator per model (manifold-3d)
scripts/efteling-kit.mjs      gedeelde bouwstenen voor de Efteling-modellen
docs/handleiding.md           hoe je een nieuw model maakt, ook met AI
docs/catalogus-formaat.md     het JSON-formaat
AGENTS.md                     korte instructies voor AI-assistenten
```

Waar de README van een model de kaart, de export of de preview noemt, gaat het
om de 3D-kaart en de printexport van [NederPrint](https://nederprint.nl).

## Modellen genereren

Elk model wordt volledig gebouwd door zijn eigen script: de maten staan in de
code, er wordt niets van internet opgehaald. De uitvoer is deterministisch, dus
opnieuw genereren geeft byte-voor-byte dezelfde bestanden.

```bash
npm install
node scripts/generate-domtoren.mjs              # één model, naar models/domtoren/
npm run generate                                # alle modellen
npm run generate -- --out /tmp/landmarks        # alle modellen naar een andere map
```

`--out` wijst de catalogusmap aan; elk script schrijft in `<out>/<slug>/`.
Zonder `--out` schrijft een script naar `models/`, ongeacht de map van waaruit
je het start. Node 20.11 of nieuwer is nodig.

## Een nieuw model maken

[docs/handleiding.md](docs/handleiding.md) beschrijft stap voor stap hoe je een
model maakt: bronnen (PDOK, BAG, BGT, AHN, 3D BAG), modelopbouw uit vlakken,
printbaarheid op 1:1000, bestanden en controle. De handleiding is geschreven
zodat een AI-assistent hem kan volgen; begin met de startprompt bovenin en vul
het bouwwerk en de plaats in. [AGENTS.md](AGENTS.md) bevat de kernregels voor
assistenten die dat bestand automatisch lezen.

## Bronnen

De modellen zijn vrij nagebouwd uit open data en openbare beschrijvingen:
plattegronden uit BAG en BGT, hoogtes uit AHN (alle drie CC0) en de
reconstructie van de abdij in `scripts/generate-lange-jan.mjs` uit de PDOK 3D
Basisvoorziening (CC BY 4.0, Kadaster). Alle invoer staat in de generators
zelf. Hoofdmaten komen uit onder meer Wikipedia, het Rijksmonumentenregister en
websites van de gebouwen zelf; foto's van Wikimedia Commons zijn alleen als
referentie gebruikt en zitten niet in deze repo. De bronnen per model staan in
`sources` in de JSON en in de README van elk model.

## Bijdragen

Pull requests met verbeteringen of nieuwe landmarks zijn welkom. Lees eerst
[CONTRIBUTING.md](CONTRIBUTING.md): daarin staan de afspraken over bronnen en
modellen, en de toestemming die je met een bijdrage geeft.

## Licentie

De modellen, de generatorscripts en de documentatie vallen onder
[Creative Commons Naamsvermelding-NietCommercieel-GelijkDelen 4.0 Internationaal (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.nl);
zie [LICENSE](LICENSE). Je mag ze gebruiken, aanpassen en delen voor
niet-commerciële doeleinden, met naamsvermelding (NederPrint-landmarks,
Edward Niewold) en onder dezelfde licentie voor wat je ervan afleidt.

Commercieel gebruik, zoals het verkopen van prints of modellen die van deze
repo zijn gemaakt, kan alleen met voorafgaande schriftelijke toestemming; neem
daarvoor contact op via [nederprint.nl](https://nederprint.nl).

De reconstructie van het abdijcomplex in `scripts/generate-lange-jan.mjs` is
afgeleid van de PDOK 3D Basisvoorziening, © Kadaster, onder
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.nl).
