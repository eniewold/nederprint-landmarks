# Muzentoren (Den Haag)

## Bestanden en plaatsing

`muzentoren.glb` in meters met Y omhoog, `muzentoren.json` voor de catalogus en `muzentoren-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-muzentoren.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [81800.4, 455063.28], X-as [0.34054365626527733, 0.9402287052507367], Z=0 op NAP 0.7297000288963318 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.1981114093669 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100000269561.

## Bouwdelen, gemeten maten en aannames

Muzentoren van Rob Krier/Christoph Kohl, 2000, aan de Fluwelen Burgwal in De Resident. De achthoekige voet volgt het eigen BAG-pand. De gevels hebben blinde vensters, vaste verticale penanten, ronde oculi in de middenband en gesloten entreenissen. De hoofdas (70.09 graden) volgt de gemeten koperen nok, niet een BAG-omhullende. De hoofdschouder is NAP 59.417 m, lagere hoekschouders liggen rond 56.5 m en twee risalieten rond 32.5 m; deze zijn afzonderlijke continue volumes, zodat de hele voet niet tot een hoogte wordt gevuld. Acht echte schilddakvlakken sluiten aan op de koperen bovenrand (circa 63.3–64.0 m) en de nok 73.455505 m; AHN bevestigt de hellingen. Twee robuuste nokmasten tot geschatte NAP 78.45 m zijn vast en minimaal 0.9 m dik, omdat de bronfotografie wel dunne masten toont maar het AHN daarvan slechts enkele punten tot 75.161 m vastlegt. Alle dakvlakken zijn planvergelijkingen en er zijn geen hoogtelagen. DTM op gecontroleerde punten buiten alle BAG-panden geeft NAP 0.7297–1.0678 m; PDOK geeft 44.1981–44.4996 m ellipsoide, de oorsprong gebruikt het laagste geldige straatniveau met een 0.15 m verzonken plaatsing. De hoogte van de nok komt uit de meting; bandritme 3.35 m, vensterverdeling, oculi, entreevelden, koperen nissen en mastvorm zijn foto-afgeleide schattingen. De overgang rond de schouders is op 1:1000 vereenvoudigd; fijne diagonale sierstenen, dunne gevelroeden en exacte koperkleur zijn geen afzonderlijke geometrie.

## Weggelaten

De sculptuur Dubbelfiguur, alle omringende Sirius/Orion-panden, bestrating en trambaan blijven buiten dit eigen BAG-model. De zeer dunne oorspronkelijke dakmasten zijn tot robuuste vaste profielen vereenvoudigd. Submillimeter roeden, sierstenen en daknaadjes zijn niet los opgenomen. RoofSurface 162 heeft een kleine onbetrouwbare schuine glasrand rond 38–42 m (AHN wisselt daar circa 26–48 m); die is niet als een echt dak toegevoegd. Afgeronde gevelovergangen zijn op de gemeten achthoek vereenvoudigd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 9,548 driehoeken. Printcontrole per node: NoError, 0.05% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: regelmatige venstervelden, verschillende hoekschouders, koperen gevelnissen en twee vaste nokmasten; 55 graden: blind gevelreliëf en gesloten entrees, ronde oculi in de middenband, zonder dunne vrije gevelonderdelen; 145 graden: gevelvensters aan de pleinzijde, zichtbare kopergeleding, echte doorgaande nok en behouden lagere risalieten; 235 graden: voorzijde met gesloten blinde glasvelden en ronde oculi, scherpe continue schildvlakken en ondersteunde mastvoeten.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 130 bij 130 mm, 251 objecten, 43,284 driehoeken, 79.2 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0518100000269561, AHN DSM/DTM 0.5 m en actuele orthoHR, 3D BAG LoD2.2: exacte eigen voet, acht kapvlakken, schouders, nok en terrein; 2026-10-14
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000269561
- https://cksa.de/portfolio/the-hague-de-resident/ (architect: 17 kantoorverdiepingen, dakmachine onder koperen kap, donkere baksteen en terugliggende geveldelen)
- https://homepages.bluffton.edu/~sullivanm/netherlands/thehague/krier/muzentoren.html (Mary Ann Sullivan: oorspronkelijke schuine straat-/pleinfotos, uitsluitend lokale onderzoeksreferentie; geen fotos meegeleverd)
- https://www.architectuur.org/bouwwerk/312/Muzentoren.html (73 m zonder masten, 18 verdiepingen, koperen dak)
