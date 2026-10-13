# SnowWorld Terneuzen (Terneuzen)

## Bestanden en plaatsing

`snowworld-terneuzen.glb` in meters met Y omhoog, `snowworld-terneuzen.json` voor de catalogus en `snowworld-terneuzen-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-snowworld-terneuzen.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [47782, 368554], X-as [0.776046407066546, 0.6306758074312862], Z=0 op NAP 1.1 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.47486049774154 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0715100000041102.

## Bouwdelen, gemeten maten en aannames

EBARchitects, bouwjaar BAG2007. Het lange dak is één gemeten planvergelijking zNAP=0.18145652u+0.00013807v+8.14156996, top NAP41.235m. De korte piste eindigt bij u85.37; de lange kop is slechts30.4m breed. De hoge piste is een holle doos met een geschatte vloer8.5m onder het dak, zichtbare X-spanten en een interne1.1m-printwand. Retaildak NAP7.521m; gehele L-vleugel met sportdak6.921m, horeca10.442m, hellende rode box13.1–15.829m en doorlopend tussenhaldak10.179–14.055m. De buitentrappentorens hebben gemeten koppen25.654 en35.243m; hun staal is gesloten met blinde trapnissen. De lange gebogen retailluifel, gevelpanelen, glasnissen0.38m en koelapparaten zijn geschat aan de hand van schuine foto's. De STL heeft al dezelfde permanente45-graden onderschalen en een1mm voetplaat; het kale model is249.2×151.5mm. De export vult hogere spantopeningen gedeeltelijk. SnowWorld noemt nu pistes van circa210 en160m, niet de verouderde200/110m uit de backlog.

## Weggelaten

Dunne vlaggen, lamppalen, letters, losse trapleuningen en plaatnaden zijn kleiner dan0.9m. Kleine dakventilatoren met minder dan0.9m hoogte zijn weggelaten; koelinstallaties zijn samengevoegd. Het interne vrije staalwerk en trapvluchten zijn vereenvoudigd tot verbonden spanten en blinde nissen voor een print zonder losse steun.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 7,260 driehoeken. Printcontrole per node: NoError, 13.50% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: open X-spanten, holle hoge piste en glasnissen in retailvoet; 55 graden: alle L-vleugels met hellende tussenhal, rode box en glasluifel; 145 graden: doorlopend dakvlak, lange gebogen retailluifel en hoge kopruit; 235 graden: twee gemeten buitentrappentorens, versmallende piste en koelapparaten.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 370 bij 370 mm, 123 objecten, 484,922 driehoeken, 41.8 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0715100000041102, Actueel_orthoHR, AHN4 DSM/DTM 0.5m bbox47582,368354,47982,368754
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0715100000041102
- https://healthinvest-beherman.com/skidome-terneuzen/
- https://www.infosteel.be/images/magazine/info-steel-21/238/index.html
- https://www.reliance-scada.com/en/success-stories/other/reliance-scada-at-snowworld-terneuzen
- https://www.snowworld.com/nl/terneuzen/skien-snowboarden
