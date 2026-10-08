# Baron 1898 (Efteling, Kaatsheuvel)

Bestanden:

| Bestand | Inhoud |
| --- | --- |
| `efteling-baron-1898.glb` | Catalogusbron in meters: nodes `building:schachttoren` (de bok met dek, schijven, lift, top en val), `building:baan` (tunnelput, Immelmann, zero-g-roll), `building:baan-oost` (spiraal, camelback, keerbocht, remmen, opstelspoor) en `building:station` (het mijncomplex met de schoorsteen) |
| `efteling-baron-1898-1-1000.stl` | Het hele model op 1:1000 met de onderkant (0,5 m onder het maaiveld) op het printbed (185 × 55 × 32 mm) |
| `efteling-baron-1898.json` | Catalogusitem met RD-georeferentie, vervangen BAG-panden, hoofdmaten en bronnen |

Gegenereerd met `node scripts/generate-efteling-baron-1898.mjs`
(gedeelde hulpfuncties in `scripts/efteling-kit.mjs`).

De GLB is in meters met de oorsprong op RD (131693,83, 406620,01), het hart
van de schachttoren, op het maaiveld (circa NAP +9,7 m), en de
glTF-conventie Y omhoog. +X loopt 47° linksom van de RD-x-as naar het
noordoosten, langs de as van het station, de lift en de tunnel; +Y wijst naar
het noordwesten (het plein en de Gondoletta). De val ligt aan de -X-kant van
de toren, de remmen komen aan de +X-kant de tongewelfhal binnen. Het maaiveld
wordt bemonsterd op het plein, de paden en het terrein rond toren en gebouw
(`groundSamplePoints`, NAP +9,6 tot +10,2 m), niet in de vijver binnen de
spiraal; `groundOffsetMetres` is 0. Vervangt de PDOK-reconstructies van
`NL.IMBAG.Pand.0809100000019756` (het mijncomplex, 2015, 874 m²) en
`NL.IMBAG.Pand.0809100000019757` (het schoorsteenhuisje, 2015, 36 m²).

Onderdelen (hoogtes boven het maaiveld):

- **Schachttoren**: de stalen bok van 14,5 bij 10 m op zes poten van 1,3 m
  met natuurstenen voeten, kruisverbanden onder 54–55°, de kop met een
  trechter van 45° onder het dek (+26,8 tot +28,8 m), zeskante lantaarns onder
  de hoeken en een seinpaal tot +31,8 m; op beide lange zijden aan de liftkant
  een rode spaakschijf (Ø 8,8 m, midden op +26 m) met het medaillon ervoor op
  een console van 45°. Bij de toren horen ook de kettinglift van 45° uit het
  ophaalgebouw naar de top op +29,6 m (twee kolommen), het wachtpunt aan de
  rand en de val van 87° langs een steunwand de schacht in; het Melkhuysje aan
  de voet.
- **Baan** (dichte band van 1,4 × 0,8 m): de valschacht (omheining als rand
  van 2,4 m), de tunnel naar de tweede put (niet zichtbaar), de uitgang met de
  Immelmann tot +24,2 m (halve looping van 15 m breed) met een A-bok naar de
  top, de halve rol boven de put, de duik en de zero-g-roll over het plein tot
  +14 m met een A-bok dwars op de baan; dan de lage stukken (+3 m), de scherpe
  spiraal (straal 9,5 m, 70° gekanteld, eerste helft +3,8 m, de uitgang kruist
  5 m boven de ingang), de camelback (+12,5 m), de keerbocht bij de
  Gondoletta-oever en de remmen terug op stationshoogte (+4,5 m) met het
  opstelspoor ernaast. Ronde kolommen van 1 m om de ca. 9 m.
- **Mijncomplex**: het ophaalgebouw (liftkamer, muren +13,6 m, schilddak tot
  +17,6 m met twee schoorstenen, vensternissen, spitse poort waar de lift naar
  buiten komt), de middenhal met drie dwarse zadeldaken (+12,1 m), de hal met
  het tongewelf (+9 / +12,4 m, gordelbogen, hoekpijlers met spitsjes, rond
  venster en spitse poort voor de remmen), de lage aanbouw met het
  lessenaarsdak aan de zuidoostkant (+5 tot +8,6 m, lisenen en spitse nissen),
  de aanbouw in de oosthoek, de noordvleugel met twee zadeldaken (+11,2 en
  +10 m, dakkapellen, vensters), de gedraaide directeurswoning met de
  versierde topgevel naar het plein en het torentje met de gouden ui
  (+14,2 m), en het schoorsteenhuisje met de fabrieksschoorsteen tot +22 m.

Niet gemodelleerd: het wateroppervlak (schacht, tunnelput, vijver binnen de
spiraal), de tunnel, het station binnen het gebouw, leuningen, trappen en
hekken, en de nieuwe attractie Hooghmoed (2026) ten zuiden van de toren (op
de luchtfoto nog in aanbouw).

Printbaar: de toren krijgt in de export 12,8 % volume bij op 1:1000 en
16,3 % op 1:500 (het dek, de schijven, de lantaarns), het gebouw 0,02 %. De
baan krijgt 186 % (west) en 254 % (oost) op 1:1000 en 146 % en 133 % op
1:500: de wig met wandje onder de band tussen de kolommen, zoals bij elke
stalen achtbaan op deze schaal. Als één node liep de opvulling van de baan
op 1:500 vast (geheugen), daarom is hij bij een kolom op x ≈ 25 in twee nodes
gesplitst. De STL is 11,3 cm³.

Bronnen: [nl.wikipedia](https://nl.wikipedia.org/wiki/Baron_1898) (lift van
45° naar 30 m, val van 37,5 m onder 87°, tunnel, Immelmann, zero-g-roll over
het plein, spiraal, camelback, remmen; schachttoren, Melkhuysje,
schoorsteenhuisje) en [en.wikipedia](https://en.wikipedia.org/wiki/Baron_1898)
(30 m, 37,5 m, 501 m baan, 90 km/u, 2 inversies), PDOK BAG (de twee panden),
PDOK AHN (dsm en dtm 0,5 m via WCS: dek van de toren +28 tot +29,5 m, lift,
gebouwhoogtes per deel, schoorsteen 21,1 m, schacht en tunnelput als
nodata/water, maaiveld NAP +9,1 tot +10,5 m), de PDOK luchtfoto 8 cm
(baanverloop, spiraal, remmen, schijven, daken; geen ware orthofoto: hoge
delen staan ca. 0,38 m per meter hoogte naar het noorden verschoven) en
Commons-foto's (Category:Baron 1898). Geschat zijn de baanhoogtes buiten de
toren (het AHN ziet de stalen baan maar als losse punten: Immelmann +24 m,
zero-g-roll +14 m, camelback +12,5 m, spiraal en lage stukken), de kanteling,
de steunafstanden, de stationshoogte (+4,5 m), de maat en plaats van de
schijven en het medaillon, de kruisverbanden van de bok (vereenvoudigd tot
X-verbanden), het Melkhuysje en de vensters.
