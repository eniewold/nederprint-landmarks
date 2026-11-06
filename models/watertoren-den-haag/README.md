# Watertoren Den Haag (Den Haag)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-den-haag.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: plint, schacht, reservoirzone, kroonlijst, balustrade en lantaarn zijn achtkante prisma's en hulls van achthoeken (planvlakken), de koepel is een hull van achthoeken op een elliptisch profiel, de risaliet bestaat uit blokken en hulls, de frontonlukarne en het tongewelf erachter zijn hulls van een elliptische boog; nissen, ingang en vensters zijn blinde nissen met een schuin plafond.

De watertoren aan de Pompstationsweg in de Oostduinen bij Scheveningen werd in 1874 gebouwd voor de Haagsche Duinwaterleiding (nu Dunea), naar ontwerp van architect L.A. (Bert) Brouwer en ingenieur Th. Stang. Eclectisch, met romaanse en renaissancemotieven; volgens Wikipedia 48,74 m hoog, met twee reservoirs van 1000 en 1200 m³, het eerste reservoir in Nederland in een bakstenen ommanteling. Eind twintigste eeuw gerestaureerd en nog in gebruik. Rijksmonument 477404. De toren staat er nog (BAG "Pand in gebruik", luchtfoto en AHN).

Een achtkante bakstenen toren op een plint met kroonlijst. Aan de zuidzijde loopt een risaliet over de hele hoogte: onderaan geschoorde hardstenen pijlers rond de ingang met een omlijst venster erboven, daarboven gele hoekpilasters met korinthische kapitelen, een dubbel venster en bovenaan een rondgebogen frontonlukarne met een golfmotief, met een tongewelf tot in de koepel. Op de schuine gevels hoge blinde nissen met een boog en zuiltjes, onder de reservoirzone een rondboogfries; de gestreepte reservoirzone kraagt licht uit tot de kroonlijst, waarop een balustrade rond een omloop staat. Daarbinnen een achtkante koperen koepel met een lantaarn.

## Bestanden

- `watertoren-den-haag.glb`: één node, `building:watertoren-schacht-risaliet-koepel-en-lantaarn`.
- `watertoren-den-haag.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-den-haag-1-1000.stl`: het model op 1:1000 (18,5 × 20,8 × 43,6 mm).

## Oorsprong en oriëntatie

RD-oorsprong [80991.852, 459331.937] (52,1172533 N, 4,3066435 O): het hart van de achthoek van BAG-pand 0518100000229416, met de kleinste kwadraten bepaald uit de zeven volle zijden (apothema 8,546 m, zijde 7,08 m; elke zijde wijkt minder dan 1 cm af), op het maaiveld: AHN-DTM NAP +6,85 (6,7 tot 7,1 tot 25 m van de toren; de toren staat op een vlak duinplateau, er is geen talud rond de voet). De top van de lantaarn in het AHN-DSM ligt binnen 0,3 m van dit punt.

De lokale X-as loopt langs de voorgevel, 14,33 graden rechtsom van RD-oost (`xAxis` [0.96889, -0.24751]); de voorzijde met de ingang wijst naar -Y (RD-richting -104,3 graden, zuid-zuidwest).

`groundSamplePoints` liggen op 10,5 m rond het hart en 13,5 m voor de risaliet; `groundHeight` 50,2 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (west 50,200, zuid 50,232, noordwest 50,266, noord 50,277, noordoost 50,353, oost 50,363; gemeten 2026-11-06). Het PDOK-pand staat op 50,19 met de top op 93,57 (een achtkante kolom met een afgeplatte top). `groundOffsetMetres` is −0,1. Geen buurpand raakt het model (het dichtstbijzijnde PDOK-pand, 0518100001644824, ligt 40 m oostelijk).

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +6,85); "apothema" is de afstand van het hart tot een gevelvlak.

- Plint: achthoek met apothema 8,546 m (BAG) tot 6,85 m; kroonlijst tot apothema 8,7 m van 6,85 tot 7,3 m met een onderkant steiler dan 45 graden, waterlijst naar de schacht tot 7,65 m.
- Schacht: apothema 8,35 m tot 25 m. Hoge blinde nissen met een spitse boog (spitsboog van 50 graden voor de ronde boog) van 7,65 tot 19,6 m, 0,35 m diep: één van 2,0 m breed in het midden van de twee gevels naast de risaliet, twee van 1,9 m (op 1,75 m uit het midden) op de vijf andere gevels. Rondboogfries van 23,3 tot 24,3 m: vijf boogjes van 0,9 m per gevel (behalve waar de risaliet ervoor staat), 0,2 m diep.
- Reservoirzone: kraagt van 24,6 tot 25,05 m uit tot apothema 8,75 m; recht tot 30,3 m.
- Kroonlijst: tot apothema 9,25 m (30,3 tot 30,85 m, onderkant 48 graden), bovenkant (omloop) op 31,0 m.
- Balustrade: achthoekige ring van apothema 7,95 tot 9,15 m van 31,0 tot 33,0 m (AHN-rand circa 33 m), per gevel twee panelen van 2,3 m als ondiepe nis (0,2 m). Boven de risaliet geen balustrade.
- Koepel: voet met apothema 7,25 m tot 31,6 m; achtkante koepel met elliptisch profiel z = 31,6 + 9,0 · √(1 − (r/7,1)²) tot de lantaarn op 40,1 m (AHN: apothema 6,25 m 35,6; 5,25 m 37,4; 4,25 m 38,7; 3,25 m 39,7).
- Lantaarn: achthoek met apothema 2,25 m tot 42,4 m, kap tot apothema 2,45 m op 42,65 m, lage piramide tot 43,35 m (AHN NAP +50,2).
- Risaliet: plint met de pijlers 8,52 m breed en 11,59 m voor het hart (BAG), geschoord naar 8,2 m breed en 11,2 m op 6,85 m, kroonlijst op 7,3 m en een waterlijst naar de risaliet. Tussen de pijlers een inham van 3,0 m breed tot 5,6 m met de deur (1,4 m, tot 2,7 m) en het venster in de omlijsting erboven (1,0 m, 3,4 tot 5,0 m). Daarboven een risaliet van 7,8 m breed met de voorkant op 10,3 m voor het hart (AHN), boven de kraag op 24,6 tot 24,9 m 8,1 m breed op 10,55 m; gele hoekpilasters (1,05 m breed, 0,2 m voor de gevel) tot de kapitelen van 18,7 tot 19,9 m (kraag van 0,3 m); dubbel venster (twee nissen van 0,9 m) van 11,1 tot 13,8 m; rondboogfries; kroonlijst tot 31,0 m.
- Frontonlukarne: elliptische boog van 7,9 m breed op de kroonlijst tot 35,25 m (AHN 35,2), 0,55 m dik, met een tongewelf van 7,5 m breed tot 35,1 m dat doorloopt tot in de koepel (AHN: 35 m in het midden, 33 m op 3 m uit het midden).

Nissen hebben een plafond dat naar binnen onder 56 graden oploopt.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Den_Haag)): 1874, L.A. Brouwer en Th. Stang, 48,74 m, 1000 en 1200 m³, achtkant, koperen koepel, rijksmonument 477404.
- BAG-pand 0518100000229416 (PDOK, 2026-11-06): achthoek met zijde 7,08 m en aan de zuidzijde de plint van de risaliet (8,52 m breed, 3,04 m voor de gevel), bouwjaar 1870 (BAG).
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +6,85, top van de lantaarn NAP +50,2 (43,35 m), koepelprofiel, rand van de balustrade circa NAP +39,9, frontonlukarne en tongewelf tot NAP +42,05, voorkant van de risaliet 10,3 m voor het hart, breedte 7,8 m.
- PDOK-luchtfoto (Actueel_orthoHR): achtkante koepel met acht vlakken, de lichte omloop en de risaliet aan de zuidzijde.
- Foto's op Wikimedia Commons (categorie "Watertoren (Den Haag)"): "Overzicht watertoren met ingangspartij - 's-Gravenhage - 20396134 - RCE.jpg" (bijna frontaal op de ingang), "Water tower The Hague 2020.jpg" (telelens), "Den Haag-Scheveningen, de watertoren RM477404 IMG 0122 2021-08-04 11.11.jpg", "Watertoren Den Haag P1290158.jpg", "Watertoren Den Haag P1290159.jpg" en "Exterieur WATERTOREN, BOVENSTE GEDEELTE - 's-Gravenhage - 20308612 - RCE.jpg".

## Geschat en weggelaten

Geschat: de hoogtes van de plintkroonlijst (7,3 m), de kapitelen (18,7 tot 19,9 m), het dubbele venster, de nissen (tot 19,6 m), het rondboogfries (23,3 tot 24,3 m), de kraag onder de reservoirzone (24,6 m) en de kroonlijst (30,3 tot 30,85 m) komen uit de RCE-foto 20396134 (0,035 m per pixel op de plint) en de telelensfoto van 2020, geschaald op het AHN; de uitkraging van de reservoirzone (0,4 m) en de kroonlijst (0,5 m), de dikte van de balustrade (in het echt dunner, 1,2 m zodat de export de panelen niet verdikt) en de schoring van de pijlers zijn van de foto's geschat. De hoogte van 48,74 m uit Wikipedia is in het AHN niet terug te vinden: de lantaarn staat op 43,35 m boven het maaiveld; het model volgt het AHN. Twee nissen per gevel op de vijf gevels achter en naast de toren en één op de twee gevels naast de risaliet is afgeleid uit foto's van drie kanten; de noordgevels zijn op geen enkele foto goed te zien. De ronde bogen staan als spitsbogen van 50 graden in het model, de lukarne als elliptische boog.

Weggelaten: de balusters (dunner dan 0,9 m), de zuiltjes in de nissen en het middelste zuiltje op de risaliet (circa 0,4 tot 0,6 m), de consoles onder de zuiltjes, de kleine rondboogvensters in de plint en boven de kapitelen (circa 0,5 m breed), de schijven in het rondboogfries, de lichte strepen in de reservoirzone (alleen kleur, geen reliëf), het golfmotief en de sluitsteen in de lukarne en de luiken in de lantaarn (kleiner dan 0,9 m).

## Controle

Eén gesloten NoError-node, één component, genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun (geen ondersteuningsobject) en zonder het PDOK-pand. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een gladde achtkante kolom met een afgeplatte top en een blok aan de zuidzijde) de plint met kroonlijst, de hoge nissen, het rondboogfries, de uitkragende reservoirzone met kroonlijst en balustrade, de achtkante koepel met lantaarn en aan de voorzijde de risaliet met pijlers, ingang, pilasters met kapitelen, dubbel venster en frontonlukarne.

Controle-URL: http://localhost:3000/kaart/52.11725/4.30664/200/1x1/0
