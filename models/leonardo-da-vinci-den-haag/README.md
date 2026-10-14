# Leonardo da Vinci (Den Haag)

## Bestanden en plaatsing

`leonardo-da-vinci-den-haag.glb` in meters met Y omhoog, `leonardo-da-vinci-den-haag.json` voor de catalogus en `leonardo-da-vinci-den-haag-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-leonardo-da-vinci-den-haag.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [79510, 458940], X-as [0.689442574583905, 0.7243403456601851], Z=0 op NAP 8.7202 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 52.130884614879676 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100000268161.

## Bouwdelen, gemeten maten en aannames

Volledig Plaza Leonardo da Vinci op de gecorrigeerde locatie aan Palaceplein/Zwolsestraat, ruim een kilometer van de oude backlog-pin. Twee ongelijke doorlopende torens, gemeten hoofddaken NAP 85.284 en 65.744 m, lagere schouders rond 76.99 m, dakmachine van de lage toren 69.44 m, gouden dakbol 88.99 m en hoge witte pylon 95.55 m. De hoge toren is dus circa 87 m boven het straatmaaiveld, niet de geschatte 83 m uit de backlog. Lange eigen galerijvleugel (NAP 38.035 m) met per glasbay een doorlopende gebogen dakluifel tot circa 38.85 m, afgerond noordelijk pleingebouw (23.306 m), de gehele rij lagere stadsappartementen (20.8–23.46 m) en hun verhoogde eigen parkeerdek/onderbouw (circa 12.58 m). De paviljoenachtige uitsnede in het noordoostelijke pleingebouw blijft lager; de openbare Palaceplein-tuin voor de torens krijgt geen extra vloerplaat. Gevelas 46.414 graden uit de lange rechte straatgevel. Afzonderlijke dakvlakken en echte gebogen profielen, geen gestapelde DSM-lagen. Zeer smalle geometrienaden zijn met 8 cm overlap gesloten. Bronfoto's van eigenaar en installateur bepalen blind glasreliëf, arcadevelden en de ronde serres; vensterritme, serre-radii (2.35/2.0 m), nisdikte, boogprofiel van de luifels, bolprofiel en witte pylonvorm zijn schattingen. Straatmaaiveld NAP 8.7202 m uit DTM, PDOK-terreinpunten 52.130885/52.170277 m ellipsoïdisch; punten op het verhoogde hof zijn uitgesloten.

## Weggelaten

Het openbare plein, straatbestrating, tramrails, kunst en tuinmeubilair zijn bestaande terreindetails en worden niet als gebouwvloer toegevoegd. Ondergrondse parkeerwanden worden alleen vertegenwoordigd door de zichtbare eigen verhoogde onderbouw, niet door extra volumes onder straatniveau. Balkon- en serreglas is blind zodat geen onprintbare open raamframes ontstaan. Fijne kozijnen, dunne balustrades, vlaggenlijnen en losse dakventilatoren onder 0.9 m zijn vereenvoudigd. Naastgelegen Palace Promenade, Kurhaus, woningen en hotels blijven behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 36,512 driehoeken. Printcontrole per node: NoError, 1.38% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: volledige eigen stadsappartementen, boogprofielen op de galerijvleugel, gesloten glasvelden en de afgeronde hofwand; 55 graden: ongelijke torens met echte dakbol en witte pylonen, gemeten schouders en doorlopende afgeronde serres; 145 graden: gesloten balkonreliëf langs de hele lange vleugel, hoge winkelarcade en onderscheiden dakluifels per gevelbay; 235 graden: volledige binnenhofonderbouw met lagere dakvlakken, ronde serrebogen en blinde raamachterwanden zonder losse frames.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 280 bij 280 mm, 843 objecten, 216,494 driehoeken, 91.2 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0518100000268161, actuele orthoHR, AHN DSM/DTM 0.5 m en 3D BAG LoD2.2: hele complexvoetafdruk, hoofdhoogtes, gebogen serrecontouren, kroon, galerijwing en eigen stadsappartementen; 2026-10-14
- https://vvedavinci.nl/ (eigenaar: Plaza Leonardo da Vinci met twee torens, pleingebouw en stadsappartementen, Dam & Partners; vijf schuine fotos, alleen referentie)
- https://www.nelec.com/da-vinci-62-woningen-opgeleverd/ (installateur: project uit 1997 aan Zwolsestraat 7, fotos F-1406/F-1410 van torengevels, witte pylonen, dakbol en lange galerijvleugel; alleen referentie)
- https://www.skyscrapercenter.com/building/leonardo-da-vinci-i/5425 (CVU: hoge toren 87 m, 26 verdiepingen, 1997)
- https://vriesrobbe.nl/woning/s-gravenhage-zwolsestraat-7/ (makelaar: architect Cees Dam, serre en ligging aan Scheveningse kust)
