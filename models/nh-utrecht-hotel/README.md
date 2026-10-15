# NH Utrecht Hotel (Utrecht)

## Bestanden en plaatsing

`nh-utrecht-hotel.glb` in meters met Y omhoog, `nh-utrecht-hotel.json` voor de catalogus en `nh-utrecht-hotel-1-1000.stl` in millimeters met Z omhoog. Reproduceer met `node scripts/generate-nh-utrecht-hotel.mjs`: alle invoer staat als constanten in de generator; geen netwerkverzoeken tijdens het genereren.

RD-oorsprong [135706, 455792], X-as [0.8580649057236446, 0.51354125205817], Z=0 op NAP 2.3340001106262207 m. De X-as volgt de gemeten gevels/nokken, niet een BAG-omhullende rechthoek. Terreinpunten staan in `groundSamplePoints`; vaste terugval 45.73414768867144 m ellipsoïdisch. Vervangt NL.IMBAG.Pand.0344100000002340.

## Bouwdelen, gemeten maten en aannames

NH Utrecht aan Jaarbeursplein 24, BAG-bouwjaar 1970, bestaat uit ongelijke kamerschachten, een terugliggende glazen hals, een uitkragende witte congreskop en de eigen lage vergadervleugels met zaagtandgevel. BAG en 3D BAG bepalen de volledige voet en afzonderlijke doorlopende dakvlakken; AHN bevestigt de daken. Gemeten NAP-hoogtes: kamerschouders 53.255 en 58.617 m, witte kop 65.815 m, machine 68.992 m en kleine opstand 67.242 m; congresvleugel 21.008 m, achtervleugel 18.232 m, eigen lage lobby en verbindingen 6.35–8.08 m. As 30.90 graden volgt de hoofdgevels. Vier geldige straatpunten buiten alle BAG-panden koppelen DTM en PDOK; laagste anker NAP 2.334 m en ellipsoide 45.7341477 m, met 0.15 m verzinking. De schachtverbinding is gevuld zodat geen kunstmatig intern kanaal ontstaat. Gevelritme van 3 m, vensterbreedte, blind reliëf 0.35–0.40 m, entreevelden, glazen hals vanaf NAP 58.3 m en onderzijde van de kop rond 61.9 m zijn uit vier officiële schuine NH-foto’s geschat. De uitkraging krijgt een doorlopende schuine dragende overgang in plaats van losse te dunne kolommen. Geen DSM-hoogteplakken. De afzonderlijke naburige gebouwen blijven behouden.

## Weggelaten

Dunne antennemast, dakhekwerken, letters en fijne glazen entreekap met stalen spanten zijn niet afzonderlijk geprint op 1:1000. De entree blijft een gesloten laag bouwdeel, de kleine verdieping van de hals is zonder los kozijnrooster gehouden en de kleuren worden door de kaart bepaald.

## Controle

Alle nodes zijn gesloten (`NoError`), op 1:1000 gecontroleerd met 45-graden overhangcorrectie. GLB 8,866 driehoeken. Printcontrole per node: NoError, 1.20% extra volume. De permanente test in `tests/landmark-models.test.ts` controleert plaatsing, bepalende dak-/gevelvormen en printverbindingen.

Vier schuine renders naast dezelfde richtingen van de echte PDOK-reconstructie en schuine bronfoto's bekeken. Per richting toegevoegd: -35 graden: ongelijke kamerschouders en herkenbare witte kop; 55 graden: gesloten glasvelden, terugliggende hals en schuine onderzijde van de congreskop; 145 graden: volledige eigen zaagtandvleugel en afzonderlijke dakinstallaties; 235 graden: achterste vergadervleugel, lage lobbyverbindingen en eigen straatvoet.

Controlekaart (plaats, richting, materiaal en maaiveld) en GLTFLoader bekeken. Volledige 1:1000-preview-export: 155 bij 155 mm, 227 objecten, 48,336 driehoeken, 68 mm modelhoogte; de hele landmarkvoetafdruk valt binnen de uitsnede. Onderzoeksbeelden, preview en audit blijven buiten de repo.

## Bronnen

- PDOK BAG 0344100000002340 (bouwjaar 1970), 3D BAG LoD2.2, AHN DSM/DTM 0.5 m en actuele orthoHR: eigen volledige voet, hotel-/congresdakvlakken, installaties, schouders, plint en straat; 2026-10-15
- https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000002340
- https://www.nh-hotels.com/nl/hotel/nh-utrecht (eigenaar: Jaarbeursplein 24, 21 verdiepingen, 276 kamers op 18 verdiepingen, 28 vergaderzalen en vier bovenin; vier eigen buitenfotos F_NH_utrecht_142/148/141/147 uitsluitend als lokale referentie)
- https://commons.wikimedia.org/wiki/File:NH_Hotel_Utrecht.jpg
- https://hoog500.nl/jaarlijst/tabel/nederland_alles_tm_1971 (historische hotelhoogte 66 m, 1970; maten in het model uit open metingen)
