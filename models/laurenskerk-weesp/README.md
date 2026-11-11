# Grote of Sint-Laurenskerk (Weesp)

Laatgotische kerk uit 1429–1462 met een basilicaal schip, een koor op de hoogte van de middenbeuk en een romaanse westtoren met een achtkante leien spits, open klokkenlantaarn (carillon van Hemony) en kroon. Rijksmonument 38550.

## Bestanden

- `laurenskerk-weesp.glb`: één node `building:kerk`, meters, Y omhoog.
- `laurenskerk-weesp.json`: catalogusitem.
- `laurenskerk-weesp-1-1000.stl`: los printbaar model op 1:1000 (mm, Z omhoog).
- Generator: `scripts/generate-laurenskerk-weesp.mjs`.

## Oorsprong en oriëntatie

Oorsprong RD (131499,37; 479985,42) op de as van het schip, halverwege de noord- en zuidgevel. De X-as (0,96727; 0,25376) loopt langs de nokken naar het koor (75,3 graden, gemeten aan de BAG-gevels en de nokken in het AHN); Y wijst naar het noorden. z = 0 ligt op NAP +1,0 m. De lader bemonstert het maaiveld op zes punten 2 tot 7 m buiten de gevels (`groundSamplePoints`); `groundHeight` 44,0 is de laagste PDOK-terreinhoogte daar (ellipsoïdisch, aan de westzijde). Het model vervangt BAG-pand `0457100000054845` (kerk, toren en aanbouwen).

## Onderdelen

- Middenbeuk en koor onder één doorlopend dak van 57 graden: goot NAP +19,35 m, nok +28,0 m. Het koor sluit driezijdig met schilden van dezelfde helling; de westgevel is een rechte topgevel achter de toren.
- Zijbeuken met een lessenaarsdak van 45 graden tegen de lichtbeuk (knik NAP +15,85 m, goot circa +10,4 m), steunberen van 0,9 m volgens de BAG-contour, en blinde spitsboognissen voor de beuk- en lichtbeukvensters.
- Hoge koorsteunberen tussen de traveeën en op de hoeken van de sluiting, met hoge vensternissen in koor en sluiting.
- Westtoren 6 × 6 m tot NAP +25,2 m met vier verdiepingen als verdiepte velden tussen hoeklisenen (de boogfriezen), deur, vensters en galmgaten; vierkante rok naar een achtkante spits met uurwerkkasten op de schuine vlakken en dakvensters op de hoofdvlakken; open lantaarn als achtkant met nissen, kroonlijst, ingesnoerde kap en kroon tot NAP +42,0 m.
- Traptoren met tentdak aan de noordzijde van de toren, achtkante traptoren met spitsje bij de aansluiting van zuidbeuk en koor, dakruiter met koepel op de nok.
- Aanbouwen aan de zuidzijde: een huis van twee lagen met de nok haaks op de kerk en een topgevel met schoorsteen aan de straat, de kosterswoning met schilddak en dakkapel, een ronde lage aanbouw met plat dak, en de lage vleugel met schilddak voor het koor; aan de noordzijde een lage aanbouw met lessenaarsdak tegen het koor.

## Geschat en weggelaten

Hellingen en nokken komen uit de 3D BAG LoD2.2 en zijn gecontroleerd in het AHN4-DSM; de torenhoogtes (brik NAP +25,2 m, lantaarn en kap tot +41 m, kroon +42 m) komen uit de AHN-omhullende (hoogste punt NAP +41,7 m) en de verhoudingen op een noordfoto. Geschat uit foto's: de breedtes van spits en lantaarn, de hoogte van de traptorens, de verdiepingen van de toren, de vensterhoogtes en de maten van dakruiter, kosterswoning en dakkapel. De open lantaarn is dicht met nissen; de opengewerkte kroon is een dichte achtkant. Weggelaten: de windvaan, het kruis en de bol boven de kroon (dunner dan 0,9 m), traceringen, pinakels op de koorsteunberen, dakgoten en schoorstenen kleiner dan 0,9 m. Het model is op 1:1000 zonder steun printbaar (één gesloten volume, overhang ≤ 45 graden).

## Controle

Tests in `tests/landmark-models.test.ts` (plaatsing, één samenhangend volume, ondersteuning op 1:1000 minder dan 3 % extra). Renders van vier kanten naast de 3D BAG-reconstructie en een plaatsing op het PDOK-maaiveld van de uitsnede (voet op ellipsoïdisch 43,2 m, top op 84,7 m, dus NAP +41,6 m). Controleer op de [kaart](http://localhost:3000/kaart/52.30731/5.04265/200/1x1/0) de torenspits met lantaarn en de aanbouwen aan de zuidzijde.

## Bronnen

- [BAG-WFS](https://service.pdok.nl/lv/bag/wfs/v2_0), pand `0457100000054845`.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0457100000054845) (LoD2.2-dakvlakken).
- [AHN4 DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en [PDOK-luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0).
- [Rijksmonumentenregister 38550](https://monumentenregister.cultureelerfgoed.nl/monumenten/38550) en [Wikipedia](https://nl.wikipedia.org/wiki/Grote_of_Laurenskerk_(Weesp)).
- Foto's op [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Laurenskerk_(Weesp)) (RCE-reeks noord-, zuid- en oostgevel, toren).
