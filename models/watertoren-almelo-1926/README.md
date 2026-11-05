# Watertoren Reggestraat (Almelo)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-almelo-1926.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: sokkel en reservoir zijn prisma's, de schacht een afgeknotte piramide met lisenen en hoekpenanten als eigen taps toelopende prisma's, de schuine onderkant, de kraagstukken en de lijsten zijn convexe omhullenden met een onderkant van 45 graden, de vensters en velden blinde nissen, het tentdak de omhullende van de gootlijst en de top, en het dakje van het hoge risaliet een schilddak uit vlakvergelijkingen.

De watertoren aan de Reggestraat 9 (rijksmonument 507700) is in 1926 gebouwd voor de Algemene Waterleiding Maatschappij Almelo, naar ontwerp van architect G. Halbertsma en ingenieur J. Buining, als kopie van een afgebroken toren uit 1916 in Velsen. Hij is 38,1 m hoog, van gewapend beton, met een reservoir van 750 m³, en staat midden in een woonwijk; sinds 2015 is er een plan om hem tot woning te verbouwen. Hij bestaat nog (luchtfoto, AHN, BAG-status "Pand in gebruik"). De plattegrond is vierkant: een hoge sokkel met aan de straatkant (oost) een dubbele deur boven een hardstenen trap van vijf treden, een taps toelopende schacht met hoekpenanten en lisenen rond verdiepte velden (de vensters in de schacht zijn in 1973 dichtgezet), kraagstukken onder het overstekende reservoir, per gevel een driezijdig middenrisaliet, verdiepte velden met smalle vensters, een lijst en een tentdak met leien. Het risaliet van de voorgevel is hoger en heeft een eigen klein schilddak.

Deze toren is niet de watertoren uit 1924 aan de Sluiskade (`watertoren-almelo-1924`) en ook niet die van spinnerij Twenthe uit 1914 (`watertoren-almelo-1914`).

## Bestanden

- `watertoren-almelo-1926.glb`: twee nodes, `building:sokkel-schacht-reservoir-risalieten-en-tentdak` (de toren) en `road:hardstenen-trap` (de trap voor de deur).
- `watertoren-almelo-1926.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-almelo-1926-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [242286.79, 485606.61] (52,35142 N, 6,66838 O), het hart van BAG-pand 0141100000008007 (12,0 × 12,0 m met vier risalieten: de omtrek van het reservoir), op maaiveld NAP +11,4 (AHN-DTM rond de toren 11,24 tot 11,68, mediaan 11,38; 3D BAG 11,38). Het hart van het tentdak in het AHN-DSM valt er binnen 0,3 m mee samen. Lokale +X wijst naar de voorgevel aan de Reggestraat (oost-zuidoost, RD-richting -21,16 graden, het gemiddelde van de BAG-gevels; `xAxis` [0.93258, -0.36097]), +Y naar het noordnoordoosten. `groundHeight` 54,5 is de terugval (NAP +11,4 plus een geoïdehoogte van circa 43,1 m, zoals bij de toren uit 1924); `groundOffsetMetres` is -0,1. Het model vervangt BAG-pand 0141100000008007, zodat het PDOK-blok verdwijnt; er staan geen andere panden onder of tegen het model.

## Onderdeel `building:sokkel-schacht-reservoir-risalieten-en-tentdak`

Maten als hele breedtes, hoogtes boven het maaiveld (NAP +11,4).

- Sokkel: 11,8 × 11,8 m tot 3,1 m, met een schuine bovenkant tot de lisenen op 3,3 m. In de oostgevel een dubbele deur van 1,6 m breed van 0,9 tot 3,0 m (nis van 0,3 m).
- Schacht: taps van 10,8 m (3,3 m) tot 9,8 m (20,1 m) tussen de lisenen, 1,7 graden. Hoekpenanten van 0,75 m per gevel en per gevel twee lisenen van 0,6 m (hart 1,75 m uit het midden, onder de randen van het risaliet), alle 0,3 m uit de schacht, zodat de velden ertussen verdiept liggen.
- Kraagstukken: elke lisene en hoekpenant eindigt in een kraagstuk met een onderkant van 45 graden tot de gevel van het reservoir op 20,9 m; daartussen loopt de onderkant van het reservoir onder 45 graden van de schacht (20,1 m) naar de gevel (21,2 m).
- Reservoir: 12,0 × 12,0 m van 21,2 tot 31,35 m. Per gevel twee verdiepte velden van 3,1 m (0,2 m diep, van 22,0 tot 30,6 m), met boven drie smalle vensters van 0,5 m (1,1 m uit elkaar, 29,05 tot 30,5 m) en daaronder een hoog venster van 0,5 m (24,2 tot 27,0 m), alle als nis van 0,3 m.
- Risalieten: per gevel een driezijdig middenrisaliet van 2,9 m aan de gevel, 1,2 m aan de voorkant en 0,87 m uit de gevel (BAG), met een onderkant van 45 graden die tot 19,3 m bij de schacht zakt en een hoog venster van 0,5 m in de voorkant. Noord, west en zuid zijn vlak op gootshoogte, met de lijst eromheen (AHN-DSM 31,3 m).
- Hoog risaliet aan de voorgevel (oost): loopt door tot 34,35 m (NAP +45,75; 3D BAG 45,5 tot 46,0) met een lijst en een schilddakje van 46 graden; de nok op 36,135 m loopt van 2,21 tot 5,41 m uit het hart en verdwijnt in het tentdak (AHN-DSM: nok 36,1 m van 2,3 tot 5,4 m). Boven het hoge venster nog een venstertje van 0,6 × 0,7 m.
- Lijst: 0,25 m overstek met een onderkant van 45 graden, bovenkant 31,35 m (NAP +42,75), 12,5 × 12,5 m.
- Tentdak: vier vlakken van 50 graden van de gootlijst tot de top op 38,75 m (NAP +50,15; AHN-DSM 50,1, 3D BAG 49,81; Wikipedia 38,10 m).

Alle nissen hebben een plafond dat naar binnen onder 63 graden oploopt.

## Onderdeel `road:hardstenen-trap`

De trap van vijf treden voor de deur (0,9 m hoog) als drie treden van 0,3 m, 2,4 m breed en 1,5 m diep, op de grond voor de oostgevel.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Almelo_Reggestraat)): bouwjaar, hoogte 38,10 m, reservoir 750 m³, rijksmonument 507700.
- [Rijksmonumentenregister 507700](https://monumentenregister.cultureelerfgoed.nl/monumenten/507700): architect, vierkante plattegrond, gewapend beton, hoge sokkel, taps toelopende schacht, lisenen met kraagstukken, driezijdige middenrisalieten, hoog risaliet met schilddakje aan de voorgevel, dubbele deur en trap van vijf treden aan de oostkant, dichtgezette vensters in de schacht, tentdak met leien.
- BAG-pand 0141100000008007 (PDOK, 2026-11-05): plattegrond van het reservoir en de risalieten, richting.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05), gelezen in het stelsel van de toren: top, dakhelling (1,24 per meter), goot, vlakke risalieten, nok en goten van het hoge risaliet, maaiveld. Luchtfoto voor de ligging en het dakje van het hoge risaliet.
- 3D BAG (3dbag.nl, CC BY 4.0, TU Delft 3D geoinformation en 3DGI), pand NL.IMBAG.Pand.0141100000008007, opgehaald 2026-11-05: maaiveld en goten van het hoge risaliet als controle (de reconstructie zelf is onnauwkeurig, RMSE 9 m).
- Foto's op Wikimedia Commons: "Watertoren Reggestraat Almelo 1926" (van het noorden, vrijwel frontaal; 32 px/m uit de breedte van het reservoir: hoogte van de onderkant van het reservoir, de vensters en de velden, de plaats van de lisenen), "2009 Watertoren Reggestraat Almelo" (van dichtbij: sokkel, schacht, velden) en "Overzicht watertoren - Almelo - 20351175 - RCE" (van het zuidoosten: kraagstukken, schuine onderkant, risalieten, hoog risaliet).

## Geschat en weggelaten

Geschat: de hoogte van de sokkel (3,1 m, uit de hoogte van het hek op de foto van dichtbij) en de plaats van de deur (0,9 tot 3,0 m); de breedtes van de schacht onder en boven (10,8 en 9,8 m) en daarmee de tapsheid; de breedte en het uitsteken van de lisenen en hoekpenanten; de onderkant van het reservoir (21,2 m) en alle vensterhoogtes uit de noordfoto (onzekerheid circa een halve meter); de diepte van de verdiepte velden (0,2 m); de lijst (0,25 m overstek); de helling van het dakje op het hoge risaliet en het venstertje erin; de trap als drie treden.

Weggelaten: de blauw geschilderde lijnen langs de velden en vensterassen (alleen kleur), de stalen kozijnen en roeden, de dichtgezette vensters in de schacht (niet meer zichtbaar), de kleine reliëfrand bovenin de velden van de schacht (kleiner dan 0,9 m), het hek en de bomen rond de toren.

## Controle

Twee gesloten NoError-nodes met elk één component en genus 0; ze raken elkaar zonder overlap. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet, en kloppen de doorsneden op dertien hoogtes. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK- en 3D BAG-reconstructie (een rechte kolom met het reservoir als voetafdruk tot de grond en een rafelig dak) op alle vier kanten de sokkel, de taps toelopende schacht met hoekpenanten, lisenen en verdiepte velden, de kraagstukken en de schuine onderkant onder het overstekende reservoir, de risalieten met hun schuine onderkant en venster, de verdiepte velden met vensters, de lijst en het gave tentdak; aan de voorkant (oost) daarnaast de deur, de trap en het hoge risaliet met zijn schilddakje.

Controle-URL: http://localhost:3000/kaart/52.35142/6.66838/200/1x1/0
