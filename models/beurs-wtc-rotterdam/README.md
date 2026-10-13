# Beurs World Trade Center (Rotterdam)

## Bestanden en plaatsing

`beurs-wtc-rotterdam.glb` in meters met Y omhoog, `beurs-wtc-rotterdam.json` voor de catalogus en `beurs-wtc-rotterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-beurs-wtc-rotterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92648, 437325], X-as [0.951, 0.309], Z=0 op NAP 0.4 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.82831 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000617974.

## Bouwdelen, gemeten maten en aannames

De gehele bovengrondse Beurs binnen BAG 0599100000617974 is één verbonden bouwdeel. De WTC-toren heeft twee doorlopende gebogen lange gevels en korte vlakke koppen, dak op NAP 87.476 m, installatieruimte 93.546 m en kop 93.884 m. De footprint is uit de 3DBAG-dakranden en ortho gemeten en met twee Béziercurven vereenvoudigd (circa 0.5 m). Vensters zijn blinde nissen van 0.3 m; kozijnen en vloerbanden blijven massief.

De beurshal is één doorlopend gebogen dwarsprofiel, geëxtrudeerd over de gemeten lengte van 82.5 m; geen stapeling van hoogtelagen. Het 90e-percentielprofiel in het AHN over de noordelijke 20 m geeft een kruin van NAP 17.19 m en lage randen 13.75–14.15 m. De profielen van twee andere blokken bevestigen de boog buiten de lasershadow van de toren binnen circa 0.2 m. Zeven historische Gusto-spanten zijn in het massieve halvolume opgenomen; ondiepe paneelnaden duiden de Thermolux-bekleding.

De Coolsingel- en Meent-vleugels zijn NAP 27.417/27.433 m; de binnenste westvleugel 23.857 m en Rodezandvleugel 20.192 m. Hun horizontale vensterbanden, de lage verbindingen rond de hal en de lager liggende zuid-/zuidoostvleugels blijven afzonderlijke benoemde volumes in de generator. De smalle Coolsingel-lichtcourt blijft open; de lage randkap is vereenvoudigd volgens dakranden 4.6–8.2 m. De hangbrug boven de hoekentree heeft NAP 22.688 m als bovenzijde en een printbare boogopening. Noordelijke trap-/liftkoppen staan op NAP 30.884/30.886 m; zuidoostelijke beheerderswoning 18.216 m. De ronde noordelijke trappartij heeft straal 5.5 m uit de ortho en bovenzijde 13.044 m.

De oude hoofdentree heeft zes circa 1.3 m brede pijlers, een vereenvoudigde brede trap van acht treden, de vergaderzaal met blinde ruitjesgevel, een gebogen dak tot NAP 23.85 m en de glazen ronde erker aan de Coolsingel (bovenzijde 21.306 m). De kloktoren is een massieve vierkante schacht met blinde detaillering en een gesloten bellstoelkap op NAP 42.397 m. Traphoogten, onderkant van de vergaderzaal, gevelritme, boog tussen dakranden en pijlerposities zijn uit schuine foto's geschat. De huidige BAG-contour, gemeten daken en foto's geven voorrang boven losse nominale hoogtemeldingen van circa 90–93 m.

## Weggelaten

Ondergronds souterrain, onzichtbaar halinterieur en interieurbeelden zijn niet afzonderlijk uitgewerkt. Fijne vlaggenmasten, antennes, klokwijzers, letters, losse geveltegels, spantstaven, dakleidingen en balustrades kleiner dan 0.9 m zijn weggelaten. Verspreide dakinstallaties zijn samengevoegd tot de gemeten grote koppen; schaduw-/glasruis op dakpatches is niet als fictieve hoogbouw gemodelleerd. De open belstoel is als gesloten grove kap vereenvoudigd. De openbare Coolsingel, Meent, Rodezand en Beursplein blijven PDOK-terrein en krijgen geen landmarkplaat; omliggende BAG-panden worden niet verborgen.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 39,888 driehoeken. Printcontrole per node: NoError, 0.98% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Lensgevel en halboog blijven doorlopend in plaats van de gerafelde vlakke PDOK-facetten; zuidoostelijke beheerdersvleugel en lage zuidplint hebben eigen dakhoogtes.; 55 graden: De oude Rodezand- en Meent-vleugels hebben horizontale gevelbanden, duidelijke trapkoppen en de ronde traptoren langs de hal.; 145 graden: De twee Coolsingel-vleugels houden hun open lichtcourt, met de lage kap en de hoge hangbrug boven de noordwestelijke entree.; 235 graden: De hoofdentree toont zes pijlers, brede trap, ruitjesgevel, gebogen vergaderzaalkap en ronde erker; de groene kloktoren is een gesloten printbaar volume..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 445 objecten, 193,094 driehoeken, 98.8 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://monumentenregister.cultureelerfgoed.nl/monumenten/513765 (RCE, Beurs en Kamer van Koophandel)
- https://groosman.com/beurs-wtc/ (architect)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000617974 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:Rotterdam_-_World_Trade_Center.jpg (Fred Romero CC BY2.0)
- https://commons.wikimedia.org/wiki/File:Beurs-World_Trade_Center.jpg (Edison McCullen CC BY-SA4.0)
