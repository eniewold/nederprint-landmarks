# Sint-Willibrordusbasiliek (Hulst)

Laatgotische kruisbasiliek in Brabantse gotiek aan de Grote Markt in Hulst (rijksmonument 22778). Op de plek van een romaanse kerk van circa 1200 kwam in de eerste helft van de 15e eeuw een gotische kerk met vieringtoren. Vanaf 1462 is de kerk herbouwd (Everaert Spoorwater, na een brand vanaf 1481 Herman de Waeghemaekere, het hoofdportaal 1482-1484 van Matthijs II Keldermans) en in 1535 opgeleverd onder Laurens II Keldermans. De torenspits verdween in 1668 door blikseminslag, in 1876 door brand (daarna een spits van Cuypers) en in 1944 door beschieting. Sinds 1957 staat er de betonnen bekroning 'De Prediker' van Jan Brouwers. Het model is opgebouwd uit bouwdelen en dakvlakken, niet uit hoogtelagen.

- GLB/JSON: één node `building:kerk` in meters. Hij vervangt BAG-pand 0677100000608184: kerk, kooromgang, sacristie en aanbouwen zijn één pand.
- STL op 1:1000: circa 79,6 × 43,1 × 66,3 mm.
- Genereren: `node scripts/generate-sint-willibrordusbasiliek-hulst.mjs --components`.

## Oorsprong en oriëntatie

De oorsprong ligt op RD (61990,00; 366551,86), lat/lon 51,280622 / 4,054078. Dat is het hart van de vieringtoren op maaiveld (NAP +3,25 m). +X loopt langs de nok van schip en koor van west naar oost, onder 16,5 graden in RD (`xAxis` [0,95882; 0,28402]). Die hoek is gemeten aan de dakranden van schip en koor in het AHN-DSM. +Y wijst naar het noordtransept. `groundHeight` is 47,69 m (ellipsoïdisch): de laagste PDOK-terreinhoogte op de `groundSamplePoints` rond de kerk (west 47,88, noord 47,94 en 47,90, zuid 47,73 en 47,69, zuidoost 47,72, oost 48,19). `groundOffsetMetres` is −0,1 en de onderkant ligt 0,5 m onder maaiveld; het maaiveld loopt naar het oosten op tot NAP +3,85.

## Onderdelen

- **Schip**: middenschip van 9,6 m breed onder een zadeldak met de nok op +28,05 m, helling 1,58 (3D BAG 27,8 tot 28,3) en de goot op +20,5 m. Vijf traveeën met lichtbeukvensters. De zijbeuken liggen onder lessenaarsdaken van +14,0 m tegen de lichtbeuk naar circa +10,1 m aan de buitenmuren (helling 0,55, 3D BAG), met vensters per travee en steunberen met pinakels om de 5,9 m (BAG). Drie dakkapellen per kant op het schip en twee op de zuidelijke zijbeuk (luchtfoto).
- **Westgevel**: topgevel 0,8 m boven het dak met een kam van zes pinakels en een toppinakel, twee achtkante traptorentjes op de westelijke steunberen (BAG) tot +25,6 m (AHN tot circa +24), het grote westvenster, het hoofdportaal en een venster per zijbeuk. Op de hoeken van de zijbeuken staan twee haakse steunberen met een pinakel.
- **Transepten**: de hoge arm is 8,4 m breed (u −4,3 tot 4,1) met een zadeldak tot +21,75 m, helling 1,6 (3D BAG) en goten op +15,0 m. De kopgevels (v 20,45 en −20,4) steken 0,6 m boven het dak uit, met een pinakel op de top (AHN +23,3), hoeksteunberen met pinakels, een groot kopvenster en in het noorden een topvenster. Aan de westkant heeft elk transept een zijbeuk tot u −11,9 onder een lessenaarsdak (helling 0,53, 3D BAG) met een schild aan de kopse kant (luchtfoto). Op de zuidoosthoek staat de slanke traptoren met lantaarnkapje tot +23,4 m (foto's, AHN +23).
- **Koor**: hetzelfde profiel als het schip, nok +28,3 m en helling 1,5 (3D BAG), met een achtzijdige sluiting tot u = 26,0 (schildvlakken in de 3D BAG). Vier lichtbeukvensters per kant en drie hoge vensters in de sluiting. De kooromgang heeft een goot op +10,3 m, een lessenaar tegen de lichtbeuk van +13,9 m (helling 0,9) en per travee een schilddak met de nok haaks op de as op +13,3 m, met een dakkapel naar buiten (luchtfoto, foto zuidoost). Steunberen en luchtbogen staan op de traveegrenzen u = 9,2 / 14,65 / 20,05 (BAG): pijler met pinakel tot circa +20,8 m (DSM +20 tot +21) en een boog naar de lichtbeuk met een onderkant van 47 graden.
- **Kooromgang en straalkapellen**: de omgang volgt de convexe omhullende van de BAG-contour van het oosteinde, met een ringdak dat van +10,3 m naar binnen oploopt tot +13,2 m. Drie straalkapellen (oost, noordoost en zuidoost, onder 45 graden vanuit het hart van de koorsluiting) hebben een zadeldak met de nok op +14,6 m (3D BAG 14,3 tot 15,2) en een driezijdige sluiting met steunberen en pinakels. Vensters in de buitenmuren.
- **Sacristie**: tegen de noordelijke kooromgang (BAG u 13,9 tot 20,2), zadeldak met de nok haaks op de as op +15,15 m en helling 1,69 (3D BAG), kopgevel naar het noorden met een venster en vier hoekpinakels. Daarnaast een lage aanbouw (+9,6) en in de zuidoosthoek van het zuidtransept een traptorentje (+12,6 met een spits tot +14,6).
- **Vieringtoren**: achtkant van 9,0 m boven de daken met vier pinakels op de hoeken van de viering, kraag en dichte omgang van 10,0 m van +31,0 tot +32,6 m, bovenste achtkant van 8,6 m met galmgaten tot de kroonlijst op +41,8 m (3D BAG-vlak 41,3). Daarop de kroon van acht pinakels van 1,1 m tot +52,6 m (DSM +52 tot +53) rond een achtkante middenschacht van 4,0 m tot +49, die verjongt tot de beeldengroep en de top op +65,3 m (DSM: +60 tot +62 over 2 m, hoogste cel +65,1).
- Rondom loopt een plint van 0,8 m.

## Geschat

- De hoogtes van de omgang (+31) en van de onderkant van de kroon zijn geschaald op een foto uit het zuidoosten (Hulst Sint-Willibrordusbasiliek 18-06-2012), met de kroonlijst (+41,3) en de pinakeltoppen (+52,6) uit het DSM als maat. De pinakels van de kroon staan op een straal van 3,45 m; in het echt zijn het slanke betonnen naalden rond een open klokkenkamer.
- De top op +65,3 m is het hoogste DSM-punt. Wikipedia noemt een torenhoogte van 68,7 m; het verschil is het kruis en de beeldengroep, die in het DSM op 0,5 m grotendeels wegvallen.
- De vensters, het portaal, de pinakels, de steunbeerhoogtes (circa +9,6) en de dakkapellen zijn uit de foto's en de luchtfoto geschat.
- De kooromgang is vereenvoudigd tot de convexe omhullende van de BAG-contour met drie radiale kapeldaken. De diagonale nokken uit de 3D BAG (noordoost en zuidoost, +14,9) en de oostelijke nok (+14,05) zijn gemiddeld tot +14,6 m.
- De schilddaken boven de kooromgang staan boven de vensters. De 3D BAG legt de nokken op de pijlers, maar daar staan de luchtbogen; de foto's tonen de daken tussen de pijlers.

## Weggelaten of vereenvoudigd

- Spitsbogen en galmgaten zijn blinde spitse nissen (59 graden) voor print zonder steun. De omgang van de toren is een dichte borstwering, de klokkenkamer van de kroon is dicht en de luchtbogen zijn dichte schijven van 0,9 m.
- Het maaswerk, de hogels, de kruisbloemen, het kruis op de toren, de wijzerplaten, de zonnewijzer, de regenpijpen en het hekwerk zijn weggelaten (dunner dan 0,9 m of vrijhangend).
- De kleine sprongen en hoekjes van de BAG-contour rond de straalkapellen zijn in de omhullende opgegaan.

## Controle

De generator controleert de geslotenheid, de Float32-rondgang en ondervlakken onder 45 graden. Het resultaat is één gesloten component met genus 8: open doorgangen onder de luchtbogen en tussen de pinakels en de schacht van de torenkroon. In `tests/landmark-models.test.ts` (webshop) staan de catalogusvelden, hoekpunten, doorsneden en de 45-gradensteuncontrole (geen opvulling). Een export op 1:1000 met steun v2 van een uitsnede van 110 × 110 m bevat het model, zonder het PDOK-pand, met hetzelfde volume als een export zonder steun. Renders van vier kanten zijn vergeleken met de PDOK-reconstructie en de foto's.

## Bronnen

- [Wikipedia: Sint-Willibrordusbasiliek (Hulst)](https://nl.wikipedia.org/wiki/Sint-Willibrordusbasiliek_(Hulst))
- [Rijksmonumentenregister 22778](https://monumentenregister.cultureelerfgoed.nl/monumenten/22778)
- [OpenStreetMap way 272162693](https://www.openstreetmap.org/way/272162693)
- Foto's op Wikimedia Commons: "Hulst Sint-Willibrordusbasiliek 18-06-2012 16-18-45", "Sint-Willibrordusbasiliek Hulst 01" tot "04", "Hulst basiliek westergevel 18-06-2012 15-52-16", "Hulst. Basiliek Sint-Willibrordus Exterieur, GD012129", RCE 20118615, 20292331, 20302851 en 20302852
- BAG-pand 0677100000608184 en de [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0677100000608184) (dakvlakken)
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0) dsm_05m/dtm_05m en de actuele luchtfoto
