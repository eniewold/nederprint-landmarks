# SnowWorld Amsterdam (Velsen-Zuid)

## Bestanden en plaatsing

`snowworld-amsterdam.glb` in meters met Y omhoog, `snowworld-amsterdam.json` voor de catalogus en `snowworld-amsterdam-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-snowworld-amsterdam.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [106841, 495950], X-as [0.5313985795180829, -0.8471219213821372], Z=0 op NAP -1.1095 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 41.78637831515875 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0453100000000400.

## Bouwdelen, gemeten maten en aannames

SnowPlanet/SnowWorld Amsterdam, HB-architecten, constructeur ABR/ASK Romein; primaire bron noemt oplevering1999 en uitbreiding2005, hoewel BAG1988 vermeldt. Hele BAG0453100000000400, buurclubpanden behouden. Dakprofielen in AHN4 op0.5m: vijf verspringende tonkappen van NAP9.969 tot29.233m, nokhart verschuift v12 naar v21.4; de kromming neemt af in de afgeronde kop. De generator gebruikt benoemde gekromde profielstations per echte kap, met continue langshelling en architectonische dakstappen bij u40.6,75.8,115.9 en146.05; geen hoogtelagen. Lagere korte piste eindigt bij u76, ontvangstboog8.39–8.49m, westgalerij2.696m en oostgalerij3.259m. De hoge onderbouw ligt onder het bestaande heuvelterrein; er is geen extra landschapsplaat. De vaste datum NAP−1.1095m komt uit de DTM bij het laagste straatmeetpunt. Regelmatige paraboolbogen zijn gefit op AHN-dwarsdoorsneden en tussen gemeten stations geïnterpoleerd; de3DBAG mist grote gebogen glas-/metaalvlakken. Glasnissen0.38m, witte entreevorken0.95m, entree-luifel met45°onderschaal en koelblokken zijn vereenvoudigd en geschat. De losse STL is inclusief permanente45-graden printcorrectie en1mm voetplaat, buitenmaat circa244×58mm.

## Weggelaten

Letters, plaatnaden, vlaggen, losse kabels, individuele staalprofielen en leuningen smaller dan0.9m zijn weggelaten. De zichtbare brede staalvorken zijn verdikt; de binnenconstructie en houten gevelbekleding zijn gesloten printvolumes met blind glasreliëf. Kleine koelapparaten zijn samengevoegd. De kunstskihellingen, grondheuvels en andere gebouwen blijven PDOK-terrein en zijn geen onderdeel van dit landmark.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 2,072 driehoeken. Printcontrole per node: NoError, 0.05% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: afgeronde hoge kop en echte doorlopend gekromde kapvlakken; 55 graden: vijf kapstappen met verschillende krommingen en volledige oostgalerij; 145 graden: lage ontvangstboog, entreevorken, glasnissen en luifel; 235 graden: afzonderlijke korte piste, westgalerij en herkenbare koelzone.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 340 bij 340 mm, 179 objecten, 1,606,438 driehoeken, 34.6 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG0453100000000400, Actueel_orthoHR, AHN4 DSM/DTM0.5m bbox106631,495740,107051,496160; dwarsprofielen per meter langs nokas -57.9graden
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0453100000000400
- https://abr-roosendaal.nl/project_detail/snow-planet-spaarnwoude/
- https://www.snowworld.com/nl/amsterdam
- https://www.snowworld.com/en/amsterdam/plan-your-visit
- https://bispingen.snowworld.com/unternehmen/ueber-uns.html
