# WerkTalent Stadion (Den Haag)

Het stadion van ADO Den Haag in het Forepark (Haags Kwartier 55, geopend in
2007, 15.000 plaatsen). Het heette achtereenvolgens ADO Den Haag Stadion,
Kyocera Stadion, Cars Jeans Stadion en Bingoal Stadion (2022–2025) en heet
sinds 2025 WerkTalent Stadion; de slug volgt de backlog (`bingoal-stadion`).

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `bingoal-stadion.glb` | Catalogusbron in meters: node `building:stadion` (ring van tribunes met dakrol, hoofdtribune, vier lichtmasten) |
| `bingoal-stadion-1-1000.stl` | Het stadion op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (165 × 143 × 42 mm, één aaneengesloten stuk) |
| `bingoal-stadion.json` | Catalogusitem met RD-georeferentie, vervangen BAG-pand, hoofdmaten en bronnen |

Gegenereerd door `scripts/generate-bingoal-stadion.mjs`.

De GLB is in meters met de oorsprong op RD (86139,50, 453195,10), in het hart
van de veldopening op het maaiveld rond het stadion (NAP −2,4 m; het veld zelf
ligt 1,9 m hoger en zit in het PDOK-terrein), en de glTF-conventie Y omhoog.
+X loopt langs de lengteas van het veld naar het noorden (93,43 graden vanaf
de RD-X-as, uit de rechte voorranden van de vier daken in het AHN) en +Y dwars
daarop naar het westen, naar de hoofdtribune. Het maaiveld wordt op vier
punten op de straten en pleinen 10 tot 15 m buiten de gevel bemonsterd
(`groundSamplePoints`); `groundHeight` 41,04 m is de laagste PDOK-terreinhoogte
(ellipsoïdisch) op die punten. Vervangt de PDOK-reconstructie van BAG-pand
`NL.IMBAG.Pand.0518100000273015`; het stadion is één pand.

Onderdelen (hoogtes boven het maaiveld; AHN-DSM op 0,5 m, luchtfoto en
foto's; alles in prisma's, blokken en convexe rompen van vlakken, geen
hoogteveld en geen lagen):

- De ring van de oost-, noord- en zuidtribune. Voorrand (de rand van de sleuf
  langs het veld) op x = 62,75 en −63,25 m en y = ±44,25 m met hoeken van
  7 m straal; gevel op de BAG-contour (x = 81,3 en −79,95 m, y = −61,1 m) met
  kwart-ellipsen in de hoeken. Per zijde een doorsnede die langs de zijde is
  uitgetrokken en in de dichte, overdekte hoeken van zijde naar zijde
  overgaat: een zitrang van zeven treden (+2,5 tot +11,5 m) die onder het dak
  open blijft, de achterwand, een dakplaat van 2,2 m dik over de rang, de
  dakvlakken van de voorrand (oost +17,7 m op 1,75 m achter de voorrand, noord
  +17,5 m op 2,25 m, zuid +17,9 m op 4,0 m) via de goot naar de nok (+18,65 m,
  13,5 tot 15,25 m achter de voorrand), en de afgeronde dakrol (superellips)
  die tot 2 m buiten de gevel uitbolt (+13 m) en op +11 m tegen de gevel
  aansluit.
- De gevel van de ring: een plint die 0,3 m terugligt tot +3,3 m met een
  schuine kraag, raamstroken (5,6 m breed, +4,6 tot +6,4 m), twee rijen kleine
  vensters (1,3 m, +7,6 en +9,4 m) en ingangen in de plint om de 20 m, alle als
  nissen van 0,4 tot 0,5 m.
- De hoofdtribune (Eretribune) aan de westkant, tussen schuine kopgevels
  (|x| = 59,2 + 0,275 (y − 54), AHN en BAG): voorrand op y = 44,25 m, dakrand op
  y = 45,5 m (+17,65 m), dakvlak met helling 0,329 tot de knik op y = 64,5 m
  (+23,9 m), dan een cirkelboog (straal 17,9 m) over de nok (+24,53 m op
  y = 69,3 m) naar de dakrol, die 2,6 m buiten de licht gebogen westgevel
  (BAG: y = 76,0 m in het midden, 72,85 m bij de kopgevels) uitbolt. Eronder
  een zitrang van negen treden (+2,6 tot +14,6 m), daarachter de skyboxen als
  glazen band (0,6 m diep, +15,4 tot +20 m, penanten om de 6 m), in de zwarte
  kopgevels twee rijen raamstroken en een deur, in de westgevel een plint,
  raamstroken en kleine vensters.
- De glazen entreehal (x −8,06 tot 9,23 m, tot y = 80,35 m, +21 m) met de
  ingang en drie glasvelden als nissen tussen stijlen van 1,0 m, en de letters
  van de stadionnaam op het dak (veertien blokken van 2,6 × 0,9 m met 0,9 m
  tussenruimte, x −23,5 tot 25 m, tot +28,6 m).
- Vier schuine lichtmasten op de hoeken: een achthoekige buis (straal 0,75
  naar 0,5 m) van het dak boven de hoek (x = ±68,6, y = ±48,5 m) onder 66 graden
  naar de binnenhoek, met een kraag op het dak en een lampenbank van
  6,0 × 1,2 × 3,4 m op een trechter, tot +41,8 m (AHN: +39,4 m NAP).

Geschat: de treden van de zitrang (het AHN ziet alleen het dak), de dikte van
de dakplaten, de onderkant van de dakrol, de skyboxband, de plaats en maat van
de vensters en ingangen (regelmatig vereenvoudigd; de echte gevel heeft een
speels verspreid patroon), de doorsnede van de masten en de lampenbanken, en
de letters (schematisch als blokken; het AHN toont de letters van Cars Jeans
Stadion op het frame, de huidige naam staat op dezelfde plek). Weggelaten: de
zonnepanelen (vlak op het dak, < 0,9 m), de goten als goot (alleen als knik in
het dakprofiel), de stoelen, trappen, hekken en reclameborden, de
spelersbanken, het videoscherm in de hoek, de lampen langs de dakrand, het
stalen frame onder de letters (te fijn voor 1:1000), de sleuf en het verhoogde
veld (zitten in het PDOK-terrein) en de parkeergarage en looproutes ten noorden
van het stadion (geen deel van het stadionpand).

Pasvorm op het AHN: de voorranden van de daken liggen op de AHN-randen
(oost −46,0, noord 65,0, zuid −67,25 en west 45,5 m, rechte randen binnen
0,1 graad evenwijdig), de dakhoogtes van de ring binnen 0,1 m van het DSM
(binnenrand +15,1 tot +15,5 m NAP, nok +16,25 m NAP), het dak van de
hoofdtribune binnen 0,2 m tot aan de dakrol, en de buitenste rand van de
dakrol op de rand van het DSM (oost −63,0 m). Aan de westgevel valt het DSM
steiler af dan de modelrol (het AHN ziet de rol op 1,4 m buiten de gevel al op
+15 tot +18 m, het model op +21 m); de foto's tonen een ronde rol.

Printbaar op 1:1000: onder +2,9 m wijst geen vlak onder 45 graden naar
beneden; daarboven hangen de dakplaten over de rang, de dakrol en de
bovenkant van de nissen bedoeld uit (`OVERHANG_OK`). De lampenbanken staan op
een trechter met zijden steiler dan 50 graden en de buizen staan onder 66 graden, dus
die hoeven geen opvulling. De export vult op 1:1000 18,6 % volume op (150,0
naar 177,9 cm³) in 3,7 s, zonder fout. De STL is 140,1 cm³ (23.998
driehoeken, status NoError), één stuk.

Bronnen: [Wikipedia](https://nl.wikipedia.org/wiki/WerkTalent_Stadion)
(15.000 plaatsen, verhoogd veld, de namen), PDOK BAG (pand
0518100000273015, contour van de gevel), PDOK AHN (dsm en dtm 0,5 m via WCS),
de PDOK luchtfoto (hoeken, goten, entreehal, masten) en Wikimedia
Commons-foto's (Cars Jeans Stadion, Den Haag (NED); Cars Jeans Stadion
(36995264265); ADO Den Haag Stadion, Forepark; Stadium at The Hague, Forepark,
the Netherlands img.nr. 01 tot 30; Panorama ADO Den Haag Stadium 15-8-2019;
ADO Den Haag v Vitesse 2019: dakrol, gevel met vensters, zwarte kopgevels,
entreehal, letters, masten en zitrang onder het dak).
