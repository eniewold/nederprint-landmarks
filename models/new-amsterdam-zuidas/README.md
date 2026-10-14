# New Amsterdam (Amsterdam)

## Bestanden en plaatsing

`new-amsterdam-zuidas.glb` in meters met Y omhoog, `new-amsterdam-zuidas.json` voor de catalogus en `new-amsterdam-zuidas-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-new-amsterdam-zuidas.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [119827, 483374], X-as [-0.05651853448202428, 0.998401550108975], Z=0 op NAP -0.9103999733924866 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 42.13835608911476 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012104198.

## Bouwdelen, gemeten maten en aannames

New Amsterdam van de Architekten Cie./Branimir Medic en Pero Puljiz is een woongebouw in Mahler 4 aan de Gustav Mahlerlaan. Het eigen BAG-pand bevat de hoge woonvleugel, lagere noordvleugel en hele winkel-/recreatieplint. Gemeten plintdaken zijn NAP 8.207 en 8.1405 m; hoofdroof 88.1105 m, grote machine 90.3825 m, lagere vleugel 60.878 m en lage dakmachine 63.8605 m. De echte vlakke penthouse-terrassen liggen circa 84.6385, 81.3355/81.385 en 77.925 m: dit zijn fysieke terugliggende bovenverdiepingen, geen DSM-hoogteplakken. De afgeronde penthouse-einden zijn kwadratische planbogen tussen de gemeten uitersten, op 1:1000 vereenvoudigd. De penthouses beginnen op NAP 77.6 m en sluiten met overlap op de standaardwoonvleugel tot 77.925 m aan; hun kromming loopt niet als een uitstulping door in de lagere gevels. Hoofdas 93.24 graden volgt de gemeten lange gevel. De plint blijft op haar eigen volledige polygonale voet. Verdiepingsritme 3.6 m komt uit de architectenbron; blind vensterreliëf van 0.35 m, de verdeling van glasvelden, robuuste verticale balkonstrips van 0.65 m en gesloten winkelentrees zijn foto-afgeleide schattingen. Alleen straatpunten buiten alle BAG-panden worden bemonsterd: DTM NAP -0.9104 tot +0.4134 m, PDOK ellipsoide 42.138356 tot 43.448301 m; de zuidelijke straat geeft de laagste geldige plaatsing met 0.15 m verzinking. AHN bevestigt de hoofdhoogtes en de machines. De balkons behouden een vaste achterwand en de gevels blijven op alle zijden gesloten.

## Weggelaten

Dunne glashekwerken, kozijnroeden, antennes, letters, losse balkonplaten en exacte kleurschakeringen zijn op 1:1000 niet afzonderlijk geprint. Balkons zijn blinde nissen, de entree en de glazen healthclub blijven gesloten. Binnenzwembad, interieur en de niet-printbare waterval zijn niet toegevoegd. De naburige SOM-, Ito- en UNStudio-kantoren blijven bestaande PDOK-panden. Kleine onbetrouwbare glasrandvlakken uit 3D BAG zijn niet als willekeurige steile daken overgenomen. De oorspronkelijke variatie van balkonbreedte is tot een herkenbaar robuust ritme vereenvoudigd.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 18,312 driehoeken. Printcontrole per node: NoError, 0.06% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: blinde glasvelden op beide woonvleugels, gesloten balkonstrips en herkenbare gebogen penthouse-einden; 55 graden: ronde penthouse-terrassen boven de rechte lagere gevels, gemeten hoge en lage dakmachines en volledige winkelplint; 145 graden: regelmatig glasreliëf aan de achterzijde, lage woonvleugel en behouden echte dakterrassen; 235 graden: herkenbare brede winkelvoet, twee ongelijke woonhoogtes, ronde koppen en robuuste verticale balkonaccenten.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 170 bij 170 mm, 169 objecten, 107,878 driehoeken, 97.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012104198, 3D BAG LoD2.2, AHN DSM/DTM 0.5 m en actuele orthoHR: eigen gehele voet, dakvlakken, verschillende woonvleugels, echte penthouse-terrassen, plint en machines; 2026-10-15
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012104198
- https://www.cie.nl/page/778/new-amsterdam (architect: woongebouw Mahler 4, 194 appartementen, 23 verdiepingen, 3.6 m verdiepingshoogte, acht meter hoge plint, balkonstrips en afgeronde penthouses; fotos alleen onderzoeksreferentie)
- https://commons.wikimedia.org/wiki/File:Gebouw_New_Amsterdam.jpg (Choinowski, CC0, 2012: schuine zuidkant met penthouse-terrassen en balkonstrips)
- https://commons.wikimedia.org/wiki/File:New_Amsterdam_-_Flickr_-_Rob_Oo.jpg (Rob Oo, CC BY 2.0, gevelreflectie als referentie)
- https://commons.wikimedia.org/wiki/File:Zuidas_Mahler_33.jpg (CC BY-SA 4.0, noordelijke straat-/plintzijde, geen fotos meegeleverd)
- https://commons.wikimedia.org/wiki/File:Zuidas_Gershwin_12.jpg (CC BY-SA 4.0, schuine zuidkant en afgeronde penthousekoppen)
- https://www.breeam.nl/projecten/new-amsterdam-11139-29083 (Vesteda-portfoliocertificering, Gustav Mahlerlaan 60 A)
