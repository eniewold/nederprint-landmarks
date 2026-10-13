# Central Park (Utrecht)

## Bestanden en plaatsing

`central-park-utrecht.glb` in meters met Y omhoog, `central-park-utrecht.json` voor de catalogus en `central-park-utrecht-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-central-park-utrecht.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135822, 455819], X-as [0.8660254, 0.5], Z=0 op NAP 2.8 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.8621 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000149581.

## Bouwdelen, gemeten maten en aannames

De toren staat op een gemeten voet van circa 48 bij 29 m langs de gevelas van 30 graden. Het hoofddak ligt op NAP 93.061 m; de grote installatiekern op 97.319 m en de kleine op 99.25 m. Deze vlakken komen uit 3DBAG op basis van AHN5 2023 en zijn rechtstreeks gecontroleerd met de AHN5-DSM. AHN4 toont op dezelfde torenlocatie nog een dak rond 50.4 m en op de noordelijke woonvleugel nog bouwgrond; die bouwfase is niet als actuele hoogte gebruikt.

De rechte hoofdschacht is onderbroken door een twee verdiepingen hoge glazen binnenparktaille. Het park is een gesloten terugliggend volume met een glooiende omtrek, blinde raamvelden en golvende plafondranden die doorlopen naar de boventoren. De gemeten randhoogte 50.782 m, architectplannen, 45m-parkbeschrijving en schuine foto's bepalen deze zone. De exacte binnenvloer, glascontour en plafondonderzijde zijn niet met de neerwaartse laserscan te meten en zijn geschat: glas circa 1–3 m terug, overgang van NAP circa 50.8 tot 57.6 m, lokaal circa 1–3 m onzekerheid. Het model heeft geen fictieve taps toelopende gevel of gestapelde groene terrassen zoals de backlog suggereerde. Het verticale gevelritme varieert subtiel in vensterbreedte en houdt alle vensters blind, 0.35 m diep.

De terugliggende publieke lobby op Forumniveau volgt de gebogen plattegrond van de architect, geschaald op de gemeten hoofdas en torenvoet. Glas is massief voor de print, met blinde kozijnnissen. Twee dakinstallatiekernen en grotere gemeten serviceblokken blijven zichtbaar; losse machineonderdelen zijn samengevoegd.

BAG 0344100000149581 omvat ook een noordelijke woonvleugel en de garage. Alle bovengrondse delen zijn meegenomen: drie aansluitende woonbeuken met daken op NAP 47.724, 47.843 en 47.84 m, een vereenvoudigde galerij-/trappenkop rond 49.4 m, venster- en balkonvelden als gesloten blinde gevelnissen, de echte Forum-garagedakvloer op 10.321 m en de onderscheidbare noordelijke lage landschaps-/servicedakzone op 11.119 m. Verdeling van nissen, galerijvorm en raamritme zijn geschat uit foto's en de actuele ortho, terwijl de bepalende dakvlakken gemeten zijn.

Het Forum is hier een bovengronds garagedak, geen dubbele terreinplaat: PDOK-terreinmonsters over het Forum liggen rond NAP 2–4 m, AHN5 meet 10.3–11.1 m op het dak. De automatische 3DBAG-patch van de zuidelijke ondergrondse footprint loopt foutief van NAP -0.36 tot 98.86 m; de vier PDOK-renders tonen daardoor een enorme schuine wand. Het model vervangt die wand door de vlakke gemeten garagevloer. De galerij-/gevelvolumes blijven één verbonden lichaam, zonder onzichtbare coplanare resthuiden bij de lobby. De zelfstandige utility-hut BAG 0344100000156688 en andere naastgelegen BAG-gebouwen blijven zichtbaar.

## Weggelaten

Glazen binnenpark en lobby zijn massief; interieurplanten, meubilair en interne loopbruggen zijn niet afzonderlijk uitgewerkt. De noordelijke balkon-/galerijgevel is tot blinde nissen en een gesloten kop vereenvoudigd, zonder dunne uitstekende glasbalustrades. Dunne roedes, logo's, onderhoudsgieken, dakhekjes, zonnepanelen en leidingen kleiner dan 0.9 m zijn samengevoegd of weggelaten. Ondergrondse garageonderdelen en de kleine noordelijke ondergrondse footprintuitloper krijgen geen fictieve bovenbouw. Straatmeubilair en openbare groenvakken buiten het BAG-dak blijven PDOK-terrein.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 24,172 driehoeken. Printcontrole per node: NoError, 0.49% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De fictieve hoge zuidelijke basementwand verdwijnt; de toren krijgt het juiste vlakke Forumniveau en de terugliggende golvende taille.; 55 graden: De rechte boventoren, twee gemeten installatiekernen en de volle gedeelde woonvleugel zijn zichtbaar; gevelbanden vervangen gerafelde PDOK-facetten.; 145 graden: De noordelijke drie woonbeuken blijven op hun gemeten lagere dakniveaus staan, met galerij-/trappenkop en de lage daken rond het Forum.; 235 graden: Gebogen lobby, verticale gevelvelden en de glazen taille sluiten aan op het vlakke garagedak; naastgelegen zelfstandige gebouwen blijven behouden..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 381 objecten, 174,540 driehoeken, 99.5 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://groupa.nl/nl/projecten/central-park-utrecht-nl/ (architect, ontwerp en plannen)
- https://groupa.nl/news/straight-building-curvy-edges/ (architect, taille en gebogen plint)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000149581 (TU Delft/3DGI CC BY4.0; AHN5 2023)
- https://www.ahn.nl/dataroom (AHN5 DSM WCS Ellipsis Drive; CC0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0; hier bouwfase)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Hoogebouw_aan_het_Jaarbeursplein_in_Utrecht.jpg (Choinowski CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Central_Park_Utrecht_under_construction.jpg (Choinowski CC BY-SA4.0, alleen gevel en taille als referentie)
