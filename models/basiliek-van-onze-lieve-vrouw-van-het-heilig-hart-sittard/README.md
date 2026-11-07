# Basiliek van Onze-Lieve-Vrouw van het Heilig Hart (Sittard)

Neogotische driebeukige basiliek met kooromgang, dwarsarm, twee westelijke traptorens en een hoge achtzijdige vieringtoren met vier hoektorentjes. Het model heeft afzonderlijke bouwdelen voor de hoofd- en zijbeuken, dakvlakken, dakkapellen, koor, steunberen en torens.

## Bestanden en plaatsing

- `basiliek-van-onze-lieve-vrouw-van-het-heilig-hart-sittard.glb`: gesloten bouwdeel in meters; glTF Y omhoog.
- `basiliek-van-onze-lieve-vrouw-van-het-heilig-hart-sittard.json`: catalogusgegevens en het vervangen BAG-pand `1883100000010318`.
- `basiliek-van-onze-lieve-vrouw-van-het-heilig-hart-sittard-1-1000.stl`: gesloten printmodel op 1:1000, Z omhoog.
- Generator: `scripts/generate-basiliek-van-onze-lieve-vrouw-van-het-heilig-hart-sittard.mjs`.

De oorsprong ligt bij de viering op RD (188913,5; 334499,4). De lokale X-as volgt het schip circa 32° ten noorden van oost. De modelvoet ligt op -0,5 m ten opzichte van het bemonsterde terrein; het BAG-maaiveld is NAP +43,52 m.

## Reconstructie en aannames

De BAG-voetafdruk, 3D BAG en AHN-DSM bepalen de onderbouw, daken en oriëntatie. De AHN-metingen van de vieringtoren zijn boven NAP +98 m grotendeels onderbroken. Enkele pixels reiken tot NAP +106,81 m; Kerk & Orgel noemt de toren circa 60 m hoog. Met het BAG-maaiveld levert de hoogste AHN-pixel circa 63,3 m inclusief top op. Die hoogste waarde is gebruikt als schatting van de uiterste punt; de bronmaat en het AHN zijn niet tot op een meter consistent.

De achtzijdige spits is tussen de meetpunten als rechte vlakken gereconstrueerd met schuine foto's en de luchtfoto als leidraad. De exacte breedte, hoekspitsjes, dakkapellen en gevelnissen zijn geschat. De opengewerkte hoektorentjes zijn voor 1:1000 gesloten en versterkt; galerijwerk, maaswerk, windwijzers en gevelreliëf onder 0,9 m zijn weggelaten. De kooromgang en kapellen zijn vereenvoudigd tot aaneengesloten dakvlakken.

## Controle

De generator meldt één gesloten manifold met genus 0. Een volledige 150 × 150 m uitsnede op 1:1000 is geëxporteerd; vier renders zijn vergeleken met de PDOK-reconstructie en beschikbare lucht- en gevelfoto's. Een 45°-printcontrole met doorsneden toont behoud van het model. Controleer op de kaart met name de torenhoogte, kooromgang, dwarsarm en aansluiting op het terrein.

## Bronnen

- [3D BAG: pand 1883100000010318](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1883100000010318)
- [PDOK AHN WCS, DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en PDOK actuele luchtfoto
- [Rijksmonumentenregister 33709](https://monumentenregister.cultureelerfgoed.nl/monumenten/33709)
- [Kerk & Orgel: basiliek Sittard, toren circa 60 m](https://kerk-en-orgel.nl/record.php?action=display_ordered&direction=desc&display=table&id=6584&item=976&page_num=49&pagenum=17&province=lb&sort=status)
- [Basiliek Sittard: luchtfoto](https://basilieksittard.com/home/)
- [Kerkgebouwen in Limburg: basiliek](https://www.kerkgebouwen-in-limburg.nl/kerken/sittard/ol-vrouw-van-het-h-hart-basiliek)
