# World Port Center (Rotterdam)

Kantoortoren aan de Wilhelminakade 909, op de kop van de Wilhelminapier, tussen Hotel New York, Montevideo en de Cruise Terminal. Ontworpen door Foster and Partners en opgeleverd in 2001. De toren telt 32 verdiepingen en is ongeveer 124 m hoog. De grootste gebruiker is het Havenbedrijf Rotterdam.

De toren is geen ovaal maar een samenstelling: een halfronde kop naar de kop van de pier, een lager rechthoekig oostblok en daartussen een donkere schijf die boven beide uitsteekt. Boven de kop zit een kroon met een uitkragende ronde dakplaat (de "hoed"). Rond de voet ligt een brede, flauw aflopende luifel op ronde kolommen.

Het model bestaat uit benoemde prisma's, stadionvormen (halve cirkel plus rechthoek), hulls en vlakken in een eigen gebouwstelsel, met glasbanden per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden: `generate-evoluon.mjs` (aanpak primitieven), `generate-toren-op-zuid.mjs` en `generate-rabobank-bestuurscentrum.mjs`. Reproductie: `node scripts/generate-world-port-center.mjs`.

## Bestanden en plaatsing

- `world-port-center.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 4, 32.184 driehoeken, 1,2 MB).
- `world-port-center.json`: catalogusitem.
  - RD-oorsprong `[92881.5, 435528.7]`: het middelpunt van de halfronde kop (cirkelfit op het AHN5; kop, dakplaat, schijf en luifel hebben hetzelfde middelpunt binnen 0,1 m).
  - `xAxis` 39,1°: langs de lange gevels (BAG-gevels 39,1–39,3°). +X wijst naar het oostblok en de Cruise Terminal, +Y naar de Maas (noordwest). De kop wijst naar −X, naar Hotel New York.
- `world-port-center-1-1000.stl`: millimeters, Z omhoog, 100,2 × 52,3 × 124,6 mm, vlakke voet.

z = 0 ligt op NAP +3,5 m, het niveau van kade en plein (AHN4-DTM +3,45 tot +3,6). De onderkant ligt op −1,0 (NAP +2,5), onder de straat aan de zuidkant (+3,25). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op de kade aan de Maas (`[−23,31] [7,31] [37,31]`), op het plein aan de oostkant (`[52,0]`) en op de stoep aan de zuidwestkant (`[−28,−21]`). PDOK geeft daar 47,09 tot 47,15 (ellipsoïdisch). De lagere straat aan de zuidkant (46,85) blijft erbuiten.
- `groundHeight` 47,1 is de PDOK-terreinhoogte op die punten (gemeten op 12 oktober 2026 in de terreintegel).

Het model vervangt één BAG-pand, `0599100000691020` (bouwjaar 2000): de begane grond, het paviljoen en het terras horen bij hetzelfde pand. PDOK reconstrueert het als LoD2.2 met een vlakke ring als luifel en een achthoekige kop. Er raakt geen buurpand aan het model. Hotel New York, Montevideo en de Cruise Terminal zijn eigen panden (en deels eigen landmarks) en zitten niet in dit model; het pand in aanbouw ten zuiden van de straat (`0599100110022000`, 2025) ligt 15 m van de luifel.

## Onderdelen (hoogtes NAP)

### Kop en oostblok

- **Plattegrond**: één stadion met straal 15,6 m (AHN5-fit; de BAG-gevel op maaiveld ligt op 15,3), van de westpunt tot de oostgevel op u = 39,0. De grens tussen kop en oostblok ligt op u = 16,1.
- **Kop** tot **+107,5**: 27 kantoorlagen van 3,44 m boven de luifel (vloer van de eerste laag +14,6). Per laag een glasband van 2,0 m, 0,35 m achter de borstweringen van 1,44 m. De bovenste laag is helemaal glas. Boven het oostblok lopen de banden door in de oostgevel van de kop.
- **Oostblok** tot **+86,1** met een rand van 1 m breed op **+87,1**: 20 lagen met dezelfde banden, daarboven een dichte rand van +83,4 tot +87,1.
  - dakput aan de zuidkant tot **+82,9** (AHN5);
  - installatieput aan de noordkant tot +83,4 met twee installatieblokken tot +85,3.
- **Sleuven** tussen kop en oostblok in de noord- en zuidgevel: 4,5 m breed (u 11,6 tot 16,1) en 3,3 m diep, open van de luifel tot het dak van de kop (AHN4 ziet in de sleuf de luifel op +15,4). Op de foto's is dat de donkere glazen strook over de volle hoogte.

### Schijf

- Donkere schijf van 11,0 m breed met een halfronde westkop (straal 5,5, AHN5-fit 5,52), van de kop tot u = 27,4 boven het oostblok.
- Dak **+126,0** binnen een rand van 0,75 m op **+126,5**; installatieput tot **+124,7** en drie opbouwen tot **+127,1** (AHN5).
- Vensters: drie kolommen per laag in de oostgevel boven het oostblok en één kolom in de lange gevels bij de oostkant.

### Kroon boven de kop

- **Trommel** (straal 7,0) van +107,5 tot +113,8 met een vensterband van +111,3 tot +112,6.
- **Balkonplaat** (straal 9,6) van +113,8 tot **+114,7**.
- **Glazen verdieping** (straal 7,5) tot +120,3, met stijlen van 0,9 m om de 3 m.
- **Dakplaat** (straal 10,0, AHN5-fit 10,03) van +120,3 tot **+121,3**, de "hoed". Alle kroondelen lopen recht door tot u = 16,1.

### Luifel en begane grond

- **Luifel**: stadion met straal 26,0 m tot u = 45,4 (AHN5). Het dak loopt van **+14,95** aan de torengevel naar **+13,35** aan de rand; de plaat is 1,0 m dik.
- **Kolommen**: ronde kolommen van 1,0 m op 1,2 m binnen de rand, om de ca. 8 m, en een ronde kolom van 3,8 m bij de zuidelijke sleuf (BAG-cirkel).
- **Glazen begane grond**: de BAG-voetafdruk binnen 2,5 m van de luifelrand, met twee glasbanden van 0,35 m. Aan de zuidkant volgt hij de BAG-gevel, gelijk met de torengevel; daar kraagt de luifel 10 m uit.

### Paviljoen en terras

- **Paviljoen** aan de westkant tot **+7,6** (AHN5), met een schuine glazen westgevel van +4,7 op de BAG-rand tot +7,6 op 3,7 m daarachter, en een glasband van 0,35 m.
- **Terras** ten noorden van het paviljoen op **+4,8** (AHN5) tot de BAG-grens, met aan de zuidkant een trap van drie treden (+4,55, +4,25, +3,95) naar het plein.

## Geschat en weggelaten

- **Laaghoogte en banden**: 27 banden in de kop geteld op een frontale foto (Commons, westkant); de verdeling glas/borstwering (2,0/1,44 m) en de 20 lagen van het oostblok zijn geschat.
- **Kroon**: alleen de bovenkant van de dakplaat (+121,3) staat in het AHN. De trommel, de balkonplaat, de glazen verdieping en hun stralen komen uit foto's vanaf de Euromast en de Maas; de dakplaat is in werkelijkheid dunner (ca. 0,5 m) en is op 1,0 m gezet.
- **Sleuven**: breedte en diepte uit AHN4 en AHN5 (gaten tot de luifel); de glazen gevel in de sleuf is niet apart gemodelleerd.
- **Luifel**: dikte 1,0 m, kolommen en hun afstand uit foto's; de glazen gevel 2,5 m binnen de rand geschat. Aan de zuidkant zijn geen foto's van dichtbij; de kolommen daar zijn aangenomen.
- **Dakputten**: het AHN5 heeft in de noordelijke put geen bruikbare waarden (glas of installaties). De diepte komt uit het AHN4 en de luchtfoto, de twee blokken staan voor de vier ventilatoren.
- **Vensters in de schijf**: kolommen en maten geschat naar foto's vanuit het oosten en de Maas.
- **Weggelaten**:
  - de antennemast en de weerpaal op de schijf en de gevelonderhoudsinstallatie aan de noordoostkant (dunner dan 0,9 m);
  - de zonweringsribben die per laag een paar decimeter uit de kop steken;
  - de glazen balustrades op het paviljoen en het balkon, de letters en logo's.
- **Hotel New York, Montevideo en de Cruise Terminal** zitten niet in dit model.

## Afwijkingen van de backlog-opmerking

De backlog noemde een ovale of elliptische toren met een halfronde kop. Het AHN5 en de foto's laten een halfrond met een recht oostblok zien, geen ellips: de kop, de dakplaat, de schijf en de luifel zijn concentrische halve cirkels (stralen 15,6, 10,0, 5,5 en 26,0) met rechte lange gevels. Het hoogste punt is het dak van de schijf (+126,0, met opbouwen +127,1), dus ca. 123 m boven het maaiveld.

## Controle

- `node scripts/generate-world-port-center.mjs` geeft een gesloten, verbonden model. Twee keer draaien geeft byte-identieke bestanden.
- In `tests/landmark-models.test.ts` van de webshop staat de test "places the World Port Center's half-round head with glass bands, …". Die controleert:
  - de oorsprong, het BAG-pand en de maaiveldhoogte;
  - de kop (+107,5) op de westpunt en de lange gevels, het oostblok (+87,1 en +86,1) en de dakputten;
  - dat de sleuven tussen kop en oostblok open zijn van de luifel tot het dak van de kop;
  - de schijf met rand, dak en opbouwen, de dakplaat en de balkonplaat en de teruggelegen glazen verdieping;
  - de luifelrand en -onderkant, een kolom, het paviljoen, het terras, de trap en de glasbanden.
- **Printcontrole op 1:1000** (`supportedSolid`, 45°): 170.269 → 176.058 mm³, dat is +3,4 %.
  - De export vult vooral onder de luifel: aan de zuidkant, waar hij 10 m uitkraagt, een wig naar de begane grond; elders tussen de kolommen en de glazen gevel.
  - Onder de dakplaat en de balkonplaat van de kroon (2,5 m uitkraging) en onder de bovenkant van de glasbanden vult hij smal op.
  - De kolommen zijn 1,0 mm dik en blijven vrij staan.
- **Renders**: van vier kanten naast de PDOK-reconstructie en tegen Commons-foto's vergeleken. Die renders horen niet in deze repo.

## Bronnen

- PDOK: BAG-pand 0599100000691020, Actueel_orthoHR, gebouwtegels en terrein (12 oktober 2026).
- AHN5 DSM 0,5 m (opname 2023), `ahn.arcgisonline.nl` Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS).
- https://nl.wikipedia.org/wiki/World_Port_Center
- Wikimedia Commons:
  - `(NLD-South_Holland)_Rotterdam_World_Port_Center_2025-06-04.jpg`
  - `Euromast_-_Scheepvaartkwartier_-_Rotterdam_-_View_of_World_Port_Center.jpg`
  - `Rotterdam_toren_worldportcenter.jpg`
  - `World_Port_Center.JPG`
  - `Kop_van_Zuid,_Rotterdam,_Netherlands_-_panoramio_(8).jpg`
  - `Kantoor_PortofRotterdam.jpg`
