# Toren op Zuid (Rotterdam)

Kantoorgebouw aan de Wilhelminakade 123 op de Wilhelminapier, naast de Erasmusbrug. Ontworpen door Renzo Piano Building Workshop en gebouwd van 1998 tot 2000. Het gebouw is 96,5 m hoog en telt 23 verdiepingen. Sinds 2018 heet het De Link; het is het hoofdkantoor van KPN.

De glazen voorgevel naar de brug helt 6° voorover. Hij loopt boven het dak door als een open scherm met een lichtwand van 896 groene lampen en het KPN-logo. Een schuine witte stut steunt de gevel halverwege. V8 Architects voegde in 2017–2018 een glazen plint toe met een uitkragend dak rondom.

Het model bestaat uit benoemde prisma's, hulls en vlakken in een eigen gebouwstelsel, met gevelnissen per laag. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven) en `generate-rabobank-bestuurscentrum.mjs` (gevelnissen op `efteling-kit.mjs`). Reproductie: `node scripts/generate-toren-op-zuid.mjs`.

## Bestanden en plaatsing

- `toren-op-zuid.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, genus 6, 11.768 driehoeken).
- `toren-op-zuid.json`: catalogusitem.
  - RD-oorsprong `[93200, 435790]`: midden in het complex.
  - `xAxis` 39,1°: langs het raster van de plint en de schijf (BAG-gevels). +Y wijst naar de Maas (noordwest), +X naar de Erasmusbrug.
- `toren-op-zuid-1-1000.stl`: millimeters, Z omhoog, 73,2 × 47,2 × 97,5 mm, vlakke voet.

z = 0 ligt op NAP +3,5 m, het kadeniveau (3D BAG-maaiveld 3,47; AHN4-DTM aan de kade +3,46 tot +3,51). De onderkant ligt op −1,0 (NAP +2,5), onder de straat aan de zuidoostzijde (+3,22). `groundOffsetMetres` is 0.

- De `groundSamplePoints` liggen op de kade aan de Maas en de stoep aan de zuidwestkant (`[−20,25] [0,25] [20,25] [−33,−10] [−33,10]`). PDOK geeft daar 46,93 tot 47,06 (ellipsoïdisch). De lagere straat aan de zuidoostzijde (46,86) en het plein aan de brugzijde (47,3 tot 47,5) blijven erbuiten.
- `groundHeight` 47,0 is de PDOK-terreinhoogte op die punten (gemeten op 12 oktober 2026 in de terreintegel).

Het model vervangt één BAG-pand, `0599100000691009` (bouwjaar 2000). PDOK reconstrueert het als LoD2.2, maar trekt de hellende gevel recht omhoog en maakt van het scherm een rij losse schotten. Het enige buurpand in de uitsnede is De Rotterdam (`0599100100002429`), een eigen landmark. Dat pand blijft PDOK; de hoogte (NAP +154,9) past bij het AHN.

## Onderdelen (hoogtes NAP)

### Kantoortoren

- **Plattegrond**: de toren staat 17,6° linksom gedraaid ten opzichte van de plint en de schijf, dus op 56,7° in RD. In het torenstelsel (a, b) is +a de normaal van de hellende gevel, naar de brug.
  - De bovenrand van het scherm volgt in het AHN5 een rechte lijn (u = −0,316 v + 27,5).
  - De zuidoostgevel ligt op b = −27,27 (BAG, verticaal tot het dak), de noordwestgevel op b = +13,6 (AHN5-dakrand). De gevel is dus 40,87 m breed.
- **Hellende gevel**: 6° voorover.
  - De voet ligt op +13,0, op a = 17,05 (de BAG-voetlijn).
  - De bovenrand van het scherm ligt op +100,0, op a = 26,19. Dat is 9,1 m uitkraging.
  - Het AHN5 legt de bovenrand van het scherm op a = 26,2: precies de helling van 6° uit Wikipedia.
- **Lagen**:
  - onder in de toren een donkere band van +13,0 tot +16,8 (twee rijen panelen);
  - daarboven 22 kantoorlagen van 3,114 m tot het dak op **+85,3**.
- **Glasvakken** in de hellende gevel: een raster van 12 traveeën van 3,24 m, 0,35 m diep, loodrecht op de gevel. Stijlen en borstweringen zijn 0,9 m.
- **Zijgevels** (witte panelen):
  - de zuidoostgevel heeft vensters van 1,3 × 2,0 m in verspringende kolommen;
  - de noordwestgevel heeft één kolom vensters bij de sleuf;
  - alle vensters zijn 0,35 m diep.
- **Dak** op +85,3 met drie installatieopbouwen tot **+86,6** (3D BAG).
- **Scherm** boven het dak van +85,3 tot **+100,0**:
  - het scherm is de doorgaande hellende gevel, 1,2 m dik, met drie rijen van 12 blinde vakken van 0,4 m;
  - erachter een ligger van +96,6 tot **+97,8**, 3 tot 3,5 m diep (AHN5), op vijf staanders van 1,0 m.
- **Nis van de stut**: 3,2 m breed, van +43 tot +48 en 2,5 m diep, iets links van het midden van de gevel (foto's).

### Stut

- Witte buis van 44,3 m, 20,5° uit het lood. Hij is 1,2 m dik aan de voet en 2,2 m boven in de nis. De buis staat loodrecht op de gevel, op b = −7,4.
- De voet staat op een zwarte piramide van 5 × 5 m en 1,6 m hoog op het plein, op RD (93225,3, 435815,1). Die plek komt uit de luchtfoto en de cirkelvormige uitsparing van 8 m in het BAG-pand.

### Kern, schijf en sleuven

- **Kern** tot **+91,8** (8 × 23,6 m) met een verlaagd deel op +89,3 (3D BAG).
- **Schijf** aan de zuidwestkant tot **+71,8** (7,9 × 41,7 m, met een verbreding aan de zuidoostkop):
  - twee dakputten tot +67,7 (AHN5);
  - verspringende vensters in de zuidwestgevel en één kolom in de kopgevels.
- **Sleuven** tussen de schijf en de toren:
  - rode lisenen tot **+77,6**, die 0,7 m voor de gevels uitsteken;
  - trappenhuizen tot **+74,8** (AHN5);
  - aan de zuidoostkant een terugliggende wand tot de schijfhoogte.

### Glazen plint (2017–2018)

- **Dak** van +12,4 tot **+13,2**. De omtrek komt uit het AHN5 (+13,0 tot +13,4), vereenvoudigd op 0,5 m.
  - Het dak loopt rondom door, aan de brugzijde tot 19 m voor de voet van de hellende gevel.
  - Waar de stut door het dak gaat, zit een inham.
- **Glasgevel** 1,5 m achter de dakrand, met twee glasbanden. Rond de voet van de stut ligt een plein (BAG-uitsparing).
- **Paviljoen** aan de zuidwestkant tot **+15,5**:
  - een glasband boven het plintdak;
  - twee daklichtstroken tot **+17,0**;
  - een rond dakvenster;
  - een schuine glazen insnijding in de zuidoosthoek, als één vlak van +13,2 tot +5,0 (AHN5).

## Geschat en weggelaten

- **Helling**: 6° komt uit Wikipedia. De BAG-voetlijn en de AHN5-bovenrand bevestigen haar. De hoogte van de voet (+13,0) komt uit foto's: twee lagen boven de kade.
- **Lagen en raster**:
  - 22 kantoorlagen van 3,114 m boven de donkere band;
  - de glasvakken in een raster van 12 in plaats van 24 traveeën, zodat de stijlen 0,9 m blijven;
  - de groene lampen zelf zijn weggelaten (0,3 m).
- **Scherm**: in werkelijkheid een open rooster met het KPN-logo. Het model maakt er een plaat met blinde vakken van, want een open rooster is op 1:1000 niet printbaar. De staanders en de ligger komen van foto's en het AHN5.
- **Stut**: de dikte, de nis en de piramide komen uit foto's; de voet uit de luchtfoto en de BAG.
- **Plint**: de glasgevel 1,5 m achter de dakrand, de glasbanden en de dakdikte zijn geschat.
- **Schuine insnijding** in het paviljoen: één vlak door de AHN5-punten. Het werkelijke verloop (trap of glasdak) is niet te zien.
- **Weggelaten**:
  - de witte ventilatieschoorsteen ("periscoop") bij de zuidoosthoek: staat sinds de uitbreiding onder het plintdak, in de BAG nog als halve cirkel;
  - de gevelonderhoudsinstallatie op het dak, de kunstwerken op de kade en de leuningen (dunner dan 0,9 m).
- **Erasmusbrug, De Rotterdam en World Port Center** zijn eigen landmarks en zitten niet in dit model.

## Controle

- `node scripts/generate-toren-op-zuid.mjs` geeft een gesloten, verbonden model. Twee keer draaien geeft byte-identieke bestanden.
- In `tests/landmark-models.test.ts` van de webshop staat de test "places Toren op Zuid's rotated office tower with the 6-degree leaning facade, …". Die controleert:
  - de oorsprong, het BAG-pand en de maaiveldhoogte;
  - het scherm tot +100,0 op beide hoeken;
  - glasvakken in de onderste en bovenste laag, 6,9 m uit elkaar;
  - dat niets voor het gevelvlak uitsteekt behalve de stut;
  - de nis, de ring halverwege de stut en de piramide;
  - dak, ligger, kern, schijf met dakputten, lisenen, trappenhuizen, plintdak en paviljoen.
- **Printcontrole op 1:1000** (`supportedSolid`, 45°): 106.288 → 106.857 mm³, dat is +0,54 %.
  - De hellende gevel (6° uit het lood) en de stut (20,5° uit het lood) krijgen geen opvulling.
  - De export vult alleen onder de rand van het plintdak (tot +34 mm² per doorsnede), onder het plafond van de nis (+4 mm²) en onder de ligger achter het scherm (43 → 73 mm²).
  - De stut is 1,2 tot 2,2 mm dik en blijft vrij staan.
- **Renders**: van vier kanten naast de PDOK-reconstructie en tegen Commons-foto's vergeleken. Die renders horen niet in deze repo.

## Bronnen

- PDOK: BAG-pand 0599100000691009, Actueel_orthoHR, gebouwtegels en terrein (12 oktober 2026).
- AHN5 DSM 0,5 m (opname 2023), `ahn.arcgisonline.nl` Hoogtebestand/AHN5_DSM_50cm; AHN4 DSM/DTM 0,5 m (PDOK WCS); 3D BAG LoD2.2.
- https://nl.wikipedia.org/wiki/Toren_op_Zuid
- Wikimedia Commons:
  - `Contrafforte_-_panoramio.jpg`
  - `KPN_building_@_Wilhelminapier_@_Kop_van_Zuid_@_Rotterdam_(29933117024).jpg`
  - `KPN_@_Erasmus_Bridge_@_Rotterdam_(30447721252).jpg`
  - `KPN_Building_(Rotterdam)_IMG_5109.jpg`
  - `Rotterdam_-_KPN_Tower_(1).jpg`
  - `TorenOpZuid.jpg`
  - `GraphyArchy_-_Wikipedia_00773.jpg`
  - `GraphyArchy_-_Wikipedia_00977.jpg`
  - `KPN_Building_-_Rotterdam,_Holland_-_panoramio.jpg`
