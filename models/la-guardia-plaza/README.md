# La Guardia Plaza (Amsterdam)

## Bestanden en plaatsing

`la-guardia-plaza.glb` in meters met Y omhoog, `la-guardia-plaza.json` voor de catalogus en `la-guardia-plaza-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-la-guardia-plaza.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [117745, 489325], X-as [1, 0], Z=0 op NAP 1.2585 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.30191880791546 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012112686, NL.IMBAG.Pand.0363100012100941, NL.IMBAG.Pand.0363100012115282, NL.IMBAG.Pand.0363100012248810, NL.IMBAG.Pand.0363100012250150.

## Bouwdelen, gemeten maten en aannames

Vier doorlopende gebogen kantoorschijven rond de binnentuin: A (NAP 60.442 m), B (49.631 m), C (42.408 m) en D (90.841 m). C en D zijn bovengronds over drie bouwlagen verbonden (NAP 12.187 m); A en B blijven losse gebouwen. Afzonderlijke dakmachines, A's lage noordelijke aanbouw, het paviljoen uit 2017 en het diensthuisje uit 2019 zijn opgenomen. De hoogste dakmachine bereikt NAP 94.291 m. Oud AHN4 leverde voor het glazen D-dak een te lage mediaan (86.115 m); AHN5 bevestigt 90.874 m, passend bij het gemeten 3D BAG-dak. Paviljoen en diensthuisje hebben continue schuine dakvlakken. De gebogen buitengevels en vier verschillende richtingen staan direct in de RD-contouren; daarom is xAxis [1,0] een expliciet wereldstelsel en geen afgeleide omhullende rechthoek. Ritme (3.9 m), blinde glasvelden (0.35 m) en hoge terugliggende plint (1.2 m), raamkaders en entreegeleding zijn schattingen uit ZZDP/JLL-fotos. Bouwdelen beginnen op een vlakke onderkant van -0.75 m; de kaart zakt nog 0.15 m in het terrein.

## Weggelaten

De parkeerkelder onder het gezamenlijke hof is ondergronds en krijgt geen bovengronds verbindingsvolume. De kunstinstallatie met boten, terrasmeubilair, beplanting, vlaggen en losse niet-architectonische tuinelementen horen niet bij de kantoorarchitectuur. Dunne kozijnen en solar-panelrasters onder 0.9 m worden weergegeven door grotere blinde raamvelden. Drie minieme nieuw geregistreerde hofpanden uit 2026 zonder bruikbare 3D BAG/AHN-dakmeting blijven als bestaande PDOK-objecten staan; ze worden niet verborgen of als verzonnen hoge kantoorvolumes toegevoegd. Het naastliggende The Ven/KPN-complex en de overige buurpanden blijven behouden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 23,090 driehoeken. Printcontrole per node: NoError, 0.24% extra volume; NoError, 0.02% extra volume; NoError, 0.10% extra volume; NoError, 0.08% extra volume; NoError, 0.00% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: gebogen gevelritme, eigen daken en machines van alle vier kantoorschijven en de lage C/D-verbinding; 55 graden: hoge blinde entreenissen, losse A/B-gebouwen en het schuine paviljoendak rond het open hof; 145 graden: correcte glazen dakhoogte van D, brede gevellijsten en afzonderlijke machines zonder DSM-hoogtelagen; 235 graden: gesloten lage plint, echte noordelijke A-aanbouwen en gemeten korte en lange gebogen gevels.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 260 bij 260 mm, 648 objecten, 415,854 driehoeken, 95.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG, actuele orthoHR, AHN4 DSM/DTM 0.5 m, AHN5 DSM 0.5 m en 3D BAG LoD2.2: panden 0363100012112686/12100941/12115282/12248810/12250150, open geometrie en NAP-daken; 2026-10-14
- https://www.zzdp.nl/history (architect: La Guardia Plaza met SOM, oblique projectfoto; alleen referentie)
- https://www.breeam.nl/projecten/bright-offices-gebouw-a-7936 (opdrachtgever: vier gebouwen, A/B vrijstaand, C/D verbonden over eerste drie bouwlagen)
- https://aanbod.jll.nl/en-nl/listings/la-guardiaweg-36-162-la-guardiaweg-36 (makelaar: actuele schuine fotos van gevels, entree en paviljoen; alleen referentie)
- https://www.fundainbusiness.nl/en/kantoor/amsterdam/object-40335130-la-guardiaweg-36-66/ (opdrachtgever/makelaar: gerenoveerde Bright Offices en Brasserie Helden)
