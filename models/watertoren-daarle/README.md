# Watertoren Daarle (Daarle)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-daarle.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is één prisma van de (gesymmetriseerde) BAG-plattegrond, de dakrand een achtkant met schuine onderzijde, het dak een achtkante piramide (convexe omhullende van de dakrand en de top) en de vensters zijn nissen.

De watertoren aan de Watertorenweg is in 1934 gebouwd naar ontwerp van Duecker & Co uit Duisburg (gemeentelijk monument). Volgens Wikipedia is hij 33,7 m hoog met een reservoir van 145 m³; in 2004 verkocht Vitens hem, in 2021 kwam er een vergunning om hem tot vijf appartementen te verbouwen (BAG-status "Verbouwing pand"). Op de luchtfoto en in het AHN (2021) is de toren nog onveranderd; het model volgt die vorm. Het is een kale betonnen schacht op een vierkant met diep teruggezette schuine hoeken: aan elke zijde een brede risaliet en in elke hoek een schuin vlak. In het zuidwestelijke hoekvlak loopt een kolom smalle trapvensters (louvres), bovenin elk hoekvlak zit een band vensters. De achtkante dakrand overspant de hoeken en draagt een vlak achtkant piramidedak.

## Bestanden

- `watertoren-daarle.glb`: één node `building:betonnen-schacht-met-risalieten-dakrand-en-achtkant-dak`, op maaiveld.
- `watertoren-daarle.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-daarle-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [234054.68, 493947.57] (52,42762 N, 6,54954 O), het hart van BAG-pand 0163100000529763 (gemiddelde van de zestien hoekpunten; de top in het AHN-DSM ligt erop). Maaiveld AHN-DTM NAP +14,9 (ring van 6 tot 9 m: 14,8 tot 15,1, mediaan 15,0; 3D BAG 14,8). Lokale +X is de normaal van de oostelijke risaliet (RD 9,23 graden, gewogen gemiddelde van de randen van het BAG-pand; `xAxis` [0.98705, 0.1604]); in dat stelsel is de plattegrond op 0,01 m symmetrisch. `groundHeight` 57,65 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints` op 7 m van het hart (oost 57,65, noord 57,79, west 57,93, zuid 57,87); het PDOK-pand begint op 57,72. Het model vervangt BAG-pand 0163100000529763, zodat het PDOK-blok verdwijnt.

## Onderdeel `building:betonnen-schacht-met-risalieten-dakrand-en-achtkant-dak`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Schacht tot 32,2 m: vier risalieten van 3,58 m breed (±1,79) tot 4,535 m van het hart (9,07 m over de risalieten), het vierkant erachter tot 3,585 m, in elke hoek een schuin vlak van 2,54 m (x + y = 5,375), 0,95 m achter de risalieten.
- Openingen als nissen met een plafond van 56 graden: in elk schuin vlak een vensterband van 2,0 m breed van 29,6 tot 30,5 m (0,3 m diep); in het zuidwestvlak veertien trapvensters van 0,4 × 1,0 m om de 1,6 m, van 3,0 tot 24,8 m (0,3 m diep), en een deur van 1,2 m breed tot 2,3 m (0,4 m diep).
- Dakrand: overspant de teruggezette hoeken met een onderzijde van 30,8 m bij het schuine vlak naar 32,2 m bij de omhullende achthoek (26 graden uit het lood), en steekt 0,1 m over de risalieten uit (onderzijde 45 graden) tot 32,9 m.
- Dak: achtkante piramide van de dakrand op 32,9 m tot de top op 34,8 m (circa 23 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Daarle)): bouwjaar, ontwerper, hoogte 33,7 m, reservoir 145 m³, verkoop in 2004.
- BAG-pand 0163100000529763 en 3D BAG (PDOK, 2026-11-05): plattegrond met zestien hoekpunten (58,6 m²), stand, maaiveld 14,8, dak tot NAP +49,73.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-05): maaiveld NAP +14,9, dakrand NAP +47,8 (32,9 m) zonder opstaande rand, top NAP +49,73 (34,8 m), het dak loopt gelijkmatig naar het midden op.
- Luchtfoto (PDOK, 2026-11-05): achtkant dak met de top in het midden.
- Foto op Wikimedia Commons: "Daarle Watertoren 3320" (4 mei 2008 om 13:35, zon in het zuiden, dus genomen vanuit het zuidwesten): risalieten, teruggezette hoekvlakken, de kolom trapvensters in het zuidwestvlak (circa 0,25 × 1,25 m om de 1,7 m, de bovenste tot circa 24,6 m), de vensterband onder de dakrand in het zuidwest- en het zuidoostvlak en de dakrand die de hoeken overspant.

## Geschat en weggelaten

Geschat: de hoogte en breedte van de vensterband (op de foto circa 0,6 m, hier 0,9 m) en dat hij in alle vier de hoekvlakken zit (gezien in twee); de maten en de afstand van de trapvensters uit één schuine foto (schaal uit de breedte van het hoekvlak), en dat ze alleen in het zuidwestvlak zitten; de plaats en maat van de deur (de voet staat op de enige foto achter de struiken); de onderzijde van de dakrand boven de hoekvlakken (op de foto steiler; hier 26 graden uit het lood, want al bij 34 graden zet de export schoren tussen de risalieten); het overstek van 0,1 m; het dak als gladde achtkante piramide (de luchtfoto toont meer naden, het AHN geen graten).

Weggelaten: de horizontale stortnaden en de verticale voegen in het beton (kleiner dan 0,9 m), de raamstijlen in de vensterband, de antenne op het dak, en eventuele wijzigingen van de verbouwing tot appartementen na 2021 (niet te zien op de luchtfoto en zonder foto). De trapvensters zijn 0,4 m in plaats van circa 0,25 m breed en 1,0 in plaats van circa 1,25 m hoog, zodat hun plafonds elkaar achter het vlak niet raken.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: dakrand met een onderzijde van 26 en 45 graden, nissen met een plafond van 56 graden, dak verjongend. Controlebeelden blijven buiten de repo. In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (de zestienhoekige plattegrond geëxtrudeerd met een grove, scheve kap tot circa 35 m) de achtkante dakrand die de hoeken overspant, het regelmatige achtkante piramidedak, de vensterbanden onder de dakrand, en aan de zuidwestkant de kolom trapvensters en de deur.

Controle-URL: http://localhost:3000/kaart/52.42762/6.54954/200/1x1/0
