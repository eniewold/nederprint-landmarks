# Grote Kerk Harderwijk

Een printbaar model van de Grote of Onze-Lieve-Vrouwekerk, bestaande uit dakvlakken en bouwdelen. Het gebouw omvat het overgebleven westelijke kerkdeel, dwarsschip, koor met kooromgang en een vereenvoudigde dakruiter. De middeleeuwse toren en een groot deel van het schip stortten in 1797 in en zijn daarom niet opgenomen. De herbouwde westgevel heeft een gebogen top.

## Gegevens en aannames

- BAG-pand `0243100001325562`; oorsprong RD (170620, 484593), lokale X-as ongeveer oostwaarts, onderkant 0,5 m onder maaiveld.
- Uit 3D BAG LoD2.2 zijn de globale plattegrond, kruisdaken, dakhellingen en hoogten afgeleid. Maaiveld NAP +2,37 m; de hoofdnok is op ongeveer 31 m boven het maaiveld gelegd. Het hoogste punt van de in 3D BAG waargenomen dakruiter ligt op ongeveer 36,4 m boven het maaiveld.
- De exacte vorm en afmetingen van de westgevel, steunberen, vensters, kooromgang, aanbouw en dakruiter zijn geschat naar foto's en dakvlakken. De open lantaarn is voor schaal 1:1000 vergroot en als gesloten kern met ondiepe openingen uitgevoerd; fijne geveldetails zijn vereenvoudigd.
- De gevelopeningen zijn ondiepe nissen; kozijnen en maaswerk zijn weggelaten. Het model is één gesloten volume met vlakke onderkant.

## Bronnen

- [3D BAG, pand 0243100001325562](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0243100001325562).
- [Historie van de kerk](https://www.vgkharderwijk.nl/de-kerk).
- [Foto's van de Grote Kerk op Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Grote_of_Onze-Lieve-Vrouwekerk_(Harderwijk)).

## Genereren en controleren

`node scripts/generate-grote-kerk-harderwijk.mjs --components` schrijft de GLB, metadata en STL op schaal 1:1000. Het model meet circa 55,8 × 52,8 × 36,9 mm op die schaal. De generator controleert de geometrie op geslotenheid en neerwaartse overhang; de exportcontrole met `supportedSolid` op 45 graden geeft geen relevante volumetoename. Een uitsnede van 150 × 150 m is als proefexport met en zonder landmark gegenereerd.
