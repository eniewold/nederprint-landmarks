# Centre Court (Den Haag)

## Bestanden en plaatsing

`centre-court-den-haag.glb` in meters met Y omhoog, `centre-court-den-haag.json` voor de catalogus en `centre-court-den-haag-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-centre-court-den-haag.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [82823, 455344], X-as [0.848048096156426, 0.5299192642332049], Z=0 op NAP 0.67 m. De lokale X-as is 32 graden als rekenreferentie; de volledige BAG-contouren behouden hun eigen gemeten hoeken en worden daarmee naar RD teruggezet. Terreinpunten staan in `groundSamplePoints`; vaste terugval 44.10150059 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0518100000238629, NL.IMBAG.Pand.0518100000239375, NL.IMBAG.Pand.0518100000271459, NL.IMBAG.Pand.0518100000218778, NL.IMBAG.Pand.0518100000221349, NL.IMBAG.Pand.0518100000326121, NL.IMBAG.Pand.0518100000338618, NL.IMBAG.Pand.0518100000212640, NL.IMBAG.Pand.0518100000287985.

## Bouwdelen, gemeten maten en aannames

Het gehele Centre Court-complex is opgenomen: de kantoor-BAG, zuidelijke woonvleugel en zeven aansluitende woon-BAGs die samen de grote binnenhof omsluiten. De oorspronkelijke backloglocatie is circa 450 m naar het noorden gecorrigeerd; het gebouw staat op de hoek Prinses Beatrixlaan/Juliana van Stolberglaan. GROUND = NAP 0,67 m uit DTM, bevestigd door het PDOK-maaiveld. Alle contouren en bepalende dakhoogtes komen uit BAG/3D BAG; AHN5 2023 bevestigt de in mei 2021 opgeleverde optopping. Hoofddak NAP 24,411 m, hoge toren opbouw 52,412/66,353/73,195 m en gemeten schoorsteen 79,94 m. De lagere toren heeft kroonhoogten 38,951/42,014 m; de nieuwe tweelaagse optopping ligt op 28,192 m. De woningen hebben eigen dakhoogten circa 24,24-24,35 m aan de noordzijde en circa 15,80-16,03 m aan de oostzijde. Bouw uit doorlopende hoofd- en vleugelvolumes met werkelijke penthouses, dakopstanden en machinekernen. De gewelfde entreehal is een continu elliptisch profiel met gemeten randhoogte 24,411 m en kroon 28,061 m; de overdekte derde courtyard heeft een continu schilddak tot de gemeten piek 28,572 m. De twee andere courtyards blijven volledig open. Vensterbreedte, verdiepingsritme, bovenste glasvelden, gewelfprofiel tussen meetpunten, vereenvoudigde schilddakvorm en roofribritme zijn fotoschattingen. Raamnissen zijn blind, met minimaal 0,8 m materiaal erachter, en verborgen gevels worden niet uitgehold. De ronde restaurantgevel heeft ondiepe nissen. De schoorsteen is naar 1,6 m breed vereenvoudigd voor 1:1000. Zeven centimeter tolerantie sluit gedeelde BAG-keldercontouren aan; details onder één centimeter zijn vereenvoudigd. De definitieve Float32-export is opnieuw gereconstrueerd en een numeriek nulvolume-restvlak is verwijderd; GLB en STL vormen precies één gesloten verbonden volume met alleen de twee bedoelde hofopeningen.

## Weggelaten

Gevelkleuren en baksteentekening, fijne raamkozijnen, hekwerk, zonnepanelen, beplanting, kleine dakinstallaties en interne vloeren zijn weggelaten. De Netkous, Monarch, KPN en andere buurgebouwen blijven het bestaande model. Open courtyards worden niet met dakmassa gevuld.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 30,720 driehoeken. Printcontrole per node: NoError, 0.97% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: blind raamritme, herkenbare getrapte torenkronen, ronde restaurantpuien en een echt doorlopend gewelf in plaats van PDOK-facetten; 55 graden: complete woonring met negen vervangen BAG-delen, behoud van de open groene courtyards en gewelfde entreehal; 145 graden: uitgewerkte achtergevels en glasvelden van de hoge kroon, complete aansluiting op het maaiveld, gemeten dakmachines en schoorsteen; 235 graden: lagere toren met eigen kroon en gemeten 2021-optopping naast de gebogen hal; alle vensternissen zijn blind en beide hoven blijven open.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 300 bij 300 mm, 879 objecten, 218,748 driehoeken, 101 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG: kantoor en complete aansluitende woonvleugel, EPSG:28992
- 3D BAG LoD 2.2: alle negen panddelen, afzonderlijke dakvlakken en contouren
- PDOK AHN5 DSM 0.5 m 2023 en AHN DTM 0.5 m; actuele orthoHR
- PDOK 3D Basisvoorziening: maaiveld 44.1015/44.2270 m ellipsoïdisch
- https://kow.nl/projecten/centre-court-den-haag/ (KOW-foto’s, uitsluitend visuele referentie)
- https://www.heembouw.nl/projecten/optopping-centre-court-den-haag/ (oplevering optopping mei 2021)
