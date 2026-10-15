# Oval Tower (Amsterdam)

## Bestanden en plaatsing

`oval-tower.glb` in meters met Y omhoog, `oval-tower.json` voor de catalogus en `oval-tower-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-oval-tower.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [124512.4, 480582.97], X-as [0.9945182460306845, 0.10456317856707874], Z=0 op NAP -2.6717000007629395 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 40.34092949092113 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012070234.

## Bouwdelen, gemeten maten en aannames

De Oval Tower van SOM (2001) heeft een doorlopende elliptische schacht. Een conische fit op de BAG-contour geeft RD-hart [124512.3945,480582.9696], radii 26.1683 en 13.5771 m en hoofdas 6.002 graden; de generator gebruikt het afgeronde hart [124512.4,480582.97] en een analytische 128-segmentenellips. Het hele hoofdvolume loopt van de voet tot NAP 92.041 m, centrale plant 92.66 m en afzonderlijke technische dakmachines circa 94.80–95.21 m uit 3D BAG en AHN. De opgegeven architecturale 94 m sluit de hogere technische uitrusting uit en wordt niet verward met NAP. De drie geldige straatpunten buiten BAG geven DTM -2.7085, -2.6717 en -2.7280 m met gekoppelde ellipsoide 40.424598, 40.340929 en 40.350723 m; het zuidelijke punt in de aangrenzende BAG-voet is uitgesloten. Plaatsing gebruikt de laagste geldige PDOK-waarde met bijbehorende NAP -2.6717 m en 0.15 m verzinking. De architect van de renovatie OPL documenteert een nieuwe vier verdiepingen hoge stadsentree en brede luifel, met verder vrijwel ongewijzigde hoge gevels. Echte foto’s 1 en 2 zijn onderscheiden van ontwerpimpressies 4–6. Horizontale blinde glasbanden zijn uit het oorspronkelijke gesloten volume gesneden met 0.35 m diepte, geschat ritme 3.65 m en doorlopende schuine plafonds; geen gestapelde hoogtelagen. Het grote stadsvenster op de oostelijke kop is een blinde nis met vaste achterwand. De ovale luifel is uit foto’s geschat als vergroting van de halve assen met 2.8 en 1.9 m, bovenkant NAP 3.878 m en minimaal 0.9 m plaat, op een doorlopende schuine aansluiting vanaf NAP -0.05 m. De kleine laag-geclassificeerde 3D BAG-glassnippers onder de toren zijn niet als echte daken overgenomen.

## Weggelaten

Fijne verticale aluminium roeden, dakhekwerken, logo’s, losse letters en antennes zijn niet afzonderlijk geprint. De luifel krijgt voor steunloos printen een stevige schuine onderzijde. De echte doorzichtigheid van de vierlaagse entree is een gesloten blind veld. Villa Arena, de naburige kantoortorens en losse straatobjecten blijven afzonderlijke PDOK-panden.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 36,454 driehoeken. Printcontrole per node: NoError, 0.01% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: continue ovale gevelbanden en herkenbare stadsentree; 55 graden: brede verbonden elliptische luifel met schuine onderzijde; 145 graden: gemeten centrale dakmachine en afzonderlijke technische opstanden; 235 graden: hele elliptische vorm en blinde glasvelden zonder open gevelschillen.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 130 bij 130 mm, 77 objecten, 98,210 driehoeken, 102.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012070234, AHN DSM/DTM 0.5 m, actuele orthoHR: elliptische voet en geldige straatpunten
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0363100012070234
- https://www.oplarchitecten.nl/project/oval-tower/ (architect renovatie 2010Ã¢â‚¬â€œ2012; extra entreevierbouwlagen, brede luifel en vrijwel ongewijzigde hoge gevels; schuine fotoÃ¢â‚¬â„¢s alleen lokale referentie)
- https://www.breeam.nl/projecten/oval-tower-10967 (24 verdiepingen, 94 m architecturale hoogte)
- https://www.zonneveld.com/en/projects/Oval-tower-Amsterdam
