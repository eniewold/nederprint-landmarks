# De Nederlandsche Bank (Amsterdam)

## Bestanden en plaatsing

`de-nederlandsche-bank.glb` in meters met Y omhoog, `de-nederlandsche-bank.json` voor de catalogus en `de-nederlandsche-bank-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-de-nederlandsche-bank.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [121830, 485778], X-as [0.9698720152847468, 0.24361501178602252], Z=0 op NAP 2.05 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.192265 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012165684.

## Bouwdelen, gemeten maten en aannames

Twee zelfstandige gesloten nodes: de volledige hofvleugels met atrium, en de langgerekte hoofdtoren met de lage logistieke/receptiedelen. Beide staan op dezelfde vlakke voet, NAP 2.05 m; de gevelas is 14.1 graden uit BAG/3DBAG en de actuele ortho. De kaart en de preview houden de huidige westelijke stadstuin en oostpatio open. De ronde toren uit 1991 en zijn oude verbindingsbrug worden niet overgenomen uit de verouderde AHN4-/3DBAG-reconstructie. De actuele PDOK-tegel heeft die ronde toren al niet meer, maar geeft de hofruimten veel vlakker en dichter weer dan de foto's en de actuele luchtfoto.

De blijvende west-, oost-, zuid- en noordvleugels zijn doorlopende bouwvolumes op de gemeten dakniveaus: buitenste randen NAP 15.199 m, terugliggende bovenzones van de zijvleugels 19.131 m, diepe noordelijke hal 20.572 m en atrium 22.094 m. De dubbele hoge kaszaalglazing aan de westelijke Frederikspleinzijde, horizontale gevelbanden, terugliggende publieke plint en grote dak-/pergolaranden zijn uit de recente schuine foto's uitgewerkt. De kleine kozijnen en zonnepaneelframes zijn tot blinde nissen en minstens 0.9 m brede materiaalstroken vereenvoudigd. De zonnepanelen/pergola's zijn met de doorgaande dakvolumes samengevoegd; geen losse steiger- of laserresten.

Het oude hoofdtorendak ligt volgens 3DBAG/AHN4 op NAP 68.182 m. De direct bemonsterde AHN5-dakzone ligt rond 70.45 m, met twee kleinere koppen tot circa 74.15 en 73.55 m. De glazen kroon is als een terugliggend gesloten gevelvolume onder een bredere dakrand gemaakt. Exacte onderkant van de glasvloer (66.6 m), capdikte/overstek (circa 0.9–1.2 m) en capbovenkant (71.35 m) zijn uit de foto's na de renovatie geschat, circa 1 m verticale onzekerheid. Beide grote dak-/trapkoppen volgen de nieuwe meting en hun footprint in de actuele ortho; de oude omvangrijke installatiebovenbouw is niet teruggezet. AHN6 is gecontroleerd maar zijn huidige servicebereik omvat Amsterdam nog niet.

De logistieke laagbouw aan de torenvoet krijgt een gemeten/vlak gemaakte bovenzijde van NAP 10.05 m; de kleine oostelijke hofruimte 5.242 m. De openbare kade, het Frederikspark en de stadstuin blijven terreinelementen en worden geen landmarkplaat. Naastgelegen zelfstandige BAG-gebouwen blijven behouden.

Naast de gewone STL is `de-nederlandsche-bank-grondplaat-1-1000.stl` opgenomen: beide werkelijke bouwgroepen op een 1 mm dikke plaat, gecontroleerd als één verbonden manifold. De plaat staat uitsluitend in deze losse print-STL, nooit in de GLB of op de kaart.

## Weggelaten

De ontmantelde ronde satelliettoren, verbindingsbrug en oude installatiebovenbouw zijn bewust weggelaten omdat ze in de huidige situatie niet meer bestaan. Onzichtbare kelder/goudkluis, interieur, kunst in de hal, klein gevelschrift, losse kozijnroedes, glasbalustrades, vlaggenmast, dakantennes en individuele zonnepaneelprofielen kleiner dan 0.9 m zijn niet los uitgewerkt. De publieke kade-/park-/tuininrichting buiten de bouwvolumes is geen deel van deze building-landmark; de bestaande terreinlaag blijft zichtbaar. Het buitenkunstwerk en losse tuinmeubels zijn niet onderdeel van de BAG-bouwmassa. Vlakke binnenhoven worden niet gevuld met een fictief bouwdak.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 24,636 driehoeken. Printcontrole per node: NoError, 0.18% extra volume; NoError, 0.12% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: De oostelijke en zuidelijke hofvleugels krijgen raam-/plintbanden, een open patio en de eigen lage receptie-/logistieke bouwdelen aan de torenvoet.; 55 graden: De noordelijke hal, hoge kaszaalpuien, atriumkop en pergolaranden worden benoemde doorlopende bouwdelen; de stadstuin blijft open.; 145 graden: De langgerekte torenschijf toont doorlopende gevelbanden en de nieuwe glazen kroon met dakrand; oude raster-/laserfacetten verdwijnen.; 235 graden: De brede complete onderbouw houdt zijn lagere dakranden en terugliggende bovenzones, zonder de ontmantelde ronde toren of dichtgezet tuindek..

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 635 objecten, 273,082 driehoeken, 75.7 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.mecanoo.nl/Projects?project=282&t=2 (architect, renovatie2025)
- https://www.dnb.nl/over-ons/renovatie/ (gebouwbeheerder, heropening2025)
- https://www.pieters.net/projecten/de-nederlandsche-bank (constructeur, nieuwe kroon)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012165684 (TU Delft/3DGI CC BY4.0; AHN4 2020, blijvende vleugels)
- https://www.ahn.nl/dataroom (AHN5 DSM WCS, CC0; bouwfase2023)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4 DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actuele ortho)
- https://commons.wikimedia.org/wiki/File:De_Nederlandsche_Bank_(2025),_Westeinde_side.jpg (Erremm CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:De_Nederlandsche_Bank_(2025).jpg (Erremm CC BY-SA4.0)
