# Watertoren Nijkerk

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-nijkerk.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht, cordonbanden, omloop, trommel en kegeldak zijn één omwentelingsprofiel, klossen, schoren en de houten uitbouw zijn platen en omhulsels, deur, vensters, oculi en spleetvensters zijn nissen.

De watertoren aan de Westkadijk bij de havenkom van Nijkerk is in 1898 gebouwd naar ontwerp van F.A. de Jongh, in chaletstijl met invloed van de neorenaissance, met één Intze-reservoir van 140 m³. Een zich verjongende bakstenen cilinder op een plint, door drie natuurstenen cordonbanden in vier zones verdeeld, draagt een uitkragende houten bovenbouw: een omloop op houten klossen, een trommel met spleetvensters en schoren, en een breed overstekend kegeldak met windvaan. Rijksmonument 523782.

## Bestanden

- `watertoren-nijkerk.glb`: twee nodes van klasse `building`, op het maaiveld: de toren en het aangrenzende pand. De export vult modellen zonder attributen per node op; een losse omloop of een los dak zou een voet tot de grondplaat krijgen, daarom is de toren één node.
- `watertoren-nijkerk.json`: catalogusitem met RD-oorsprong, `xAxis` en de twee vervangen BAG-panden.
- `watertoren-nijkerk-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [161374.0, 471049.9], het hart van het kegeldak in het AHN (de top ligt 0,1 m ernaast, het zwaartepunt van de BAG-contour 0,2 m), op maaiveld (NAP +1,41 m). Assen in RD-richting (`xAxis` [1, 0]). De BAG-contour van pand 0267100000030958 is een cirkel van 9,0 m: dat is de omloop, niet de schacht van 4,5 tot 5,2 m. Deur, vensters en oculi staan in vier kolommen op kompasrichting 58 + k·90 graden, met de deur naar het oostnoordoosten (de Westkadijk); de houten uitbouw onder de omloop op 195 graden. De stand volgt uit de twee huidige foto's, die vanuit het oostzuidoosten genomen zijn (achter het achthoekige paviljoen): de vensters van de middenzone en de oculi onder de omloop staan in dezelfde kolom, de uitbouw op de linkerrand. Op de prentbriefkaart staan deur, oculus en venster boven elkaar.

## Onderdeel `building:schacht-omloop-trommel-en-kegeldak`

- Plint van 5,5 m tot +0,75 en een schuine rand naar de schacht.
- Ronde bakstenen schacht, verjongend van 5,2 m op +0,95 naar 4,55 m op +13,1, met drie natuurstenen cordonbanden met een schuine onderkant (56 graden): op +4,45 en +8,75 (0,4 m hoog, 0,1 m uit de gevel) en op +13,1 (0,45 m, 0,14 m uit de gevel). Benedenzone: deur (1,0 m breed, 2,1 m hoog) en vier oculi op +2,7 tot +3,5, één boven de deur. Middenzone: vier vensters van 0,9 m op +6,2 tot +8,25. Onder de omloop: vier oculi op +13,85 tot +14,6.
- Ring van klossen (7,5 m) van +14,95 tot +15,3, twaalf houten klossen (schoor en vloerbalk als driehoekige plaat van 0,3 m) van de schacht op +13,65 naar de omloop, telkens 15 graden naast de oculi.
- Omloop van 9,64 m van +15,3 tot +15,8.
- Houten uitbouw onder de omloop naar het zuidzuidwesten: 1,2 m breed tot 3,35 m uit het hart, van +13,05 tot de omloop, met een schuine kraag (56 graden) naar de schacht.
- Houten trommel van 7,46 m van +15,8 tot +20,55 met zestien spleetvensters (0,3 m breed, +17,8 tot +19,15) en zestien stijlen met schoren (driehoekige plaat van 0,25 m) van +18,1 naar de dakrand.
- Kegeldak van 11,4 m: dakbeschot van de trommel naar de dakrand op +20,05, rand tot +20,35, een vlakkere strook (17 graden) tot r 4,9 op +20,6 en daarna 36,7 graden tot de top op +24,25.

## Onderdeel `building:aanbouw-en-paviljoen`

Het aangrenzende pand 0267100000004832 (aanbouw en paviljoen, 1998) heeft in de 3D BAG een strook tot NAP +22,3 m aan de zuidzuidoostkant van de toren: de BAG-contour loopt onder de dakrand van de toren door en de reconstructie heeft de dakpunten van het kegeldak meegenomen. In het AHN is het pand 3 tot 7 m hoog. Het staat daarom in `replacesBuildings` en is als eenvoudig blok op de BAG-contour gemodelleerd: het oostdeel plat op +4,2 (AHN 3 tot 5 m), de vleugel naar het zuidwesten (8,4 × 11,3 m) met een zadeldak langs de lange as, goot op +5,0 en nok op +7,2 (AHN-mediaan langs de nok 7 m). Een schoorsteen of lichtkoepel van circa 8 m op het oostdeel is weggelaten. Het blok raakt de toren niet: de vleugel komt tot 4,4 m van het hart, onder de dakrand, waar de schacht 2,75 m straal heeft.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Nijkerk)): architect, bouwjaar, 30 m, 140 m³, monument.
- [Rijksmonumentenregister 523782](https://monumentenregister.cultureelerfgoed.nl/monumenten/523782): ca. 32 m; verjongende cilinder op een plint, drie natuurstenen cordonbanden en vier zones, oeils-de-boeuf en een deur beneden, vensters in de middenzone, oeils-de-boeuf onder de bovenbouw, omloop op houten klossen, kegeldak met spits en windvaan.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +1,41, hoogste punt NAP +25,59 (24,18 m boven maaiveld, top van het kegeldak; de windvaan valt eruit), dakprofiel per halve meter in de schone zuidwestelijke helft (r 0,75: 23,6; 3,25: 21,8; 4,75: 20,6; 5,25: 20,45 m), dakrand tussen r 5,75 en 6,0, hart uit de dakrand en de top.
- BAG-pand 0267100000030958 (1898, in gebruik, 63 m², 17 hoekpunten) en luchtfoto (PDOK): ligging, dak van 11,1 tot 11,3 m in doorsnede met staande naden.
- Foto [Nijkerk Watertoren](https://commons.wikimedia.org/wiki/File:Nijkerk_Watertoren.jpg), van ver en bijna recht: breedtes van dak, omloop, trommel en schacht (51 px/m op het dak), hoogtes van de cordonbanden, de omloop, de klossen, de spleetvensters en de dakrand, aantal stijlen en spleetvensters, oculi en uitbouw.
- Prentbriefkaart [RCE 20166508](https://commons.wikimedia.org/wiki/File:Aanzicht,_reproductie_van_prentbriefkaart_-_Nijkerk_-_20166508_-_RCE.jpg), rond 1900, de hele schacht vanaf de grond: plint, deur, oculi, vensters, verjonging en de hoogtes van de banden (binnen 0,3 m gelijk aan de huidige foto).
- Foto [Alde wettertoer Nijkerk 7](https://commons.wikimedia.org/wiki/File:Alde_wettertoer_Nijkerk_7.JPG): omloop, uitbouw, vensters en de stand ten opzichte van het paviljoen.

## Geschat en weggelaten

Geschat: de verjonging van de schacht (uit de breedteverhouding op beide foto's), de hoogtes van banden, vensters, omloop en trommel (van de foto's, geschaald op het dak; dakrand en top uit het AHN), de diepte van de nissen (0,2 tot 0,3 m), de stand van de kolommen (58 graden) en van de uitbouw (195 graden), het aantal en de vorm van de oculi (vier per zone, als spitse zeshoek met een bovenkant van 56 graden), de diepte van de uitbouw, het aantal klossen (twaalf). Spleetvensters en stijlen zijn gehalveerd tot zestien: in het echt zijn het er circa tweeëndertig van 0,15 m met stijlen van 0,6 m ertussen, smaller dan de export openhoudt. De uitbouw heeft in het echt een vlakke onderkant; de schuine kraag voorkomt een steunkolom tot de tweede cordonband.

Weggelaten (kleiner dan 0,9 m of te dun): de windvaan en het spitsje, het hekwerk van de omloop (leuning), de gele sierbanden in het metselwerk en de natuurstenen kruisen om de oculi en vensteromlijstingen (vlak in de gevel), de golfplaatrand van de klossenring, de kruisende richting van de schoren (als radiale platen), de naden van het dak.

## Controle

In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 14,8 % (gemeten 1,1476): dat zijn de echte overstekken van deze hoedvormige toren, de omloop die 2,5 m buiten de schacht steekt op klossen van 38 graden (vanaf circa 12,8 m) en het dak dat 2 m buiten de trommel steekt (vanaf circa 18 m). Een eerste versie met een vlakke onderkant aan de uitbouw kreeg daaronder een steunkolom tot +9,2. De doorsneden op 1,5, 3, 7,2, 10, 12, 16,5, 17,5, 21 en 23 m (deur, oculi, vensters, schacht, trommel boven de omloop, dak) blijven gelijk. Naast de 3D BAG, die hier terugvalt op een LoD1.1-cilinder van 24 m, heeft het model van alle vier kanten de plint, de verjongende schacht met cordonbanden, deur, oculi en vensters, de omloop op klossen, de trommel met spleetvensters en schoren, het brede kegeldak en de uitbouw. Controlebeelden blijven buiten de repo. De torennode is één gesloten NoError-solid met genus 0, het buurblok ook; de 45-gradenopvulling laat het buurblok ongewijzigd. In de preview-export (1:1000, support v2) komt steun alleen onder de omloop en de dakrand, met dunne schoren langs de schacht; op de kaart staat de toren met het buurblok op de verborgen PDOK-panden. Op de kaart staat de toren met het buurblok op de verborgen PDOK-panden, met de voet 0,35–0,55 m in het maaiveld; de PDOK-strook van het buurpand tot NAP +22,3 is weg.

Controle-URL: http://localhost:3000/kaart/52.22753/5.48050/200/1x1/0
