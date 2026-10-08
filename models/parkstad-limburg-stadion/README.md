# Parkstad Limburg Stadion (Kerkrade)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `parkstad-limburg-stadion.glb` | Catalogusbron in meters: node `building:stadion` (vier tribunes met membraandaken boven de open zitrang, vier hoeken met tent, vier lichtmasten met schuine giek en de aanbouwen aan alle zijden) |
| `parkstad-limburg-stadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het laagste maaiveld) op het printbed (220,6 × 160,6 × 45,4 mm, één stuk) |
| `parkstad-limburg-stadion.json` | Catalogusitem met RD-georeferentie, maaiveld, vervangen BAG-panden, hoofdmaten en bronnen |

Gegenereerd door `scripts/generate-parkstad-limburg-stadion.mjs`.

## Oorsprong en oriëntatie

De GLB is in meters met de glTF-conventie Y omhoog. Na omzetting naar Z omhoog
ligt de oorsprong op RD (198561,67, 318762,52), in het hart van de
veldopening (het midden tussen de voorranden van de vier daken). +X loopt
langs de lange as van het veld naar het oostnoordoosten (27,6 graden vanaf de
RD-X-as, uit de voorranden van de vier daken in het AHN), +Y dwars daarop naar
het noordnoordwesten, naar de hoofdtribune.

Het stadion ligt in heuvelachtig terrein op een eigen plateau: het veld ligt op
NAP +172,3 m, de straten en parkeerterreinen rond de gevels op NAP +170,6 tot
+171,2 m, en verder naar het noorden zakt het terrein naar NAP +163 m bij de
vijver. z = 0 is daarom het laagste maaiveld op acht punten 12 tot 18 m buiten
de gevels (`groundSamplePoints`; `groundHeight` 216,29 m ellipsoïdisch, circa
NAP +170,4 m); het veld ligt 1,91 m hoger. Langs de hele buitenrand ligt het
PDOK-terrein 0,3 tot 1,2 m boven z = 0, zodat de voet nergens zweeft, en in de
zitrang steekt het PDOK-terrein nergens boven de treden uit. De noordelijke
hellingbaan aan de oostzijde zit ook in het PDOK-terrein; het model ligt daar
0,2 m boven het AHN-profiel.

Vervangt de PDOK-reconstructie van de vier BAG-panden:
`NL.IMBAG.Pand.0928100000125190` (het stadion), `…125458` (aanbouw west),
`…125612` (aanbouw oost) en `…126245` (aanbouw zuid met het hotel).

## Onderdelen

Hoogtes hieronder boven het veld (AHN-DSM 0,5 m); in het model komt er 1,91 m
bij. Alles is opgebouwd uit uitgetrokken en gedraaide doorsneden, blokken,
prisma's en convexe rompen van vlakken, geen hoogteveld.

- **Veldopening en voorranden**: de voorranden van de vier daken vormen een
  rechthoek van 128,8 bij 86,1 m (u ±64,4, v ±43,05 m). Daaronder begint de
  zitrang, achter een gracht van 2 m die 1,2 m onder het veld ligt (in het
  PDOK-terrein).
- **Tribunes**: per zijde dezelfde doorsnede, langs de zijde uitgetrokken: een
  zitrang van twaalf treden van +1,2 tot +11,4 m (22 m diep), een achterwand
  van 3 m tot in de dakplaat met een donkere band (de bovenste omloop) boven de
  bovenste trede, en een dakplaat van 1,8 m dik die 25 m over de rang
  uitkraagt. Bij de hoofdtribune (noord) is het dak 19,5 m diep en heeft de
  rang negen treden tot +9,2 m met de skyboxband erachter. Onder het dak is de
  rang tot de dakplaat (+15,3 m aan de voorrand) open.
- **Membraandaken**: per vak van 10,75 m een tongewelf dat dwars op de tribune
  loopt, met het dal op +17,1 m aan de voorrand tot +16,1 m achter en de kruin
  1,1 m hoger (AHN), elf vakken op de lange zijden en zeven op de korte, met
  het middelste vak midden op de zijde. Op de vaklijnen radiale spanten (ribben
  van 1,2 m, 0,6 m boven het dal) die aan de veldkant 1,6 m uitsteken, en een
  vakwerkligger van 2,5 m hoog langs de voorrand.
- **Hoeken**: kwartcirkels met straal 25 m om de hoeken van de veldopening, met
  een zitrang die met de hoek meedraait en een achterwand met band. Erboven
  een hol tentdoek van 2 m dik: een flauwe kegel (top +23,3 m, helling 0,33)
  met een steile top tot +27,0 m, 8,5 m langs beide assen buiten de hoek van de
  veldopening, en een vlakke rand op +16,75 m in de stroken tussen het laatste
  spant en de hoek. De top hangt met een hanger aan de giek.
- **Lichtmasten**: per hoek een driehoekige vakwerkgiek (drie randstaven en
  zigzagdiagonalen van 0,9 m, 3,6 m breed onderaan en 2,8 m bovenaan, tien
  vakken) die vanaf een pijler op de buitenhoek (25,5 m langs de diagonaal, tot
  +10,6 m) onder circa 56 graden schuin over de tent naar binnen loopt, met de
  lampenkop (6,4 × 5,0 × 1,6 m, 25 graden gekanteld naar het veld) boven de
  hoek van het veld tot +43,0 m (45 m boven straat, zoals Wikipedia).
- **West (Koempeltribune)**: de bakstenen gevel op u = -99,6 m met het hoge
  middendeel (+21,0 m, v ±17,5 m), het glazen tongewelf met het clublogo
  (v ±9,5 m, tot +24,0 m) boven een glazen pui, vleugels op +17,55 m en de
  buitenste delen op +14,0 m, met raamnissen per verdieping.
- **Oost**: de lage strook (+14,0 m, midden +17,55 m) met aan beide kopse
  kanten een hellingbaan van +4,2 m naar het maaiveld (AHN-profiel), en het
  winkelgebouw (Albert Heijn XL; +21,0 m, middendeel +24,2 m) met de entree
  (de gevel boven +11 m ingesprongen), een entreeportaal, raamstroken en twee
  installaties op het dak.
- **Zuid (Theo Pické Tribune)**: de vleugels op +17,45 m en het hotel
  (u -29 tot 35,5 m, +21,9 m) met een kern (+20,6 m), een installatie op het
  dak en raamstroken in vijf lagen.
- **Noord (hoofdtribune)**: de strook achter de skyboxen (+14,85 m, met een
  lichtkap op +15,8 m) en het middendeel (+18,1 m, dakrand +19,2 m) met de
  gebogen glazen gevel tot v = 75,8 m, met glazen banden en ramen.

## Geschat en weggelaten

Geschat: de treden van de zitrang (aantal en hoogtes; het AHN ziet alleen het
dak), de dikte van de dakplaat (1,8 m) en van het tentdoek (2,0 m), de holle
vorm van de tenttop, de doorsnede van de giek en de lampenkop, de pijler onder
de giek, de raamnissen (maat en ritme uit de foto's) en de entree van het
winkelgebouw.

Weggelaten: de stoelen, trappen en hekken op de zitrang, de dugouts, de
reclameborden, de lichtletters PARKSTAD LIMBURG op het dak van de westgevel en
de staalkabels van de tenten (dunner dan 0,9 m), de staven van de spanten en
de vakwerkligger (als gesloten balken gemodelleerd), en de kolommen en trappen
achter de rang (achter de aanbouwen en te fijn).

## Printbaarheid op 1:1000

Onder +9,9 m wijst geen vlak flauwer dan 45 graden omlaag (raamnissen hebben
een schuine bovenkant van 46 graden); daarboven hangen de dakplaten, de
tentdoeken, de uitstekende spanten, de giek en de lampenkoppen bedoeld uit. De
printcontrole (`prepareMeshes` met printbare overhang, 1:1000) geeft status
NoError en vult 14,5 % volume op (332 naar 380 cm³), in 21 s. De STL is één
stuk (status NoError, genus 43 door de vakwerkgieken), 301 cm³.

## Bronnen

[Wikipedia](https://nl.wikipedia.org/wiki/Parkstad_Limburg_Stadion) (19.979
plaatsen, lichtmasten 45 m, aanbouwen per tribune), PDOK BAG (de vier
panden), PDOK AHN (DSM en DTM 0,5 m via WCS: voorranden, dakprofiel en
spanten, hoeken, tenten, lichtmasten, aanbouwen, hellingbanen, gracht en
maaiveld), de PDOK luchtfoto (membraantonnen, spanten, tenten en gieken) en
Wikimedia Commons-foto's (Parkstad Limburg Stadion, augustus 2016; Parkstad
Limburg Stadion Kerkrade 19-02-2020; Kerkrade, Parkstad Limburg stadion van
Roda JC IMG 2091; Voetbalstadion Kerkrade; Parkstad Limbug Stadion -
panoramio; Parkstad Limburg Stadion.JPG; Roda JC - panoramio; Nieuwbouw
Parkstad Limburg Stadion - panoramio, vijf foto's uit 1999-2000) voor de
zitrang onder het dak, de membraantonnen, de giek met de lampenkop, de
westgevel met het gewelf en het hotel.
