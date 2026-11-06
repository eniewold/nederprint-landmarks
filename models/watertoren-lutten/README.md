# Watertoren Lutten (Lutten)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-lutten.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één vierkant prisma dat aan het eind taps wordt getrokken, het dak een prisma van de driehoek tussen de goten, de topgevels prisma's van hun gevelvlak, en panelen, consoles, portaal en nissen zijn losse bouwdelen.

De watertoren van Lutten (gemeente Hardenberg) is in 1932 gebouwd in de typische jarendertigstijl en is gemeentelijk monument. Volgens Wikipedia is hij 49,2 m hoog met een reservoir van 578 m³; het is de hoogste als watertoren gebouwde toren van Overijssel en een van de twee Nederlandse watertorens met een zadeldak. In 2006 ging hij buiten gebruik; sinds een verbouwing in 2014 is het een accommodatie met tien slaapkamers (BAG-status "Verbouwing pand"). Een vierkante bakstenen schacht die licht taps toeloopt, met een steil zadeldak tussen topgevels aan de noord- en zuidzijde en goten achter een borstwering aan de oost- en westzijde. Elke gevel heeft dezelfde opbouw: een licht vooruitspringend onderblok, een hoge verdiepte nis met een rondboog, een rij consoles met in het midden een hangende console op de kruin van de boog, en daarop een vooruitspringend paneel ter hoogte van het reservoir. Tegen de zuidgevel staat een portaal met een zadeldakje.

## Bestanden

- `watertoren-lutten.glb`: één node `building:bakstenen-schacht-met-nissen-consoles-panelen-portaal-en-zadeldak`, op maaiveld.
- `watertoren-lutten.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-lutten-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [233386.79, 514143.46] (52,60919 N, 6,54446 O), het hart van de top in het AHN-DSM: de nok ligt 0,44 m en het midden tussen de borstweringen circa 0,25 m oostelijk van het hart van BAG-pand 0160100001371261 (vierkant van 12,75 m), de topgevels liggen circa 0,5 m noordelijk; de oorsprong ligt 0,35 m oost en 0,3 m noord van het BAG-hart. Maaiveld AHN NAP +8,6 (DSM rondom 8,6; 3D BAG 8,41). Lokale +X is de normaal van de oostgevel (RD 4,72 graden, uit de BAG-randen; `xAxis` [0.99661, 0.08229]), +Y wijst naar het noorden en de nok loopt langs Y; de zuidgevel met het portaal is de voorkant (-Y). `groundHeight` 51,0 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` (oost 51,00, west 51,03, noord 51,09, zuid 51,01); het PDOK-pand begint op 50,84. Het model vervangt BAG-pand 0160100001371261; de buurpanden raken het model niet.

## Onderdeel `building:bakstenen-schacht-met-nissen-consoles-panelen-portaal-en-zadeldak`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Schacht: vierkant van 12,75 m op maaiveld (BAG), taps tot 12,0 m op de borstwering op 42,45 m (AHN NAP +51,05). Alle geveldelen lopen met de tapsheid mee.
- Borstwering 0,5 m dik aan de oost- en westzijde, daarachter een goot van 0,5 m breed op 42,1 m (AHN NAP +50,7).
- Zadeldak: twee vlakken van 53,4 graden van de goot op ±5,0 m tot de nok op 48,84 m (AHN NAP +57,44; vlakfit van het DSM 53,0 en 53,7 graden, rms 0,07 à 0,11 m).
- Topgevels noord en zuid: 0,6 m dik, 0,36 m boven het dakvlak, top op 49,2 m (AHN NAP +57,81 op de noordgevel; gelijk aan de hoogte op Wikipedia).
- Per gevel: onderblok van 4,6 m breed en 0,2 m diep tot 7,6 m; rondboognis van 3,4 m breed en 0,3 m diep van 7,6 m tot de kruin op 28,5 m, met drie spleetvensters (0,5 × 1,4 m op 10,1, 16,5 en 22,8 m) en een rond venster bovenin (als nis van 0,8 m op 26,4 m); zes consoles van 0,5 m (30,4 tot 32,5 m, onderzijde 63 graden) en een hangende console van 0,9 m tot 28,8 m; paneel van 7,6 m breed en 0,5 m diep van 31,8 m (schuine onderzijde naar 32,5 m) tot 42,1 m, op de topgevels met een lage punt tot 42,9 m; naast het paneel twee vensters boven elkaar (0,5 × 1,4 m op 34,6 en 39,6 m), naast het onderblok twee vensters op 5,85 m; in de topgevels een hoog venster (0,5 × 2,2 m op 43,2 m).
- Portaal tegen de zuidgevel: 4,1 m breed, 1,3 m diep, 1,2 m west van het midden, zadeldakje van 52 graden met de goot op 3,5 m en de nok op 6,1 m haaks op de gevel, deur van 1,4 × 2,3 m als nis.
- Vensters en deur zijn nissen van 0,3 à 0,4 m diep met een plafond van 56 graden; het plafond van de rondboognissen loopt naar binnen onder 72 graden op.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Lutten)): bouwjaar, stijl, gemeentelijk monument, hoogte 49,2 m, reservoir 578 m³, zadeldak, verbouwing in 2014.
- BAG-pand 0160100001371261 en 3D BAG (PDOK, 2026-11-06): vierkant van 12,75 m op RD 4,72 graden, maaiveld 8,41, nok 57,47.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): maaiveld NAP +8,6, borstwering +51,05, goot +50,7, dakvlakken van 53 graden, nok +57,44, topgevel +57,81, breedte van de top 12,0 à 12,1 m.
- Luchtfoto (PDOK, 2026-11-06): zadeldak met de nok noord-zuid, topgevel met de lage punt van het paneel, de toren hangt op de ortho circa 8 m naar het zuiden over.
- Foto's op Wikimedia Commons: "Overzicht watertoren - Lutten - 20350822 - RCE" (RCE, 1997, vanuit het zuidoosten: zuid- en oostgevel, onderblok, portaal, nis, consoles, paneel, vensters, tapsheid van 6 à 9 px per zijde over de hoogte) en "Watertoren Lutten" (2003, vanuit het zuidoosten: topgevel, paneel met lage punt, vensters naast het paneel, consoles op de oostgevel).

## Geschat en weggelaten

Geschat: de tapsheid (0,375 m per zijde, uit de verhouding tussen BAG-voet en AHN-top en uit de RCE-foto); alle maten van de geveldelen uit de twee foto's, geschaald op de gevelbreedte en de AHN-hoogte van de borstwering (de foto's zijn van dichtbij en van onderen genomen, dus hoogtes boven 25 m zijn op circa 1 m nauwkeurig); dat de noord-, oost- en westgevel dezelfde opbouw hebben als de zuidgevel (de oostgevel staat schuin op beide foto's, de noord- en westgevel op geen enkele); de plaats en maat van het portaal (alleen aan de zuidkant gezien), en dat de noordgevel geen portaal heeft; de lage punt van het paneel (na correctie voor het perspectief circa 0,8 m); de vensters als nissen van 0,5 m breed (in het echt circa 0,4 m).

Weggelaten: de rondbogen tussen de consoles en de getande verticale strook midden in het paneel (kleiner dan 0,9 m), de natuurstenen hoekblokken onder de consoles, de deklijsten van de borstweringen en topgevels, de schotelantenne, raamindelingen, en een laag uitspringend bouwdeel onderaan de oostgevel bij de zuidhoek dat op de RCE-foto van 1997 staat maar niet in het AHN (vermoedelijk verdwenen bij de verbouwing). Nieuwere vensters van de verbouwing in 2014 zijn niet bekend (geen recente foto's).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (120 × 120 m rond de toren) heeft geen ondersteuningsobject bij de toren en geen PDOK-pand meer op zijn plek. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (het BAG-vierkant geëxtrudeerd met een zadeldak tot 49,1 m) de tapsheid, de borstweringen met goten, de topgevels die boven het dak uitsteken, op elke gevel het onderblok, de hoge rondboognis met vensters, de consoles met de hangende console en het vooruitspringende paneel (op de topgevels met de lage punt en een hoog venster), en aan de zuidkant het portaal met zadeldakje en deur.

Controle-URL: http://localhost:3000/kaart/52.60919/6.54446/200/1x1/0
