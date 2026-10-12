# Provinciehuis Noord-Brabant ('s-Hertogenbosch)

Provinciehuis aan de Brabantlaan bij de A2 in 's-Hertogenbosch (Hugh Maaskant, geopend in 1971), 103,5 m hoog. Het complex bestaat uit:

- een laagbouw van twee lagen (149,9 × 64,05 m) op kolommen boven een open parkeerlaag, met rondom een galerij op de eerste verdieping en een overstekende dakplaat;
- midden in de laagbouw de statenzaal met haar vleugelvormige koperen daken;
- aan de oostkant de hoogbouw van 23 lagen: diepe horizontale banden tussen vier massieve hoekpijlers, een dichte borstweringsband en een kroon met een donkere glasstrook onder een zware dakplaat;
- aan de noordzijde de oprit van het voorplein naar de entree op galerijhoogte, met een luifel;
- aan de oostzijde een terras en een loopbrug naar Brabantlaan 3.

Het model bestaat uit benoemde prisma's en dakvlakken in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-pontsteiger.mjs` (gevelnissen per laag op `efteling-kit.mjs`). Reproductie: `node scripts/generate-provinciehuis-noord-brabant.mjs`.

## Bestanden en plaatsing

- `provinciehuis-noord-brabant.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 60, 7.508 driehoeken).
- `provinciehuis-noord-brabant.json`: catalogusitem.
  - RD-oorsprong `[151052.11, 409901.26]`: het hart van de toren (AHN5-omtrek).
  - `xAxis` 1,674°: langs de lange gevels (BAG, hoeken haaks op 0,03 m). +Y wijst naar het noorden (oprit, Brabantlaan), de statenzaal ligt op −X.
- `provinciehuis-noord-brabant-1-1000.stl`: millimeters, Z omhoog, 185,0 × 103,1 × 103,2 mm, vlakke voet.

z = 0 ligt op NAP +2,65 m: het parkeerterrein rondom (AHN-DTM +2,6 tot +2,7). De onderkant ligt op −1,5 (NAP +1,15), onder het peil van de vijver (PDOK-water NAP +1,7), want de westkop met de galerij staat aan en boven het water. `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op het parkeerterrein ten zuiden en oosten van de laagbouw (`[−90,−38] [−40,−38] [10,−38] [40,−25]`). De vijver (PDOK 45,24) en het hogere voorplein aan de noordzijde (48,6) blijven erbuiten.
- `groundHeight` 46,19 is de laagste PDOK-terreinhoogte op die punten (ellipsoïdisch, gemeten op 12 oktober 2026 in de terreintegel).

Het model vervangt één BAG-pand, `0796100000239857`: laagbouw, toren, oprit en oostvleugel zijn samen één pand. PDOK reconstrueert het als LoD2.2 met een dichte laagbouw tot het maaiveld. Het buurpand Brabantlaan 3 (`0796100000277104`, de witte kantoorvleugel met zaagtanddak ten oosten van de waterloop) is een eigen pand en blijft PDOK; zijn reconstructie (tot NAP +22,0) klopt met het AHN (95e percentiel +21,7). De loopbrug houdt 0,5 m voor zijn gevel op.

## Onderdelen (hoogtes NAP)

### Toren

- **Plattegrond** (AHN5-omtrek): het middendeel van de lange gevels (26,9 m breed, 26,0 m lang) steekt 1,7 m buiten de kopeinden uit; de kopeinden zijn 23,5 m breed tot v = ±20,45, met afgeschuinde hoeken van 1,2 m. Totaal 26,9 × 40,9 m.
- **Banden**: 23 lagen van 3,4 m vanaf **+16,2** tot het dak **+94,4**. In de onderste 22 lagen ligt het glas 1,0 m achter de voorkant van de band; het plafond loopt onder 45° naar de voorkant op, zodat het zonder steun print. Banden op de lange gevels over 26 m, op de kopgevels over 11,5 m tussen de pijlers.
- **Hoekpijlers**: dicht, 6,0 m breed op de kopgevels en 7,45 m langs de lange gevels, met een verticale voeg van 0,6 m.
- **Borstwering**: dichte band boven de bovenste laag, **+95,5** in de westhelft en **+97,15** in de oosthelft, vanaf het midden over 5 m oplopend (AHN4 en AHN5 meten dit allebei). Erbinnen het dak op **+94,4** en langs de oostzijde van de kroon een strook op **+96,2**.
- **Kroon** van 17,6 × 31,5 m: dichte wand tot +98,8, een donkere glasstrook 1,0 m terug met penanten tot +101,3, en een dakplaat tot **+103,3** (AHN5 103,2–103,4). Daarop een installatiekast van 5,5 × 3,0 m tot **+104,2** en een opbouwtje tot +104,3.

### Laagbouw

- **Dakplaat** van +14,0 tot **+15,5** (AHN5-mediaan) over de hele BAG-omtrek.
- **Twee kantoorlagen** van 3,45 m (+7,1 tot +14,0), 3,0 m achter de dakrand, met raamstroken per laag tussen penanten op 7,2 m.
- **Hoge gevelkolommen** van 1,2 m, 1,6 m binnen de dakrand, op ca. 7,2 m, van de onderkant tot de dakplaat.
- **Galerij** van +5,6 tot **+7,1** rondom, aan de westkop 3,4 m verder boven het water (AHN5 +7,2).
- **Parkeerlaag** open tussen de kolommen; alleen de kern onder toren en statenzaal (BGT-pand op het maaiveld, 72,6 × 46,7 m) is dicht, met glasstroken.
- **Op het dak** (AHN5): een glazen daklicht en een lichthof (vloer +11,3) west van de toren, zonnepanelen en een patio met beplanting (+11,3) oost van de toren, een lichtstrook langs de westkant van de statenzaal en vijf kleine daklichten.

### Statenzaal

Drie daken naast elkaar over 37,8 m diepte (AHN5-dakvlakken):

- **west** (20,5 m): vrijwel vlak, van **+19,31** naar **+20,31** oplopend naar het oosten;
- **midden** (18,5 m): vlinderdak met de hoge westrand op **+30,0**, de kiel op **+23,55** en de oostrand op **+25,9**;
- **oost** (23 m): naar de toren oplopend van **+20,3** tot **+23,95**, licht geknikt.

Elk dak is een plaat van 1,0 m die het dakvlak volgt. Aan de kopgevels steekt hij 1,5 m over; de onderkant loopt onder 45° naar de gevel (de blauwe onderzijde op de foto's). Onder het middelste dak dragen per kopgevel vier schijven het overstek. In de kopgevels en in de hoge westwand van het middelste dak zitten raamsleuven.

### Noord- en oostzijde

- **Oprit** van het voorplein (**+5,1**) naar de galerij (**+7,2**), met borstweringen van 0,6 m en de vide naar de parkeerlaag (BAG-gat). Erboven bij de entree een **luifel** tot **+11,3** op vier kolommen.
- **Oostvleugel**: terras op galerijhoogte (+7,1) met een borstwering tot +7,7 en een strook tot +10,2 langs de oostgevel; daarbuiten een lager terras (+6,6) op kolommen.
- **Loopbrug** van +7,0 tot **+10,0** naar Brabantlaan 3, met glasstroken.

## Geschat en weggelaten

Geschat:

- **Galerij, dakplaat en kolommen van de laagbouw**: dikte en hoogte uit foto's (RCE); de bovenkant van de galerij uit het AHN aan de westkop. De gevel 3,0 m achter de dakrand en de kolommen van 1,2 m op ca. 7,2 m zijn geschat.
- **Torenlagen**: 23 lagen van 3,4 m (Wikipedia: 23 verdiepingen), passend tussen het laagbouwdak en het torendak. De bovenste laag is als dichte borstwering gemodelleerd. De echte banden zijn dunner en dieper; het schuine plafond is een keuze voor de print.
- **Hoekpijlers**: breedte uit de AHN-omtrek en foto's; de holle overgang van pijler naar band is weggelaten.
- **Kroon**: alleen de dakhoogte komt uit het AHN. De verdeling in dichte wand, glasstrook en dakplaat komt uit foto's.
- **Statenzaal**: de dakvlakken zijn gemeten. Overstek, dakplaat, de schuine onderzijde en de schijven onder het middelste dak komen uit foto's; de zaal zelf is een dicht volume onder de daken.
- **Luifel, terras en loopbrug**: onderkanten en kolommen geschat.

Weggelaten:

- **Binnenkolommen van de parkeerlaag**: niet te zien; alleen de randkolommen en de dichte kern.
- **Witte betonlamellen** op delen van de laagbouwgevel en de **leuningen** van de galerij: dunner dan 0,9 m.
- **Antennemast** op de kroon (AHN5 tot +107,7): dunner dan 0,9 m.
- **Trappen** van het oostterras naar het water: treden kleiner dan 0,9 m.
- **Het kunstwerk** in de vijver (*Uit voor en tegen een zaak die draait*) en de vijver zelf: geen deel van het pand; de vijver staat in het PDOK-terrein.
- **Brabantlaan 3**: eigen pand, blijft PDOK (zie boven).

## Controle (12 oktober 2026)

- **Generator**: `NoError`, één deel, genus 60, 208.258 m³. Twee keer draaien geeft byte-identieke bestanden.
  - Ondervlakken: de galerij boven de open parkeerlaag (6.940 m² op +5,6), de dakplaat boven de teruggezette gevel, de luifel en de kroonplaat boven de glasstrook.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`. De eigen test controleert:
  - catalogus, vervangen pand, `groundHeight`, voet (−1,5) en top (+104,3);
  - de omtrek van de toren met de borstwering op +95,5 en +97,15, het dak op +94,4, de kroon tot +103,3 en de installatiekast;
  - het glas 1,0 m achter de westgevel in 22 lagen en de dichte bovenste laag;
  - het laagbouwdak, de galerij aan de westkop en de open parkeerlaag;
  - de randen van de drie statenzaaldaken op beide kopgevels;
  - oprit, luifel en loopbrug.
- **Printcheck** op 1:1000 bij 45° (`supportedSolid`, gedeeld zoals in de export): 208.258 → 237.987 mm³, 14,3 % opvulling. De opvulling zit onder de galerij in de open parkeerlaag (wiggen vanaf kolommen en kern), onder de westkop en onder terras, loopbrug en luifel. De torenbanden en de overstekken van de statenzaal printen zonder opvulling (doorsneden boven 12 mm voor en na gelijk).
- **Renders** naast de PDOK-reconstructie op −35°, 55°, 145° en 235° (30° hoogte) en naast Commons-foto's. PDOK heeft de toren met hoekpijlers, de kroon en de drie statenzaaldaken, maar een dichte laagbouw tot het maaiveld en gladde gevels. Het model heeft per kant meer:
  - **Zuidzijde (−35°)**: de galerij met de open parkeerlaag en de kolommen, de raamstroken van de laagbouw, de torenbanden tussen de pijlers op de zuidkop, het overstek van de statenzaal met schijven.
  - **Westzijde (55°)**: de westkop met de galerij boven het water, de raamsleuven in de hoge westwand van het vlinderdak, de banden op de lange westgevel van de toren.
  - **Noordzijde (145°)**: de oprit met vide en luifel, de noordkop van de toren met banden, daklichten en lichthof.
  - **Oostzijde (235°)**: oostterras, loopbrug, patio en zonnepanelen naast de toren, de banden op de oostgevel en de oplopende borstwering.

## Bronnen

- PDOK BAG `0796100000239857`, BGT-pand van dat pand op het maaiveld en Actueel_orthoHR; 12 oktober 2026.
- AHN5 DSM 0,5 m (opname 2023), [ahn.arcgisonline.nl](https://ahn.arcgisonline.nl/arcgis/rest/services/Hoogtebestand/AHN5_DSM_50cm/ImageServer): toren, kroon, daken, statenzaal, galerij, oprit, luifel, terras en loopbrug. AHN4 DSM/DTM 0,5 m (PDOK WCS) ter controle en voor het maaiveld.
- [Wikipedia: Provinciehuis (Noord-Brabant)](https://nl.wikipedia.org/wiki/Provinciehuis_(Noord-Brabant)): 103,50 m, 23 verdiepingen, laagbouw van twee lagen met de statenzaal, parkeerruimte onder het gebouw.
- Commons-foto's van alle kanten (RCE en anderen): [20413415](https://commons.wikimedia.org/wiki/File:Overzicht_-_%27s-Hertogenbosch_-_20413415_-_RCE.jpg) (noordzijde: galerij, kolommen, statenzaal, kroon), [20413416](https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413416_-_RCE.jpg) (zuidzijde: toren, laagbouw op kolommen), [20413397](https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413397_-_RCE.jpg), [20413398](https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413398_-_RCE.jpg), [20413414](https://commons.wikimedia.org/wiki/File:Overzicht,_vijver_met_kunstwerk_op_de_voorgrond_-_%27s-Hertogenbosch_-_20413414_-_RCE.jpg), [20348592](https://commons.wikimedia.org/wiki/File:Overzicht_-_%27s-Hertogenbosch_-_20348592_-_RCE.jpg) (1971), [vanaf de Guido Gezellelaan](https://commons.wikimedia.org/wiki/File:Provinciehuis_Noord-Brabant_vanaf_de_Guido_Gezellelaan.jpg), ['s-Hertogenbosch - Provinciehuis Noord-Brabant](https://commons.wikimedia.org/wiki/File:%27s-Hertogenbosch_-_Provinciehuis_Noord-Brabant.jpg).
