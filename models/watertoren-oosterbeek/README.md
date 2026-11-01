# Watertoren Oosterbeek

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-watertoren-oosterbeek.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: de schacht, de band en de afdeklijst zijn omwentelingsprofielen, consoles, lisenen, vensters en balkonkastjes zijn `hull`-blokken met schuine ondervlakken, de trappentoren is een prisma met ronde koppen; vensters en deur zijn nissen.

De watertoren van Oosterbeek is in 1938 gebouwd naar ontwerp van architect Th.K.J. Koch, 22,35 m hoog met een reservoir van 150 m³. Hij staat in het bos aan de noordkant van het dorp en is gemeentelijk monument. De bakstenen toren draagt antennes van telecomaanbieders.

## Bestanden

- `watertoren-oosterbeek.glb`: één node van klasse `building`, op het maaiveld. De export vult modellen zonder attributen per node op; een los trappenhuis of losse vensters zouden een eigen voet tot de grondplaat krijgen.
- `watertoren-oosterbeek.json`: catalogusitem met RD-oorsprong, `xAxis` en het vervangen BAG-pand.
- `watertoren-oosterbeek-1-1000.stl`: alles samen op 1:1000.

## Oorsprong en oriëntatie

RD-oorsprong [184278.04, 444665.48], het hart van de cirkel in BAG-pand 0274100000009522 (61 punten, straal 4,02 m op 1 mm na), op maaiveld (NAP +55,25 m; het maaiveld loopt rond de voet van +55,6 aan de noordkant naar +55,2 aan de zuidkant). Het AHN-silhouet onder de borstwering ligt op dezelfde plek. Assen in RD-richting (`xAxis` [1, 0]). De trappentoren staat op het zuiden (BAG-uitbouw met ronde kop), aan het pad vanaf de weg. Vervangt alleen het BAG-pand van de toren.

## Onderdeel `building:schacht-met-band-vensters-en-trappentoren`

- Ronde bakstenen schacht, taps van 8,04 m aan de voet (BAG) naar 7,84 m onder de afdeklijst (AHN), met een afdeklijst 0,08 m uit en een borstwering tot +20,8 rond een plat dak op +19,75. De borstwering is 0,9 m dik.
- Stenen band op de reservoirvloer, 0,2 m uit, van +14,9 tot +15,3 met een schuin ondervlak; daaronder om de 45 graden een console (0,55 m breed, 0,3 m uit) op een lisene van 0,1 m die tot het maaiveld loopt. Op het zuiden neemt de trappentoren de plaats van console en lisene in.
- Vier smalle uitgebouwde vensters (0,9 m breed, 0,25 m uit) van +16,75 tot +19,0 met een glasnis van 0,55 × 1,85 m, een kapje en een schuine onderkant, midden tussen twee consoles op 67,5, 112,5, 202,5 en 337,5 graden (linksom vanaf het oosten). Onder elk venster een balkonkastje op de band (1,2 m breed, 0,55 m uit, onderkant schuin naar de muur).
- Trappentoren aan de zuidkant: 2,06 m breed met ronde koppen, 1,6 m uit de schacht, tot +22,6; boven het dak loopt hij als trappenhuis door tot 1,9 m ten noorden van het hart. Deur (1,0 × 2,2 m) in de zuidkop. Op het trappenhuis een installatieblok met de antennekasten tot +23,65.

## Bronnen en maten

- [Wikipedia](https://nl.wikipedia.org/wiki/Watertoren_(Oosterbeek)): architect, bouwjaar, 22,35 m, 150 m³.
- AHN DSM/DTM 0,5 m (PDOK, opgehaald 2026-11-01): maaiveld rond de voet NAP +55,2 tot +55,65, plat dak NAP +75,0, borstwering tot NAP +76,05, trappenhuis NAP +77,85 van 5,5 m ten zuiden tot 1,9 m ten noorden van het hart, antennekasten tot circa NAP +79,5. Straal per sector: 3,85 tot 3,95 m onder de borstwering, een sprong van 0,2 tot 0,3 m op 15 tot 16 m boven maaiveld (de band). De bomen rond de toren reiken tot 15 m en vervuilen de lagere sectoren.
- 3D BAG (LoD2.2): maaiveld NAP +55,15, dak NAP +75,0, opbouw tot NAP +78,8 en een blok op NAP +79,5 (antennes).
- BAG-pand 0274100000009522 en luchtfoto (PDOK): ronde toren met lichte afdekking rond een donker dak, trappenhuis met ronde kop van de zuidrand naar het midden, pad naar het zuiden.
- Foto [Watertoren Oosterbeek](https://commons.wikimedia.org/wiki/File:Watertoren_Oosterbeek.jpg) (Basvb, 2010), van onderen uit het noordoosten: band met consoles om de 45 graden en lisenen, twee uitgebouwde vensters met kapje en een balkonkastje met drie openingen, afdeklijst, antennes. Hoogtes geteld in steenlagen (circa 88 lagen van 6,25 cm van de afdeklijst tot de band, 5,5 m); vensters 28 tot 58 lagen boven de band.

## Geschat en weggelaten

Geschat: de hoogte van de band (steenlagen op de enige foto, klopt met de sprong in het AHN), de afmetingen van consoles, lisenen, vensters, kapjes en balkonkastjes (op de foto geschaald op de schachtbreedte), de richting van de foto en dus van consoles en vensters (de trappentoren is op de foto niet te zien, dus is de foto genomen vanuit het noordoosten), de vensters en kastjes op 112,5 en 202,5 graden (gespiegeld om de as van de trappentoren; op de foto staan alleen die op 67,5 en 337,5), de deur in de zuidkop van de trappentoren (aan het pad), de lichte tapsheid van de schacht en de dikte van de borstwering (0,9 m in plaats van circa 0,5 m, om op 1:1000 te staan). Het installatieblok is versimpeld tot één blok binnen de omtrek van het trappenhuis.

Weggelaten (kleiner dan 0,9 m of te dun): de antennemasten en bliksemafleiders, de drie openingen in de balkonkastjes, de roeden van de vensters, de kleine vensters van de trappentoren (de zuidkant staat op geen enkele foto) en het metselverband.

## Controle

Eén gesloten NoError-node met genus 0. In de webshoptest (`tests/landmark-models.test.ts`) vergroot de 45-gradenopvulling per node, zoals de export die doet, het volume niet (verhouding 1,0000000): band, consoles, balkonkastjes, kapjes en afdeklijst hangen onder 56 graden, nissen hebben een plafond onder 56 graden en de schacht is recht. De doorsneden op 1,1, 8, 14,5, 15,1, 16,5, 17,9, 19,1, 20,5 en 22 m blijven gelijk. Controlebeelden blijven buiten de repo. De preview-export (1:1000, support v2) heeft geen steun; op de kaart staat de toren op het verborgen PDOK-blok met de voet op de helling 0,05–0,4 m in het maaiveld.

Controle-URL: http://localhost:3000/kaart/51.98961/5.81345/200/1x1/0
