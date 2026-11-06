# Watertoren DuPont (Dordrecht)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-dordrecht-dupont.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: ketel, omloop, bodem, dak, ontluchting en middenbuis zijn één omwentelingsprofiel (96 segmenten), de poten cilinders en de windverbanden capsules (hull van twee bollen) tussen de pootharten.

De watertoren staat op het fabrieksterrein van DuPont de Nemours aan de Baanhoekweg in Dordrecht (nu Chemours). Hij werd in 1961 gebouwd naar ontwerp van Vries Robbé & Co N.V., is 46,5 m hoog en heeft een reservoir van 570 m³ (Wikipedia). Het is een stalen vakwerktoren: acht loodrechte poten in een regelmatige achthoek met per vak gekruiste windverbanden en horizontale ringen, een middenbuis (stijgleiding) tot in de bodem, een ronde stalen ketel met een bolle bodem, een rondlopende omloop met leuning aan de voet van de ketel en een vlak kegeldak met een leuning en een ontluchting. Op de ketel staat het DuPont-logo. De toren staat er nog (luchtfoto en AHN).

De toren is geen BAG-pand: in de BAG-WFS en in de PDOK-gebouwtegels staat op deze plek niets (het dichtstbijzijnde pand, 0505100000012784, is een hokje van 2,6 bij 1,8 m op 12 m ten noorden). `replacesBuildings` is daarom leeg; de kaart toont hier zonder dit model alleen terrein.

## Bestanden

- `watertoren-dordrecht-dupont.glb`: één node, `building:watertoren-vakwerk-middenbuis-ketel-omloop-en-dak`.
- `watertoren-dordrecht-dupont.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints` en `groundHeight`, zonder vervangen pand.
- `watertoren-dordrecht-dupont-1-1000.stl`: het model op 1:1000 (12,6 × 12,6 × 47,7 mm).

## Oorsprong en oriëntatie

RD-oorsprong [109225.26, 425681.73] (51,81787 N, 4,72332 O): het hart van de achthoek van de poten, de cirkel door de drie voeten die op de luchtfoto (Actueel_orthoHR, 8 cm) te zien zijn: (109222,2; 425677,9), (109226,1; 425676,9) en (109229,4; 425679,1), straal 4,9 m. Het zwaartepunt van het AHN-DSM boven NAP +30 ligt 0,6 m van dat hart. Maaiveld AHN-DTM NAP +3,8 (vlak, 3,76 tot 3,89 tussen 6 en 12 m).

De lokale X-as staat 9,6 graden linksom van RD-oost (`xAxis` [0.986, 0.16677]), door een poot; de poten staan op k × 45 graden (gemeten 6,4, 9,9 en 12,6 graden plus een veelvoud van 45, dus circa 3 graden onzeker). Op de luchtfoto lopen de linker- en rechterrand van het vakwerk evenwijdig omhoog: de poten staan loodrecht.

`groundSamplePoints` liggen op 8 m in de vier asrichtingen, buiten de omloop (6,3 m); `groundHeight` 47,38 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op die punten (oost 47,45, west 47,46, noord 47,38, zuid 47,48, gemeten 2026-11-06). `groundOffsetMetres` is −0,1.

## Onderdelen

Maten en hoogtes boven het maaiveld (NAP +3,8).

- Poten: acht cilinders van 1,0 m doorsnede met het hart op 4,9 m van de oorsprong, van de onderkant tot in de bodem van de ketel.
- Windverbanden: in elk van de acht zijvlakken zeven vakken van 5,15 m hoog (tot 36,05 m) met een kruis van twee staven van 0,9 m dik, van pootknoop naar pootknoop onder 54 graden.
- Middenbuis: 1,2 m doorsnede van de grond tot de bodem op 31,7 m.
- Bodem: een kegel onder 45 graden van de middenbuis (31,7 m) tot de rand van de omloop (6,3 m op 37,4 m); de poten komen erin uit.
- Omloop: rand van 12,6 m doorsnede van 37,4 tot 38,1 m, vloer op 38,1 m rond de ketel.
- Ketelmantel: 9,9 m doorsnede van 38,1 tot 46,5 m.
- Dak: vlakke kegel (6 graden) tot 46,95 m, ontluchting van 1,2 m doorsnede tot 47,4 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Dordrecht_DuPont)): 1961, Vries Robbé & Co N.V., 46,5 m, 570 m³, op het terrein van DuPont de Nemours.
- Foto "Dordrecht Watertoren Dupont 2010.JPG" op Wikimedia Commons (vanaf de weg, van onderaf): acht poten (vier poten zichtbaar aan elke kant van de middenbuis, verhouding 0,42 zoals bij een achthoek met een vlak naar de camera), zes gelijke vakken met kruisverbanden en ringen onder de bodem en één vak tussen de bodem en de omloop, de middenbuis, de bolle bodem, de omloop met leuning en het dak met leuning. Er is maar één foto (fabrieksterrein).
- AHN DSM/DTM 0,5 m (PDOK WCS, 2026-11-06): maaiveld NAP +3,8; dak NAP +50,75 in het midden en +50,4 à +50,6 op 3,5 tot 4,5 m (46,6 tot 46,95 m boven het maaiveld); hoogste punt NAP +51,36 (leuning of ontluchting); op 5,25 tot 6 m van het hart niets boven NAP +41,9 (omloop); buiten 6,75 m niets boven NAP +40. Het vakwerk geeft verspreide punten, de ketel weinig.
- PDOK-luchtfoto (Actueel_orthoHR): voeten van de poten, ketel van 9,9 m en omloop van 12,6 m doorsnede (verhouding 0,79, zoals op de foto).
- PDOK BAG-WFS en gebouwtegels (2026-11-06): geen pand op de toren.

## Geschat en weggelaten

Geschat: de hoogte van de omloop (38,1 m) is het hoogste AHN-punt boven de omloop en kan de leuning zijn (dan ligt de vloer circa 1 m lager); de bovenkant van de mantel (46,5 m) en het dak komen uit het AHN. De bodem is in werkelijkheid bol; hier een kegel onder 45 graden van de middenbuis tot de rand van de omloop, met de onderkant (31,7 m) net boven de bovenste ring zoals op de foto. De vakverdeling (zeven gelijke vakken tot de omloop) en de hoek van de poten (circa 3 graden onzeker) komen uit de foto en de luchtfoto. Poten (1,0 m), windverbanden (0,9 m) en middenbuis (1,2 m) zijn dikker dan in het echt, zodat ze op 1:1000 printbaar zijn; het vakwerk oogt daardoor dichter dan op de foto.

Weggelaten: de horizontale ringen tussen de poten (in werkelijkheid dunner dan 0,9 m, en als vrije overspanning van 3,75 m niet zonder steun te printen), de stangen van de ringen naar de middenbuis, de consoles onder de omloop (binnen de kegel), de leuningen van de omloop en het dak, ladders en flenzen (dunner dan 0,9 m), en het logo (verf).

## Controle

Eén gesloten NoError-node, één component, genus 168 (de openingen in het vakwerk). In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet: de windverbanden lopen onder 54 graden, de bollen aan hun einden liggen binnen de poten en de bodem loopt onder 45 graden. Een export op 1:1000 (80 m uitsnede, steunmethode v2, 45 graden) bevat het model met hetzelfde volume als zonder steun en zonder ondersteuningsobject. Controlebeelden blijven buiten de repo. PDOK toont op deze plek geen gebouw; het model voegt de hele toren toe.

Controle-URL: http://localhost:3000/kaart/51.81787/4.72332/200/1x1/0
