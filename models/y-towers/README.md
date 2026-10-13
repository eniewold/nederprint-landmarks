# Y-Towers (Maritim Hotel en Yvie) (Amsterdam)

## Bestanden en plaatsing

`y-towers.glb` in meters met Y omhoog, `y-towers.json` voor de catalogus en `y-towers-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-y-towers.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [122133, 488703], X-as [0.8090169943749475, 0.5877852522924731], Z=0 op NAP 1.65 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.580624 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012247366.

## Bouwdelen, gemeten maten en aannames

De volledige eigen bovengrondse Y-Towers bestaat uit een rechte hoteltoren met verticale natuurstenen pilasters/glasraster, een getrapte woontoren met horizontale balkonbanden, de congreszalen, lobbyvleugels en het tussengelegen atrium. Hotelhoofdplatdak111,624NAP, dakmachine115,916NAP en noordschouder106,952NAP; woonplatdak106,112NAP, dakkop107,638NAP en lage dakschouders102,52/102,534/102,512NAP. Gemeten AHN5/3DBAG-plinthoogtes15,076NAP en18,872/18,901NAP, lagere hofterras15,223NAP. De grote ondergrondse garagecontour onder het Schegpark hoort bij hetzelfde BAG-pand, maar wordt niet als bovengrondse parkplaat meegenomen.

Het glazen atrium heeft in AHN5 grotendeels geen retour; het LoD2.2-vlak daar stijgt foutief tot108,242NAP door een bouwkraan. Het gesloten atriumdak is daarom geschat op18,9NAP bij de aangrenzende lobbydaken, circa2–3m onzeker. Hoteltraveeën2,9m en verdiepingen3,18m met2,2m hoge/1,8m brede blinde vensters zijn uit foto's vereenvoudigd; de woongevel heeft3,15m verdiepingen,2,12m hoge blinde glasbanden en verspringende balkonvelden. Uitkragende vloeren zijn.95m dik met1,2m uitsteking en45graden onderzijde; de glazen verbindingsstrook blijft vrij van fictieve balkonframes. De gesloten.95m dikke dakrand107,312NAP en dakwybertjes19,7NAP zijn uit foto's/AHN5 vereenvoudigd, ongeveer.6m onzeker.

De daadwerkelijke PDOK-tegels bevatten voor het recent geregistreerde BAG-pand0363100012247366 nog geen gebouwmesh; de vier vergelijkingsrenders tonen daarom de echte PDOK-omgeving zonder beide Y-Towers. De kaartschakelaar laat het complete nieuwe model verdwijnen, terwijl de bestaande buurtorens blijven staan. AHN5/3DBAG en recente schuine foto's leveren de eigen complexvorm.

## Weggelaten

De ondergrondse garage en openbare Schegpark-/straatplaat, inmiddels verwijderde AHN5-bouwcontainers op het park, bouwkranen en valse hoge atriumwand worden niet gemodelleerd. Dunne balkonbalustrades, raamroedes, dakrails en antennes onder.9m blijven weg of krijgen gesloten reliëf. B'Mine/BOLD en het oostelijke buurcomplex blijven eigen PDOK-panden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 37,168 driehoeken. Printcontrole per node: NoError, 0.38% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-omgeving en schuine bronfoto's bekeken: het pas geregistreerde eigen complex ontbreekt nog in de gebouwtegels; dit is ook met de kaartschakelaar bevestigd. Per richting toegevoegd: -35 graden: beide eigen torenvolumes, gemeten dakkoppen en verschillende gevelritmes; 55 graden: complete congres-/lobbyplint en lager hofterras, zonder parkgarageplaat; 145 graden: horizontale balkons met.95m dikke randen en45graden onderzijde; 235 graden: gemeten dakschouders en gesloten kroonrand, zonder kraanwand of oude bouwketen.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 297 objecten, 339,836 driehoeken, 117.5 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://teamv.nl/project/y-towers-overhoeks/ (architect,torens/plint/wybertjes/balkonritme,2025)
- https://knauf.com/nl-NL/projectreferenties/yvie-ytowers-amsterdam (projectleverancier114/106m)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012247366 (TU Delft/3DGI CC BY4.0;AHN52023)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (CC0,bouwjaar2026,pandingegebruik)
- https://www.ahn.nl/ahn5 (AHN5DSM2023 CC0,EllipsisWCSfc9d369f-94ca-4373-8281-a6854edb67c9)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho,parkvrijvanbouwketen)
- https://commons.wikimedia.org/wiki/File:Yvie_en_Maritim.jpg (MrAronymous CC0)
- https://commons.wikimedia.org/wiki/File:Yvie_AmsterdamNoord.jpg (J93ffrey CC BY-SA4.0)
- https://commons.wikimedia.org/wiki/File:Maritim_Hotel_Amsterdam_2022.jpg (Choinowski CC BY-SA4.0,alleenbuitenvormnietbouwkraan)
