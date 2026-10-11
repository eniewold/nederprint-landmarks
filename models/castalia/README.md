# Castalia (Den Haag)

Kantoortoren van het ministerie van VWS aan het Parnassusplein (Michael Graves, 1998), 104 m. Het skelet van het Transitorium (Jan Lucas, 1967, 73 m) kreeg een nieuwe bakstenen gevel en twee steile zadeldaken van 35 m, de "Haagse Tieten", die het gebouw op een groot grachtenpand moesten laten lijken. Het model bestaat uit benoemde prisma's en dakvlakken (hulls van goot en nok) in een eigen gebouwstelsel, zonder gestapelde DSM-lagen. Voorbeelden per rij: `generate-evoluon.mjs` (aanpak primitieven), `generate-rembrandttoren.mjs` en `generate-haagse-toren.mjs`. Reproductie: `node scripts/generate-castalia.mjs`.

## Bestanden en plaatsing

- `castalia.glb`: meters, Y omhoog, één gesloten `building:`-node (genus 0, één deel, 13.080 driehoeken).
- `castalia.json`: catalogusitem.
  - RD-oorsprong `[81895.72, 455178.52]`: midden tussen de twee nokken en midden tussen de twee topgevels.
  - `xAxis` 36,1°: de BAG-gevels lopen op 36,1° en 126,1°. Nokken, goten en topgevels in het AHN lopen langs dezelfde assen.
  - +X loopt langs de lange gevels naar het noordoosten. +Y wijst naar het noordwesten, naar de straat langs de noordwestgevel. −Y is de zuidoostgevel aan het overdekte Parnassusplein.
- `castalia-1-1000.stl`: millimeters, Z omhoog, 79,5 × 45,7 × 104,7 mm, vlakke voet.

z = 0 ligt op NAP +0,5 m, op de straat aan de oostzijde (AHN-DTM +0,35 tot +0,66). De voet loopt door tot −1,2 m (NAP −0,7). De straten aan de westzijde (+1,1) en de noordwestzijde (+1,3) liggen hoger; daar bedekt het PDOK-terrein de voet. `groundOffsetMetres` is 0. De `groundSamplePoints` liggen op de oostelijke straat: `[45,−20] [45,0] [45,13]`.

Het model vervangt alleen BAG `0518100000234102` (bouwjaar 1969 in de BAG, het Transitorium-skelet). Dat pand omvat de toren en de lage onderbouw eromheen: de oostvleugel aan de straat, de stroken langs de noordwestgevel en het Parnassusplein en de smalle westvleugel met de ronde aanbouw.

Wat er níet bij hoort:

- Het pand ten zuiden van het overdekte plein (`0518100001754311`, 1998, drie schijven tot NAP +57,6) is een apart gebouw.
- Het glasdak van het Parnassusplein (NAP +23,6 tot +24,1) is geen BAG-pand.
- Het pand ten noordwesten (`0518100000269583`) is een apart gebouw.
- De Hoftoren, de Zurichtoren en het station zijn ook aparte gebouwen.

In de 3D BAG blijven de buurpanden op hun eigen hoogte: 23 tot 27 m aan de noordwestzijde en 57,6 tot 59 m aan de zuidzijde, gelijk aan het AHN. Ze hebben dus geen punten van de toren meegenomen.

## Onderdelen (hoogtes NAP, AHN-DSM en 3D BAG)

### Toren

- **Romp**: 53,7 × 23,5 m tot de goot op +70,4. De kopgevels liggen op de AHN-rand, de topgevels op het einde van de dakvlakken in het AHN.
- **Twee zadeldaken** met de nok haaks op de lange gevels: de topgevels staan op de lange gevels, naast elkaar.
  - **Helling**: 70,7° (2,86). Een kleinste-kwadratenfit per dakvlak in het AHN gaf 70,4°, 70,4°, 70,8° en 71,2°; de 3D BAG geeft 70,6–70,8°.
  - **Nokken**: op 28,85 m van elkaar, nokhoogte +101,8 (fit: 101,67 en 101,94).
  - **Kapbreedte**: 22 m op de goot.
  - **Goot**: aan de westkop ligt de goot 2,1 m binnen de gevel, aan de oostkop 0,8 m (AHN-richel op +69,6 tot +70,7).
- **Topgevelkappen**: de vier topgevels steken 2,2 m boven het dakvlak uit tot +104,0. Dit zijn de "iets hogere zijkanten" van Wikipedia (AHN 103,5–104,0, 3D BAG-nok 104,01). Ze zijn 1,5 m diep, gemeten vanaf de gevel.
- **Middendeel** tussen de goten: 6,9 m breed, plat op +76,5. De glazen erkers voor beide topgevelzijden zijn 5,3 m breed, staan 1,2 m voor de gevel en hebben een kap tot +77,0 (AHN).
- **Binnenste dakkapellen**: één aan elke kant van het middendeel, met de voorkant naar het midden. Plat op +79,35, 10 m lang (3D BAG-vlakken 414/430, AHN 79,3).
- **Kopgevelerkers** midden in beide kopgevels: 5,6 m breed, 0,76 m voor de gevel. Ze lopen tot +76,5 als grote dakkapel het dak in (AHN, foto's).
- **Kleine dakkapellen**: twee naast elke kopgevelerker op de goot, 4,0 m breed, tot +74,8 (AHN 74,5–75,4, foto's).

### Gevel van Graves

- **Vensters**: dubbelhoge vensters (4 ruiten hoog, verdiepingshoogte 3,4 m) als nissen van 0,35 m, 2,3 × 5,2 m.
  - De rijen liggen op 6,8 m. De bovenste rij eindigt 1,5 m onder de goot.
  - Elke topgevelzijde heeft zes kolommen op 3,6 m rond de nok: zeven rijen aan de pleinzijde en acht boven de lage noordwestelijke strook.
  - Elke kopgevel heeft 2 + 2 kolommen naast de erker. De westkopgevel heeft tien rijen tot op de straat.
- **Kroonband**: een groef van 0,5 m onder de goot rondom.
- **Erkers**: twee ruitvakken per laag van 3,4 m (nissen van 0,3 m).
- **Topgevels**: verspringende sleuven, zes rijen van 6, 5, 4, 3, 2 en 1 op 5 m hoogte en 3,6 m breedte (foto frontaal op een topgevel).
- **Dakkapellen**: elke dakkapel heeft een venster.

### Onderbouw

- **Oostvleugel** aan de straat tot +22,9, met een uitbouw naar het zuiden.
- **Strook langs het Parnassusplein** tot +22,8.
- **Lage strook langs de noordwestgevel** tot +17,0.
- **Westvleugel van 4 m** met een ronde aanbouw van Ø 4,9 m naar de toren, tot +23,3.
- Alle gevels van de onderbouw hebben één venster per laag van 3,4 m, 1,8 m breed op 3,6 m.

## Geschat en weggelaten

Geschat:

- **Vensterritme**: dubbelhoge vensters op 6,8 m, kolommen op 3,6 m. Geteld op frontale foto's van een topgevel en een kopgevel; de verdiepingshoogte van 3,4 m komt uit de ruitvakken van de erkers. Alle rijen zijn even hoog gemaakt.
- **Topgevelsleuven**: werkelijk circa 0,5 × 1,5 m. Ze zijn vergroot tot 0,9 × 2,0 m zodat ze op 1:1000 zichtbaar zijn.
- **Kleine dakkapellen** (breedte en positie) en de ruitvakken van de erkers: uit foto's en de ortho.
- **Lage strook langs de noordwestgevel** op +17,0. Het AHN ziet daar naast de 100 m hoge gevel vooral gevelpunten (10e percentiel 11–14 m, mediaan 17–20 m). De 3D BAG zet hem op +22,7, maar dat is waarschijnlijk te hoog.
- **Daken van de onderbouw**: plat gemaakt. De westvleugel loopt in de 3D BAG licht op van 23,5 naar 24,2.

Weggelaten:

- **Glasdak van het Parnassusplein** tussen de toren en het zuidelijke pand (NAP +23,6–24,1): geen BAG-pand, glas, en buiten het model.
- **Getrapte profilering van de blauwe erkers** per verdieping en de vensterstijlen: kleiner dan 0,9 m.
- **Felsnaden van de zinken dakvlakken**, de rail van de gevelonderhoudsinstallatie langs de goot en de luifel boven de kleine dakkapellen: kleiner dan 0,9 m.

## Controle (11 oktober 2026)

- **Generator**: `NoError`, één deel, genus 0, 130.243 m³. De ondervlakken zijn alleen de bovenkanten van de nissen en de kroonbandgroef.
- **Tests**: `npx vitest run tests/landmark-models.test.ts tests/landmark-api.test.ts`, 357 geslaagd. De eigen test controleert:
  - catalogus, vervangen pand, voet, top en uitersten;
  - goot, nokken achter de topgevelkappen en de kappen tot +104,0 op alle vier de topgevels;
  - dat niets boven de dakvlakken of het middendeel uitsteekt;
  - erkers, kopgevelerkers, kleine en binnenste dakkapellen;
  - de vier delen van de onderbouw;
  - zeven en tien vensterrijen en zes rijen topgevelsleuven.
- **Printcheck** op 1:1000 bij 45°: 0,04 % extra volume.
- **Export**: `createModelBundle` op 1:1000, RD `[81845,455120,81960,455228]`, 115 × 115 mm. Duur 5,9 s, 157 objecten, 64.064 driehoeken, drie vellen, modelhoogte 111,2 mm. Het model staat op het terrein, de buurpanden staan op hun plek.
- **Renders** naast de 3D BAG op −35°, 55°, 145° en 235° en van bovenaf. De 3D BAG heeft de juiste massa en de twee kappen, maar de wanden zijn vlak en de dakvlakken en topgevels rafelig, zonder erkers en dakkapellen. Het model heeft per kant meer:
  - **Noordwest (−35°) en zuidoost (145°)**, de topgevelzijden:
    - twee scherpe topgevels met verhoogde kappen en sleuvenpatroon;
    - zes kolommen dubbelhoge vensters per topgevel;
    - de kroonband;
    - de erker tussen de topgevels met ruitvakken en kap;
    - de binnenste dakkapellen.
  - **Noordoost (55°)**, de oostkopgevel:
    - de vensterkolommen naast de erker;
    - de erker als dakkapel tot +76,5;
    - twee kleine dakkapellen met venster;
    - de oostvleugel met vensterrijen.
  - **Zuidwest (235°)**, de westkopgevel tot op de straat:
    - tien vensterrijen en de erker;
    - de dakkapellen;
    - de westvleugel en de ronde aanbouw met vensters.
- **Bovenaanzicht**: het model ligt op de 3D BAG-voetafdruk.

Kaartcontrole (11 oktober 2026, dev-server na herstart, [controlekaart](http://localhost:3000/kaart/52.08005/4.32073/350/1x1/0)): het model ligt op de PDOK-reconstructie van het pand, de twee topgevels met de erker ertussen en het vensterritme zijn zichtbaar en de onderbouw sluit aan op de buren. Met de schakelaar ‘Gedetailleerde landmarkmodellen’ uit verschijnt het PDOK-pand (vlakke wanden) op dezelfde plek en aan weer verdwijnt het.

## Bronnen

- PDOK BAG `0518100000234102`, AHN DSM/DTM 0,5 m (WCS) en Actueel_orthoHR; 11 oktober 2026.
- [3D BAG, TU Delft/3D geoinformatie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000234102), CC BY 4.0: dakhelling, nokken (101,4–102 en 104,0), platte delen (70,5 / 76,5 / 79,35) en onderbouw (22,7–24,2).
- [Wikipedia: Castalia (gebouw)](https://nl.wikipedia.org/wiki/Castalia_(gebouw)): 104 m, Transitorium (Jan Lucas, 1967, 73 m), herbouw door Michael Graves (1998), puntdaken van 35 m.
- Commons, alleen als visuele referentie:
  - [De Castaliatorens (de Puntmutsen)](https://commons.wikimedia.org/wiki/File:De_Castaliatorens_(de_Puntmutsen).jpg) (kopgevel)
  - [Castalia The Hague](https://commons.wikimedia.org/wiki/File:Castalia_The_Hague.JPG) (beide topgevels schuin)
  - [MinVWS](https://commons.wikimedia.org/wiki/File:MinVWS.jpg) (kopgevel met dakkapellen)
  - [Castalia en Hoftoren](https://commons.wikimedia.org/wiki/File:Castalia_en_Hoftoren.jpg) (topgevels vanaf het Plein)
  - [Den Haag – Helicon and Castalia](https://commons.wikimedia.org/wiki/File:Den_Haag_-_Helicon_and_Castalia_(24951616597).jpg)
  - [DeResident1](https://commons.wikimedia.org/wiki/File:DeResident1.jpg) (topgevel frontaal, sleuven)
  - [De Castaliatorens en de Zurichtoren](https://commons.wikimedia.org/wiki/File:De_Castaliatorens_(de_Puntmutsen)_en_de_Zurichtoren_(_de_Sinaasappelpers).JPG) (kopgevel en erker)
  - [The Hague Government and business buildings 4](https://commons.wikimedia.org/wiki/File:The_Hague_Government_and_business_buildings_4.JPG) (kopgevel frontaal)
  - [Pletterijkade met Castalia en Hoftoren](https://commons.wikimedia.org/wiki/File:Pletterijkade_met_Castalia_en_Hoftoren.jpg)
  - [Netherlands, The Hague, Clioplein (01)](https://commons.wikimedia.org/wiki/File:Netherlands,_The_Hague,_Clioplein_(01).jpg)
