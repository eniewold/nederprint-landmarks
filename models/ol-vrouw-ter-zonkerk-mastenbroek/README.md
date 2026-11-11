# Onze Lieve Vrouw ter Zonkerk (Mastenbroek)

Model van de eenbeukige hervormde kerk met smaller driezijdig koor, consistorie en de neoclassicistische toren uit 1845. Kerk en toren zijn rijksmonumenten 20925 en 20926 en behoren tot hetzelfde BAG-pand.

## Bestanden

- `ol-vrouw-ter-zonkerk-mastenbroek.glb`: gesloten node `building:kerk`, in meters en Y omhoog.
- `ol-vrouw-ter-zonkerk-mastenbroek.json`: plaatsing, terreinbemonstering en BAG-vervanging.
- `ol-vrouw-ter-zonkerk-mastenbroek-1-1000.stl`: binaire STL in millimeters, Z omhoog, op 1:1000.
- Generator: `scripts/generate-ol-vrouw-ter-zonkerk-mastenbroek.mjs`.

## Plaatsing

RD-oorsprong (198163, 509846); lokale +X langs de nok richting koor met RD-richting (0,984808, 0,173648). De vlakke voet ligt 0,5 m onder het gekozen kerkmaaiveld. `groundSamplePoints` kiest punten op de verhoging rond de kerk, omdat het omringende polderterrein lager ligt; het AHN-DTM geeft bij de toren en zuidgevel ongeveer NAP +1,5 tot +1,7 m, aflopend naar het oosten. Controleer de aansluiting op het kaartterrein en de preview zorgvuldig. Vervangt `NL.IMBAG.Pand.1896100000013742`.

## Bouw en aannames

Het schip heeft een zadeldak met nok NAP +15,4 m en het kleinere koor een iets lagere nok rond NAP +14,16 m; de daken zijn gebouwd uit vlakken op de BAG-contour. De consistorie aan de noordzijde heeft een eigen schilddak. De toren heeft twee geledingen met lisenen, galmgaten en op schuine kragen gedragen lijsten, en een achtzijdige spits. De AHN-top ligt circa NAP +30,2 m; de gemodelleerde top van +28,6 m boven het gekozen maaiveld is geschat omdat het raster de dunne bekroning raakt. De spits eindigt op 0,9 m breed voor printbaarheid.

Posities en afmetingen van galmgaten, deur, vensternissen, steunberen en torenlijsten zijn naar de foto's geschat en vereenvoudigd; de galmgaten en rondboogvensters zijn blinde spitsnissen om op 1:1000 zonder steun te printen. Weggelaten zijn haan, bol en metalen kruis, afvoeren, kozijnprofielen en overige details smaller dan 0,9 m. Het kerkhof en de terp blijven onderdeel van PDOK-terrein en staan niet in de GLB.

## Controle

De generator controleert geslotenheid en ondervlakken. De modeltest controleert plaatsing, BAG-vervanging, grondpunten, één component en `supportedSolid` op 1:1000 met horizontale doorsneden. De PDOK-gebouwtegel is vanuit vier camerahoeken naast het model gezet met beschikbare foto's ter vergelijking; de foto's zijn niet allemaal uit dezelfde hoeken en de noordzijde is beperkt zichtbaar. Er zijn geen andere PDOK-gebouwpanden binnen 1 m van de modelvoetafdruk. De kaart en preview-export dienen nog te worden gecontroleerd.

## Bronnen

- [Rijksmonument kerk 20925](https://monumentenregister.cultureelerfgoed.nl/monumenten/20925) en [toren 20926](https://monumentenregister.cultureelerfgoed.nl/monumenten/20926).
- [Monumenten in Nederland, Mastenbroek](https://www.dbnl.org/tekst/sten009monu03_01/sten009monu03_01_0071.php): geschiedenis, eenbeukig schip, koor en achtzijdige torenspits.
- [3D BAG pand 1896100000013742](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1896100000013742): contour en dakvlakken.
- PDOK AHN DSM/DTM 0,5 m, actuele luchtfoto en gebouwtegel.
- [Wikimedia Commons: Onze Lieve Vrouw ter Zon](https://commons.wikimedia.org/wiki/Category:Onze_Lieve_Vrouw_ter_Zon_(Mastenbroek)): foto's van kerk en toren.
