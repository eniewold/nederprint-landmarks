# Haagse Poort (Den Haag)

Kantoorcomplex van Nationale-Nederlanden aan de Schenkkade, ontworpen door Rob Ligtvoet en opgeleverd in 1994. Het gebouw overspant de verdiepte Utrechtsebaan met een grote boog. Eén lange schijf van 15 m breed loopt van een spitse punt in het zuidwesten:

- over de laagbouw (+36,6);
- als brug over de weg (+35,1);
- naar het hoogbouwdeel, waar ze als bovenste balk (+70,5) over twee torens van +59,9 heen loopt.

Aan de laagbouw zitten drie kamvleugels met ronde trappenhuiskoppen en een lage driehoekige vleugel met de glazen koepel boven de centrale hal. Tussen de torens liggen een glazen atrium met rotonde (noord) en een lager zuiddeel met parkeerdek.

Het model bestaat uit benoemde prisma's, convexe bouwdelen (koepel, rotonde, boog) en verdiepingsbanden als groeven, in een eigen gebouwstelsel. Er zijn geen gestapelde DSM-lagen gebruikt. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-haagse-toren.mjs` en `generate-hoftoren.mjs`. Reproductie: `node scripts/generate-haagse-poort.mjs`.

## Bestanden en plaatsing

- `haagse-poort.glb`: meters, Y omhoog, één gesloten `building:`-node (één deel, 66.874 driehoeken).
- `haagse-poort.json`: catalogusitem.
  - RD-oorsprong `[82963.25, 454825.61]`: het midden van de boog op de as van de schijf.
  - `xAxis` 35,64°: langs de schijf, naar het hoogbouwdeel (BAG-gevels 35,6° en 125,6°).
  - +Y wijst naar het noordwesten (Prinses Beatrixlaan).
- `haagse-poort-1-1000.stl`: millimeters, Z omhoog, 255,4 × 104,4 × 72,5 mm, vlakke voet.

z = 0 ligt op NAP +0,7 m: de straten rondom liggen in de AHN-DTM op +0,5 tot +0,8. De voet loopt door tot −1,2 m (NAP −0,5). `groundOffsetMetres` is 0. Er zijn negen `groundSamplePoints` op straatniveau (AHN-DTM +0,49 tot +0,75):

- voor de drie kamvleugels;
- ten noorden en ten zuiden van beide torens;
- langs de gebogen vleugel;
- bij de zuidwestpunt.

Ze liggen nergens in de bak van de Utrechtsebaan (NAP −3,3 tot −5,1) of op de straatjes onder de boog (0,0 tot +0,5). Het model bevat geen terrein.

Het hele complex is één BAG-pand: `0518100000229788` (1994). Alleen dat pand wordt vervangen. Wat er niet bij hoort:

- Het pandje `0518100001650983` (21 m², 1976) ligt in de bak ten noorden van de brug.
- Het Prinsenhof (`0518100000207723`, aparte backlogrij), de Malietoren en het station liggen 40 m of verder weg.

Er zijn geen bestaande landmarks binnen 900 m.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

- **Laagbouwschijf** (+36,6): van de spitse zuidwestpunt tot de brug. De BAG-kop staat schuin onder 33° op de as. Op het dak installatieblokken van +38,3 tot +39,0.
- **Brug over de Utrechtsebaan** (+35,1), 60 m lang tussen de derde kamvleugel en de bovenste balk.
- **Boog**: zie [De boog en de printbare doorgang](#de-boog-en-de-printbare-doorgang).
- **Bovenste balk** (+70,5) van u 31,3 tot de oostkop, 6 m voorbij de oosttoren, tot op de grond.
  - Een verlaagd installatiedek op +68,6 met vier blokken koelers.
  - Installatieblokken tot +72,0.
- **Twee torens** (+59,9), 15 × 94 m.
  - Naar het noordwesten een scheve punt (prow) volgens de BAG.
  - Op het dak een verhoogde middenstrook van +61,5 (2,8 m breed).
  - Op de zuidkop een rond trappenhuis met glasbanden per verdieping.
- **Atrium** tussen de torens (+34,7), met een glazen gevel als ruitenraster.
  - Een rotonde: trommel tot +37,0 en kap tot +39,0.
  - Een ronde entree (+9,6) en een entreeluifel (+5,8).
- **Zuiddeel** tussen de torens: +23,3 langs de schijf, parkeerdek +18,4 en +19,8 aan de zuidgevel.
- **Drie kamvleugels** (+31,1) met ronde trappenhuiskoppen van volle hoogte en glasbanden.
- **Driehoekige vleugel** (+16,7) met de gebogen zuidoostgevel volgens de BAG.
  - Een blok van +20,4 tegen de schijf.
  - De centrale hal: een cilinder (straal 12,2 m) tot +20,4 met een glazen bolkap tot +27,4.
  - Installaties tot +18,2.
- **Gevels** (3.423 nissen en groeven, 0,3 tot 0,35 m diep):
  - schijf: kleine openingen in de bovenste laag, hoge vensters over twee lagen en lager verspringende vierkante vensters; groen-witte banden als groef op elke verdiepingsvloer (3,5 m);
  - torens: vierkante vensters per 2,5 m in 15 lagen van 3,6 m;
  - kamvleugels, zuiddeel en driehoekige vleugel: vensters per 3,6 m;
  - begane grond: glazen plint als hoge nissen.

## De boog en de printbare doorgang

De echte boog is een tongewelf van 15 m diep met een vlakke kruin.

- De voeten staan op straatniveau, net naast de toren en de derde kamvleugel.
- De onderzijde komt 21,1 m boven de straat (NAP +21,6).
- De groene stalen rib ligt in de gevel.

Gemeten op een frontale foto vanaf de Prinses Beatrixlaan: voeten op u −24,4 en +30,4 (binnen 54,8 m, buiten 57,8 m). Het profiel ligt tussen een parabool en een ellips: h(1 − |x/a|^2,38). De rib is 1,5 m breed en steekt 0,5 m voor de gevel.

Zo'n vlakke kruin over 16 m diepte is op 1:1000 niet open te printen. Getest met de printcheck (`supportedSolid`, 45°):

| Vorm van de onderzijde | Opvulling in de export |
| --- | --- |
| Tongewelf zoals het is | 2.295 m³: een dichte plaat onder de kruin, gelijk met beide gevels, en een wand tot de onderplaat |
| Spits oplopend gewelf binnen de schijf | 1.700 m³: de laagste rand van de onderzijde ligt op de gevel en hangt daar, en kreeg aan beide gevels een wand tot de onderplaat |

Daarom heeft het model een printbare vorm:

- Op de voorkant van beide ribben staat het echte boogprofiel.
- Vandaar loopt de onderzijde onder 62° schuin naar binnen omlaag: een diepe, schuine dagkant.
- Die dagkant komt uit op een spitsboog van 50° die door de hele schijf loopt. De top ligt op de hoogte van de echte kruin (21,1 m boven de straat), de voeten 35,4 m uit elkaar (u −14,7 tot +20,7).
- Elk deel van de onderzijde loopt zo steiler dan de printhoek.

**Doorgang na opvulling**: aan beide gevels de volle boog. Door de hele schijf blijft een spitse opening van 35,4 m breed aan de straat en 21,1 m hoog volledig open. De opvulling onder de boog is 0 m³.

Het verschil met de werkelijkheid: in het midden van de schijf zijn de straatjes langs de bak (u −24,4 tot −14,7 en +20,7 tot +30,4) afgesloten door de schuine dagkanten. De bak zelf (u −16 tot +14) valt op 1,3 m na binnen de spitsboog.

## Backlog-hint tegen de metingen

- **"Kantoorbrug van circa 100 m lang met een toren aan elke kant"**: klopt niet.
  - Het complex is 255 m lang (Wikipedia: 275 m).
  - De brug over de weg is 60 m.
  - Aan de westkant staat geen toren maar de laagbouw (+36,6) met drie kamvleugels (+31,1) en de lage vleugel met koepel.
  - Beide torens (+59,9) staan aan de oostkant, met de bovenste balk (+70,5) erover.
- **"Schuine/afgeronde koppen en daken"** van de torens: de daken zijn vlak (AHN 59,9, 3D BAG 59,91–60,01) met een verhoogde middenstrook.
  - Het schuine silhouet op foto's is de scheve punt (prow) van de plattegrond.
  - De afgeronde koppen zijn de ronde trappenhuizen op de zuidkoppen van de torens en op de koppen van de kamvleugels.
- **"Dek als printbare balk"**: de brug is geen dun dek maar de volle schijf van 35 m hoog. Alleen de boog eronder vraagt een printbare vorm (zie hierboven).

## Geschat en weggelaten

Geschat:

- **Boog**: voeten, overspanning, kruinhoogte en profiel uit één frontale foto (schaal 0,091 m per pixel op de schijf). De ribbreedte (1,5 m) en het uitsteken (0,5 m) komen uit foto's.
- **Gevelritme** van schijf, torens en vleugels uit foto's. Verdiepingshoogtes 3,5 m (schijf, vleugels) en 3,6 m (torens) boven een begane grond tot +5,0.
- **Installaties** als blokken op de hoogtes uit 3D BAG en AHN. Het installatiedek in de bovenste balk komt uit de 3D BAG (68,6).
- **Rotonde**: trommel en kap uit het AHN (rand 37,3, top 39,0).
- **Entreeluifel**: 0,9 m dik.
- **Koepel van de centrale hal**: een bolkap uit rand en top in het AHN; het ribbenpatroon van het glas is weggelaten.

Weggelaten:

- **Stalen vakwerk en glazen kap in het gewelf** en de dunne leuning op het brugdak: kleiner dan 0,9 m.
- **Zonnepanelen en losse koelers** op de lage vleugel: lager dan 0,9 m.
- **Glazen strookjes** van 0,6 m op de lage vleugel (3D BAG +17,0 tot +17,4).
- **Kleine kolommetjes en balkonstompjes** langs de westelijke kamvleugel (0,6 m).
- **Doorgang onder de oostkop** van de bovenste balk (foto vanaf het noorden). Die zit binnen de BAG-voet; het model heeft daar alleen de glazen plint als nis.
- **Hellend glas** tussen atrium en bovenste balk (3D BAG 63,7–68,4): het AHN heeft daar geen punten.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 11, 66.874 driehoeken, 439.784 m³. Ingesloten holtes vallen weg.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 388 geslaagd. De eigen test controleert:
  - catalogus en vervangen pand;
  - voet en top;
  - lengte en spitse punt van de schijf;
  - laagbouw, brug en bovenste balk;
  - torens met middenstrook, scheve punten en trappenhuizen;
  - 15 vensterrijen in de westtoren;
  - atrium en rotonde, kamvleugels, lage vleugel en koepel;
  - het boogprofiel op beide ribben;
  - dat er geen materiaal in de spitse doorgang zit.
- **Printcheck** op 1:1000 bij 45°: 0,09 % extra volume. Dat zijn de bovenkanten van de nissen en de wig onder de entreeluifel (70 m³); onder de boog niets.
- **Export**: `createModelBundle` op 1:1000, RD `[82810,454720,83085,454935]`.
  - Duur 21,6 s, 380 objecten, 285.660 driehoeken, vijf vellen, modelhoogte 93,9 mm.
  - De render van de 3MF vanaf de weg aan beide kanten (−35,6° en 144,4°) toont de spitse doorgang open, met de bak van de Utrechtsebaan erachter.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf, plus lage hoeken als de foto's (−35,6° als de foto vanaf de Prinses Beatrixlaan, −84° als de foto bij het rode beeld). De 3D BAG heeft de juiste massa's, maar vlakke wanden, een dichte brug zonder boog en ruwe koppen.
  - **Noordwest (−35°)**: de boog met rib, de hoge vensters en banden van de brug, de kamvleugels met vensterraster en ronde koppen, de glazen gevel van het atrium tussen de scheve torenpunten.
  - **Noordoost (55°)**: de oostkop van de bovenste balk met vensters, de buitengevel van de oosttoren met vensterraster, de middenstrook en de installaties.
  - **Zuidoost (145°)**: de boog, de gebogen vleugel met vensters en de koepel, de zuidkoppen van de torens met ronde trappenhuizen, het zuiddeel met parkeerdek.
  - **Zuidwest (235°)**: de spitse punt van de schijf met vensters, de installaties op het dak en de koepel.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.07702/4.33638/350/1x1/0)): de schijf met de boog over de Utrechtsebaan, de torens en de kamvleugels liggen op de PDOK-reconstructie van het pand. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden, dichte brug) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0518100000229788`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, pand 0518100000229788](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000229788) (TU Delft/3D geoinformatie, CC BY 4.0): dakhoogtes, installatiedek, koepel en rotonde.
- [Wikipedia: Haagse Poort](https://nl.wikipedia.org/wiki/Haagse_Poort) en [Haagse Poort (Engels)](https://en.wikipedia.org/wiki/Haagse_Poort): 275 m, 70 m, boog vanaf de zevende etage, centrale hal met cilinder en koepel.
- Commons, alleen als visuele referentie:
  - [Bezuidenhout-West panoramio (11)](https://commons.wikimedia.org/wiki/File:Bezuidenhout-West,_2595_Den_Haag,_Netherlands_-_panoramio_(11).jpg) (boog frontaal vanaf het noordwesten)
  - [Bezuidenhout-West panoramio (9)](https://commons.wikimedia.org/wiki/File:Bezuidenhout-West,_2595_Den_Haag,_Netherlands_-_panoramio_(9).jpg) (torens en kamvleugels vanaf het noorden)
  - [panoramio (151)](https://commons.wikimedia.org/wiki/File:.._-_panoramio_(151).jpg) (boog vanaf de Utrechtsebaan)
  - [Utrechtsebaan (03)](https://commons.wikimedia.org/wiki/File:Netherlands,_The_Hague,_Utrechtsebaan_(03),_Haagse_Poort.jpg) (gewelf en rib vanaf het zuidoosten)
  - [Schenkkade (03)](https://commons.wikimedia.org/wiki/File:Netherlands,_The_Hague,_Schenkkade_(03),_Haagse_Poort.jpg) (scheve torenpunten en atrium)
  - [Haagse Poort Den Haag](https://commons.wikimedia.org/wiki/File:Haagse_Poort_Den_Haag.jpg)
  - [Utrechtse Baan Haagse Poort](https://commons.wikimedia.org/wiki/File:Utrechtse_Baan_Haagse_Poort.jpg)
  - [The Hague panoramio](https://commons.wikimedia.org/wiki/File:The_Hague_-_panoramio.jpg) (zuidkoppen en laagbouwschijf vanaf de Utrechtsebaan)
  - [Haagse Poort](https://commons.wikimedia.org/wiki/File:Haagse_Poort.JPG)
