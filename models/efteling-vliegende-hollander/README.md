# De Vliegende Hollander (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-vliegende-hollander.glb` | Catalogusbron in meters: nodes `building:havenstad` (showhal, gevelrij, huis Van der Decken, kademuur), `building:toren` (liftoren met lifthuisbak) en `building:baan` (de baan met steunen, duinhuisje en wrak) |
| `efteling-vliegende-hollander-1-1000.stl` | Het hele model op 1:1000 met de onderkant (NAP +7,3 m, onder het water van de vijver) op het printbed (79 × 109 × 26 mm) |
| `efteling-vliegende-hollander.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Gegenereerd met `node scripts/generate-efteling-vliegende-hollander.mjs`
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131782,45, 406568,49), het hart
van de liftoren, op het maaiveld bij de toren (NAP +10,4 m), en de
glTF-conventie Y omhoog. +X loopt langs de gevel aan het plein (RD-richting
-14,4°, ongeveer naar het oosten) en +Y de hal in (ongeveer naar het noorden);
de toren, het plein en de vijver liggen aan de -Y-kant. Het maaiveld wordt
bemonsterd op het pad ten westen van de toren en op het plein
(`groundSamplePoints`, NAP +10,4 tot +10,6 m); `groundOffsetMetres` is 0.
De onderkant ligt op Z = -3,1 m (NAP +7,3 m), een halve meter onder het water
van de vijver (NAP ca. +7,9 m), omdat de kademuur, de pijlers en de plons in
het water staan. De vijver zelf zit niet in het model (PDOK-water). Vervangt
de PDOK-reconstructie van `NL.IMBAG.Pand.0809100000017610` (showhal met toren,
bouwjaar 2006).

Onderdelen (hoogtes in NAP):

- **Havenstad**: de showhal op het BAG-pand (dak +17,3 m, het noordoostdeel
  +15,8 m) met borstwering en kantelen langs de buitenranden en installaties op
  het dak; aan het plein de stadsmuur met looppad (+14 m), pilasters met
  leeuwen en de roestige poort (blinde nissen), daarachter vijf havenhuisjes
  van 4,2 m met klok-, trap- en spitse houten gevels (goot +17 m, toppen tot
  +21,4 m) en twee vensters elk; het huis van kapitein Van der Decken in de
  hoek (nok +21,5 m) met trapgevels op de kopse kanten (treden van 1,25 m),
  de houten dakkapel op een kraag van 45°, deur en vensters als nissen en de
  leeuwen bij de deur; de kademuur langs de BGT-oever met kantelen (+12,1 m) en
  spitse bogen op de waterlijn, de grote boog is de doorvaart van de sloepen.
- **Toren**: de liftoren (7,2 bij 7,0 m) met plint en lichte band, mezekouwen
  op een kraag van 45°, de omgang met spleten en kantelen tot +29,3 m, vier
  achtkante hoektorentjes op een kraag met spitsen tot +32,8 m, de houten bak
  aan de zuidkant waar de baan naar buiten komt, en de schuine houten
  lifthuisbak die onder 42° van de top naar het dak van de hal loopt (de lift
  van 22,5 m zelf zit binnen).
- **Baan**: een dichte band van 1,5 m breed en 0,9 m dik: de val uit de toren
  (+26,2 m) met een rechterbocht naar het wrak aan de oever, waar de baan het
  'mistige gat' induikt; vanaf de uitgang in het duin de luchtheuvel (+17,5
  m), het dal, de overhelde linkerbocht in het noorden (tot 75° gekanteld,
  +16 m), de klim naar het duinhuisje op palen (tussenrem, nok +22,6 m), de
  tweede val, de linkerbocht over het water, de laatste bult (+13,2 m) en de
  plons (+8,2 m). Kolommen van 1,0 m om de ca. 6 m, onder lage delen op het
  land een doorlopende voet, boven het water pijlers.

Het ondergrondse deel tussen het wrak en de uitgang in het duin en de dark
ride binnen (havenstation, spookschip, lift) zijn niet gemodelleerd.

Printbaar: de stad en de toren krijgen in de export vrijwel niets bij (0,01 en
0,07 % op 1:1000). De baan krijgt op 1:1000 73 % en op 1:500 38 % volume bij:
dat is de wig met wandje onder de band tussen de kolommen en onder het
duinhuisje, zoals bij elke stalen achtbaan op deze schaal. De STL is 19,7 cm³.

Bronnen: [nl.wikipedia](https://nl.wikipedia.org/wiki/De_Vliegende_Hollander_(Efteling))
en [en.wikipedia](https://en.wikipedia.org/wiki/De_Vliegende_Hollander)
(hoogte 22,5 m, 420 m baan, volgorde van de rit), PDOK BAG (het pand), PDOK
BGT (oever van de vijver), PDOK AHN (dsm en dtm 0,5 m via WCS: daken, toren,
lifthuisbak, duinhuisje en baanhoogtes als maxima langs het pad), de PDOK
luchtfoto (tracé, kademuur, wrak; let op: geen ware orthofoto, hoge delen
staan tot ca. 0,35 m per meter hoogte naar het noorden verschoven) en
Commons-foto's (Category:De Vliegende Hollander). Geschat zijn het tracé onder
de bomen (1-2 m nauwkeurig), de kanteling van de bochten, de steunafstanden,
de hoogte van de overhelde bocht, de vorm van het wrak, de indeling van de
gevelrij en de geveltypes (naar de foto's), de vensters en de leeuwen.
