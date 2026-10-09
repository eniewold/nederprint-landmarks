# Station Groningen (Groningen)

`station-groningen.glb` en `station-groningen.json` zijn het kaartmodel;
`station-groningen-1-1000.stl` meet 121,5 × 32,3 × 26,9 mm.
Reproduceer met `node scripts/generate-station-groningen.mjs`.

RD `[233623.076,581123.967]`, X-as `[.997,.077]` langs het gebouw naar oost;
voorgevel aan Stationsplein naar +Y. Straatpeil circa NAP +2,5 m,
voet -0,8 m en vier bemonsteringspunten voor het gebouw, buiten de diepe
fietsenkelder. Alleen BAG 0014100010938997 wordt vervangen.

Drie afzonderlijke paviljoens met vlakke mansardetoppen en vier schuine
dakvlakken, twee lagere verbindingsvleugels, galerijen, frontons,
hoekpilasters, bekroningen, erkers, dakkapellen en schoorstenen.
De centrale kap is 22,07 m boven straat, de zijpaviljoens 19,17 en 19,13 m,
de lage kappen 13,41 m. De klokbekroning is 26,07 m.
De aangebouwde perronkap heeft een doorlopend gebogen dwarsprofiel.

Geschat uit foto's: frontons en pinakels, vensterverdeling en blinde
galerijbogen (0,35–0,38 m diep), dakkapellen en kapprofiel boven het
achterperron. Glas geeft in het AHN geen volledig profiel; vier 20 m stroken
geven wel constante lagere dakpunten rond NAP +8,4 m. De perronkap en
entree hebben een vaste printkern. Weggelaten: vrijstaande ijzeren
dakhekjes, letters, vlaggenmasten en ornamenten onder 0,9 m.
Het model betreft het monumentale gebouw en zijn aangebouwde kap;
lange vrijstaande perronkappen, traverse en nieuwe emplacementbebouwing
zijn tijdens de verbouwing geen onderdeel van dit model.

Controle 9 oktober 2026: `NoError`, één solid, 4.418 driehoeken.
Catalogus/API en regressietest groen. Printcheck 1:1000: 44.845 naar
44.867 mm³, minder dan 0,1% opvulling. Vier renders naast PDOK vanuit
-35°, 55°, 145° en 235° en gevel/perronfoto's bekeken; nieuwe frontons,
galerijnissen, bekroningen en perronkap verbeteren elke zijde.
GLTFLoader en kaart bekeken, inclusief landmarkschakelaar en maaiveld.
Volledige 170 m uitsnede als preview en 3MF: 92 objecten, 171.460
driehoeken, 170 × 170 × 29,7 mm. Controle-URL:
http://localhost:3021/kaart/53.210965/6.56406/250/1x1/0.

Bronnen: PDOK BAG 0014100010938997, Actueel_orthoHR en AHN DSM/DTM
0,5 m bbox `233480,580960,233780,581190`,
[RCE 18691](https://monumentenregister.cultureelerfgoed.nl/monumenten/18691),
Commons Groningen Hauptbahnhof 01 en 05 en Groningen perron (1)/(2)
station RM-18691-WLM. Gevelmaten volgen BAG/AHN, geen geometrie overgenomen
uit foto's of particuliere 3D-modellen.
