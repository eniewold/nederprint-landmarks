# Watertoren Kuinre (Kuinre)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-kuinre.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht is een prisma van de BAG-contour, de hoekerkers zijn prisma's en convexe omhullenden van kwart ellipsen, de bovenkant bestaat uit blokken op AHN-hoogtes, en de vensters en de deur zijn blinde nissen.

De watertoren van Kuinre is in 1933 gebouwd in de stijl van de Amsterdamse School. Volgens Wikipedia is hij 35,45 m hoog en heeft hij een reservoir van 120 m³. Hij is rijksmonument 506466. Het is een vierkante bakstenen schacht waarvan de vier hoeken over de hele hoogte zijn uitgespaard. Bovenin zit in elke hoek een bolle erker van glazen bouwstenen: zes rijen glas tussen stenen banden, op een stenen dorpel. Daarboven is de toren weer volledig vierkant. Aan de noordwest- en noordoostzijde ligt het dak lager; de rest is een opbouw met een rand rond een verdiept plat dak. Onderin zitten een deur met luifel en een driedelig venster.

## Bestanden

- `watertoren-kuinre.glb`: één node `building:watertoren-schacht-hoekerkers-opbouw-deur-en-luifel`, op maaiveld.
- `watertoren-kuinre.json`: catalogusitem met RD-oorsprong, `xAxis`, `groundSamplePoints`, `groundHeight` en het vervangen BAG-pand.
- `watertoren-kuinre-1-1000.stl`: het model op 1:1000.

## Oorsprong en oriëntatie

De RD-oorsprong is [185656.01, 533514.43] (52,78805 N, 5,84163 O): het midden van de omhullende rechthoek van BAG-pand 1708100000028231, in het stelsel van de gevels. Het maaiveld ligt op NAP +1,4 (AHN-DTM in een ring van 5,5 tot 8 m: 0,95 tot 1,87, mediaan 1,37). De toren staat op een lage verhoging die naar het oosten oploopt; de 3D BAG geeft voor het maaiveld 0,94.

+X loopt langs de zuidoostgevel naar het noordoosten, onder 44,85 graden linksom vanaf oost; die hoek is gemeten op de lange BAG-gevels (`xAxis` [0.70896, 0.70525]). +Y wijst naar het noordwesten.

`groundHeight` 43,52 is de laagste PDOK-terreinhoogte (ellipsoïdisch) op de vier `groundSamplePoints`: zuidwest 43,52, noordwest 43,58, zuidoost 43,69 en noordoost 44,02 (op het pad). Gemeten met de terreintegels van de export.

Het model vervangt BAG-pand 1708100000028231. Andere panden raken het model niet: het dichtstbijzijnde pand, een bergje van circa 14 m², staat circa 14 m naar het zuiden.

## Onderdeel `building:watertoren-schacht-hoekerkers-opbouw-deur-en-luifel`

Maten in het lokale stelsel, hoogtes boven maaiveld.

- **Schacht**: de BAG-contour, 8,22 × 7,88 m, met uitgespaarde hoeken van 0,58 à 0,75 m (langs X) bij 1,29 à 1,47 m (langs Y), van de voet tot 32,2 m.
- **Hoekerkers**: in elke inkeping een kwart ellips met het middelpunt op de binnenhoek; de ellips raakt beide gevelvlakken aan de rand van de inkeping.
  - Zeven stenen banden van 0,22 m met zes rijen glas van 0,55 m daartussen, van 26,9 tot 31,74 m.
  - Het glas ligt 0,12 m achter de banden; de banden hebben een onderkant van 45 graden.
  - Daarboven vult een overgang van 0,46 m (42 graden) de inkeping tot de volle hoek.
- **Dorpels**: 0,25 m buiten de gevels op 26,9 m, met een onderkant van 45 graden. Eronder zit een kraag die in de binnenhoek van de inkeping uitloopt in een punt 1,85 m lager.
- **Bovenkant**:
  - Volledig vierkant (8,22 × 7,88 m) tot 32,3 m: dat is de lage strook aan de noordwestkant, 1,94 m breed (NAP +33,7).
  - Aan de noordoostkant een strook van 0,66 m breed tot 33,4 m (NAP +34,8).
  - Opbouw van 7,56 × 5,94 m, vlak met de zuidwest- en zuidoostgevel. Een rand van 1,0 m loopt tot 34,6 m (NAP +36,0) rond een verdiept dak op 33,35 m (NAP +34,75).
- **Spleetvensters**: blinde nissen van 0,6 × 1,0 m, 0,3 m diep, op de middellijn van de gevels.
  - In de zuidoost- en noordwestgevel vier boven elkaar: 7,7 / 13,5 / 19,4 / 23,8 m.
  - In de zuidwest- en noordoostgevel één, op 23,8 m.
  - Daarnaast een hoge opening van 0,9 m breed van 29,3 tot 31,4 m in de zuidoostgevel.
- **Begane grond**:
  - Driedelig venster van 1,0 m breed van 1,6 tot 2,8 m in de zuidwestgevel.
  - Deur van 1,2 m breed tot 2,0 m in de zuidoostgevel, 1,2 m naar het noordoosten.
  - Luifel van 2,3 m breed en 0,6 m diep boven de deur, met een onderkant van 45 graden en de bovenkant op 3,0 m.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Kuinre)): bouwjaar 1933, hoogte 35,45 m, reservoir 120 m³, Amsterdamse School, rijksmonument 506466.
- BAG-pand 1708100000028231 (PDOK, 2026-11-06): de contour met de uitgespaarde hoeken.
- 3D BAG (CC BY 4.0, TU Delft 3D geoinformation en 3DGI): maaiveld 0,94; dakvlakken op NAP +34,75 (bijna de hele contour) en +33,2 (strook aan de noordwestkant); h_dak_max 36,21.
- AHN DSM/DTM 0,5 m (PDOK, 2026-11-06):
  - rand van de opbouw NAP +35,9 tot +36,1, verdiept dak daarbinnen +34,75;
  - strook aan de noordwestkant +33,2 tot +33,7, strook aan de noordoostkant +34,8;
  - hoogste punt +36,46 (antennes).
- Luchtfoto (PDOK, 2026-11-06): de rand van de opbouw met installaties binnen, en een donkere lage strook langs de noordwestgevel.
- Foto's op Wikimedia Commons:
  - "Watertoren Kuinre 01d" (vanuit het zuiden): geledingen, erkers, opbouw, spleetvensters, deur met luifel en het driedelige venster. Schaal 18,4 px/m uit de AHN-hoogte van de opbouw.
  - "De watertoren van Kuinre" en "Watertoren Kuinre": de erkers van glazen bouwstenen met hun dorpels, en de lagere strook aan één kant van de bovenkant.

## Geschat en weggelaten

**Geschat**, uit één frontale foto op schaal van de AHN-hoogte:

- de hoogtes van de erkers, banden en dorpels;
- de vensters, de deur en de luifel;
- de stand van de gevels: links op de foto zuidwest, rechts zuidoost. De deur kan dus ook in een andere gevel zitten;
- welke gevels vier spleetvensters hebben: op de foto alleen de zuidoostgevel; de noordwestgevel is aangenomen;
- de vorm van de erkers als kwart ellips in de inkeping;
- de kraag onder de dorpels: niet op de foto's, maar nodig om de erker zonder steun te printen;
- de rand van de opbouw (1,0 m) en de opbouw vlak met de zuidwest- en zuidoostgevel. Het DSM ziet de rand circa 0,6 m verder naar binnen, de foto laat hem vlak met de gevels zien.

**Vergroot voor 1:1000**: spleetvensters 0,6 × 1,0 m (in het echt circa 0,35 × 0,8 m).

**Weggelaten** (kleiner dan 0,9 m):

- de antennemasten en de schotel;
- de regenpijpen;
- de lichte plint;
- de dunne lijst langs de dakrand;
- de roeden in de glazen bouwstenen.

## Controle

Het model is één gesloten NoError-node met genus 0.

In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling, zoals de export die doet, het volume niet. De ondervlakken die dat mogelijk maken:

- banden en dorpellippen met een onderkant van 45 graden;
- de kraag onder de dorpels, 46 graden of steiler;
- de overgang naar de volle hoek onder 42 graden;
- nissen met een plafond van 56 graden;
- de luifel met een onderkant van 45 graden.

Een export op 1:1000 van een uitsnede van 80 × 80 m rond de toren neemt het model op, met de voet op het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

In renders van vier kanten heeft het model tegenover de PDOK-reconstructie (een blok met de uitgespaarde hoeken en een licht hellend dak) meer:

- de erkers met banden en dorpels in alle vier de hoeken;
- de volle vierkante bovenkant;
- de lage strook en de opbouw met verdiept dak;
- de spleetvensters;
- aan de zuidkant de deur met luifel en het driedelige venster.

Controle-URL: http://localhost:3000/kaart/52.78803/5.84164/200/1x1/0
