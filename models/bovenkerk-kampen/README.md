# Bovenkerk (Kampen)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `bovenkerk-kampen.glb` | Catalogusbron in meters: node `building:kerk` (de kerk met de westtoren, uit dakvlakken en bouwdelen) |
| `bovenkerk-kampen-1-1000.stl` | De kerk op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (82 × 47 × 72 mm) |
| `bovenkerk-kampen.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Gegenereerd door `scripts/generate-bovenkerk-kampen.mjs`.

De GLB is in meters met de oorsprong op RD (191155,25, 507617,46), de viering (het
snijpunt van de nok van het schip en die van het dwarsschip), op het maaiveld (NAP
+2,57 m), en de glTF-conventie Y omhoog. +X loopt langs de nok van schip en koor naar
het oostnoordoosten (7,8 graden linksom vanaf de RD-X-as, gemeten aan de nok in het
AHN; de BAG-muren geven 7,1 tot 7,9 graden) en +Y loodrecht daarop naar het
noordnoordwesten. Het maaiveld wordt bemonsterd naast de aanbouwen bij de toren, langs
beide zijbeuken en bij het koor (`groundSamplePoints`, AHN NAP +2,54 tot +2,95 m); de
laagste waarde ligt aan de westkant. Valt geen van die punten in de uitsnede, dan
gebruikt de lader `groundHeight` 45,11 m (de ellipsoïdische PDOK-terreinhoogte op het
laagste punt). Vervangt de PDOK-reconstructie van `NL.IMBAG.Pand.0166100000016074`
(kerk) en `NL.IMBAG.Pand.0166100000016070` (toren); andere PDOK-panden raken het model
niet.

Onderdelen (hoogtes boven het maaiveld op NAP +2,57 m; 81,6 bij 46,8 m en 72,5 m hoog
met de onderkant):

- Schip en koor van de kruisbasiliek onder één nok op +33,9 m (dakvlakken van 59
  graden), muren op v = ±5,6 m met een omgang op +26,7 m achter de dakvoet; de
  koorsluiting heeft zeven zijden van een twaalfhoek rond (19,2, 0), met de dakvlakken
  samenkomend boven dat hart.
- Dwarsschip (u -4,6 tot 5,05 m, tot v = ±17,2 m, gelijk met de buitenmuren van de
  zijbeuken): nok op +34,05 m (55 graden), kopgevels afgewolfd vanaf |v| = 13,5 m,
  een groot spitsboogvenster en een portaal in beide kopgevels, diagonale steunberen
  met pinakels op de oostelijke hoeken en een dakruiter op de viering (achtkantige
  lantaarn en spits tot +39,8 m).
- Zijbeuken van het schip (dubbele zijbeuken onder één dak): per kant vijf dwarse
  zadeldaken (nok +17,5 m noord, +17,25 m zuid, 55 graden, traveeën van 6,5 m) met een
  schild naar de buitenmuur, boven een kilgoot die van de schipmuur met 0,9 m per m
  naar de goot op +12,7 m afloopt; steunberen tussen de traveeën en een venster per
  travee. In de laatste travee voor het dwarsschip het noordportaal (de dwarse kap
  loopt door tot een schild, +17,3 m) en het zuidportaal (tentdak, +16,4 m), beide met
  diagonale hoeksteunberen en een toegang.
- Lichtbeuk: een spitsboogvenster per travee in de muren van schip en koor boven de
  zijbeukdaken, en steunberen met pinakels op de traveegrenzen en op de hoeken van de
  sluiting.
- Kooromgang en kapellenkrans (buitenmuur uit de BAG): goot op +12,6 m met een
  borstwering tot +13,3 m, een kilgoot van +15,8 m langs de koormuur, een lessenaarsdak
  tegen het dwarsschip, drie dwarse kappen per kant langs het rechte koor en vijf
  straalsgewijze kappen rond de sluiting (nok +15,85 m, met een schild naar buiten),
  steunberen met pinakels tot +16,6 m op de BAG-stompjes, een venster per kapelzijde en
  een traptorentje in de hoek met het noordelijke dwarsschip.
- Westtoren (u -47,8 tot -38,0 m, 9,8 bij 10,2 m): drie rijen van drie
  spitsboognissen op de vrije gevels, een waterlijst op +27 m, de goot op +41,5 m, een
  schilddak met een dakkapel per zijde tot de voet van de spits op +44,8 m, en een
  achtzijdige naaldspits tot +72,0 m. De spits staat 0,4 m westelijker dan het hart van
  de schacht en de top nog 0,35 m zuidelijker, zoals in het AHN (de toren helt).
- Lage aanbouwen aan weerszijden van de toren: schilddak (goot +4,2 m, nok circa +7,2
  m) met een plat deel op +4,3 m tegen de zijbeuk, en een venster in de westgevel.

Weggelaten: maaswerk, de uurwerken, bol, kruis en windvaan op de spits (het AHN-punt
van +72,7 m), de opengewerkte balustrades (als dichte borstwering), kleine pinakels en
hogels onder 0,9 m en de luchtbogen: op foto's staan steunberen tussen de kapellen,
maar het AHN toont tussen de straalsgewijze kappen geen verhoging, dus ze zijn hooguit
dun en laag; de steunberen staan er als pinakels in.

Vergelijking met het AHN-DSM (raster op 0,5 m, alleen cellen boven 3 m): 79,7 % ligt
binnen 1 m en 85,2 % binnen 2 m. De afwijkingen zitten vooral aan de randen (overstek
van de dakvoeten), in de toren (de spits is in het DSM deels gat) en bij de dakruiter
en de pinakels, die het AHN niet ziet.

Printbaar op 1:1000: alle vlakken wijzen omhoog of staan verticaal, op de spitsbogen
van de nissen na (58 graden) en de waterlijst van de toren (onder 49 graden). De
printcontrole van de export (printbare overhang, 45 graden) vult op 1:1000 niets bij
(0 %). De STL is 53,8 cm³, heeft 4.360 driehoeken en is één samenhangend deel (status
NoError, genus 0). Dunste delen op 1:1000: de pinakels (0,9 tot 1 mm) en de top van
de spits en de dakruiter (0,9 mm).

Geschat: de hoogtes van de torennissen en de waterlijst, de dakkapellen op het
torendak, de dakruiter boven het AHN, de pinakels en steunberen (hoogtes en maten), de
diagonale hoeksteunberen, de vensternissen en portalen (ligging en maat), de
borstwering van de kooromgang (dicht in plaats van opengewerkt) en de goothoogte van de
aanbouwen bij de toren.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Bovenkerk_(Kampen)) (gotische
kruisbasiliek met dubbele zijbeuken, basilicaal koor met kooromgang en straalkapellen),
Rijksmonument 23053, PDOK BAG, PDOK AHN (dsm en dtm 0,5 m via WCS), 3D BAG LoD2.2
(api.3dbag.nl), de PDOK-luchtfoto en foto's van Wikimedia Commons (toren met schilddak
en naaldspits, koor met borstweringen, dakruiter, portalen).
