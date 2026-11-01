# Nieuwe watertoren (Tiel)

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-tiel-nieuwe-watertoren.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: schacht en reservoir zijn een cilinder en een omwentelingsprofiel, de steunberen geëxtrudeerde blokken, de latei een omhulsel met een schuine onderkant; deur en vensters zijn nissen.

De nieuwe watertoren van Tiel staat aan het Fabriekslaantje bij de Echteldsedijk. Hij is in 1946 gebouwd naar ontwerp van G.B.F. Hoes op de plek van de in de oorlog verwoeste toren uit 1890, 35 m hoog met een reservoir van 500 m³. Sinds de restauratie van 2016 is het een woning met kantoor; het is een gemeentelijk monument.

## Bestanden

- `watertoren-tiel-nieuwe-watertoren.glb`: één node van klasse `building`, op het maaiveld: schacht, steunberen, reservoir, dak en latei samen. De export vult elke node apart op; een los reservoir zou een eigen voet krijgen.
- `watertoren-tiel-nieuwe-watertoren.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-tiel-nieuwe-watertoren-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [158841.6, 433447.59], het middelpunt van de ronde BAG-contour van pand 0281100000000199 (straal 6,0 m), op maaiveld (NAP +6,40 m, mediaan van het DTM op 7 tot 11 m van het hart; het grindplein rond de toren is vlak binnen 0,1 m). Assen in RD-richting (`xAxis` [1, 0]).

De toren helt over: in het AHN ligt het middelpunt van het dak (de rand van NAP +40,5 m) 0,90 m westelijk en 0,43 m noordelijk van het BAG-middelpunt. Aan de oostzuidoostkant liggen muurpunten buiten het dak die per hoogte geleidelijk naar het dak toe schuiven (op 16 m 0,4 m, op 31 m 0,1 m buiten de dakrand), aan de westkant is onder de overhang een gat in het DSM. Het model helt daarom als afschuiving langs z 1,0 m over naar het westnoordwesten (1,7 graden).

De acht steunberen staan op het noorden, noordoosten, oosten enzovoort (kompas k × 45 graden; op de twee foto's vanuit het oosten en op de luchtfoto binnen circa 5 graden). De deur en de vensterstroken staan in de oostelijke vakken op kompas 67,5 en 112,5 graden.

## Onderdeel `building:schacht-met-steunberen-reservoir-en-dak`

- Ronde bakstenen schacht van 10,4 m (straal 5,2) tot de onderkant van het reservoir op +23,0.
- Acht steunberen van 1,0 m breed tot straal 6,2: tot het reservoir 1,0 m voor de schacht, daarboven 0,3 m voor het reservoir, tot +25,8 (de natuurstenen blokken op de bovenkant, circa 1 m hoog, liggen in het vlak van de beer).
- Reservoir van 11,8 m (straal 5,9) van +23,0 tot +34,1, met een betonnen rand van 0,1 m uit tot +23,3. Tussen de beren kraagt het met die rand 0,8 m horizontaal uit boven de schacht.
- Opstaande rand rond het dak: 0,8 m dik, bovenkant +34,1 met een afgeschuinde koperen afdekking vanaf +33,9; plat dak op +33,05; dakluik van 1,4 × 1,6 m tot +33,35 in het midden.
- In elk van de acht vakken een klein venster onder de dakrand, 0,5 × 0,9 m van +31,2 tot +32,1, als nis van 0,25 m.
- Vensterstroken van 0,5 m breed van +10,5 tot +22,2 in de vakken op kompas 67,5 en 112,5 graden, in het zuidelijke van die twee eronder nog een los venster van +7,0 tot +8,5.
- Deur van 1,2 × 2,4 m in het vak op kompas 67,5 graden (nis van 0,35 m), met een betonnen latei van 2,6 m breed, 0,2 m uit de gevel, van +2,8 tot +3,05 op een schuine onderkant (56 graden).

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Nieuwe_watertoren_(Tiel)): bouwjaar 1946, architect G.B.F. Hoes, hoogte 35 m, reservoir 500 m³, geschiedenis en herbestemming.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld NAP +6,40, plat dak +33,05 boven maaiveld met een rand tot +34,0 à +34,16, dakluik 0,25 tot 0,3 m boven het dak, het dak 11,7 tot 12 m breed, de straal per sector op lage hoogte 6,0 tot 6,3 m, en de scheefstand (zie boven).
- BAG-pand 0281100000000199 (bouwjaar 1946, in gebruik): een cirkel van 6,0 m straal.
- Luchtfoto (PDOK, 8 cm): het platte dak met de lichte afdekking van de rand, het dakluik in het midden, en door de hoogteverplaatsing (0,165 m per m) de noordnoordoostkant van de schacht met de beren; de verhouding tussen dakrand, onderkant reservoir en voet gaf de onderkant van het reservoir op circa 23 m.
- Foto [Tiel Watertoren Fabriekslaantje 26](https://commons.wikimedia.org/wiki/File:Tiel_Watertoren_Fabriekslaantje_26.jpg) (Wiki Loves Monuments 2015, vanuit het oosten): beren, uitkraging met betonnen rand, natuurstenen blokken, vensterstroken, deur met latei; hoogtes langs de schacht met een perspectiefmodel (camera circa 28 m van de as, verankerd op de onderkant van het reservoir en de voet).
- Foto [Watertoren Tiel](https://commons.wikimedia.org/wiki/File:Watertoren_Tiel.jpg) (ook vanuit het oosten, verder weg): beren, de kleine vensters onder de dakrand en de rand met koperen afdekking; de afstanden tussen de beren op beide foto's (na perspectiefcorrectie 44 tot 47 graden) gaven acht beren.

## Geschat en weggelaten

Geschat: er zijn alleen foto's van de oostkant. De beren en de kleine vensters onder de dakrand zijn rondom gelijk genomen (de toren is regelmatig, en op beide foto's staan ook in de vakken aan de rand vensters onder het dak); de vensterstroken en de deur alleen waar ze op de foto's staan, de andere vakken blijven dicht. De hoogte van de onderkant van het reservoir (23 m, luchtfoto 24,4 en foto's 22 m), de bovenkant van de beren (2,8 m daarboven), de diepte van de uitkraging (0,7 m plus de rand, uit de onderaanzicht op de foto) en het uitsteken van de beren (0,3 m voor het reservoir; het AHN laat niet meer dan circa 0,3 m toe) zijn geschat. De hoogtes van vensters, deur en latei komen van schuine foto's van onderaf (circa 0,5 m nauwkeurig). De scheefstand komt alleen uit het AHN; er is geen bron die hem noemt.

Weggelaten: de ronde metalen plaat boven de deur (0,85 m), de antenne op het dak en het rooster van het dakluik (onder 0,9 m); de natuurstenen blokken als apart vlak (ze liggen in het vlak van de beer, alleen de kleur verschilt); de kozijnen en de verdeling van de vensterstroken; het hekwerk en de berging van 31 m² ten zuidwesten van de toren (een eigen BAG-pand, niet vervangen).

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume met 0,24 % (gemeten 1,00243): dat is alleen de wig onder de onderkant van het reservoir, dat tussen de beren 0,8 m horizontaal uitkraagt (van 22,2 tot 23 m); op 22,6 m is de doorsnede na het opvullen groter. Nissen hebben een plafond onder 56 graden en de latei hangt onder 56 graden over: de doorsneden op 1, 2,95, 7,7, 15, 21,5, 23,15, 24,5, 28, 31,6, 33,5 en 34 m blijven gelijk. Op de kaart hoort de toren op de plek van het verborgen PDOK-pand te staan, met het dak circa 1 m west-noordwestelijk van de voet. Controlebeelden blijven buiten de repo. In de preview-export (1:1000, support v2) komt een wig onder het reservoir tussen de beren en dunne schoren in de groeven langs de steunberen; op de kaart staat de toren op het verborgen PDOK-blok met de voet 0,1 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.88955/5.44298/200/1x1/0
