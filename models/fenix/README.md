# Fenix (Rotterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `fenix.glb` | Catalogusbron in meters: node `building:fenixloods` (de loods met de dakramen en de Tornado op het dak) |
| `fenix-1-1000.stl` | De loods op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (174 × 49 × 31 mm) |
| `fenix.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (92862,65, 435227,87), het hart van
de Fenixloods, op het maaiveld (NAP +3,4 m), en de glTF-conventie Y omhoog. +X
loopt langs de lange gevel naar het oosten (7,75 graden met de klok mee vanaf
de RD-X-as) en +Y loodrecht daarop naar het noorden, naar de Maas. Het maaiveld
wordt op vier punten op de promenade en de kade bemonsterd
(`groundSamplePoints`, NAP +3,3 tot +3,5 m). Vervangt de PDOK-reconstructie van
`NL.IMBAG.Pand.0599100010056978`.

Onderdelen (hoogtes boven het maaiveld):

- De Fenixloods op de BAG-contour (173 bij 49 m) met een licht hellend dakvlak
  uit het AHN-DSM: +11,9 m aan de zuidzijde en +13,3 m aan de noordzijde (NAP
  +15,3 en +16,7 m). De noordrand loopt over de laatste 3 m schuin af (van
  +13,3 m op v = 21,4 naar +6,4 m op v = 24,45; het AHN toont daar de schuine
  glasstrook langs de dakrand).
- 16 dakramen in een rij op v = -4,3 tot -9,2 m: zaagtandkappen van 3,1 m
  breed met het zinken dak oplopend van het dak in het noorden naar de nok op
  v = -7,7 m (2,1 m boven het dak, 32 graden) en een schuin glasvlak dat aan de
  zuidkant weer afloopt naar het dak (54 graden; de witte kozijnen op de
  luchtfoto, die van boven goed te zien zijn). In het AHN op 0,25 m staan 19
  identieke verhogingen op een vaste steek van 8,6 m (u = -82,0 tot 72,5 m); de
  drie voor de Tornado (u = -13,2, -4,6 en 4,0 m) staan in de glaskoker die de
  Tornado door het dak laat en zijn op de luchtfoto verdwenen, die blijven weg.
  De bouwfoto's (dezeen, designboom) tonen dezelfde prisma's met driehoekige
  wangen. Een eerdere versie met een verticale glasgevel kwam op 90 % binnen
  1 m van het AHN; het schuine glasvlak geeft 98 %.
- Vier opbouwen op het dak uit het AHN: twee blokken van 5,1 bij 3,9 m en 1,5 m
  hoog aan de zuidrand (u = -38,9 en 38,4 m, de liftkokers) en twee kleine
  kasten van 2,4 bij 2,1 m (1,5 m) en 2,6 bij 2,9 m (2 m) bij de westkop.
- De Tornado van MAD Architects, opgebouwd als een loft van secties
  (Manifold-mesh, gesloten): de voet is een afgeronde rechthoek van 26 bij 27 m
  op het dak (de glaskoker, u = -17,7 tot 8,3 m, v = -14,4 tot 12,7 m);
  daarboven waaiert de wand uit (onderaan iets sneller dan bovenaan, met een
  draai van 18 graden die naar boven uitdooft) naar de platformring van 35 bij 42
  m (u = -22,6 tot 12,9 m, v = -17,9 tot 24,2 m), met een 1 m uitstekende rand
  die op een afschuining van ongeveer 45 graden rust. De ring staat dus ruim 5
  m ten noorden van het hart van de voet (de Tornado is scheef). De bovenrand is
  een schuin vlak (0,08 m/m dalend naar het oosten, 0,10 m/m stijgend naar het
  noorden): +24,0 m bij het uitkijkplatform (u = -14,25, v = 8,95 m), +25,3 m in het
  noordwesten (het hoogste) en +20,2 m in het zuidoosten. In het dek liggen drie
  trapkuilen (ovalen met een vlakke bodem): de zuidwestelijke van 18 bij 11 m
  (bodem +15 m), de oostelijke van 19 bij 7 m (+16,5 m) en de noordelijke van 11
  bij 6 m (+19 m); de stroken ertussen zijn de trapbanden. Het uitkijkplatform
  ligt in het noordwesten op +24 m rond de zwarte kern (cilinder van 5,8 m
  doorsnede, vanaf het dak tot +27,6 m), met daarboven de schotelkap: een
  afgeplatte ellips van 16,2 bij 12,2 m (hoek 22 graden) met de rand op +28 m, de
  top op +30 m en de onderkant tot +26,2 m bij de kern.

Plaats en vorm van de Tornado zijn geschat. Het AHN is van voor de bouw, de
luchtfoto geeft de omtrek maar is een gewone ortho: alles wat hoog boven het
maaiveld staat is in de foto naar het noorden verschoven (de gevel aan de
zuidkant is als strook van 2 m voor 12 m hoogte zichtbaar, dus 0,17 m per m
hoogte; de dakramen op +12,6 m staan er 2,1 m te noordelijk tegenover het AHN,
dat is dezelfde 0,17). Daarom zijn de glaskoker 2,1 m, de ring en de trapkuilen
(op ongeveer +23 m) 3,8 m en de kern en de kap (op ongeveer +29 m) 4,8 m naar het
zuiden gezet. In de foto staat de ring daardoor ruim 15 m noordelijker dan de
voet, in het model 5 m. De schaduw die de Tornado op het dak werpt (zon uit het
zuidwesten, hoek rond 45 graden) valt in het model 2 tot 4 m korter dan op de
foto, dus de plaats klopt tot op enkele meters. De hoogtes
(platform 24 m, top 30 m, de ringhelling) komen uit de pers en de bouwfoto's. De
binnenkant (glaskoker, helixtrap, bruggen) is niet gemodelleerd en de ring is
massief onder de trapkuilen.

Vergelijking van de loods met het AHN-DSM (rastervergelijking op 0,25 m binnen
de BAG-contour, 1 m rand eraf, zonder het Tornado-gebied u = -26 tot 16 m): 98,4 %
ligt binnen 1 m en 99,0 % binnen 2 m (gemiddelde afwijking 0,16 m). Alleen de
dakramen: 98 % binnen 1 m en 100 % binnen 2 m, het volume boven het dakvlak is 217
m³ tegen 222 m³ in het AHN. De noordrand (v = 21 tot 24,4): 89 % binnen 1 m. Op
de Tornado is geen AHN-vergelijking mogelijk (hij staat er niet in).

Printbaar op 1:1000 zonder steun: alleen de schotelkap (onderkant 19 tot 29
graden) en een deel van de trechterwand (30 tot 45 graden) hangen onder de 45
graden en staan in `OVERHANG_OK`; het script slaagt zonder `--allow-overhang`.
De export vult 0,23 % bij op 1:1000 en 1:1500 en 1,17 % op 1:2500. De STL is
115,4 cm³ en het model één samenhangend deel (genus 0).

Bronnen: [Wikipedia](https://en.wikipedia.org/wiki/FENIX_Museum_of_Migration),
[dezeen](https://www.dezeen.com/2024/09/09/fenix-museum-rotterdam-mad-tornado-steel-staircase/)
en [designboom](https://www.designboom.com/architecture/mad-architects-fenix-museum-completion-double-helix-staircase-rotterdam-10-03-2024/)
(foto's van de bouw en de afwerking, hoogtes), PDOK BAG (het pand), PDOK AHN
(dsm en dtm 0,5 m via WCS, op 0,25 m herbemonsterd) en de PDOK luchtfoto.
Geschat zijn de plaats, vorm en maten van de Tornado en de precieze vorm van de
glasgevel van de dakramen. Weggelaten: installaties kleiner dan 0,9 m, de
geveldetails, de glazen strook langs de zuidrand van het dak en de dubbele
helixtrap in de Tornado.
