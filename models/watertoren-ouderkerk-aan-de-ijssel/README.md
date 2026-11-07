# Watertoren Ouderkerk aan den IJssel (Ouderkerk aan den IJssel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-ouderkerk-aan-de-ijssel.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een zeskant als prisma's tussen vier niveaus (verjongend), de hoekpilasters en lisenen zijn blokken langs de hoeken, de velden en de deur zijn nissen, de overgang naar het reservoir is een kegel van 45 graden, het reservoir een omwentelingsvorm (96 zijden) en het trappenhuis een prisma met een schuine onderkant en een overstekend dak.

De watertoren van Ouderkerk aan den IJssel staat aan de voet van de dijk bij het bedrijventerrein aan de Kerkweg. Hij is in 1916 gebouwd door Visser & Smit (later Visser & Smit Hanab). Volgens Wikipedia is hij 32,5 m hoog en heeft hij één reservoir van 400 m³. Hij is opgetrokken uit beton en IJsselsteentjes en is sinds 1980 buiten gebruik; boven de ingang hangt een gedenkplaat. Hij lijkt op de watertoren van Nieuw-Lekkerland. De zeskante schacht heeft betonnen hoekpilasters en banden rond verdiepte velden van gele baksteen en een betonnen plint. Bovenaan gaat de schacht met een bolle rand over in het ronde betonnen reservoir. Op de hoeken lopen zes lisenen over het reservoir door tot boven de borstwering, en onder de bovenrand zit een rij kleine gaten. Het rechthoekige trappenhuis hangt tegen de zuidoostgevel: het kraagt boven de schacht uit en loopt door tot boven het dak, met een plat overstekend dak.

Het bestaande model `watertoren-ouderkerk-aan-de-amstel` is een andere toren.

## Bestanden

- `watertoren-ouderkerk-aan-de-ijssel.glb`: één node `building:watertoren-zeskante-schacht-met-velden-reservoir-met-lisenen-en-trappenhuis`, op maaiveld.
- `watertoren-ouderkerk-aan-de-ijssel.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-ouderkerk-aan-de-ijssel-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

De RD-oorsprong is [102188.15, 438248.13] (51,93019 N, 4,61934 O), het hart van de zeskant. Dat is een kleinste-kwadratenfit op de zes gevellijnen van BAG-pand 0644100002062228: apothema 4,67 m, spreiding 5 cm. De gevelnormalen in de BAG staan op 0,9, 58,6, 118,9, 179,3, -120,4 en -61,7 graden, gemiddeld 0,7 graden gedraaid ten opzichte van een regelmatige zeskant. Lokale +X wijst loodrecht uit de zuidoostgevel met de deur en het trappenhuis (RD -60,7 graden; `xAxis` [0.4894, -0.8721]).

z = 0 is het laagste maaiveld rond de voet: AHN-DTM NAP +3,3 à +3,4 aan de noord- en westkant (gekozen NAP +3,35). Aan de zuidoostkant loopt het terrein op naar NAP +4,2 bij het pad en de weg; daarom ligt de deur op +0,85 m. `groundHeight` 46,90 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints`, gemeten op 2026-11-07: west 46,897, noordwest 46,929, zuidwest 46,966 en noordoost 47,094. Aan de deurkant is PDOK 47,77. Het PDOK-pand begint op 46,84.

Het model vervangt BAG-pand 0644100002062228 (kantoorfunctie, 1916). Er raken geen andere panden het model; het dichtstbijzijnde is een schuurtje 16 m ten noordwesten.

## Onderdeel `building:watertoren-zeskante-schacht-met-velden-reservoir-met-lisenen-en-trappenhuis`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- Schacht: regelmatige zeskant met gevels loodrecht op 0, 60, …, 300 graden. Het apothema is 4,67 m aan de voet (BAG), 4,50 m op de bovenkant van de plint (5,0 m) en 4,35 m onder het reservoir (20,45 m).
- Hoekpilasters: zes blokken van 0,7 m breed op de hoeken, 0,3 m buiten de hoek (BAG: buitenkant 5,69 m uit het hart), die de verjonging volgen.
- Velden: per gevel twee verdiepte baksteenvelden van 0,3 m diep tussen de hoekstroken van 0,75 m: 5,6 tot 12,25 m en 13,05 tot 18,3 m. Daartussen staan de betonnen banden (5,0 tot 5,6, 12,25 tot 13,05 en 18,3 tot 20,45 m). Het plafond van elk veld loopt onder 56 graden naar binnen op.
- Deur en gedenkplaat: dubbele deur als nis van 1,9 m breed en 0,4 m diep, van 0,85 tot 3,6 m, in de zuidoostgevel. Daarboven de gedenkplaat met fronton, 1,1 m breed van 3,8 tot 5,0 m, 0,3 m voor de plint, met een onderkant van 45 graden.
- Overgang: kegel onder 45 graden van de schacht (straal 4,3 m op 20,45 m) tot de reservoirwand op 21,85 m.
- Reservoir: cilinder met straal 5,7 m van 21,85 tot 29,9 m, met een plat dak. Onder de bovenrand loopt een groef van 0,45 m hoog en 0,3 m diep (28,85 tot 29,3 m) voor de rij gaten.
- Lisenen: de hoekpilasters lopen boven de overgang onder 45 graden uit tot 6,0 m uit het hart. Ze lopen als lisenen van 0,9 m breed over het reservoir door tot 30,8 m, 0,9 m boven de borstwering.
- Trappenhuis: rechthoekig, 4,0 m breed (y van -2,2 tot 1,8 m), buitengevel op 5,65 m uit het hart. Het kraagt onder 45 graden uit de zuidoostgevel en heeft zijn onderkant aan de buitengevel op 18,55 m. Het platte dak ligt op 32,05 tot 32,65 m en steekt 0,2 m over, met een onderkant van 45 graden.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Ouderkerk_aan_den_IJssel)): 1916, Visser & Smit Hanab, 32,5 m, één reservoir van 400 m³, beton en IJsselsteentjes, trappenhuis boven het dak, sinds 1980 buiten gebruik, gedenkplaat boven de ingang.
- BAG-pand 0644100002062228 (PDOK, 2026-11-07): zeskant met hoekpilasters, 77 m², bouwjaar 1916, kantoorfunctie.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-07):
  - maaiveld NAP +3,3 à +3,4 aan de noord- en westkant, oplopend tot +4,2 aan de zuidoostkant
  - reservoirdak NAP +33,2 à +33,25, vlak, straal circa 5,7 m
  - trappenhuisdak NAP +36,0, van 2,3 tot 5,7 m uit het hart langs de zuidoostnormaal, circa 4 m breed
- Luchtfoto (PDOK, 2026-11-07): rond reservoir met lisenenkoppen op de rand, vierkant trappenhuis aan de zuidzuidoostkant, pad naar de deur.
- Foto's op Wikimedia Commons:
  - "Exterieur OVERZICHT - Ouderkerk aan den IJssel - 20302525 - RCE" (1994, vanaf de dijk in het zuidwesten, rechtstandig). Hieruit komen de banden (12,65 en 18,75 m), de overgang (20,95 tot 21,85 m), de onderkant van het trappenhuis (18,55 m), de lisenen tot boven de borstwering, de rij gaten en de verjonging. De hoogtes zijn lineair per diepte omgerekend, met de horizon op de weg als camerahoogte en de schaal uit de schachtbreedte, en aan het AHN vastgezet.
  - "Ouderkerk ad IJssel Watertoren 2986" (2006, vanaf het zuiden): de plint (circa 5 m, uit de dubbele verhouding met de banden), de deur met de gedenkplaat, de velden, de bolle overgang en de uitkraging van het trappenhuis.

## Geschat en weggelaten

Geschat:

- De tussenhoogtes (plint, banden, overgang, onderkant van het trappenhuis) komen uit de twee foto's, met een onzekerheid van circa 0,5 m. Het dak van het reservoir en van het trappenhuis komen uit het AHN.
- De verjonging van de schacht (4,50 naar 4,35 m) en de uitloop van de plint (4,67 naar 4,50 m) komen uit de foto's.
- De straal van het reservoir (5,7 m) en de maat en plaats van het trappenhuis komen uit het DSM en de luchtfoto.
- De bolle overgang is een kegel van 45 graden en de uitkraging van het trappenhuis een schuine onderkant van 45 graden. In het echt is de overgang rond en de uitkraging vrijwel vlak.
- De rij gaten (circa 0,4 m, 0,4 m uit elkaar) is een doorlopende groef van 0,45 m hoog.
- De lisenen (0,9 m breed en 0,9 m boven de borstwering) zijn iets grover dan op de foto.

Weggelaten:

- De smalle vensters (circa 0,35 × 0,9 m): één per veld, kleine vierkante in het bovenste stuk onder het reservoir, drie boven elkaar in het trappenhuis en een laag venster in de zuidwestgevel. Ze zijn kleiner dan 0,9 m, en als nis vulde de export de achterkant van elke nis op.
- Het bovenste baksteenveld (circa 19,2 tot 20,4 m) is vlak. Direct onder de bolle overgang vulde de export het hele veld.
- De vlaggenmast, het hekwerk en het bord bij de ingang.

## Controle

- Generator: status NoError, genus 0, één deel, 1944 driehoeken, 2406 m³; STL 11,6 × 12,0 × 32,9 mm op 1:1000.
- `supportedSolid` op 45 graden voegt niets toe. Een preview-export op 1:1000 (80 × 80 m, `supportMethod` v2) bevat het model zonder ondersteuningsobject, en PDOK-pand 0644100002062228 is weg.
- Renders van vier kanten naast de PDOK-reconstructie (een zeskant met één vlak dak en het trappenhuis als blok) en de RCE-foto.
