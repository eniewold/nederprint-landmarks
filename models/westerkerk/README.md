# Westerkerk (Amsterdam)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `westerkerk.glb` | Catalogusbron in meters: node `building:westerkerk` met middenschip, zijbeuken, de twee dwarsbeuken, steunberen, aanbouwen en de Westertoren met de keizerskroon, node `building:prinsengracht-281` met het pand tegen de zuidgevel van de toren, node `building:oostaanbouw` met de lage aanbouw voor de oostgevel en node `building:aanbouwen-dwarsbeuk` met de twee lage aanbouwen onder de oostelijke dwarsbeuk |
| `westerkerk-1-1000.stl` | De kerk met het pand naast de toren en de aanbouwen in één stuk op 1:1000, met de onderkant (1 m onder het maaiveld) op het printbed (61 × 34 × 86 mm) |
| `westerkerk.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

De GLB is in meters met de oorsprong op RD (120701,34, 487525,44), in het
hart van de Westertoren, op het maaiveld (NAP +1,6 m) en de glTF-conventie Y
omhoog. +X loopt langs de as van de toren naar de oostgevel (RD-richting
-3,3 graden, net ten zuiden van oost), +Y naar het noorden; de toren staat aan
de -X-kant, aan de Prinsengracht, en de oostgevel aan de Westermarkt. Het
maaiveld wordt op drie punten bemonsterd (`groundSamplePoints`, NAP +1,6 tot
+1,7 m: de kade voor de toren en de straat langs de noord- en zuidkant), zodat
het water van de Prinsengracht buiten beschouwing blijft. Het catalogusitem
vervangt BAG-panden `NL.IMBAG.Pand.0363100012174221` (de kerk) en
`NL.IMBAG.Pand.0363100012174220` (Prinsengracht 281, 1772, tegen de zuidgevel
van de toren): PDOK reconstrueert dat pand met de AHN-punten van de toren tot
een kolom van ellipsoïdisch 110,6 m (circa NAP +67 m), die naast het model op
de kaart bleef staan. Om dezelfde reden vervangt het ook drie lage aanbouwen
uit 1990 die PDOK met de gevelpunten van de kerk ophoogt:
`NL.IMBAG.Pand.0363100012164998` voor de oostgevel (PDOK circa NAP +28 m, AHN
+5,2 m) en `NL.IMBAG.Pand.0363100012174224` en `NL.IMBAG.Pand.0363100012174406`
tussen de steunberen onder de oostelijke dwarsbeuk (PDOK NAP +16,9 m, AHN
+5,2 m). De andere aanbouwen tussen de steunberen en ten noordoosten van de
kerk en het pand ten noorden van de toren (Prinsengracht 277, 1761) blijven
als PDOK-reconstructie staan; in de export reikt geen ervan hoger dan zijn
AHN-hoogte (Prinsengracht 277 NAP +10,4 m, de rest +5,6 tot +5,9 m of lager).

Onderdelen in het model (hoogtes in NAP, uit dwarsprofielen van het AHN-DSM in
een stelsel langs de as):

- Alles binnen de BAG-contour tot +6 m: de lage aanbouwen tussen de
  steunberen aan de noordkant, met de steunberen langs de zuid-, oost- en
  noordgevel tot +12 m en een aanbouw naast de toren tot +10 m.
- De zijbeuken van de westgevel tot de oostgevel onder een vlak dak op
  +18,1 m dat naar de buitenmuur afloopt, met een vensternis per travee.
- Het middenschip van 13,2 m breed: muren tot +27 m, zadeldak met de nok op
  +37,1 m van de toren tot de oostgevel, met een groot venster als nis in de
  oostgevel en een kleiner in elke zijbeuk daarnaast.
- De twee gelijke dwarsbeuken van 10 m breed (assen 23,65 m uit elkaar, goot
  +26 m, nok +33,8 m) van de noord- tot de zuidgevel, met topgevels en een
  groot venster als nis aan beide kanten.
- De Westertoren rond de oorsprong: de bakstenen voet binnen de BAG-contour
  tot +20 m met het portaal, de romp van 9,8 m tot +44,5 m met twee rijen van
  twee galmgaten in de west-, noord- en zuidgevel, de kroonlijst met
  balustrade tot +46,2 m die 0,3 m uitkraagt, de zandstenen geleding van 8 m
  met de nis van het wapen tot +53,6 m, de eerste houten geleding van 6,4 m
  met een galmgat in elke gevel, kroonlijst en balustrade tot +63,2 m, de
  tweede van 5,4 m tot +71,5 m, de voet met voluten, de keizerskroon (band
  van 3,6 m, koepel tot +78,3 m), de bol en de naald met de windvaan tot 85 m
  boven het maaiveld (NAP +86,6 m).
- Een eigen node `building:prinsengracht-281`: het hoekpand van twee
  bouwlagen tussen de toren, de zuidelijke zijbeuk en de Westermarkt als blok
  binnen zijn BAG-contour (9,3 × 10,9 m) op dezelfde onderkant als de kerk,
  met een schilddak (foto op Commons en luchtfoto): de nok langs de
  Prinsengracht van de toren tot de hoek en langs de Westermarkt van de hoek
  tot de kerk, goot +11 m, nok +15,5 m, dakhelling circa 52 graden, en een plat
  dak op +12,8 m in de binnenhoek tegen de toren en de kerk. De hoogtes komen
  uit het AHN-DSM binnen de contour zonder de cellen tegen de torengevel
  (mediaan +13 m, 95e percentiel +15,7 m); 86 % van die cellen ligt binnen 1 m
  van het model. Dakkapellen zijn weggelaten.
- Een eigen node `building:oostaanbouw`: de lage aanbouw van 1,8 × 10,2 m
  voor de oostgevel tussen de middelste steunberen, binnen zijn BAG-contour,
  met een plat dak (luchtfoto, deels glas) op NAP +5,2 m (mediaan van het
  AHN-DSM binnen de contour zonder de cellen tegen de gevel).
- Een eigen node `building:aanbouwen-dwarsbeuk`: de twee lage aanbouwen van
  5,9 × 1,65 m tussen de steunberen onder de oostelijke dwarsbeuk, aan de
  noord- en zuidkant, binnen hun BAG-contouren met een plat dak op NAP +5,2 m
  (de buitenste DSM-cellen en de gelijke aanbouwen in de andere travees, +5,0
  tot +5,4 m).

Binnen de voetafdruk ligt 81 % van de DSM-cellen binnen 2 m van het model
(75 % binnen 1 m, mediaan +0,16 m); per deel 87 % bij het schip met de
zijbeuken ten westen van de eerste dwarsbeuk, 91 % bij de dwarsbeuken en
83 % bij het schip daartussen en ten oosten ervan. De toren wijkt per cel het
meest af (26 % binnen 2 m): het DSM van de opengewerkte geledingen, met
zuilen, balustrades en open klokkenlantaarns, verspringt van cel tot cel tot
20 m. Per ring rond het hart ligt het model wel tussen de mediaan en het 90e
percentiel van het DSM (bijvoorbeeld 63,2 m tegen 62,9 tot 67,1 m op 3 tot
3,5 m uit het hart, 72 m tegen 66 tot 73 m op 2,5 tot 3 m); het hoogste
AHN-punt ligt op +83 m bij de bol, de dunne windvaan erboven ontbreekt in het
AHN.

Printbaar op 1:1000 zonder steun: alles staat recht op of loopt schuin omhoog,
elke geleding van de toren is smaller dan de vorige, de kroonlijsten van de
bovenste geledingen en de band van de kroon kragen onder 40 graden uit, de
naald is 0,9 m dik en de nissen hebben een spitse bovenkant van 60 graden.
Alleen de kroonlijst met balustrade boven de bakstenen romp kraagt 0,3 m vlak
uit; het script controleert dat geen ander vlak boven de onderkant naar
beneden wijst en dat alles op dezelfde onderkant begint, ook bij het pand
naast de toren (dat heeft alleen schuin omhoog lopende dakvlakken) en de
aanbouwen (rechte blokken). Door die
uitkraging gaat de kerk als gesloten solid met overhangopvulling door de
export, zodat de nissen behouden blijven: een uitsnede van 200 m op 1:1000
duurt circa 1,8 seconden (45,9 naar 47,5 cm³, vooral de voet tot de
onderplaat) en de vervangen panden zitten niet meer in de export. Voor de STL
verenigt het script het pand en de aanbouwen met een las van 5 cm in de
kerkmuur, omdat de BAG-muren net niet samenvallen met het model en de
vereniging anders dunne tunneltjes of losse snippers overlaat. Het maaiveld van het model ligt
0,1 tot 0,5 m onder het PDOK-maaiveld rondom, de onderkant 1,1 tot 1,5 m.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/Westerkerk_(Amsterdam))
(driebeukige protestantse kerk van Hendrick de Keyser uit 1620-1631 met twee
gelijke dwarsbeuken, 58 × 29 m),
[Westertoren](https://nl.wikipedia.org/wiki/Westertoren_(Amsterdam))
(1638, bakstenen romp, een zandstenen en twee met lood beklede houten
geledingen en de keizerskroon, circa 85 à 87 m),
[Rijksmonumentenregister 4298](https://monumentenregister.cultureelerfgoed.nl/monumenten/4298),
PDOK BAG (contour), PDOK AHN (dsm en dtm 0,5 m via WCS: dwarsprofielen,
omhullende van de toren per hoogte en per afstand tot het hart, maaiveld) en
foto's op Wikimedia Commons (de bovenbouw van de toren frontaal en vanaf de
Westermarkt, het pand Prinsengracht 281), PDOK luchtfoto (de platte daken van
de aanbouwen). Geschat zijn de grenzen en breedtes van de torengeledingen (uit
het AHN en de verhoudingen op een frontale foto), de vorm van de kroon, de
naald met de windvaan boven het hoogste AHN-punt (de top op 85 m boven het
maaiveld), de vensternissen en de hoogtes van de steunberen en aanbouwen; de
zuilen, vazen, balustrades, uurwerken en open lantaarns zijn dicht of
weggelaten, en de zijbeuken hebben een vlak dak zoals het AHN ze toont.

Licentie van het model: eigen werk op basis van open bronnen.
