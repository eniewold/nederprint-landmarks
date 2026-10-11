# Forum Groningen (Groningen)

Cultuurgebouw aan de Nieuwe Markt naast de Grote Markt (NL Architects, geopend 29 november 2019), circa 48 m boven de straat. Het gebouw is een veelvlak in natuursteen met een zeshoekig grondvlak en een zeshoekig dakterras. De acht zijvlakken zijn achtereenvolgens een vierhoek, een driehoek met de punt omhoog, een vierhoek en een driehoek met de punt omlaag, en dan nog eens die vier; geen enkel vlak is verticaal (Wikipedia). Reproductie: `node scripts/generate-forum-groningen.mjs`. Voorbeelden: `generate-evoluon.mjs` (aanpak primitieven), `generate-cooltoren.mjs` en `generate-montevideo.mjs`.

De backlog noemt "uitstekende ramen" en "vlakken uit het AHN". De vlakken klopten; de ramen niet. Op de foto's liggen de vensters vrijwel vlak in de schuine natuursteen, met een smalle neg. Ze zijn daarom als nissen gemodelleerd, niet als uitstekende blokken.

## Bestanden en plaatsing

- `forum-groningen.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 3.022 driehoeken).
- `forum-groningen.json`: catalogusitem.
  - RD-oorsprong `[234026, 582018]`, midden op het dak.
  - `xAxis` 22°: langs de lange noordgevel (BAG-gevel 22,1°). +X wijst naar het oostnoordoosten, +Y naar het noordnoordwesten.
- `forum-groningen-1-1000.stl`: millimeters, Z omhoog, 79,5 × 45,8 × 48,9 mm, vlakke voet.

z = 0 ligt op NAP +4,5 m, de straat aan de oostkant (AHN-DTM +4,45 tot +4,55). Het maaiveld loopt naar het westen op: de Nieuwe Markt ligt op +6,3 tot +6,5, en daar zit de voet ongeveer 2 m in het terrein. De voet loopt door tot −1,2 m (NAP +3,3). `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de straat aan de oostkant: `[40,−28] [43,−12] [42,−1]`.

Het model vervangt twee BAG-panden:

- `0014100022188313`: het Forum zelf (bouwjaar 2020, 2.677 m² voetafdruk).
- `0014100022188314`: de ondergrondse parkeergarage (390 plaatsen) en fietsenkelder. De BAG-contour daarvan omvat het Forum en de westelijke helft van de Nieuwe Markt. De 3D BAG heeft geen model van dit pand, maar de PDOK-gebouwtegels wel: dat blok neemt de punten van het Forum mee en staat tot de dakrand (in de eerste export tot 59,6 mm op 1:1000, net boven het model). Zonder vervanging bedekte dat blok het dak en de noordgevel van het model. Op de Nieuwe Markt blijft het PDOK-terrein liggen; onder maaiveld is niets gemodelleerd.

Buren: geen enkel ander PDOK-pand in de export komt in de buurt van het Forum hoger dan 22 mm. Het pand ten noorden (`0014100040033834`, in aanbouw) ligt 3 tot 5 m van de noordgevel. De Martinitoren (het dichtstbijzijnde landmarkmodel) staat 150 m naar het westnoordwesten.

## Hoogtebron

Het AHN op PDOK (AHN4) bevat het voltooide gebouw. De 3D BAG van het pand is op dezelfde AHN4-opname gereconstrueerd (`b3_pw_bron` ahn4, 2022); voor AHN5 heeft de 3D BAG hier nog geen punten. AHN5 was dus niet nodig.

| Onderdeel | NAP | Bron |
| --- | --- | --- |
| Dakrand (zeshoek) | +52,15 | 3D BAG 52,17–52,22, AHN 52,0–52,2 |
| Patio (verdiept dakterras) | +47,75 | 3D BAG 47,74–47,77, AHN 47,5–48,0 |
| Punt zuidoostdriehoek (B2) | +4,64 | AHN-vlak, maaiveld +4,5 |
| Punt noordwestdriehoek (B5) | +6,26 | AHN-vlak, maaiveld +6,3 |

## Opbouw: een convexe veelvlak uit tien halfruimtes

Het gebouw is convex. De massa is daarom de doorsnede van acht gevelvlakken met het dak en de onderkant, elk een planvergelijking; er zijn geen gestapelde DSM-lagen.

- **Dak**: de zeshoek van de 3D BAG-dakrand. T2 en T3 liggen op het gemeten vlak van de zuidoostdriehoek, T5 en T6 op dat van de noordwestdriehoek.
- **Voet**: de zeshoek van de BAG-voetafdruk zonder de twee dakhoeken die erbuiten uitkragen, met de maaiveldhoogte uit het AHN bij elk hoekpunt.
- **Vierhoeken**: de bovenrand loopt evenwijdig aan de onderrand (BAG). De noord- en zuidvierhoek zijn scheve parallellogrammen: de bovenrand ligt 35 tot 37 m verschoven ten opzichte van de onderrand.
- **Driehoeken met de punt omlaag** (zuidoost en noordwest): in het AHN gemeten. Het vlak, robuust gefit op 1.400 en 950 DSM-punten met 97 en 86 % binnen 0,5 m, gaat door de dakhoeken en eindigt precies op het maaiveld.
- **Driehoeken met de punt omhoog** (noordoost en zuidwest): kragen uit naar de twee dakhoeken die buiten de voet liggen (BAG-voetafdruk). Het AHN ziet ze niet.

| Gevelvlak | Vorm | Helling uit het lood |
| --- | --- | --- |
| zuid | vierhoek | 9,1° naar binnen |
| zuidoost | driehoek, punt omlaag | 24,7° naar binnen |
| oost | vierhoek | 5,0° naar binnen |
| noordoost | driehoek, punt omhoog | kraagt 12,9° uit |
| noord | vierhoek | 9,4° naar binnen |
| noordwest | driehoek, punt omlaag | 18,4° naar binnen |
| west | vierhoek | 5,3° naar binnen |
| zuidwest | driehoek, punt omhoog | kraagt 6,5° uit |

Een controle van het eerste omhulsel tegen het DSM gaf een mediane afwijking van 0,0 m. De afwijkingen zaten alleen langs de steile gevels (glas en randpixels) en in de patio.

## Onderdelen

- **Dakterras**: de verdiepte patio op +47,75, een langgerekte zeshoek van 21 × 10,5 m met de punt naar het oosten (AHN). Aan de oostkant loopt een zittrap van acht treden van 0,55 m × 0,95 m naar de dakrand (AHN: helling van +47,75 naar +52,15 over 7,6 m).
- **Openingen in het dak** (ortho en AHN):
  - het trapgat in de zuidwesthoek (4,0 × 2,6 m tot +49,7);
  - het lichtgat ten oosten van de patio (2,8 × 1,6 m tot +49,5);
  - het glazen dak boven het atrium in de noordoosthoek, als nis van 0,5 m.
- **Glazen zigzag** (de "kloof" achter de gekruiste roltrappen) over de lange noordzijde. De banden lopen over de noordvierhoek met uitlopers in de noordwest- en noordoostdriehoek; per laag is het een glasband van vloer + 0,4 tot vloer + 4,0. Ze zijn 0,5 m diep loodrecht op elk vlak, met 0,95 m steen tussen de lagen (x-bereiken per laag uit de foto vanaf de Martinitoren). De zuidzijde heeft dezelfde banden, puntsymmetrisch gespiegeld; de ortho toont daar glasbanden in de zuidvierhoek en de zuidoostdriehoek. Onder de bovenste vensterrij ligt aan beide kanten een smalle donkere band.
- **Vensters**: 150 liggende vensters als blinde nissen van 0,35 m, loodrecht op het vlak.
  - Ze zijn 1,3 m hoog en 1,3, 2,2 of 3,2 m breed, met de onderkant 1,0 m boven de vloer.
  - Ze staan in verspringende rijen per laag, nooit over een glasband. De bovenste laag heeft een regelmatige rij onder de dakrand, zoals op de foto's.
- **Begane grond**: een glazen pui van 0,5 m diep aan de smalle oost- en westgevel. Aan de westkant ligt de entree aan de Nieuwe Markt met het terras.

## Geschat en weggelaten

Geschat:

- **Verdiepingshoogte**: tien lagen van 4,55 m vanaf de vloer op +6,5, uit de vensterrijen op de foto's (circa 4,2–4,6 m per rij).
- **Glazen zigzag**:
  - de x-bereiken per laag zijn van één schuine foto (vanaf de Martinitoren) afgelezen;
  - de zuidzijde is puntsymmetrisch aangenomen. Er is geen frontale foto van de zuidgevel gevonden; de ortho bevestigt alleen dat daar glasbanden zitten.
- **Vensters**: maat en ritme uit foto's. Het werkelijke patroon per gevel is niet overgenomen; de plaatsing volgt een vaste pseudo-willekeurige reeks, dus het script geeft steeds hetzelfde model.
- **Zittrap**: als acht gelijke treden. Het glazen dak is als vlakke nis gemodelleerd, omdat het AHN er door het glas ruis geeft.

Weggelaten:

- **Glazen balustrade rond het dakterras** (circa 1,2 m hoog, glas): dunner dan 0,9 m.
- **Stalen pergola op het dak**: profielen dunner dan 0,9 m.
- **Kozijnstijlen en de stijlen in de glasbanden**: kleiner dan 0,9 m.
- **Ondergrondse parkeergarage en fietsenkelder**: onder maaiveld.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 94.822 m³. De ondervlakken zijn de plafonds van glasbanden en vensternissen.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 381 geslaagd. De eigen test controleert:
  - catalogus en beide vervangen panden, voet en dak;
  - de zes dakhoeken op +52,15;
  - de uitkraging van de noordoostdriehoek en de punt van de zuidoostdriehoek;
  - de patio op +47,75 met zeven tussentreden van de zittrap;
  - glasbanden aan de noord- en zuidzijde in drie lagen.
- **Printcheck** op 1:1000 bij 45°: 0,06 % extra volume. De uitkragende driehoeken (6,5° en 12,9°) hangen ruim binnen de printhoek.
- **Export**: `createModelBundle` op 1:1000, RD `[233950,581960,234100,582070]` (vierkant uitgebreid naar 150 × 150 mm). Duur 1,5 s, 187 objecten, 53.882 driehoeken, vijf vellen, modelhoogte 59,4 mm. Het landmarkobject staat compleet in de 3MF en beide vervangen panden ontbreken. In de eerste export stond pand `0014100022188314` als blok tot de dakrand over het model; daarom staat het nu in `replacesBuildings`.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° (30° hoogte), op −60°, 30°, 120° en 210°, en van bovenaf. De 3D BAG (LoD2.2) heeft verticale wanden op de voetafdruk met de hellende driehoeken als trapsgewijze daken, en vlakke gevels zonder vensters. Het model heeft per kant meer:
  - **Noordwest (−35°/−60°)**: de schuine noordvierhoek en de omgekeerde noordwestdriehoek met de glazen zigzag, de vensterrijen en de smalle westgevel met de glazen pui.
  - **Noordoost (30°/55°)**: de uitkragende noordoostdriehoek met vensters, de noordzijde van de zigzag en de patio met zittrap.
  - **Zuidoost (120°/145°)**: de omgekeerde zuidoostdriehoek met de punt op de straat, de zuidvierhoek met de gespiegelde glasbanden, de oostgevel met pui, en de bovenste vensterrij.
  - **Zuidwest (210°/235°)**: de uitkragende zuidwestdriehoek, de westgevel die naar boven versmalt (zoals op de foto's vanaf de Nieuwe Markt), en het trapgat en de zittrap op het dak.
- **Bovenaanzicht**: het model ligt op de BAG-voetafdruk; de twee uitkragende dakhoeken liggen op de hoeken van de BAG-contour.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/53.21894/6.57032/350/1x1/0)): het model ligt op de PDOK-reconstructie, met de schuine facetten, de glazen zigzagbanden en de vensters zichtbaar. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-blok op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0014100022188313` en `0014100022188314`, BGT, AHN DSM/DTM 0,5 m (WCS, AHN4) en Actueel_orthoHR; 11 oktober 2026.
- 3D BAG, TU Delft/3D geoinformatie, CC BY 4.0: dakrand, patio, zittrap en de hellende driehoeken ([pand 0014100022188313](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100022188313)).
- [Wikipedia: Forum Groningen](https://nl.wikipedia.org/wiki/Forum_Groningen): veelvlak met zeshoekig grondvlak en dakterras, de volgorde van de acht zijvlakken, dakterras op 45 m, parkeergarage en fietsenkelder.
- Commons, alleen als visuele referentie:
  - [Forum Groningen, 22 Augustus 2022 – 06](https://commons.wikimedia.org/wiki/File:Forum_Groningen,_22_Augustus_2022_-_06.jpg) (vanaf de Martinitoren: noordvierhoek, noordwestdriehoek en westgevel met de glazen zigzag)
  - [Forum Groningen](https://commons.wikimedia.org/wiki/File:Forum_Groningen.jpg) (vanaf het noordoosten, verhoogd)
  - [Forum Groningen Westseite](https://commons.wikimedia.org/wiki/File:Forum_Groningen_Westseite.jpg)
  - [Forum-Groningen1-Kirschbluete-2026-04](https://commons.wikimedia.org/wiki/File:Forum-Groningen1-Kirschbluete-2026-04-msu7-3811.jpg) (westgevel vanaf de Nieuwe Markt)
  - [Groninger Forum-2026-04](https://commons.wikimedia.org/wiki/File:Groninger_Forum-2026-04-msu2-3811.jpg)
  - [Groninger Forum](https://commons.wikimedia.org/wiki/File:Groninger_Forum.jpg)
  - [Groninger Forum – dakterras](https://commons.wikimedia.org/wiki/File:Groninger_Forum_-_dakterras.jpg) (patio en zittrap)
  - [Forum Groningen, 22 Augustus 2022 – 07](https://commons.wikimedia.org/wiki/File:Forum_Groningen,_22_Augustus_2022_-_07.jpg) (zittrap op het dak)
  - [Wageningen and Groningen (July–August 2020) – 67](https://commons.wikimedia.org/wiki/File:Wageningen_and_Groningen_(Netherlands,_July-August_2020)_-_67_(50553910866).jpg) (vensters in de schuine natuursteen)
