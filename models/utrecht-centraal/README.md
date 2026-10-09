# Utrecht Centraal

De OV-terminal van Benthem Crouwel, met drie dubbelgekromde dakgolven,
glasgevels, lichtstraten en trapopgangen. Vervangt BAG **0344100000139915**
en de vrijwel geheel onder de terminal liggende strook **0344100000148778**.
Katreinetoren 0344100000148768, Stadskantoor, bollendak, perronkappen en
ondergrondse tunnels blijven zelfstandige bronnen.

## Onderzoek

- RD-oorsprong 136000,455710; lange terminalas `[.869,.495]`, 29,67° RD;
  Jaarbeurszijde naar -X, Moreelsebrug naar -Y.
- Maaiveldreferentie NAP +2,47 m: AHN-DTM van de lage straat ten zuidwesten
  van de Jaarbeursentree. Verhoogd Jaarbeursplateau ligt rond NAP +10,28 m.
- Langsdakextrema op NAP: toppen 26,75 / 27,92 / 26,75 m bij lokaal
  X=-107 / -8 / 87 m; dalen 21,25 / 21,40 m bij -67 / 47 m.
  Meetprofielen uit P90 over 8 × 3 m vensters, gecontroleerd met meerdere
  dwarssneden. Torenpixels aan de randen uitgesloten.
- Dakomhullende 251 × 95 m, passend bij de [architectbeschrijving](https://www.benthemcrouwel.com/projects/utrecht-central-station).
- PDOK BAG, Actueel_orthoHR en AHN DSM/DTM 0,5 m, bbox
  135760,455460,136220,455980, geraadpleegd 2026-10-09.
- Foto's: [oostentree](https://commons.wikimedia.org/wiki/File:Exterior_of_Utrecht_Centraal_(2019)_02.jpg),
  [zuidzijde schuin](https://commons.wikimedia.org/wiki/File:Central_station_and_Stadskantoor_Utrecht_seen_from_Moreelsebrug.jpg),
  architectfoto's [N58](https://cms.benthemcrouwel.com/dynamic/images/483_OVT_Utrecht_Centraal_N58_a4.jpg),
  [N19](https://cms.benthemcrouwel.com/dynamic/images/483_OVT_Utrecht_Centraal_N19_a4.jpg)
  en [N68](https://cms.benthemcrouwel.com/dynamic/images/483_OVT_Utrecht_Centraal_N68_a4.jpg).

## Modellering en schattingen

Cosinusinterpolatie tussen de gemeten langsprofielextrema, met een
parabolische dwarskromming: doorlopende dakvlakken, getrianguleerd uit
vergelijkingen, zonder DSM-hoogtelagen. De BAG-uitsparing rond de
Katreinetoren blijft aanwezig. Glasgevels en spooropeningen zijn blinde
nissen in een volle printkern; de noordpassage is zichtbaar als nis.

Geschat: regelmatige gevelindeling, afgeronde dakinterpolatie, trapkappen,
de grove westelijke aankomsttrap en de verlaagde noordelijke lichtstrook.
De fijne constructie en letters onder 0,9 m ontbreken. Twee kleine
ingesloten vensterholtes bij aangebouwde trapkappen zijn voor de print gevuld.

## Controle

Eén gesloten building-node, NoError, 11778 driehoeken, 488043,9 m³;
STL 1:1000: 274 × 112 × 26,25 mm. Export-opvulling op echte 1:1000:
499306 → 499405 mm³, minder dan 0,1%, NoError. Geen losse steun nodig.
Volledige preview en 3MF van RD 135820,455520,136160,455860 op 1:1000:
340 × 340 mm, 996 objecten, 423060 driehoeken; hoogste buur is het Stadskantoor.

Vier renders (-35°, 55°, 145°, 235°) naast PDOK en referentiefoto's bekeken:
alle kanten krijgen de doorlopende dakgolven, lichtstraten en glasnissen;
zuidzijde krijgt trapopgangen, westzijde de aankomsttrap, noordzijde de
passage. PDOK bevat ook hoge uitschieters in het stationpand: die verdwijnen.
De GLB is met de echte three.js GLTFLoader bekeken; kaartpositie, oriëntatie,
kleur, maaiveld en vervanging gecontroleerd met de landmarkschakelaar.
Controlebeelden en exports blijven buiten de repository's.

[Controlekaart](http://localhost:3023/kaart/52.08932/5.10997/400/1x1/0).
Generator: `node scripts/generate-utrecht-centraal.mjs`.
