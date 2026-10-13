# Schielandtoren (Rotterdam)

Woontoren van Pi de Bruijn / de Architekten Cie., 1996, met het volledige
eigen Beursplein-pand: winkels, garage, verlaagd binnendak, winkelpassage,
entreecanopy en lage noordelijke toegang. De scherpe hoeken zijn metalen
erkers; er is geen fictieve dakspits. Overige panden rond Beursplein,
Beurstraverse en het Schielandshuis blijven in PDOK behouden.

## Bestanden en plaatsing

`schielandtoren.glb`: twee building-nodes in meters, Y omhoog: het verbonden
hoofdcomplex en de werkelijk losse noordelijke lage toegang. Elk bouwdeel
is afzonderlijk gesloten. `schielandtoren.json`: plaatsing en vervangen
pand `0599100000702017`. `schielandtoren-1-1000.stl`: beide bouwdelen op
dezelfde vlakke printonderzijde, samen circa 76,4 × 108,1 × 101,8 mm.
De STL bevat twee afzonderlijke eilanden; er is geen fictieve verbindingsplaat.
Generator: `scripts/generate-schielandtoren.mjs`.

Oorsprong RD (92693, 437148), +X op 15,9°, z = 0 rond NAP +0,70 m,
onderzijde -1,2 m. Vier gecontroleerde straatpunten geven ellipsoïdisch
+44,25284 tot +45,43459 m; de laagste is terugvalhoogte. De voet loopt
onder de hogere straat bij de toren door; de lage Coolsingelzijde zweeft niet.

## Gemeten bouwdelen

Bakstenen hoofddak NAP +96,260 m, lift-/techniekkern +101,200 m en de hoge
zuidelijke erker +101,334 m. Het lokale AHN-maximum binnen de torenvoet is
circa +101,406 m. Het maximum van circa +107 m in de brede onderzoeksuitsnede
hoort bij een ander gebouw en is niet als torentop overgenomen. De eigenaar
publiceert 106 m, andere registraties circa 101 m; het model gebruikt de
gemeten daken, geen verlenging om een publicatiehoogte af te dwingen.

Het westelijke winkelblok heeft dak +20,115 m, binnendak +15,847 m,
zuidelijke winkelgevel gemiddeld +11,602 m. De garage heeft goten rond
+27,313 m en vier doorlopende dakbeuken tot circa +29,05 m. De oostelijke
aansluiting heeft niveaus +10,421 en +27,579 m. De passage heeft afzonderlijke
dakschalen op +15,346 en +19,829 m, elk 1 m dik, op aangesloten kolommen.
De ruimte onder deze daken is hol en heeft een open spitse entree.

De lagere metalen erker-/plintdaken liggen op +8,325 en circa +14,542 m.
Erkergeometrie boven die lagere daken is uit foto's aangevuld waar de
automatische reconstructie alleen het onderliggende dak ziet. Alle meetbare
dakinstallaties zijn als eigen bouwdelen opgenomen, waaronder +33,189 m op
de garage, +22,712/+23,173/+21,834/+20,966 m op de westelijke winkels en
+18,403/+19,386 m bij de passage. Een brede licht-/techniekvorm op het
binnendak eindigt rond +17,083 m. De noordelijke toegang eindigt circa
+5,453 m. Het model bestaat uit benoemde bouwprisma's, erkers, kolommen en
doorlopende dakprofielen, zonder stapeling van DSM-hoogtelagen.

## Geschat en vereenvoudigd

Vaste BAG-/3D BAG-contouren zijn circa 0,5–1 m vereenvoudigd. Het gebogen
zuidelijke winkeldak is gemiddeld weergegeven; plaatselijk circa 1–2 m
onzekerheid. De dakkerntip is tot vaste vlakken vereenvoudigd om numerieke
splinters in de printcorrectie te voorkomen. Hoogtes blijven gemeten.

De twee overstekende metalen erkers beginnen rond NAP +29,1 m; hun
aangesloten schuine onderschalen lopen van +25,1 naar +29,1 m. Startniveau
en contour hebben circa 1–2 m onzekerheid. Gewone vensters zijn circa
1,7 × 1,9 m met 3 m verdiepingsritme; glaserkervelden circa 2,5 × 2,25 m.
Vensters zijn 0,4 m diepe blinde nissen. Winkelpuien en kolomraster zijn
fotomaten; kolommen zijn 1 m dik en staan circa 5 m uit elkaar.

De vier garage-dakbeuken en lichte profilering volgen de foto en gemeten
band +27,3–29,1 m; de verdeling is geschat. De entreecanopy heeft een
geschatte gebogen contour van circa 26 × 14 m, top +5,8 m en dikte 0,9 m.
De spitse passage-entree is een printaanpassing van de geschatte glasentree.
De 45°-correctie verkleint de hogere ruimte onder de passage- en canopydaken.

Reclame, fijn kozijnwerk, dakrelings, glazen balustrades, zonnepanelen en
antenne-/installatieonderdelen dunner dan 0,9 m zijn weggelaten of samengevoegd.
Er is geen nieuwe terrein-, straat- of ondergrondse garageplaat.

## Controle

Generator, STL en opnieuw ingelezen GLB: `NoError`, 34.916 driehoeken,
één verbonden hoofdgebouw en één gesloten los toegangsbouwdeel. De
permanente test controleert twee plaatsingen uit één vervangen BAG-pand,
twaalf gemeten daken/techniekhoogtes, de hogere erkers, complete winkelplint,
de lage toegang en gesloten verbonden volumes vóór en na de printcorrectie.
Op beide passagecontrolepunten blijft in de print vier meter vrije
hoogte boven straat behouden.

De 45°-correctie voegt 2,451% volume toe aan het hoofdgebouw; de lage
toegang verandert niet. Op 1:1000 is geen afzonderlijk steunmateriaal nodig.
Vier aanzichten zijn naast dezelfde hoeken van de echte PDOK-reconstructie
en schuine eigenaar-/architectfoto's beoordeeld: gevelvelden, scherpe
glaserkers, hangende erkers, canopy, volledige lage vleugels, dakbeuken,
holle passage en afzonderlijke daktechniek verbeteren de automatische vorm.

GLTFLoader, kaart en volledige printpreview zijn gecontroleerd. De exacte
1:1000-export omvat de hele toren, eigen plint en lage toegang op 190 × 190 mm:
287 objecten, 124.602 driehoeken, 105,3 mm hoogte inclusief ondergrond.
Onderzoek, referentiefoto's, renders en export blijven buiten de repo.

## Bronnen

- [Van der Vorm Living](https://www.vormliving.nl/portfolio/schielandtoren/),
  eigenaar, architect en 32 woonlagen; buitenfoto's uitsluitend referentie,
  auteur niet bij de gebruikte buitenbeelden vermeld.
- [de Architekten Cie.-projectprofiel](https://architectenweb.nl/projecten/project.aspx?id=1040),
  Beursplein, winkels, garage, winkelpassage en metalen erkers; eigen foto's
  uitsluitend referentie, geen overgenomen tekeningen.
- [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0), CC0.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), CC0.
- [Luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702017),
  TU Delft/3DGI, CC BY 4.0.
- PDOK 3D Tiles: passende reconstructie en straathoogtes.
