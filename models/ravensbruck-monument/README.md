# Ravensbrück-monument, Amsterdam

Ronde licht- en geluidzuil en elf oplopende spiegelpanelen op het natuurstenen plateau op het Museumplein. Meters, Z omhoog in het script, glTF `(x,z,-y)`. Oorsprong RD `[120600.2,485570.253]`, BGT-punt van het herdenkingsmonument; +X langs het plateau naar het zuidoosten, richting −55,48°. Drie nodes: `road:natuurstenen-plateau`, `building:licht-en-geluidzuil`, `building:elf-spiegelpanelen`. Geen BAG-pand vervangen.

## Bronnen en metingen

- [Nationaal Comité 4 en 5 mei](https://www.4en5mei.nl/oorlogsmonumenten/zoeken/1439/amsterdam-vrouwen-van-ravensbr%C3%BCck), [Comité Ravensbrück](https://ravensbruck.nl/a/monument/de-opdracht/) en [Wikipedia](https://nl.wikipedia.org/wiki/Vrouwen_van_Ravensbr%C3%BCck_1940-1945): zuil 3,4 m, elf panelen in een halve cirkel, algemene maat 9 × 7,5 m en huidige plaats na de verplaatsing in 1996.
- [Commons](https://commons.wikimedia.org/wiki/Category:Vrouwen_van_Ravensbr%C3%BCck_1940-1945): `Amsterdam - Vrouwen van Ravensbrück - 1.jpg`, `- 2.jpg` en `Amsterdam - Vrouwen van Ravensbürg - 6.jpg` tonen voorkant, verloop, dikte en tussenruimtes. Foto's alleen in de tijdelijke controlemap.
- PDOK BGT straatmeubilair `G0363.26f97db8d0724f9699e58c8e7eef80e2` voor positie. De huidige plateaucontour is onbegroeidterreindeel `G0363.0dd3ff8bd0c74c779720fb4eba391678`, circa 10,77 × 7,63 m, gemeten langs de vijf exacte BGT-hoekpunten. Het is groter dan de algemene maat van het monument; de GLB vervangt uitsluitend dit PDOK-terreinobject om geen dubbele plateaurand te maken.
- PDOK Actueel_orthoHR en AHN DSM/DTM 0,5 m, 11 oktober 2026. DTM rondom circa NAP 0,50–0,64 m. Het DSM haalt slechts NAP 3,12 m en mist de smalle metalen toppen deels; daarom bepaalt de bronhoogte van 3,4 m de zuil.

## Opbouw en printafwegingen

Een vlak plateauprisma, elf gedraaide paneelprisma's en één gesloten cilinder; geen gestapelde hoogtelagen. Paneelstraal 3,3 m, oplopende toppen 2,1–3,25 m, breedte 0,9 m en plateauhoogte 0,15 m zijn geschat uit foto's en ortho. Panelen en zuil zijn verdikt tot 0,9 m voor 1:1000. De zeer smalle panelenspleten blijven geometrisch aanwezig maar kunnen bij een grove nozzle dichtvallen; de afzonderlijke topniveaus bewaren het paneelritme. De exacte verdeling en oplopende richting zijn onderdeel van de review.

Weggelaten: tekst, elf lichtsleuven, licht- en geluidswerking, spiegeling, voegen, bloemen en de kleine gedenkplaat. De plaatdikte en staaldikte zijn geen nauwkeurige materiaalmetingen.

## Maaiveld en controles

PDOK-grondsamples 43,64694, 43,65872 en 43,61491 m ellipsoïdisch. Offset −0,05 m; modeldatum 43,5649099665 m. De vaste fallbackhoogte is circa 43,61 m. Het vlakke plateau vervangt de ruw gereconstrueerde steenplaat; omliggende paden en gras blijven staan.

`node scripts/generate-ravensbruck-monument.mjs --scale 1000` schrijft GLB, JSON en STL. Alle nodes `NoError`; elf positieve paneelvolumes. De verenigde STL is één verbonden volume, circa 10,8 × 7,6 × 3,4 mm. Gedeelde 45°-controle van het verenigde volume: 36,815445081 → 36,815445076 m³, 0% steunopvulling binnen numerieke tolerantie. Doorsneden op 0,1, 0,5, 1, 2 en 3 m blijven gelijk.

De echte preview/3MF-export op 1:1000 omvat het hele monument in een uitsnede van 80 × 80 m. Vier schuine aanzichten op 30° boven de horizon (−35°, 55°, 145°, 235°) zijn naast de PDOK-reconstructie en schuine bronfoto's gecontroleerd. De landmark voegt de ontbrekende cilinder en panelen toe en corrigeert de plateauvorm zonder dubbele terreinplaat. De webshoptest controleert de BGT-vervanging, elf panelen, zuilhoogte, positieve volumes, verbonden STL-vorm, plaatsing en gelijk volume na overhangcontrole.

[Controlekaart](http://localhost:3000/kaart/52.35693/4.88222/100/1x1/0?size=80): controleer de verdikte elf panelen, hun oplopende richting en de aansluiting van het exacte plateau op het pad. Tijdens controle is een tijdelijke proxy met de actuele catalogus gebruikt.
