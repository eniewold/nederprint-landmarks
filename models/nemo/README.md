# NEMO Science Museum (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `nemo.glb` | Catalogusbron in meters: nodes `building:romp`, `building:toren` |
| `nemo-1-1000.stl` | Romp en toren in één stuk op 1:1000, met de onderkant (NAP -2 m) op het printbed (45 × 117 × 32 mm) |
| `nemo.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (122660, 487475) op straatniveau aan
de zuidkant (NAP +1,5 m) en de glTF-conventie Y omhoog; de STL ligt 3,5 m hoger,
zodat de onderkant op z = 0 staat. Het model is noord-georiënteerd (+X oost,
+Y noord); de boeg wijst naar het noorden, over het plein aan het Oosterdok.
Het maaiveld wordt op twee punten op de straat ten zuidwesten bemonsterd
(`groundSamplePoints`): de standaardpunten rond de voetafdruk van 117 m zouden
op de lagere kade (NAP +0,6 m), het water of de tunnelhelling (NAP -4,4 m)
vallen. De romp loopt door tot NAP -2 m, zodat hij ook aan de kadezijden in het
terrein staat.

Het catalogusitem vervangt BAG-pand `NL.IMBAG.Pand.0363100012164988`
(`replacesBuildings`). De PDOK-reconstructie daarvan heeft een redelijk
LoD2.2-dak, maar verticale gevels op de dakomtrek: de boeg wordt een dichte muur
tot de grond en de schuine zuidgevel een rechte wand. Het pand ten zuiden
(`0363100012170749`) blijft staan.

Het model is vereenvoudigd zodat het op 1:1000 zonder losse steunconstructie
print (zie de Magere Brug): de export vult er nog 0,2 % van het volume op. Dat
geldt als NEMO helemaal binnen de uitsnede valt; snijdt de rand van de
uitsnede het model af, dan snijdt de export het als gesloten volume af en vult
hij op wat er dan nog overhangt.

Onderdelen in het model (hoogtes in NAP):

- Romp op de BAG-dakomtrek (Amsterdam meet de bovenaanzichtcontour) met de ronde
  boeg en de schuine zuidgevel. De koperen gevels beginnen op NAP +4,5 m,
  1,5 m binnen de dakrand, en waaieren uit tot de dakrand op NAP +13,5 m.
- De boeg hangt vrij boven het plein: onder de boeg staat de dubbelhoge
  entreehal tot NAP +9,3 m, tot 19,6 m achter de punt; daarvoor loopt de
  onderkant onder 47 graden op tot de punt. Vanaf de hal waaiert de koperen
  schaal sterker uit dan de romp: op NAP +9,3 m 6 m binnen de dakrand, tot de
  dakrand op NAP +25,5 m (frontale foto: de onderrand is circa 74 % van de
  breedte bovenaan).
- Uitbouw in de oostgevel onder de boeg, tussen het trappenhuis en de voorkant
  van de hal: een trapezium van 13,3 m onderaan en 8,2 m bovenaan, van 4,7 tot
  14,7 m boven straat, met de voorkant 2,4 m binnen de dakrand (dus onder de
  overhangende schaal, op de luchtfoto niet zichtbaar). Onderaan loopt hij onder
  45 graden terug naar de gevel van de hal, zodat hij zonder steun print. In werkelijkheid is dat circa
  30 graden (foto: de onderkant begint 40 m achter de punt op circa 8 m), wat
  op 1:1000 niet zonder steun print.
- De zuidgevel helt naar buiten: op NAP +4,5 m ligt hij 4 m achter de dakrand
  (foto: circa 25 graden).
- Dak volgens het AHN: trappenplein in negen treden van NAP +13,7 naar +22 m,
  het middenvolume (25 m breed) van +24,9 naar +27 m, en het boegdak van +25,3
  naar +30 m.
- Terugliggende trappenhuizen in beide zijgevels tussen romp en boeg (BAG),
  over de volle hoogte.
- Begane grond 1,9 m terug onder de romp (onder de zuidgevel 4,4 m); de
  entreehal onder de boeg 6,5 m.
- Bakstenen toren van 3,5 × 3 m aan de zuidgevel tot NAP +23 m (AHN).

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/NEMO_(museum)) (Renzo
Piano, 1997, boven de ingang van de IJtunnel), PDOK BAG (dakomtrek, boeg,
trappenhuizen), PDOK AHN (dsm en dtm 0,5 m via WCS: dakprofiel, middenvolume,
toren, straat- en kadeniveau), de PDOK luchtfoto (indeling van het dak) en
Wikimedia Commons-foto's (`NEMO science center from tour boat 2016-09-12-6565.jpg`,
`A view on the NEMO-museum, located above the entrance of the IJ-tunnel, in Amsterdam, FotoDutch, 2013.jpg`,
`2018 - NEMO Science Museum, Amsterdam, Netherlands ( Ank Kumar ) 01.jpg`,
`NEMO and area.jpg`) voor de boeg, de entreehal, de gevelhelling en de toren,
plus een foto van de oostgevel voor de uitbouw. Het Mapbox Standard-landmarkmodel
is alleen visueel vergeleken (plaats van de uitbouw); er is geen geometrie uit
overgenomen.
Dakomtrek en dakhoogtes komen uit BAG en AHN; de hoogte van de entreehal, de
lengte en helling van de boeg, de helling van de zuidgevel, het uitwaaieren
van de zijgevels en de boeg en de maten van de uitbouw zijn uit foto's geschat. De treden van het plein zijn
gelijkmatig verdeeld; de trap langs de oostrand, de dakopbouwen, de
zonnepanelen en de ramen zijn niet gemodelleerd.

Licentie van het model: eigen werk op basis van open bronnen.
