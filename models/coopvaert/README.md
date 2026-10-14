# De Coopvaert (Rotterdam)

## Bestanden en plaatsing

`coopvaert.glb` in meters met Y omhoog, `coopvaert.json` voor de catalogus en `coopvaert-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-coopvaert.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [92843, 436976], X-as [0.9614725680858853, 0.2749008927201447], Z=0 op NAP 4.1 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 47.69469135 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0599100000432858, NL.IMBAG.Pand.0599100000753476.

## Bouwdelen, gemeten maten en aannames

Het gehele complex bevat de toren aan Blaak/Plein 1940, de overdekte luchtbrug en de eigen parkeergarage Wijnstraat 100. De twee volledige BAG-contouren bepalen de voetafdruk. De gemeten gevelas is 15,956108 graden. Modelnul is NAP 4,10 m; de voet steekt tot NAP 3,20 m onder lager straatniveau. De drie doorlopende torenvleugels eindigen op NAP 95,136/101,136/101,222 m, de centrale kroon op 104,161 m en de gemeten machines en marmerfinnen tot 109,394 m. De garage heeft twee hoofddaken op NAP 32,170/33,457 m en een trappenhuis tot 36,122 m. AHN meet het dak van de luchtbrug op NAP 11,2-11,3 m; gemodelleerde bovenkant 11,35 m. De drie circa 30 m hoge kolommen onder de Blaak-projectie zijn bevestigd door de architect en schuine leveranciersfoto's. Hun breedte van 2,0 bij 1,8 m en de verbonden 45-graden kapitelen zijn vereenvoudigde schattingen voor 1:1000. De luchtbrugonderzijde op NAP 8,85 m, venster- en erkerpatroon, blinde nissen van 0,35-0,55 m, garageventilatievelden en kroonvereenvoudiging zijn fotoschattingen. Alle vensters hebben een gesloten achterwand; alleen de drie echte arcadeopeningen blijven open. De contouren zijn lokaal op 0,25 m afgerond, maximaal 0,125 mm afwijking op printschaal. Het model bestaat uit benoemde continue bouwdelen en dakvlakken. De printtest bevestigt een doorlopende ondersteuning van minstens 0,8 mm onder de luchtbrug en een enkel verbonden positief materiaalvolume.

## Weggelaten

Interieurs, dunne kozijnen, letters, hekwerken, antennes, afzonderlijke marmerplaten en kleuren zijn weggelaten. De historische Incassobank (BAG 0599100000702218) onder en naast de torenprojectie blijft als PDOK-pand staan; dit is geen te verbergen rest. Ook andere buurgebouwen blijven behouden. De parkeergarage is vanaf sommige kaartzijden deels door buurgebouwen afgedekt; daarom is de gehele voetafdruk ook in de losse renders en de volledige export beoordeeld.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 16,416 driehoeken. Printcontrole per node: NoError, 2.16% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: drie gevelvleugels met blinde verticale erker- en venstervelden, de gemeten marmerkroon en volledige garage; 55 graden: de drie hoge kolommen met open arcade, lage plint en de overdekte luchtbrug op de gemeten hoogte; 145 graden: doorlopende achtergevel, afzonderlijke daken en machines, gesloten raamhoeken en garageventilatie; 235 graden: de open projectie boven de behouden Incassobank, hogere kroonfinnen en verbonden parkeergarage.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 250 bij 250 mm, 434 objecten, 147,704 driehoeken, 113.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG pand 0599100000432858 en eigen garage 0599100000753476, volledige contouren EPSG:28992
- PDOK Locatieserver Wijnstraat 100: RD 92862.41/436952.85; 3D BAG LoD 2.2 van beide panden
- PDOK AHN DSM/DTM 0.5 m: daken, maaiveld en luchtbrug tot NAP 11.2-11.3 m; actuele orthoHR
- PDOK 3D Basisvoorziening maaiveld 47.6947/47.4135 m ellipsoidisch
- https://damenpartners.com/projecten/de-coopvaert/ (architect: marmerkroon, erkers en drie 30 m-kolommen, publiek zoekfragment)
- https://de-coopvaert.nl/ (VvE: gehele complex, garage Wijnstraat en overdekte luchtbrug)
- https://www.loveld.com/en/references/gritblasted-concrete/de-coopvaert/ (betongevelleverancier, vier schuine fotos)
- https://www.zonneveld.com/nl/projecten/Coopvaert-Rotterdam (constructeur, entreefoto)
