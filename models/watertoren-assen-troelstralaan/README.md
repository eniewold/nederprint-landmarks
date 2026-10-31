# Watertoren Troelstralaan (Assen)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-assen-troelstralaan.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: cilinders, een kegelvormige bodem als omhulsel van twee ringen, pilasters en portaal als prisma's.

De watertoren is in 1959-1960 gebouwd naar ontwerp van W. ter Braake (Gemeentewerken Assen), 34 m hoog met een reservoir van 550 m³. Hij is een provinciaal monument en sinds 2022 verbouwd tot verblijf.

## Bestanden

- `watertoren-assen-troelstralaan.glb`: twee nodes van klasse `building`, de toren en het portaal, elk op het maaiveld.
- `watertoren-assen-troelstralaan.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-assen-troelstralaan-1-1000.stl`: alles samen op 1:1000 (12,9 × 13,9 × 33,7 mm).

## Oorsprong en oriëntatie

RD-oorsprong [233082.07, 557060.25], het middelpunt van de ronde BAG-contour van pand 0106100000027379 (straal 6,35 m), op maaiveld (NAP +10,9 m). De ingang met het glazen portaal en de stalen trap ligt naar -Y, op 117,5 graden linksom van RD-oost (noordnoordwest), waar het bordes op de luchtfoto naast de tank uitsteekt; `xAxis` [-0.887, -0.462]. Vervangt alleen het BAG-pand van de toren.

## Onderdelen

De toren is één node: de export vult modellen zonder attributen per node op, en een losse tank- of daknode zou een voet recht tot de grondplaat krijgen. Het portaal staat zelf op het maaiveld en is een tweede node.

- `building:schacht-kegelbodem-tank-en-dak`:
  - schacht: glazen kern (straal 2,55 m) tussen acht betonnen pilasters van 0,8 m breed tot 5,84 m doorsnede, met een gemetselde plint tot +1,0 m; de pilasters staan zo dat het portaal in een glasvak valt;
  - ring rond de schacht (straal 3,6 m, +19,7 tot +20,3) en de kegelvormige betonnen bodem naar de buitenrand (straal 6,45 m) op +21,4, met een betonband tot +21,8;
  - gemetselde tankmantel van 12,7 m doorsnede (BAG) tot +28,5 met een betonnen dekrand tot +28,8;
  - terugliggende vensterband (straal 5,75 m) met zestien vensters van 1,8 m als nissen van 0,3 m, dakschijf met een schuine onderkant van 45 graden tot de blauwe dakrand (straal 6,25 m, +30,8 tot +31,2) en het zeskantige dakhuisje van 2,9 m tot +33,4.
- `building:portaal-en-trap`: glazen portaal van 2,3 × 2,0 m tot +3,6 m met dakrand en glas als nis, bordes op +1,0 m en de trap als schuine wig naar voren.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Assen_Troelstralaan)): bouwjaar, architect, 34 m, 550 m³.
- BAG-pand 0106100000027379: ronde contour van 12,7 m (56 hoekpunten, afwijking < 1 cm), de omtrek van de tank.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-10-31): maaiveld NAP +10,88; op het hart NAP +44,3 (dakhuisje, 33,4 m boven maaiveld), één punt op +45,3 (antenne). Het dak zelf geeft veel gaten, want het ligt vol zonnepanelen (luchtfoto).
- Luchtfoto 8 cm (PDOK): plat dak met lichte dakrand, zonnepanelen, het zeskantige dakhuisje en het bordes met trap aan de noordnoordwestkant.
- Frontale RCE-foto [20412964](https://commons.wikimedia.org/wiki/File:Overzicht_-_Assen_-_20412964_-_RCE.jpg), geschaald op de tankbreedte (29,5 px/m) en gelezen aan de zijkanten van de ellipsen: kraag +20,2, onderkant tankrand +21,2, onderkant metselwerk +22,0, bovenkant metselwerk +28,6, dakrand +30,3 tot +31, schacht 5,8 m. Verder [reservoir](https://commons.wikimedia.org/wiki/File:Overzicht_van_het_reservoir_-_Assen_-_20412958_-_RCE.jpg), [entree](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_entree_van_de_watertoren_-_Assen_-_20412959_-_RCE.jpg) en [AssenWatertoren2017a](https://commons.wikimedia.org/wiki/File:AssenWatertoren2017a.jpg).

## Geschat en weggelaten

Geschat uit foto's: alle hoogtes onder het dak, het aantal pilasters (acht; op elke foto staat er een midden voor en een op ongeveer 50 graden), de breedte en diepte van de pilasters, de helling van de bodem, de maten van portaal, bordes en trap, de vensterverdeling van de omloop (zestien vakken) en de hoogte en breedte van het dakhuisje (uit de luchtfoto en het AHN-hart). De schuine onderkant van de dakschijf is een printkeuze: in het echt is het een platte overstek met een blauwe boeiboord.

Weggelaten (kleiner dan 0,9 m of te dun): zonnepanelen, antenne, de stalen trapleuningen, kozijnen en roeden in de glasvakken, de rode bordessen achter het glas en het metselverband.

## Controle

Twee gesloten NoError-nodes met genus 0, elk één deel en elk op het maaiveld; samen één deel. STL 12,9 × 13,9 × 33,7 mm. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 6 % (de kegel onder de tankbodem naar de schacht) en blijven de doorsneden op 10, 25 en 29,4 m gelijk. In een preview-export op 1:1000 (100 × 100 m rond de toren) staat alleen die kegel en een randje onder de vensterlateien als ondersteuning. Op de kaart staat de toren op de plek van het verborgen PDOK-blok, de voet 0,13 m in het PDOK-maaiveld. Controlebeelden blijven buiten de repo.

Controle-URL: http://localhost:3000/kaart/52.99472/6.55000/200/1x1/0
