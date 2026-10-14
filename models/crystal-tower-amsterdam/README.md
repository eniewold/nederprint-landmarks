# Crystal Tower (Amsterdam)

## Bestanden en plaatsing

`crystal-tower-amsterdam.glb` in meters met Y omhoog, `crystal-tower-amsterdam.json` voor de catalogus en `crystal-tower-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-crystal-tower-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [117549, 489385], X-as [1, 0], Z=0 op NAP 0.85 m. De X-as is RD-oost als referentie; Busitel en garage volgen hun eigen gemeten gevelcontouren en de toren volgt zijn gemeten cirkel. Terreinpunten staan in `groundSamplePoints`; vaste terugval 43.5698791 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0363100012068785.

## Bouwdelen, gemeten maten en aannames

De complete eigen BAG-contour omvat Crystal Tower, Busitel, de tweelaagse luchtbrug en de bovenbouw van de parkeergarage. Deze delen zijn allemaal meegenomen omdat zij onder hetzelfde pand-id vallen. De cirkelgevel is uit 22 BAG-punten gemeten: lokaal centrum [0,0671; 27,6457], straal 34,2961 m, maximale afwijking 0,041 m. De hoofdtoren heeft doorlopende rechte zijvleugels op NAP 89,336 m en een gebogen kop op 96,140 m; de centrale kroon eindigt op 96,759 m, de gebogen dakrand op 97,191 m en afzonderlijke gemeten machines tot 97,905 m. De Busitel-vleugels hebben gemeten hoofddaken op 31,083/37,864/43,887 m met hun eigen installaties. De twee garagedekvlakken liggen op NAP 13,475/14,807 m en het trappenhuis op 18,788 m. Het brugdak is het echte continue vlak z=0,00575685589*x-0,0172372792*y+18,2146297 in lokale XY; de LoD2.2-vertexresiduen zijn kleiner dan 0,001 m. De brugonderzijde op NAP 11,45 m, de zichtbare kolom van 2,1 m diameter, entreezuilen van 1,6 m diameter, de terugliggende glazen entree en de gesloten gebogen glaskap met top NAP 9,70 m zijn schattingen uit de vier architectfoto's. De kap is een continu boogprofiel, geen stapeling van lagen. Alle glasvelden zijn blinde nissen van 0,30-0,40 m met een gesloten achterwand; venster- en ventilatieritme zijn vereenvoudigd voor 1:1000. Modelnul NAP 0,85 m volgt de laagste garagestraat; de gebouwvoeten steken onder het hoger gelegen Busitel- en entreeterrein door. PDOK-terreinmetingen liggen op 43,5699 m bij de garage, 44,4117 m bij de luchtbrug en 46,9887 m op de westelijke straat. De X-as is RD-oost als referentie; elke vleugel volgt zijn eigen gemeten contour, en de torenkop volgt de gemeten cirkel. Polygonen zijn waar nodig op 0,25 m afgerond voor gedeelde vlakgrenzen. De gesloten brongeometrie heeft genus 2; vensternissen veranderen die topologie niet. De printtest controleert de gemeten hoofd- en garagedaken, de cirkelgevel, entreeglaskap en doorlopende ondersteuning onder alle vijf gemeten brugdoorsneden van minstens 0,8 mm.

## Weggelaten

Ondergrondse parkeerlagen, auto's op het bovenste parkeerdek, glastransparantie, dunne kozijnen, fijn raster van de glazen entreekap, letters, kleuren, leuningen, masten en interieurs zijn weggelaten. De parkeerlagen boven maaiveld zijn gesloten volumes met blind ventilatierelief. Binnenhof, groen, bestrating en hoogteverschillen blijven PDOK-terrein; zij krijgen geen tweede landmarkplaat. Het naastliggende KPN-kantoor heeft een ander BAG-id en blijft PDOK. De lage garage en Busitel worden op sommige kaartzijden deels door buurgebouwen afgedekt; zij zijn ook volledig beoordeeld in de losse renders en export.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 47,162 driehoeken. Printcontrole per node: NoError, 1.49% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: de gemeten cirkelgevel met blind vensterritme, hogere ronde kroon, entreezuilen en gesloten boogkap; 55 graden: de gemeten zijvleugels en dakmachines, gehele garage en luchtbrug met werkelijk hellend dakvlak; 145 graden: de open ruimte onder de tweelaagse gebogen luchtbrug, kolom en complete Busitel-vleugels; 235 graden: de ronde torenkop, doorlopende gevelvelden en complete eigen gebouwen rond het open binnenhof.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 280 bij 280 mm, 507 objecten, 316,330 driehoeken, 98.4 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0363100012068785: Crystal Tower, Busitel en garage onder een identificatie; volledige contouren EPSG:28992
- PDOK Locatieserver Orlyplein 10; AHN DSM/DTM 0.5 m, actuele orthoHR en 3D BAG LoD2.2 voor daken, frontcirkel en brugdakvlak
- PDOK maaiveld westelijke straat 46.9887 m, luchtbrugstraat 44.4117 m, oostelijke garagestraat 43.5699 m ellipsoidisch
- https://www.agsarchitects.net/portfolio-item/crystal-tower-amsterdam/ (architect: twee lagen luchtbrug naar Busitel, garage en vier schuine gevel-/entreefotos)
- https://www.avecdavinci.nl/crystal-tower-amsterdam.html (projectbegeleider: 27 verdiepingen, circa 95 m)
- https://www.skyscrapercenter.com/building/crystal-tower/5404 (CVU: 95 m, 2002, 27 verdiepingen)
