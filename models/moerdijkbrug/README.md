# Moerdijkbrug (Moerdijk)

De huidige A16-brug over het Hollandsch Diep: één brede trapeziumkoker op
negen hergebruikte rivierpijlers, met een licht gebogen lengteprofiel.
`moerdijkbrug.glb` heeft twee nodes: constructie en wegdek.
`moerdijkbrug.json` bevat plaatsing en vervangings-ID;
`moerdijkbrug-1-1000.stl` bevat het hele model met eigen printvoet.

## Bronnen en metingen

- [Bruggenstichting, A. Romeijn, 2003](https://bruggenstichting.nl/71-bruggen/bruggen-2003/bruggen-juni-2003/530-evolutie-van-de-verschijningsvorm-van-vaste-bruggen-vanaf-1940):
  de vervanging uit 1976 gebruikt een torsiestijve koker op de bestaande
  smalle pijlers; constructiehoogte 3,50 m.
- Bekeken schuine foto's:
  [huidige wegbrug, Tukka](https://commons.wikimedia.org/wiki/File:Road_bridge_motor_way_A16_Moerdijk.jpg)
  en [plaatsing nieuwe brugsectie, Bert Verhoeff/Anefo, 1976](https://commons.wikimedia.org/wiki/File:Nieuw_brugdeel_Moerdijkbrug_geplaatst_het_nieuwe_deel_tussen_de_twee_oude_brugd,_Bestanddeelnr_928-4998.jpg).
  De bouwfoto toont de brede trapeziumdoorsnede. Het vakwerk rechts op die
  foto hoort bij de oude brug en is niet in het huidige model opgenomen.
- [Rijkswaterstaat, werkzaamheden 2026](https://www.rijkswaterstaat.nl/nieuws/archief/2026/06/a16-verkeershinder-door-werkzaamheden-aan-de-moerdijkbrug-21-juli-3-augustus-2026):
  huidige A16-wegbrug. De BGT-attributen bepalen de materiaalclassificatie.
- PDOK actuele BGT, AHN DSM/DTM 0,5 m en actuele luchtfoto, gedownload
  10 oktober 2026; uitsnede RD
  [102384.133,413811.123,103884.133,415311.123].

De dekcontour is `L0002.c63bd45d152149c392d8d6050d9ef2e6`, circa
44.265,56 m². De volledige BGT-contour inclusief landhoofden is lokaal
1042,525 m lang en maximaal 45,572 m breed. De negen actuele
BGT-pijlerbasissen liggen lokaal op x -408,630; -306,656; -204,667;
-102,527; -0,528; 101,470; 203,469; 305,468; 407,467 m, ongeveer
102 m uit elkaar. Hun letterlijke contouren staan in de generator.

Oorsprong RD [103133.962637,414561.617408], +X
[-0.3428766976,0.9393804183] naar Dordrecht, +Y naar het westen.
Lokale Z is NAP minus 0,7 m; glTF gebruikt Y omhoog. De referentie
NAP +0,7 m is een schatting van het waterpeil: AHN-DTM bevat daar NoData.
De gemeten PDOK-waterhoogte naast het dek is ellipsoïdisch 44,032351 m;
die staat als `groundHeight` terugval in de metadata. De twee expliciete
maaiveldpunten zijn lokaal [-30,-30] en [30,-30].

Het dekprofiel is uit dwarsstroken in AHN-DSM gemeten om de 5 m,
met het 30e percentiel om voertuigen te vermijden. Het loopt van ongeveer
NAP +11,06 m aan de uiteinden naar +14,40 m bij het midden. De generator
verbindt deze stations met vlakken, niet met gestapelde hoogtelagen.

De twee actuele wegdelen met relatieve hoogteligging 1 zijn
`L0002.3bc2cd1bb7184031992ba9d0d4daa94b` en
`L0002.6fc031646f884a98970e66638098d05c`.
Beide hebben `bgt_functie: rijbaan autosnelweg` en
`bgt_fysiekvoorkomen: gesloten verharding`, zonder plus-attribuut.
Deze letterlijke set staat in `extras.attributes` van `road:rijbaan`.
Ook de randstroken staan in deze BGT-wegdelen; er is geen afzonderlijk
actueel fietspad in de bron. De rode fietspadregel kleurt dit dek daarom
niet rood. De bovenste 0,5 m van het dek is weg; schampkanten blijven
in `building`, met 2 cm ruimte tot de wegdekpartitie.

## Geschatte delen en printvereenvoudigingen

De constructie bestaat uit een dekplaat van 0,8 m, een massieve
trapeziumkoker, pijlerbasissen, dubbele taps toelopende pijlerkolommen,
landhoofden en drie doorgaande schampkanten. De totale koker/dekhoogte
3,50 m is uit de technische bron; onderbreedte 19,6 m en bovenbreedte
41 m, dekplaatdikte, pijlerkoppen, hoogte van de oude basissen
NAP +3,2 m, landhoofddetails en schampkanten 0,9 × 0,6 m zijn uit foto's
geschat. De koker is dicht, zonder opgesloten binnenruimte.
Leuningen, lichtmasten, bebording en wegmarkering zijn weggelaten.
Spoorbrug en HSL-brug ernaast horen niet bij dit model.

De eigen STL-printvoet is één wig van 50 graden vanaf de kokerbodem
naar een scherm van minimaal 0,9 mm, geknipt op de BGT-dekcontour.
De voet is onderdeel van het model; externe steun is niet nodig.
Op 1:1000: circa 1042,525 × 45,572 × 15,298 mm, volume 555,25 cm³.
Voor een gewone printer zijn meerdere tegels nodig.

## Controle

- Constructie, weg, geheel en STL: positieve gesloten Manifold-volumes,
  `NoError`. Het geheel heeft negen open doorgangen tussen de dubbele
  pijlerkolommen; de STL met printvoet heeft genus 0.
- Partitievolume wijkt minder dan 0,05 m³ af; overlap onder 0,02 m³.
- 21.910 raychecks: nul dubbele bovenvlakken tussen nodes en nul
  wegvlakken zonder dikte. Permanente test controleert negen basissen,
  bronhoogte van de koker, hoogste dek, beide uiteinden, attributen en BGT-ID.
- Onafhankelijke AHN-controle: 19.380/19.380 geldige punten (100%);
  96,77% binnen 1 m, 99,18% binnen 2 m; mediaan +0,001 m, P90 0,262 m.
- STL: 26.722 driehoeken en nul ongedragen neerwaartse facetten.
- Controlekaart op poort 3083 bekeken met landmark aan en uit en
  `r.f.fietspad.10200`: gesloten dek in wegkleur, schampkanten gebouwkleur.
  De PDOK-reconstructie mist stukken midden op de rivier; de recente
  AHN-bron heeft daar wel geldige dekmetingen. De kaart is van boven
  gecontroleerd; schuine controle via GLB en previews, niet via een
  gekantelde Cesium-camera.
- Volledige preview-export van 600 × 1200 m rond 51,71739 / 4,63665,
  matrixdoelschaal 1:1000, 3 × 6 tegels van 200 mm: het hele model valt
  in de gecentreerde 600 × 1200 m tegeluitsnede. Van vier kanten naast
  PDOK vergeleken, plus vier GLB-aanzichten en de genoemde bronfoto's.
- Volledige 3MF-export geslaagd. Opvulling in de constructie (+288,71%);
  wegvolumeverschil +0,011%, binnen de numerieke tolerantie van 0,05%.
  Wegen krijgen geen eigen printvoet. De laagste horizontale doorsnede
  onder het dek bestaat uit één doorgaande steunwand.

Bronbestanden, renders, raychecks en preview/3MF staan buiten beide repo's
in `landmarks-run/moerdijkbrug/` bij deze Codex-chat.

Reproduceren: `node scripts/generate-moerdijkbrug.mjs --scale 1000`.
Kaart: `/kaart/51.71739/4.63665/1200/1x1/0?theme=thema-stad&landmarks=1&rules=r.f.fietspad.10200`.
Nakijken: de brede trapeziumkoker, de geschatte dubbele pijlerkoppen en
de aansluiting van het als autosnelweg geregistreerde dek op beide oevers.
