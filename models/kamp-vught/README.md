# Nationaal Monument Kamp Vught

Model van het huidige museum en museale kampterrein, in meters, Z omhoog. Oorsprong RD `[146100, 408600]`, +X oost, +Y noord. De GLB gebruikt de glTF-assen `(x,z,-y)` en negen `building:`-nodes. Het model vervangt alleen de drie BAG-panden van museum, barak en crematorium.

## Bronnen en metingen

- [Museum: kampterrein](https://www.nmkampvught.nl/ontdekken/te-zien/kampterrein/) en [Nationaal Comité 4 en 5 mei](https://www.4en5mei.nl/oorlogsmonumenten/zoeken/878/vught-nationaal-monument-kamp-vught): samenstelling en afbakening van het monument.
- [Kindergedenkteken](https://www.4en5mei.nl/oorlogsmonumenten/zoeken/1981/vught-kindergedenkteken): acht bronzen platen; vorm gecontroleerd met front- en schuine Commons-foto's.
- BAG-panden `0865100000009433`, `0865100000019389` en `0865100000019390`; [3D BAG museum](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0865100000009433), [crematorium](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0865100000019389), [barak](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0865100000019390), CC BY 4.0: doorlopende dakvlakken en nokken, gecontroleerd met AHN en luchtfoto.
- PDOK Actueel_orthoHR, BGT en AHN DSM/DTM 0,5 m, opgehaald 11 oktober 2026. Baraknok NAP 8,88 m, crematoriumnok circa 11,25 m, museumdak circa 11,4 m met hogere installaties en een lagere noordvleugel. Schoorsteen rond RD `[146066.85,408657.8]`, top circa NAP 17,25 m. De bomen zijn niet als dak of schoorsteen gebruikt.
- [OSM zuidelijke toren](https://www.openstreetmap.org/node/8618912958), [middelste](https://www.openstreetmap.org/node/8618912959), [noordelijke](https://www.openstreetmap.org/node/8618912960): drie posities aan de oostelijke kampgracht; © OpenStreetMap-bijdragers, [ODbL](https://www.openstreetmap.org/copyright). AHN meet daktoppen rond NAP 11,3–11,7 m.
- [Commons-referenties](https://commons.wikimedia.org/wiki/Category:Nationaal_Monument_Kamp_Vught), waaronder de barak, het crematorium met schoorsteen, museumingang, drie torens en het kindergedenkteken. Foto's alleen voor controle, niet opgenomen in deze repo.

## Opbouw en schattingen

Dakvlakken worden als gesloten prisma's onder hun vlak opgebouwd; triangulatie verdeelt alleen de vlakken. Er zijn geen gestapelde hoogtelagen. De BAG-voet sluit de aansluiting tussen de vleugels; nulvlakken en een losse negatieve uitsparing langs coplanaire crematoriumranden worden verwijderd.

De venstermaten en het gevelritme zijn geschat uit foto's. De barak heeft nissen aan beide lange gevels; het museum heeft een brede glasnis, achterdeur, reliëfmasker en lagere noordvleugel. Nissen zijn maximaal 0,35 m diep en hebben afgeschuinde bovenzijden.

Wachttorenbreedte, verdiepinghoogtes en vensters zijn geschat: totale top NAP 11,6 m, voet 3,9 m breed, dragende pijlers minimaal 0,9 m. De echte dunne kruisverbanden zijn vervangen door een verdikte onderbouw met puntopeningen van circa 54°. De cabinevensters zijn blinde nissen; de dakrand heeft een schuine kraag.

Het kindergedenkteken staat op de BGT-positie van de gedenkmuur. De acht platen zijn aan een 0,9 m dikke kern gehecht en hebben afzonderlijke reliëfvlakken; de open sleuven zijn op 1:1000 gesloten. Top 2,8 m, sokkel en twee flankerende banken zijn geschat uit foto's en ortho. De maquette meet circa 13,7 × 27 m; hoogte en de gegroepeerde gebouwminiaturen zijn geschat. Twee asputten hebben geschatte lage randen.

## Weggelaten

- Prikkeldraad, dunne hekstaanders, de houten kruisverbanden en trappen van de torens: minder dan 0,9 m dik; zouden bij verdikken de open onderbouw dichtzetten.
- Namen, kleine davidsterren, speelgoed, tegelvoegen, losse zonnepanelen en dunne gevelgroeven: te klein voor 1:1000. De grotere dakopbouwen zijn wel opgenomen.
- Het beeld voor politieke gevangenen van Truus Menger bij het crematorium: de uitgestoken armen en afzonderlijke figuren zijn uit de foto geschat veel dunner dan 0,9 m en zouden bij verdikken samenvallen; niet herkenbaar printbaar op 1:1000. Interieurs en het reliëf van afzonderlijke namenpanelen zijn eveneens weggelaten.
- De buitenliggende fusilladeplaats, Barak 1B en de naastgelegen gevangenis: buiten het huidige museale terrein van deze uitsnede. PDOK verzorgt de omliggende gebouwen, gracht, grond en paden. Deze terreinvlakken zijn niet gedubbeld in de GLB.

## Maaiveld en printcontrole

Modeldatum NAP 3,7 m. PDOK maaiveld op de drie buiten de gebouwen gekozen samples: 47,49887, 47,53284 en 47,51003 m ellipsoïdisch. De catalogus gebruikt het minimum 47,4988747982 m en `groundOffsetMetres: -0.3`; dat brengt de modeldatum op 47,1988747982 m. De voet staat op/in het terrein; de lokale bodem volgt niet een fictief vlak plateau.

`node scripts/generate-kamp-vught.mjs --scale 1000` schrijft GLB, JSON en STL. Alle nodes zijn gesloten en bestaan uit positieve volumes; museum, barak, crematorium en de drie torens zijn elk één verbonden volume. De losse STL meet circa 104,3 × 191,4 × 13,55 mm en bevat de afzonderlijke terreinobjecten.

De echte `createModelBundle`-export van een complete uitsnede van 220 × 220 m op 1:1000 is gecontroleerd: preview 220 × 220 mm, alle modelonderdelen binnen de uitsnede. Bij 45° printbare overhang blijft het modelvolume 15911,5157 m³ gelijk: **0% steunopvulling**. Ook doorsneden op 0,5, 2, 4, 6, 8 en 11 m blijven gelijk. Vier schuine aanzichten van 30° boven de horizon zijn naast de PDOK-reconstructie en bronfoto's gecontroleerd; controlebeelden staan buiten de repo.

De regressietest in de webshop controleert de drie vervangen BAG-panden, negen nodes, schoorsteenhoogte, drie torenposities en hun open doorsneden, acht paneelvlakken, positieve verbonden volumes, plaatsing en onveranderd volume na gedeelde overhangcontrole.

[Controlekaart](http://localhost:3000/kaart/51.66625/5.2588/400/1x1/0?size=220): kijk de drie verdikte torens, het kindergedenkteken en de aansluiting van maquette en asputranden op het maaiveld na. Herstart een bestaande dev-server als zijn catalogus nog van vóór de generatie is.
