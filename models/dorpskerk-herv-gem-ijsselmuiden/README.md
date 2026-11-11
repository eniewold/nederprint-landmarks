# Dorpskerk (IJsselmuiden)

Vereenvoudigd model van de romaanse Sint-Crispijnkerk met het gotische koor, het neogotische dwarsschip en de middeleeuwse toren. Het gebouw en de toren zijn afzonderlijke rijksmonumenten 39906 en 39907, maar liggen in één BAG-pand.

## Bestanden

- `dorpskerk-herv-gem-ijsselmuiden.glb`: in meters, Y omhoog, één gesloten node `building:kerk`.
- `dorpskerk-herv-gem-ijsselmuiden.json`: positie, oriëntatie en BAG-vervanging.
- `dorpskerk-herv-gem-ijsselmuiden-1-1000.stl`: binaire STL in millimeters, Z omhoog, los te printen op 1:1000.
- Generator: `scripts/generate-dorpskerk-herv-gem-ijsselmuiden.mjs`.

## Plaatsing

RD-oorsprong (191697, 508776), op het kerkterrein; lokale +X langs de scheepsnok naar het koor, RD-richting (0,953717, 0,300706). De toren staat op de −X-zijde. De voet ligt 0,5 m onder het gekozen maaiveld van NAP +3,72 m. Het complex staat op een verhoging; `groundSamplePoints` kiest punten op het kerkterrein om te voorkomen dat de lagere straat en het plein het model te laag plaatsen. Vervangt `NL.IMBAG.Pand.0166100000019872`.

## Bouw en aannames

Het schip en de vijfzijdige koorsluiting delen een langsdak met nok ca. +12,23 m, het brede dwarsschip heeft een dwarskap met nok ca. +13,65 m. Beide zijn uit vlakke dakvlakken opgebouwd, met de kleinere dwarsgevels, uitbouwen, steunberen, vensternissen en ingangen als eigen bouwdelen. De toren heeft een rechthoekige schacht, hoeklisenen, galmgaten en een achtzijdige spits. De kerkelijke bron geeft voor de toren +25,75 m tot onder de bol en haan. De spits is aan de top op 0,9 m begrensd voor de print.

De 3D BAG en het AHN geven contour, as en dakhoogtes; de torenspits in de 3D BAG is verstoord en is vervangen op basis van de opgegeven maat, de AHN-omhullende en de foto. De afmetingen en posities van nissen, steunberen, geveldetails en kleine uitbouwen zijn uit foto's geschat en voor 1:1000 vereenvoudigd. De echte rondboogvormen zijn als blinde spitsboognissen uitgevoerd om zonder steun te printen. Maaswerk, uurwijzers, haan, kruisjes en reliëfs smaller dan 0,9 m zijn weggelaten.

## Controle

De generator controleert geslotenheid, verbinding en te steile ondervlakken. De modeltest controleert BAG-vervanging, de terreinbemonstering, plaatsing, één gesloten component en `supportedSolid` op 1:1000 inclusief horizontale doorsneden. Vier richtingen zijn naast de PDOK-gebouwtegel vergeleken en met beschikbare schuine foto's beoordeeld; de foto's hebben niet allemaal hetzelfde standpunt als de renders. Nabijgelegen pand 0166100000019869 ligt 0,42 m naast het model en hoeft niet te worden vervangen. De kaart en preview-export dienen nog te worden gecontroleerd.

## Bronnen

- [Dorpskerk IJsselmuiden: een stenen kerk](https://dorpskerkijsselmuiden.nl/een-stenen-kerk/): bouwgeschiedenis, torenhoogte 25,75 m en maaiveld +3,72 m NAP.
- [Rijksmonumentenregister kerk 39906](https://monumentenregister.cultureelerfgoed.nl/monumenten/39906) en [toren 39907](https://monumentenregister.cultureelerfgoed.nl/monumenten/39907).
- [3D BAG pand 0166100000019872](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0166100000019872): contour en dakvlakken.
- PDOK AHN DSM en DTM 0,5 m, actuele luchtfoto en gebouwtegels.
- [Wikimedia Commons: Sint-Crispijnkerk IJsselmuiden](https://commons.wikimedia.org/wiki/Category:Sint-Crispijnkerk_(IJsselmuiden)): gevels en opstand.
