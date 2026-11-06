# Watertoren Haamstede (Boswachterij Westerschouwen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:100. Generator: `scripts/generate-watertoren-haamstede.mjs`; uitvoeren met Node vanuit nederprint-landmarks (zonder `--scale` schrijft hij de STL op 1:100). Geen hoogteplakken: de kolom is een 96-hoekig prisma, het platform één omwenteling (rand en kegel), de wenteltrap 42 blokken als convexe omhullenden, en het gat in het dek is per trede weggesneden.

De toren staat op een duintop in de bossen ten noordwesten van Haamstede en is gebouwd in 1946 tot 1948 boven het ondergrondse schoonwaterreservoir van de N.V. Waterleiding Maatschappij Schouwen-Duiveland. Het is geen klassieke watertoren: de betonnen kolom was een standpijp die drukverschillen in het net opving, het reservoir ligt onder de duin. Boven op de kolom ligt een rond uitzichtplatform met een stalen hekwerk, bereikbaar via een betonnen wenteltrap van losse blokken rond de kolom; van 1965 tot 1984 zat er een brandwachtpost. Na betonrot is de toren in 1989 en 2000 gerestaureerd. Hij staat nog, als uitkijkpunt (luchtfoto en Commons-foto uit 2024).

## Bestanden

- `watertoren-haamstede.glb`: één node `building:watertoren-kolom-platform-en-wenteltrap`, op maaiveld.
- `watertoren-haamstede.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints` en `groundHeight`. Geen `replacesBuildings`: de toren is geen BAG-pand en ook geen BGT-object (pand, overig bouwwerk of kunstwerkdeel), dus PDOK heeft hier alleen terrein.
- `watertoren-haamstede-1-100.stl`: alles samen op 1:100 (5,7 × 5,7 × 9,1 cm).

## Oorsprong en oriëntatie

RD-oorsprong [38568.0, 412848.95] (51,692297 N, 3,703164 O), de as van de kolom: een cirkelfit op het platform in het AHN-DSM 0,5 m gaf [38567.95, 412848.95] met een straal van 2,7 tot 2,9 m; op de luchtfoto (8 cm) ligt de cirkel 0,2 m oostelijker en een stuk noordelijker, door de scheefstand van de foto. De toren is rond: +X wijst naar het oosten, +Y naar het noorden (`xAxis` [1, 0]); hoeken in deze README tellen linksom vanaf het oosten. De coördinaten in de opdracht (en op Wikipedia) liggen 27 m oostelijker, op het pad aan de voet van de duin.

`groundHeight` 75,84 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 4 m van de as (oost 75,84, noord 76,03, west 76,14, zuid 76,08; gemeten 2026-11-06). Het AHN-DTM ligt op die punten 44,05 tot 44,16 m lager, dus ellipsoïdisch is hier NAP + 44,1 en z = 0 ligt op NAP +31,74 (AHN-DTM rond de voet 31,6 tot 32,1). `groundOffsetMetres` is -0,1.

## Onderdeel `building:watertoren-kolom-platform-en-wenteltrap`

Hoogtes boven z = 0 (NAP +31,74).

- Kolom: doorsnede 1,45 m, van de onderkant tot in het platform.
- Platform: doorsnede 5,7 m (luchtfoto), dek op 8,78 m (AHN-DSM NAP +40,52, mediaan van 90 cellen binnen de rand), verticale rand van 0,5 m (8,28 tot 8,78). Daaronder loopt een kegel van 50 graden naar de kolom, die hij op 5,75 m raakt.
- Gat in het dek: van de kolom tot 1,77 m van de as, van 87 tot 145 graden (noordnoordwest), per trede weggesneden tot de bovenkant van die trede, zodat de treden de bodem van het gat zijn.
- Wenteltrap: 42 blokken van 0,209 m optrede, buitenstraal 1,8 m, linksom klimmend over 300 graden: onderaan aan de westzuidwestkant (-155 graden), halverwege (4,5 m) aan de oostkant voor de kolom, bovenaan door het gat op het dek (145 graden). Elk blok heeft een vlakke bovenkant, een buitenkant van 1,0 m en daaronder een kraag van 50 graden naar de kolom.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Haamstede)): 1946 (in gebruik 1948), 12 m, "hoogste punt 36 meter boven NAP", standpijp boven een ondergronds reservoir, uitzichtplatform, brandwachtpost 1965 tot 1984, restauraties 1989 en 2000.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06): dek, hekwerk (tot NAP +41,3), maaiveld.
- PDOK-luchtfoto (Actueel_orthoHR, 8 cm): doorsnede van het platform, plaats van het gat, de duintrap aan de oostkant.
- PDOK BAG-WFS en BGT (2026-11-06): geen pand of bouwwerk op deze plek.
- PDOK-terrein (2026-11-06): maaiveld rond de voet.
- Foto's op Wikimedia Commons: "Haamstede Watertoren 6119.JPG" en "Watertoren Haamstede.jpg" (2024), allebei vanaf de duintrap aan de oostkant omhoog.

## Geschat en weggelaten

Gemeten tegen bron: het AHN zet het dek op NAP +40,52 en het hekwerk tot +41,3, dus 8,8 m boven het maaiveld op de duintop. Wikipedia noemt 12 m en een hoogste punt van NAP +36 m; dat past niet bij het AHN. Het model volgt het AHN.

Geschat uit de foto's: de doorsnede van de kolom (0,24 tot 0,25 keer het platform, 1,45 m), de dikte van de rand (0,5 m), het aantal treden, de draairichting, het begin en de draaihoek van de trap (300 graden; onzeker op circa 30 graden), en de breedte van de trap (1,07 m vanaf de kolom). De plaats van het gat komt uit DSM en luchtfoto, het begin ervan (87 graden) volgt uit waar de trap de kegel raakt.

Aangepast om zonder steun op 1:1000 te printen: in het echt is de onderkant van het platform vlak (met een balk eronder) en zijn de treden losse blokken van circa 0,2 m dik met een zaagtand eronder. Hier loopt onder het platform een kegel van 50 graden naar de kolom, en heeft de trap aan de buitenkant 1,0 m dikte met een kraag van 50 graden: dunner werd in de export als dun dragend deel tot de grond opgevuld. Het gat begint pas waar de trap de kegel raakt, zodat er geen doorgang tussen trap en kegel ontstaat.

Weggelaten: het stalen hekwerk rond het dek en de leuning van de trap (dunner dan 0,9 m), de balk en de randjes onder het platform, de smalle deur of luik onderaan de kolom, de rechte duintrap met hekken aan de oostkant (volgt het terrein; het PDOK-terrein is daar te grof om er overal boven te blijven) en de ingang van het reservoir onder aan de duin (een apart bouwwerk in de duinvoet, geen deel van de toren).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume met minder dan 0,01 % (splinters van samen 3 dm³ onder de buitenrand van de onderste treden); kegel, kraag en gat krijgen niets. In een tegelexport op 1:1000 (80 m, ondersteuning v2, 45 graden) staat het model op het PDOK-terrein (voet 0,1 mm onder het terrein, dek 8,78 mm erboven) en komt er geen ondersteuningsobject bij. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft PDOK hier alleen de duin; het model voegt aan elke kant de kolom, het platform en de wenteltrap toe, en het gat aan de noordnoordwestkant.

Controle-URL: http://localhost:3000/kaart/51.69230/3.70316/200/1x1/0
