# Millennium Tower Amsterdam (Amsterdam)

## Bestanden en plaatsing

`millennium-tower-amsterdam.glb` in meters met Y omhoog, `millennium-tower-amsterdam.json` voor de catalogus en `millennium-tower-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-millennium-tower-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [117568, 489633], X-as [0.9941132045189992, 0.10834637327094243], Z=0 op NAP 0.9848999977111816 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.17363873138221 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012078190, NL.IMBAG.Pand.0363100012201454, NL.IMBAG.Pand.0363100012201455.

## Bouwdelen, gemeten maten en aannames

Millennium Tower / Reed Elsevier aan Radarweg 29, EGM/Rob van Erk, opgeleverd in 2004. De Kluif heeft vier vierkante kantoorarmen en diagonale verbindingsdelen, geen ronde plattegrond zoals de backlog suggereerde. Alle echte hoofdhoogtes zijn gemeten: buitenste daken NAP 89.291 en 89.280 m, hogere koppen 95.794 en 95.783 m, centrale glaskern 98.663 m, kleine dakmachine 99.505 m, eigen plintdaken rond 9.90 m. De lage garageoverkapping (BAG 0363100012201454) heeft een gemeten, licht hellend dak rond 3.725 m; het eigen kleine diensthuisje (0363100012201455) heeft AHN-mediaan 3.77725 m, omdat 3D BAG daarvoor niet beschikbaar is. De kantoorarmen zijn doorlopende prisma's en de laagbouw volgt een echt dakvlak, zonder hoogtestapeling. As 6.22 graden uit de vierkante kopgevels; de diagonaal verbindende vlakken liggen als vaste polygonen in dit stelsel. DTM-terreinpunten geven NAP 1.2403/0.9849 m, PDOK 44.382146/44.173639 m ellipsoïdisch; alleen bestaande straatpunten worden bemonsterd. Gevelritme (3.65 m), blinde kantoorvensters, glaskernbanden, verticale accentstroken en gesloten entreenissen zijn schattingen uit Wessels Zeist-fotos. De drie onderdelen zijn onafhankelijk gesloten en op de vlakke onderkant verankerd.

## Weggelaten

3D BAG RoofSurfaces 178, 185 en 186 zijn foutieve steile glas-/gevelvlakken: AHN ligt tientallen meters hoger of lager, terwijl de foto's doorlopende kantoorwanden tonen; deze worden niet als slopende nep-daken overgenomen. Dunne opgehangen reclameletters, logo's en reclameframes op het dak hebben onderdelen onder 0.9 m dikte en worden niet als los zwevend raamwerk gebouwd. Straatbestrating, tuin, parkeerplaatsen en de naburige Telegraaf-hallen blijven bestaande PDOK-objecten. Ondergrondse kelderwanden onder maaiveld worden niet toegevoegd. Geveldetails van het lage garagepaviljoen en het diensthuisje zijn op de beschikbare schuine foto's niet zichtbaar; hun volledige gemeten massa en dakvorm blijven opgenomen.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 20,888 driehoeken. Printcontrole per node: NoError, 0.09% extra volume; NoError, 0.00% extra volume; NoError, 0.00% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: vier kantoorarmen met blinde vensters, centrale glasbanden, hogere dakhoofden en alle gemeten plintdaken; 55 graden: gesloten smalle gevels, onderscheiden hoofdhoogtes en eigen lage garageoverkapping zonder losse PDOK-restobjecten; 145 graden: volledige dogbone-vorm met echte horizontale dakvlakken en blind glaskernreliëf in plaats van foutieve steile glasmeshes; 235 graden: vierkante eindkolommen, gekoppelde kantoorplaten en behouden eigen diensthuisje naast de garageoverkapping.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 200 bij 200 mm, 161 objecten, 108,320 driehoeken, 100.7 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012078190/0363100012201454/0363100012201455, 3D BAG LoD2.2, actuele orthoHR, AHN DSM/DTM 0.5 m: footprint, echte hoofddaken, plint, garagepaviljoen en terrein; hutdak uit AHN wegens ontbrekende 3D BAG; 2026-10-14
- https://www.wessels-zeist.nl/nl/projecten/millennium-tower-kantoor-reed-elsevier-amsterdam (bouwer: De Kluif, Rob van Erk/EGM, 2004; drie schuine projectfotos met daken, kantoorarmen en glaskern, alleen referentie)
- https://www.skyscrapercenter.com/building/millennium-tower/5646 (CVU: Millennium Tower / Reed Elsevier, 97.5 m, 24 verdiepingen)
- https://www.mitsubishi-liften.nl/project/millennium-tower/ (installateur: kantoor Elsevier, liftmodernisering 2025)
