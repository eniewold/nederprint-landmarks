# Boekhuis (Amsterdam)

## Bestanden en plaatsing

`boekhuis-sloterdijk.glb` in meters met Y omhoog, `boekhuis-sloterdijk.json` voor de catalogus en `boekhuis-sloterdijk-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-boekhuis-sloterdijk.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [117956, 488982], X-as [1, 0], Z=0 op NAP 1 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.948831 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012107557.

## Bouwdelen, gemeten maten en aannames

Het gehele eigen BAGcomplex0363100012107557,65,96bij261,15m, met opengeslagen boekvleugels op82,757NAP en dakrand83,5NAP, lange westvoorbouw19/20,049NAP, noordgarage19,752NAP, zuidelijke kantoorvleugel59,637NAP met kop26,488NAP en verbinding27,266NAP, servicebouw14,834NAP, ronde entree10,258NAP en techniek16,628/23,983NAP. QPort,naastgelegen kantoren en het kleine losse BAGgebouw blijven behouden. De grote buitenhof is open; alleen negen meetkieren onder3,36m2 zijn gedicht.

Gemeten glaspiramideapex22,164NAP boven hal10,578NAP; ontbrekende glasvlakken symmetrisch geschat circa1m. Noordelijke garagematen en laadhelling als benoemde rechte dakvlakken gefit op3DBAG (residuen<.001m), geen gestapelde hoogtelagen.

Glasgroepen3,65m pitch,6m breed/1,55m hoog/.35m blind, zwarte verticale piers1,3m breed/1,1m projectie en glazen boekkoppen/vouw geschat uit actuele PaulStarinkfoto’s circa1-2m. HetWiel9m hoog volgens PublicArt; ovalen vorm en positie circa1m geschat,1,05m dikke gesloten plaat met.22m blinde engraving en dikke as voor1:1000, geen onprintbaar dun draadmodel. Kleine machinekoppen tot gesloten hoofdvolumes vereenvoudigd circa.5-1m.

## Weggelaten

Geen dunne glasroedes, open kolomgalerij, parkeerinterieur, labels, antennes of openbare pleinplaat. HetWiel is voor1:1000 gevuld en verdikt; echte grote buitenhof blijft open.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 24,746 driehoeken. Printcontrole per node: NoError, 0.23% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: gehele261monderbouw met afzonderlijke zuidvleugel, garage en laadhelling; 55 graden: openVvorm met brede glasgroepen, verticale piers en glashoofden; 145 graden: gemeten glaspiramide en versterkt9mdakwiel; 235 graden: hele noordgarage, dakmachines, lobbies en open buitenhof zonder buurpanden.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 340 bij 340 mm, 494 objecten, 414,014 driehoeken, 93.9 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- https://www.molsbergendevelopment.com/nieuwe-eigenaar-kantoorgebouw-belastingdienst-sloterdijk-amsterdam/ (eigenaar,2dec2025,boekvorm/HetWiel,PaulStarinkphotos)
- https://publicart.amsterdam/projecten/het-wiel/ (kunstorganisatie,9mhoog1996JeroenHenneman)
- https://www.realisag.de/en/magazine-and-press/company-news/article/real-is-signs-lease-for-40000-m2-in-amsterdam/ (eigenaar2023,hele40000m2complex)
- https://nl.wikipedia.org/wiki/Boekhuis (BAG0363100012107557,boekvorm/onderbouw)
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012107557 (TU Delft/3DGI CC BY4.0)
- https://service.pdok.nl/lv/bag/wfs/v2_0 (BAGCC0)
- https://service.pdok.nl/rws/ahn/wcs/v1_0 (AHN4DSM/DTM CC0)
- https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0 (actueleortho)
- Commons:ChoinowskiBoekhuis2016/CCBYSA4,CeescamelWiel2020/CCBYSA4; Molsbergen/PaulStarink2025©uitsluitendvisuelereferentie buitenrepo
