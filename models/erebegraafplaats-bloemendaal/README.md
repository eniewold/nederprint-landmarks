# Eerebegraafplaats Bloemendaal (Overveen)

Model van het ommuurde grafveld: de verlaagde graven, verhoogde omgang, vier gedenkplaten, urn, toegang en klokkenstoel. Het houten kruis op het hogere duin en het auditorium aan de duinvoet liggen buiten deze voetafdruk en zijn niet opgenomen.

## Bestanden en generatie

- `erebegraafplaats-bloemendaal.glb`: meters, Y omhoog; drie gesloten materiaalnodes.
- `erebegraafplaats-bloemendaal.json`: plaatsing en bronnen.
- `erebegraafplaats-bloemendaal-1-1000.stl`: één gesloten volume, circa 118,7 × 32,3 × 5,8 mm.
- `../../scripts/generate-erebegraafplaats-bloemendaal.mjs`: `node scripts/generate-erebegraafplaats-bloemendaal.mjs` vanuit de landmarksrepo.

## Plaatsing en bouwdelen

RD-oorsprong `[99804,490712]`, X-as `[0.3924,0.9198]` langs het grafveld naar het noorden, Y naar de westmuur. De contour van de omgang komt uit BGT/ortho. Het BGT-groenveld `G0377.cfa0463095e849ddb0d21012a97b2ed9` wordt volledig vervangen; de omliggende duinen blijven PDOK-terrein.

Het modelvlak ligt 0,8 m onder de bemonsterde omgang; drie grondpunten langs de oostkant vermijden het ontbrekende PDOK-maaiveld binnen de graven. Terugvalhoogte is 56,61547 m ellipsoïdisch. AHN: omgang circa NAP 13,6 m, grafveld circa NAP 13,1 m, top klokkenstoel NAP 18,61 m. De urn is volgens de beheerder 2,5 m hoog.

`road:omgang-paden-grafvakken` bevat de omgang, lagere paden en randen. `vegetation:41-grafvakken` heeft 41 afzonderlijke vakken. `building:muren-gedenkplaten-urn-klokkenstoel-toegang` bevat de ommuring, vier platen, twee toegangsposten, urn en klokkenstoel. Prisma's, een omwentelingsprofiel en doorlopende dakvlakken; geen gestapelde hoogtelagen. De materiaalvolumes zijn onderling uitgesneden.

## Schattingen en vereenvoudiging

De 41 ongelijke vakken zijn handmatig uit de gedraaide ortho getekend; vakgrenzen en urnpositie zijn schattingen. Muurhoogtes zijn benaderd uit AHN en foto's; dikte 0,9 m. Grafranden zijn 0,25 m breed, laag reliëf zonder dragende functie. Urndiameter, sokkel en de klokkenstoelopstand komen uit foto's. De klokkenstoelvoet is 2,35 × 3,1 m rond de BGT-overkapping van circa 2,2 × 2,9 m.

De houten klokkenstoel is een gesloten opstand met een blinde nis van 0,35 m en een spitse bovenkant, met afgeschuinde dakonderkant. Het bovenprofiel volgt de AHN-top. De horizontale houten toegangsbalk, dunne hekken, vlaggenmast, letters en individuele grafstenen zijn weggelaten. Geen vrij hangende klok of balken op deze schaal.

## Controle

Kaart: `http://localhost:3000/kaart/52.40139/4.57611/350/1x1/0?size=160`. In deze sessie is dezelfde kaart via de lokale verse-catalogusproxy op poort 5188 bekeken. Een al draaiende dev-server kan herstart nodig hebben om de catalogus te vernieuwen.

Vier schuine renders (−35°, 55°, 145°, 235°, elevatie 30°) naast de PDOK-reconstructie en twee Commons-overzichtsfoto's gecontroleerd. Volledige preview-export: 160 × 160 m naar 160 × 160 mm, schaal 1:1000, geen uitsnede door het model. De vakken en paden blijven gescheiden; de klokkenstoel en urn vallen binnen de export. De 45°-controle voegt circa 0,0135% totaal volume toe (0,067% aan het gebouwdeel), zonder zichtbare opvulling van grafpaden of toegang. Doorsneden op 0,3, 0,8, 1,4 en 3 m blijven gelijk. Alle nodes en de gecombineerde STL zijn `NoError`; samen één volume. De permanente test controleert plaatsing, 41 vakken, vier platen, urn, klokkenstoel en materiaalvolumes na de printcontrole.

Nakijken op de kaart: aansluiting van de westmuur op het duin, de indeling van de 41 vakken en de geschatte urnpositie op het noordterras.

## Bronnen

- https://www.eerebegraafplaatsbloemendaal.eu/ontwerp-en-architectuur
- https://www.eerebegraafplaatsbloemendaal.eu/klokkenstoel
- https://www.eerebegraafplaatsbloemendaal.eu/urn
- https://www.eerebegraafplaatsbloemendaal.eu/kruis
- https://www.4en5mei.nl/oorlogsmonumenten/zoeken/1813/overveen-eerebegraafplaats
- https://commons.wikimedia.org/wiki/Category:Erebegraafplaats_Bloemendaal (overzicht naar klokkenstoel en overzicht naar urn)
- PDOK BGT OGC, actuele HR-ortho en AHN DSM/DTM 0,5 m, geraadpleegd 11 oktober 2026.
