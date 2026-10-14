# Central Post (Rotterdam)

## Bestanden en plaatsing

`central-post-rotterdam.glb` in meters met Y omhoog, `central-post-rotterdam.json` voor de catalogus en `central-post-rotterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-central-post-rotterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92129, 437799], X-as [0.954285096977075, 0.2988978984326497], Z=0 op NAP -0.1 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.57521675 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000700780.

## Bouwdelen, gemeten maten en aannames

De eigen BAG-voetafdruk is geheel opgenomen, inclusief het westelijke trappenhuis en de oostelijke uitbouw. De X-as volgt de gemeten gevel met 17,3914 graden. DTM aan het Delftseplein ligt circa NAP -0,1 m; het spoor ligt hoger. 3D BAG/AHN leveren het hoofddak op NAP 53,136 m, westelijke kern 57,058 m, oostelijke kern 57,123 m en hoogste machinehuis 57,762 m. Afzonderlijke dakmachines zijn met hun gemeten contouren en dakhoogten vereenvoudigd tot gesloten bouwdelen. De lange gevels behouden zeven paren venstervelden van de oorspronkelijke dubbelhoge zalen; kantoorhoofden hebben het halve verdiepingsritme. De westelijke galerijstrook is een diepe blinde nis met doorlopende binnenwand. Venstermaat en -ritme, entreepuien, kleine 45-graden luifels en 22 uitstekende glas-in-betonkunstvensters zijn uit schuine foto's geschat. Hun reliëf is teruggebracht tot verbonden wigvormen met blinde glasnissen. Geen gestapelde hoogtekaartlagen: één doorlopende dragende massa met uitgeholde gevelvelden en afzonderlijke dakdelen. De backlogclaim van een nieuwe glazen opbouw tot 60 m is gecorrigeerd: volgens de eigenaar en KAAN zijn bij de renovatie interne tussenvloeren geplaatst in de bestaande hoge zalen. Alle holten in dit model zijn uitwendige blinde nissen, geen ingesloten kamers of doorgaande gaten.

## Weggelaten

Gevelkleuren, letters, de fijne tekening van het glas-in-betonkunstwerk, hekwerken, losse installatiedetails en interieurs zijn weggelaten. De buiten de eigen BAG-contour gelegen spoorvoorzieningen en naastliggende kantoren blijven PDOK. De kaartzijde bij 235 graden wordt deels door het behouden Delftse Poort-model afgedekt; de losse vierzijderender is daar volledig beoordeeld.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 12,152 driehoeken. Printcontrole per node: NoError, 0.66% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: dubbelhoge zalen herkenbaar door gepaarde blind uitgeholde glasvelden, halve kantoorverdiepingen en gehele onderbouw; 55 graden: volledige noordgevel met raamritme en de echte oostelijke BAG-uitbouw, terwijl PDOK alleen dichte vlakken levert; 145 graden: westelijke trappenhuisuitbouw met verbonden kunstvensterreliëfs en juiste gemeten kernen en dakmachines; 235 graden: diepe westgalerijen, dubbele glasrijen, eigen entreeluifels en gesloten vensterranden; het los gerenderde model blijft herkenbaar uit deze richting.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 220 bij 220 mm, 227 objecten, 173,396 driehoeken, 155.8 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000700780
- PDOK BAG 0599100000700780 EPSG:28992; AHN DSM/DTM 0.5 m en actuele orthoHR
- PDOK 3D Basisvoorziening: maaiveld Delftseplein 43.5752/43.6063 m ellipsoÃ¯disch
- https://kaanarchitecten.com/work/central-post-offices (schuine foto Luuk Kramer; uitsluitend visuele referentie)
- https://central-post-rotterdam.com/nl/gebouw/
- https://wederopbouwrotterdam.nl/artikelen/stationspostkantoor (fotoâ€™s Marlies Lageweg en bouwhistorie)
