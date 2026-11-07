# Sint-Pauluskerk (Aldtsjerk)

Sint-Pauluskerk (Pauluskerk, Paulustsjerke) in Aldtsjerk (Oudkerk), gemeente Tytsjerksteradiel (Fryslân), rijksmonument 35669. Romaanse kerk uit de 12e eeuw van kloostermoppen met tufsteen, op een terp met kerkhof. De zware toren met zadeldak tussen twee versierde topgevels is uit het begin van de 13e eeuw; de westmuur van de toren is in 1721 opgehoogd. Het schip heeft een rondboogfries en 19e-eeuwse rondboogvensters, het vijfzijdig gesloten koor is 19e-eeuws, bepleisterd en okergeel. Het jaartal 1700 in de BAG en de Kanzo-taak hoort bij de herenbank van Sminia, niet bij het gebouw. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0737100000025600 (toren, schip en koor zijn één pand). Geen buurpand raakt de kerk (het dichtstbijzijnde ligt 17 m noordelijker).
- STL op 1:1000: circa 34,0 × 10,7 × 26,6 mm.
- Genereren: `node scripts/generate-sint-pauluskerk-aldtsjerk.mjs --components`.

## Oorsprong en oriëntatie

Oorsprong RD (188467,5; 586576), lat/lon 53,2646771 / 5,8887752, midden in het schip, op z = 0 = het laagste maaiveld rond de voet (oostkant, NAP circa +2,9 m). +X loopt langs het schip van west naar oost, onder −4,0 graden in RD (`xAxis` [0,99756; −0,06976]); +Y wijst naar het noorden. De lange gevels liggen in de BAG-contour onder −3,98 graden; de nokken van schip en toren in het AHN-DSM en de 3D BAG lopen evenwijdig. `groundHeight` 43,89 m (ellipsoïdisch) is de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de voet (oostkant bij het koor). De terp loopt naar de westkant op tot NAP +3,2 à +3,3 m (PDOK 44,2 tot 44,4 m) en zakt naar NAP +2,0 m aan de rand van het kerkhof; die terp zit in het PDOK-terrein en niet in het model. `groundOffsetMetres` −0,1, onderkant 1,0 m onder z = 0.

Het AHN ligt ten opzichte van de BAG-contour circa 0,4 m naar het zuiden verschoven (nokken van schip en toren, noordelijke dakrand); de plattegrond volgt de BAG, de hoogtes het AHN en de 3D BAG.

## Onderdelen

- **Schip en koor**: BAG-contour u = −12,43 tot 16,97, v = −5,0 tot 5,15 met de vijfzijdige koorsluiting. Zadeldak met helling 1,36 (53,7 graden; AHN zuid 1,39, noord 1,32, 3D BAG 1,30 tot 1,39), goot +6,75 m rondom (AHN 6,7 tot 7,0) en nok +13,65 m (AHN 13,6, 3D BAG 13,5 tot 13,8). Boven de koorsluiting gaat het dak over in vijf schilden met dezelfde helling (3D BAG 1,27 tot 1,48); de nok houdt op bij u = 10,7.
- **Gevels**: plint tot +0,8 m (0,12 m), gootlijsten van 0,25 m langs alle gevels met een goot. Zuidgevel: deur bij de toren met een venstertje erboven en drie rondboogvensters die naar het oosten groter worden; noordgevel: dezelfde vensters en het venstertje bij de toren; ingang in de westmuur van het schip ten noorden van de toren.
- **Koor**: het okergele deel begint op u = 7,0 met een recht travee met venster aan beide kanten; pilasters op de overgang naar het schip en op de vijf hoeken van de sluiting; rondboogvenster in de zuidoostzijde.
- **Toren**: 6,8 × 5,7 m (BAG en AHN), u = −16,6 tot −9,8; de oostmuur staat 2,6 m in het schip. Zadeldak west-oost met nok +24,4 m (AHN 24,3, 3D BAG 24,3 tot 24,5) en helling 1,65 (59 graden), goot +19,7 m (AHN 19,6 tot 20,0) met een fries als lijst. Topgevels west en oost met een muurafdekking 0,3 m boven het dak, hoekpinakels tot +21,3 m en een pinakel op elke top tot +25,6 m. Eén hoog spaarveld per zijde (op de oostzijde boven het schipdak), een rondboogvormig galmgat per zijde, twee vensters boven elkaar in de westzijde en in elke topgevel een galmvenster met een klein venster erboven.

## Geschat

- Plaats en maten van vensters, deuren, spaarvelden en galmgaten zijn uit de foto's geschat (zuid en zuidoost 2018 tot 2020, west en noordwest, oost); de vensters in de noordgevel zijn naar de zuidgevel aangenomen. De oude RCE-foto van de zuidgevel (20180313) laat een andere vensterindeling zien; het model volgt de huidige toestand.
- Het begin van het okergele koor (u = 7,0) is uit de foto's vanuit het zuidoosten geschat.
- Hoogte en maat van de pinakels (0,9 m in het vierkant, hoek 21,3 m, top 25,6 m) zijn uit de torenfoto's geschat; het AHN geeft op de nok een piek tot +25,2 m.
- De goot van schip en koor is rondom op één hoogte gezet (AHN zuid iets hoger dan noord).

## Weggelaten of vereenvoudigd

- Vensters, deuren en galmgaten zijn blinde nissen met een spitse top (58 graden) in plaats van rondbogen; spaarvelden hebben een plafond van 50 graden. Roeden, galmborden en de wijzerplaten op de zuid- en westzijde van de toren zijn weggelaten.
- Rondboogfries, visgraat- en siervelden in de topgevels, de lijsten van het koor en de regenpijpen (kleiner dan 0,9 m); het fries onder de torengoot en de gootlijsten staan erin als lijst.
- Het kruis op de koorschilden, de windwijzer op de toren, de schoorsteenpijp op het zuidelijke dakvlak en de grafmonumenten op het kerkhof (geen BAG-pand of kleiner dan 0,9 m).

## Controle

De generator controleert geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden; het resultaat is één gesloten component met genus 0. In `tests/landmark-models.test.ts` (webshop) staan catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 80 × 80 m bevat het model, zonder het PDOK-pand en zonder opvulling (zelfde volume als zonder steun). Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Pauluskerk (Oudkerk)](https://nl.wikipedia.org/wiki/Pauluskerk_(Oudkerk))
- [Rijksmonumentenregister 35669](https://monumentenregister.cultureelerfgoed.nl/monumenten/35669)
- [Wikidata Q3400952](https://www.wikidata.org/wiki/Q3400952) en [OpenStreetMap way 277506399](https://www.openstreetmap.org/way/277506399)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Pauluskerk,_Aldtsjerk) (20180612 Sint-Pauluskerk1/2 en torenspits; 20200902 Sint Pauluskerk1 tot 3; Paulustsjerke mei tsjerkhôf; Paulustsjerke fanút it noardwêst; RCE 20180286, 20180309, 20180312, 20180313)
- BAG pand 0737100000025600 en [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000025600) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
