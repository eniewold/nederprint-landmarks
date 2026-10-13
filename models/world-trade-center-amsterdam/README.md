# World Trade Center Amsterdam (Amsterdam)

## Bestanden en plaatsing

`world-trade-center-amsterdam.glb` in meters met Y omhoog, `world-trade-center-amsterdam.json` voor de catalogus en `world-trade-center-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-world-trade-center-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [120025, 483710], X-as [0.9984890974505379, 0.05495017991244574], Z=0 op NAP 0.79 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.87165557 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012065344, NL.IMBAG.Pand.0363100012096613.

## Bouwdelen, gemeten maten en aannames

Twee gebouwgroepen omvatten alle eigen toren- en plintdelen; het Zuidplein ertussen en station Zuid blijven vrij. H heeft daken op NAP92,107/97,665/101,172/103,267m. I en de westelijke golfkap volgen het gemeten dwarsprofiel26,689–28,890m. A/B/C/E hebben afzonderlijke armen/kernen op42,761/46,537/48,435/63,774/65,793/63,788/64,745/61,900/65,869m. De oudere AHN4/3DBAG miste TowerTen: de nieuwe hogere vleugels zijn daarom uit AHN5 gemeten op79,027/71,275m, met lagere west-/noordvleugels50,189/38,158m en techniek76,443m. Grenzen daarvan zijn tot regelmatige bouwdelen vereenvoudigd, circa0,5–1m onzeker. Glas-/staalritme, vensterverdeling, entrees en witte1m-Tenstijlen zijn geschat. De golfkappen worden als doorlopende dwarsprofielen geëxtrudeerd; vaste onderschalen houden ze verbonden. De overhangcorrectie voegt in west14,55% en in oost1,00% volume toe; onder de westkap blijft de ruimte onder5m open. Het centrale atrium wordt voor de print hoger gedeeltelijk gevuld. Naast de gezamenlijke304,6mm lange STL zijn aparte west-/oost-STLs beschikbaar:53,9bij91,7mm en199,7bij93,1mm op1:1000.

## Weggelaten

Fijne glasroedes, kleurverschillen per glasplaat, precieze zonnepaneelindeling, kleine dakapparaten, reclames en tijdelijke bouwkranen. Dunne balken zijn op0,9–1m verdikt. De interne atriumruimtes zijn door de printonderschalen vereenvoudigd; openbare pleinen krijgen geen extra terreinplaat.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 103,872 driehoeken. Printcontrole per node: NoError, 14.55% extra volume; NoError, 1.00% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: Gevelnissen, H-kroon, twee glasgolven en huidige TowerTen; 55 graden: Vrij Zuidplein, volledige vleugelcontouren, vensters en nieuweTenhoogte; 145 graden: Witte gevelstijlen, afzonderlijke dak-/kernvolumes en holle kappen; 235 graden: Glas-/staalprofielen, eigen plintvleugels en raamritme rondom.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 400 bij 400 mm, 871 objecten, 662,746 driehoeken, 105.3 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://arcam.nl/architectuur-gids/wtc-complex-zuidas/
- https://zuidas.nl/construction-project/wtc/ (TowerTen opgeleverd2022)
- https://www.ahn.nl/dataroom (AHN5 DSM,CC0)
- https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec (AHN5,coveragefc9d369f-94ca-4373-8281-a6854edb67c9)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012065344 (TU Delft/3DGI CC BY4.0)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012096613 (oudereD-vlakken niet gebruikt)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4,CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0
- https://commons.wikimedia.org/wiki/File:World_Trade_Center_Amsterdam_2.jpg (Steven Lek CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:World_Trade_Center_Amsterdam_Toren_H.jpg (Choinowski CC BY-SA4.0)
- https://zuidas.nl/wp-content/uploads/2017/12/20230111-wtc-tower-ten-marcel-steinbach-01-1800x1201.jpg (Marcel Steinbach2023,uitsluitend visuele referentie)
