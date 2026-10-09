# Slot Zuylen (Oud-Zuilen)

Model op ware grootte voor de landmarkcatalogus van NederPrint, printbaar op 1:1000 zonder externe steun. De drie bouwvleugels vormen een U rond het open voorplein. De omliggende poortgebouwen, tuin, slangenmuur, water en het voorplein blijven uit PDOK komen.

## Bestanden en plaatsing

- `slot-zuylen.glb`: meters, glTF Y omhoog, scherpe normalen vanaf 40°.
- `slot-zuylen.json`: catalogusmetadata en bronverwijzingen.
- `slot-zuylen-1-1000.stl`: millimeters, Z omhoog. Slot en losse toegangsbrug; bedoeld voor plaatsing op het terreinmodel.
- `slot-zuylen-grondplaat-1-1000.stl`: dezelfde geometrie met een 1 mm grondplaat voor een zelfstandige print.
- `../../scripts/generate-slot-zuylen.mjs`: reproduceerbare generator met prisma's, dakvlakken en gelede kappen; geen gestapelde AHN-hoogtelagen.

Oorsprong RD **(133493, 459926)**. Lokale +X loopt onder 30° ten opzichte van RD-oost: `[0.866025403784, 0.5]`; +Y is 90° linksom. De hoogtereferentie is het grachtwater, **NAP −0,34 m**, uit PDOK-water op ellipsoïdehoogte 42,936 m minus de lokale LoD2/AHN-offset van 43,274 m. De lader kiest de laagste watermeting bij `[-25,0]`, `[24,0]` en `[0,22]`. `groundHeight: 42.936` is de ellipsoïdehoogte voor de fallback, geen NAP-hoogte. Alle onderbouwen beginnen lokaal op −0,8 m onder water.

Vervangt alleen BAG-pand **0333100000015736**. De bijgebouwen hebben eigen BAG-panden en blijven staan. Het vrijwel vlakke dak aan het voorplein (AHN circa +14,2 tot +14,4 m) is een afzonderlijk licht hellend vlak vóór het steile achterdak, geen verzonnen rij dakkapellen.

## Bouwvormen

- Hoofd- en zijvleugels met afzonderlijke schilddakvlakken: nokken NAP +19,3 / +19,25 / +19,3 m. Binnengevels volgen de U-vorm van BAG.
- Rechthoekige achteruitbouw met middenrisaliet en eigen schilddak tot +17,0 m.
- Drie achtzijdige arkeltorens met steile spitsen, toppen +23,6 / +24,3 / +24,2 m. Hun onderkanten dragen op steile kragen die in de gevelhoek aansluiten.
- Westelijke achtkantige toren met een klokdak als gelede kap en verdikte pinakel tot +21,2 m.
- Negen dakkapellen op de zijvleugels en achterzijde, vier schoorstenen met gedragen kappen, omgaande gootlijsten op schuine kragen, de klassieke deurpartij met pilasters.
- Regelmatige gevelvensters en souterrainvensters als 0,35 m diepe blinde nissen; torenvensters als puntige nissen. Geen verborgen luchtkamers in overlappende bouwdelen.
- Terras aan de zuidwestgevel op +1,55 m met drie grove treden naar het water.
- De stenen toegangsbrug met drie bogen, kruin +1,7 m en licht aflopende landhoofden. De oorspronkelijke ronde bogen zijn drie printbare spitsbogen van circa 55°; het fijne ijzeren hek vervalt.

## Brugdek en BGT

De volledige actuele dekcontour komt uit overbruggingsdeel **G1904.7bcb115ebc064389a13bd207b3c72e96**. Op het dek ligt geen `wegdeel`, maar het actuele onbegroeidterreindeel **G1904.7f655726ff004a20befa6c61e393623a**, `relatieve_hoogteligging: 1`, `fysiek_voorkomen: gesloten verharding`, met exact dezelfde contour. Daarom heeft de eigen `road:erfbrug`-node uitsluitend `bgt_fysiekvoorkomen: gesloten verharding`; er is geen verzonnen `bgt_functie`. De node is een laag van **0,5 m**, afgesneden van `building:brugdragers`; de snijstrook loopt ruim boven en buiten het dek door. De aansluitende erven en het volledige voorplein worden niet vervangen.

`node scripts/replaces-terrain.mjs slot-zuylen --write` vindt één volledig bedekt BGT-overbruggingsdeel en neemt dat op in `replacesTerrain`. Het water blijft staan. Op 2068 verticale teststralen is de minimumdekdikte 0,49999999 m; nul samenvallende bovenvlakken tussen wegdek en constructie.

## Geschat en weggelaten

De spitsen steken boven de hoogste bemonsterde AHN-punten uit; hun uiteinden, klokdakprofiel en pinakel zijn op de schuine foto's geschat. Arkelkragen zijn steiler en gladder gemaakt voor de print. Breedte en plaats van vensters, dakkapellen, schoorsteenkappen, gootlijsten, deurdetails en terrasstappen zijn op foto's afgestemd en afgerond. Het kleine hekwerk, windvanen, vlaggenmasten, roeden, muurankers en het ornament op het klokdak zijn weggelaten. De brugbogen zijn puntig vereenvoudigd; het wegprofiel volgt de AHN-kruin en landhoofden.

## Controle

Generator: alle nodes en STL's `NoError`, ook na Float32-rondgang met gelijk genus en volumeafwijking <0,2%. Het slot is één positief component met genus 1; de brugconstructie is één positief component. De gecombineerde STL telt 3252 driehoeken, circa **10,42 cm³**, **52,2 × 49,0 × 25,4 mm** op 1:1000. Het losse slot en de brug zijn in de grondplaatversie verbonden; de GLB bevat geen eigen terreinplaat.

Alle dakvlakken stijgen, kragen zijn steil en bogen zijn spits; uitsluitend de 0,35 m diepe rechte vensternissen hebben een klein horizontaal plafond. De gezamenlijke 45°-overhangopvulling verandert het slotvolume **+0,0263%**; brugconstructie en dek veranderen niet. Een echte preview en 3MF van **120 × 120 mm op 1:1000**, 1 mm grondplaat en hoogteversterking 1, omvatten het hele slot én de brug. De vier renders zijn met dezelfde camera's naast de PDOK-reconstructie gezet en beoordeeld naast vier schuine foto's. Controlebeelden en exports blijven buiten beide repo's.

AHN-controle op 2470 hoge rastercellen: **76,9% binnen 1 m**, **86,7% binnen 2 m**, mediane absolute afwijking **0,37 m**. Dit ondersteunt de dakmaten; kleine spitsuiteinden en geveldetails blijven schattingen.

De permanente test in `tests/landmark-models.test.ts` controleert BAG- en terreinvervanging, open voorplein, torentoppen, terras, brugklasse, attributen, constructiehoogte en beide oppervlakken van het 0,5 m dek. De twee landmarktestbestanden slagen gezamenlijk: 307 tests.

Vier kanten ten opzichte van PDOK:

| Camera | Toegevoegde herkenbare vormen |
| --- | --- |
| −35°, hoogte 30° | Achtkantige torens met spitsen, achteruitbouw met vensters, schoorsteenkappen en driebogenbrug. |
| 55°, hoogte 30° | Open U-voorplein, klassieke ingang, vensterrijen en vrijwel vlakke voorste dakstrook. |
| 145°, hoogte 30° | Klokdak en pinakel op westhoek, terras met treden, zijgevelvensters en dakkapellen. |
| 235°, hoogte 30° | Achterste schilddak en risaliet, drie spitsen, gootlijsten en achterste vensterrijen. |

Controle-URL: [Slot Zuylen op de kaart](http://localhost:3063/kaart/52.12712548/5.07312733/240/1x1/0). Vergelijk met `?landmarks=0`. Kijk vooral naar de drie spitsen tegenover het klokdak, het lage voorste dak en de aansluiting van brug en terras.

## Bronnen

- [Rijksmonumentenregister 519611 — hoofdgebouw](https://monumentenregister.cultureelerfgoed.nl/monumenten/519611): U-plattegrond, schilddak, drie spitstorens en westelijk klokdak, vensters, achteruitbouw en terras.
- [Rijksmonumentenregister 519615 — brug](https://monumentenregister.cultureelerfgoed.nl/monumenten/519615): stenen brug met drie bogen.
- PDOK BAG WFS, AHN DSM/DTM 0,5 m WCS, actuele 8 cm luchtfoto en BGT OGC API; opgehaald 9 oktober 2026.
- [Wikimedia Commons — Slot Zuylen exterior](https://commons.wikimedia.org/wiki/Category:Slot_Zuylen_(exterior)): `Voor- en linker zijgevel - Zuilen - 20225985 - RCE.jpg`, `Rechter zijgevel - Zuilen - 20225983 - RCE.jpg`, `Linker zij- en achtergevel - Zuilen - 20225986 - RCE.jpg`, `Noord-zijde - Zuilen - 20225978 - RCE.jpg`; frontcontrole met `Vooraanzicht - Zuilen - 20225982 - RCE.jpg`. Historische details vergeleken met de actuele ortho.
