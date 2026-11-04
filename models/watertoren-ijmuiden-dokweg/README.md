# Watertoren Dokweg IJmuiden (IJmuiden)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-ijmuiden-dokweg.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de onderbouw is een achthoekig prisma met verdiepte vakken en nissen, de pijlers zijn radiale profielen (voet, console en lisene als vlakken), de onderkant van het reservoir is de omhullende van een achthoek en een cirkel, en het reservoir is een cilinder met randen.

De watertoren aan de Dokweg 35 is in 1914-1915 door Rijkswaterstaat gebouwd voor de haven en de vissersschepen van IJmuiden (rijksmonument 520707); in de jaren negentig is hij buiten gebruik geraakt. Volgens het register is hij 24,50 m hoog (Wikipedia: 24,25 m). De onderbouw is achthoekig en open: acht pijlers van gewapend beton rond een buizenkoker, op vier hoogtes met koppelbalken verbonden. Onderaan is de ruimte tot circa 3 m afgesloten (dienstlokalen, met deuren in de noordoost- en zuidmuur, een vierruits raam in het noordwesten en liggende ramen in de overige zijden); het bovenste deel van de onderbouw met de lekvloer is ook afgesloten, met een stolpraam in het midden van elke zijde, en aan de oostzijde uitgebouwd. Daarop rust een uitkragend cilindrisch reservoir van 11,25 m doorsnede en 600 m³ met een plat dak. De pijlers lopen als lisenen langs het reservoir omhoog, met een schuine console van de pijler naar de reservoirrand; tussen de lisenen rode baksteen met smalle ramen en bovenin kleine vierkante ramen. Aan de zuidwestkant staat een bedrijfspand (BAG 0453100000032585, 1994) op 0,3 m van de pijlervoeten.

## Bestanden

- `watertoren-ijmuiden-dokweg.glb`: één node `building:achtkante-onderbouw-pijlers-en-reservoir`, op het maaiveld.
- `watertoren-ijmuiden-dokweg.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-ijmuiden-dokweg-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [101145.46, 496882.48] (52,45705 N, 4,59488 O), het hart van het BAG-pand (cirkelfit op de zestien punten waar de pijlers de muren raken, straal 4,8 m). Maaiveld AHN-DTM NAP +4,45 (ring van 7 tot 12 m: +4,34 tot +4,58; 3D BAG +4,36). De pijlers staan in het BAG-pand op RD 15,75 + 45k graden (de acht paren meten 15,4 tot 16,1); lokale +X is de normaal van de oostgevel (RD -6,75 graden; `xAxis` [0.99307, -0.11754]) en de pijlers staan op 22,5 + 45k graden in het lokale stelsel. `groundHeight` 47,32 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 7,5 m van het hart aan de vrije kanten (47,32 tot 47,38); de punten liggen niet aan de zuidwestkant, waar het bedrijfspand staat. Het model vervangt BAG-pand 0453100000003509, zodat het PDOK-blok (de BAG-voetafdruk tot NAP +28,3) verdwijnt.

## Onderdeel `building:achtkante-onderbouw-pijlers-en-reservoir`

Achthoeken als apothema (hart tot gevelvlak) met de hoekpunten op de pijlers; hoogtes boven het maaiveld.

- Dienstlokalen: achthoek 4,45 m (BAG) tot 3,2 m. Deuren van 1,1 × 2,3 m als nis in de noordoost- en zuidmuur, een raam van 1,6 × 1,3 m in het noordwesten en ramen van 1,4 × 0,9 m in de overige muren, nissen van 0,3 tot 0,35 m.
- Pijlers: 0,9 m breed, radiaal tot 4,9 m van het hart, van de voet tot het reservoir. Voeten tot 6,05 m (BAG) tot 2,6 m hoog, met een bovenkant van 45 graden naar de pijler. Console onder 50 graden van de pijler (4,9 m op 16,25 m) naar de lisene (6,1 m op 17,7 m).
- Open onderbouw: koppelbalken van 7,95 tot 8,6 m en van 11,3 tot 12,1 m in het vlak van de muren (4,45 m). Tussen de pijlers en de balken diepe vakken van 1,3 m (3,2 tot 7,95, 8,6 tot 11,3 en 12,1 tot 13,85 m), met een plafond van 50 graden; in het echt zijn ze open.
- Lekvloer: vloerbalk 0,15 m voor de muren van 14,1 tot 14,8 m met een onderkant van 45 graden, muren tot 16,3 m, in elke zijde een stolpraam van 0,9 × 0,8 m (15,0 tot 15,8 m). Aan de oostzijde een uitbouw tussen de pijlers tot 5,5 m van het hart, 2,7 m breed, van 13,3 m (onderkant 50 graden naar de muur) tot het reservoir, met een raam aan de voorkant.
- Onderkant reservoir: van de achthoek (4,45 m op 16,3 m) naar de onderrand (straal 5,75 m op 17,9 m), 51 graden midden op een zijde.
- Reservoir: onderrand 5,75 m tot 18,4 m, mantel 5,625 m (register: 11,25 m), bovenrand 5,75 m van 24,35 tot 24,9 m met een onderkant van 50 graden. Acht lisenen van 1,1 m breed tot 6,1 m van het hart, van de console tot 24,9 m. Per vak tussen de lisenen een smal raam van 0,7 × 1,5 m (20,0 tot 21,5 m) en een klein raam van 0,7 × 0,65 m (22,6 tot 23,25 m), nissen van 0,3 en 0,25 m.
- Dak: plat op 23,85 m (AHN NAP +28,3), verdiept binnen een rand vanaf 4,75 m.

## Bronnen en maten

- [Rijksmonumentenregister 520707](https://monumentenregister.cultureelerfgoed.nl/monumenten/520707): bouwjaar, 24,50 m, acht pijlers rond een buizenkoker met koppelbalken op vier hoogtes, de dienstlokalen tot circa 3 m met ramen en deuren, de lekvloer met stolpramen en de uitbouw aan de oostzijde, het reservoir van 11,25 m en 600 m³ met smalle en kleine vierkante ramen, het platte dak.
- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(IJmuiden_Dokweg)): 1915, Rijkswaterstaat, 24,25 m, 600 m³.
- BAG-pand 0453100000003509 (PDOK, 2026-11-04): achthoekige muren met de pijlers als uitstekende voeten, hart en stand. 3D BAG: dak 28,3, maaiveld 4,36 (AHN5, 2022).
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-04): maaiveld NAP +4,45, dak NAP +28,25 tot +28,4 binnen 5 m van het hart, rand tot NAP +29,4 tussen 5,5 en 6,3 m. Luchtfoto: rond reservoir met groen dak en luiken.
- Foto's op Wikimedia Commons: "Exterieur OVERZICHT - IJmuiden - 20284889 - RCE" (1993, waterpas; schaal op de breedte van het reservoir: hoogtes van het reservoir (7,0 m), de lekvloer en de koppelbalken, verhouding van de pijlers tot het reservoir) en "Watertoren IJmuiden Dokweg" (pijlers, consoles, lekvloer met vloerbalk en ramen, uitbouw, ramen in het reservoir).

## Geschat en weggelaten

Geschat: de hoogtes van de koppelbalken, de lekvloer en de onderkant van het reservoir uit één foto uit 1993 (onzekerheid circa een halve meter); de dienstlokalen tot 3,2 m naar de omschrijving "tot ongeveer drie meter"; het buitenvlak van de pijlers (4,9 m) uit de verhouding van pijlers en reservoir op beide foto's; dat de pijlervoeten van het BAG-pand (tot 6,05 m) alleen tot 2,6 m reiken, want de onderkant is op geen enkele foto te zien; de pijlerbreedte (foto circa 0,8 m, BAG-voeten 0,55 m, hier 0,9 m om te printen); de breedte en diepte van de uitbouw; de plek van de deuren en ramen in de dienstlokalen naar het register; welke vakken van het reservoir ramen hebben (hier alle acht).

Weggelaten of aangepast: de onderbouw tussen de koppelbalken is open, maar staat als diepe vakken in het model, omdat een open vak onder een vlakke balk niet zonder steun te printen is; de buizenkoker in het hart valt daardoor weg. De onderkant van het reservoir en de consoles zijn schuin (51 en 50 graden) in plaats van vlak. De dakrand is 0,9 m dik (AHN circa 0,4 tot 0,5 m), anders verdikt de export hem; de kleine ramen bovenin zitten 0,3 m lager dan op de foto, zodat de nis onder het dak blijft. De smalle ramen zijn 0,7 in plaats van circa 0,5 m breed. Weggelaten: de stalen steektrap tussen de pijlers, de lage ring en de luiken op het dak (minder dan 0,3 m hoog), de regenpijpen en het hekwerk.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,003 % (randjes in de kleine raamnissen bovenin); vakken, uitbouw en consoles hebben een plafond of onderkant van 50 graden, de onderkant van het reservoir 51 graden, de nissen 63 graden. Via `createModelBundle` op een uitsnede van 80 m op 1:1000 staat het model compleet in de export, op het PDOK-maaiveld (47,32, de voet 0,4 m erin met `groundOffsetMetres` -0,1), en is de PDOK-reconstructie van het pand verborgen. Het bedrijfspand ernaast staat in PDOK op 8,0 m boven het maaiveld en in het AHN op 7,6 m: het heeft geen punten van de toren meegenomen. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de BAG-voetafdruk als blok tot 24 m, met acht vinnen over de volle hoogte) de dienstlokalen met deuren en ramen, de pijlervoeten, de pijlers met de diepe vakken tussen de koppelbalken, de lekvloer met vloerbalk en stolpramen, aan de oostzijde de uitbouw, de schuine onderkant met consoles, het bredere ronde reservoir met lisenen, ramen en randen, en het verdiepte dak.

Controle-URL: http://localhost:3000/kaart/52.45705/4.59488/200/1x1/0
