# Hervormde Kerk (Blokzijl)

Hervormde Kerk of Grote Kerk aan de Brouwerstraat, rijksmonument 10448: een in
1609 gestichte zaalkerk, een van de eerste protestantse kerken die nieuw werden
gebouwd. In de loop van de 17e eeuw werd ze uitgebouwd tot kruiskerk. In 1630
kwam de toren in de noordarm aan de Kerkstraat erbij.

## Bestanden

| Bestand | Inhoud |
| --- | --- |
| `hervormde-kerk-blokzijl.glb` | Model in meters, Y omhoog, één node `building:kerk` |
| `hervormde-kerk-blokzijl.json` | Catalogusitem |
| `hervormde-kerk-blokzijl-1-100.stl` | Printbestand 1:100 in mm, Z omhoog |
| `hervormde-kerk-blokzijl-1-1000.stl` | Printbestand 1:1000 in mm, Z omhoog |

Gegenereerd met `node scripts/generate-hervormde-kerk-blokzijl.mjs`.

## Oorsprong en oriëntatie

- Oorsprong RD (193751,7, 526779,1): het snijpunt van de twee nokken, op
  maaiveldniveau (NAP +1,75 m, AHN-DTM rond de kerk).
- X naar het oosten (`xAxis` [1, 0]): beide nokken lopen op RD-noord, en de
  dakvlakken in de 3D BAG staan op 0, 90, 180 en -90 graden. Y wijst naar het
  noorden, waar de toren staat.
- `groundOffsetMetres` 0 met `groundHeight` 1,75 als terugval. Het model loopt
  0,5 m onder het maaiveld door.
- Vervangt BAG-pand 1708100000017874. Kerk, toren, portaal en aanbouwen zijn
  één pand.

## Onderdelen

- **Schip** (west-oost, 29,4 x 12 m) en **dwarsarm** (zuid-noord, 27,25 x
  11,7 m), allebei met goot NAP +11,9 m en nok NAP +17,4 m (41 tot 43 graden).
  De armen eindigen in een schild van 53 graden dat begint op de schouder van
  de eindgevel (NAP +14,2 m). Hoogtes en hellingen komen uit de 3D BAG
  (LoD2.2) en het AHN-DSM.
- **Eindgevels** west, oost en zuid: rechte gevels van 0,9 m dik met
  schouders op NAP +14,2 m en een segmentboog over 6 m tot NAP +16,3 m (de
  AHN-omhullende langs de gevels). Elke gevel heeft twee hoge vensters als
  nis. In de zuidgevel zitten ook de blinde boog rechts en het portaal.
- **Portaal** voor de zuidgevel: een middendeel van 2,45 x 2,9 m tot
  NAP +5,05 m (BAG, 3D BAG) met een segmentvormig fronton tot NAP +5,85 m, en
  lagere zijvleugels (NAP +4,05 m) met elk een deur.
- **Toren** in de noordarm (5,7 x 5,15 m; het voorvlak ligt gelijk met de
  noordgevel): schacht tot de kroonlijst op NAP +22,8 m met deur, galmgaten en
  vier wijzerplaten. Daarop staan een klokvormige, afgeschuinde kap tot
  NAP +25,4 m in drie vlakken, een achtkante lantaarn met balustraderand,
  spitse openingen als nis en een kroonlijst tot NAP +28,1 m, een koepeltje
  tot NAP +30,2 m en een achtkante naald tot NAP +35,0 m.
- **Aanbouwen** tegen de oostarm: een plat afgedekte aanbouw op NAP +5,7 m met
  een schuine voorkant, en een smalle aanbouw met een lessenaarsdak dat van
  NAP +5,7 m tot +11,6 m oploopt. Beide volgen de vlakken in de 3D BAG.

## Geschat en weggelaten

- Geschat uit foto's (RCE, Commons): de hoogtes van de torenbekroning (kap,
  lantaarn, koepeltje en naald; de AHN-piek ligt rond NAP +34 m), de maten van
  vensters, deuren en galmgaten, en het fronton en de zijvleugels van het
  portaal. Rondbogen zijn nissen met een spitse top van circa 54 graden, zodat
  ze zonder steun printen.
- Er is niet van elke kant een foto. Daarom is het aantal vensters in de
  lange muren geschat: één per vrij muurvak.
- Vereenvoudigd: de oostgevel staat recht (in de BAG loopt hij 0,9 m scheef),
  en de gevels zijn symmetrisch (op foto's en in het AHN is de ene schouder
  soms hoger dan de andere).
- Weggelaten: het maaswerk, de oculi in de gevelspitsen, de windvaan, de
  balustrade van de lantaarn als open hekwerk, en de knoppen op het portaal.
  Dat is allemaal dunner dan 0,9 m.

## Controle

- `status` NoError, genus 0, één samenhangend volume, 1646 driehoeken, hoogste
  punt 33,25 m boven het maaiveld.
- `tests/landmark-models.test.ts` (Hervormde Kerk Blokzijl) controleert de
  catalogus, de oorsprong, `replacesBuildings`, de plaatsing en de
  printbaarheid op 1:1000 zonder extra steun (volume en doorsneden binnen 3 %).
- Renders van vier kanten naast de 3D BAG-reconstructie (LoD2.2).
  Plaatsingscontrole met het AHN-maaiveld op de negen bemonsteringspunten: de
  laagste ligt op NAP +1,58 m, dus de voet ligt 0,1 tot 0,4 m in het maaiveld.

## Bronnen

- BAG-pand 1708100000017874 (PDOK BAG WFS)
- 3D BAG: <https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1708100000017874>
- Rijksmonumentenregister: <https://monumentenregister.cultureelerfgoed.nl/monumenten/10448>
- Wikipedia: <https://nl.wikipedia.org/wiki/Hervormde_kerk_(Blokzijl)>
- Wikimedia Commons: foto's van de kerk (onder meer RCE 20036385 tot 20036393 en
  20404426)
- OpenStreetMap: <https://www.openstreetmap.org/way/267114635>
- AHN DSM/DTM 0,5 m (PDOK WCS)
