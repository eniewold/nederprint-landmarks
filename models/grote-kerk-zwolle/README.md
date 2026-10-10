# Grote of Sint-Michaëlskerk, Zwolle

Model op 1:1000, opgebouwd uit benoemde bouwdelen en regelmatige dakvlakken.
De drie hallen, de kortere zuidelijke koorsluiting, de achtzijdige consistorie,
het noordportaal met spits en zeskantige traptoren, het catechisatielokaal,
de aangebouwde Hoofdwacht en alle lage kooraanbouwen zijn opgenomen.
Geen gestapelde AHN-hoogtelagen.

## Bestanden en plaatsing

- `grote-kerk-zwolle.glb`: meters, glTF Y omhoog; één gesloten `building:kerk`-node.
- `grote-kerk-zwolle.json`: oorsprong RD `[202860, 502915]`, +X ongeveer oost,
  hoek 0,57°; Z omhoog in het generatorscript.
- `grote-kerk-zwolle-1-1000.stl`: printmillimeters, vlakke onderkant Z=0.
- Generator: `scripts/generate-grote-kerk-zwolle.mjs`; uitvoeren met
  `node scripts/generate-grote-kerk-zwolle.mjs` in de landmarks-repository.

Vervangt BAG `0193100000000169` (kerk), `0193100000004645`
(catechisatielokaal) en `0193100000018194` (Hoofdwacht). De twee kleine
buurpanden aan de noordwestzijde blijven PDOK-panden. De laagste van vier
maaiveldmonsters buiten de kerk bepaalt de plaatsing, met een offset van −0,3 m
en een onderkant op −0,55 m om op de lokale ondergrond aan te sluiten.
Gemeten maaiveldmonsters in de kaart/export: 46,42–46,95 m ellipsoïdisch;
de bouwmaten gebruiken NAP +3,8 m als lokale nul.

[Controlekaart](http://localhost:3000/kaart/52.51167/6.09194/350/1x1/0).
Eigen controle uitgevoerd op de lokale dev-server, inclusief landmark aan/uit.

## Maten en herkomst

De BAG-contour en de AHN DSM/DTM op 0,5 m bepalen de voet, nokken en goten.
3D BAG LoD2.2 vult de gaten in de donkere leien daken aan; de gemeten vlakken
zijn per hal tot regelmatige vlakken teruggebracht. De noordelijke nok ligt
op circa NAP +32,92 m, de middelste op +32,03 m en de zuidelijke op +32,54 m.
De lage consistoriespits en de noordportaalspits bereiken circa +31,45 en
+31,35 m. De consistorie heeft een achtzijdige kap, geen ronde kegel.
Het register bevestigt de driebeukige hallenkerk, de verdwenen westtoren,
de achtzijdige consistorie en het noordportaal.

Steunberen, portaalpinakels, vensternissen, dakkapellen, het fronton van de
Hoofdwacht en het traptorenprofiel zijn in positie uit BAG/ortho en in vorm
uit schuine foto's geschat. De nissen zijn 0,35 m diep met spitsboogtoppen
van circa 55°; de kleinste vrijstaande schachten zijn 1,06 m breed.
De bestaande spits is opgenomen zonder het fragiele beeld erboven.

## Controle

STL/GLB: `NoError`, één samenhangend volume, genus 0, 2.392 driehoeken;
79,8 × 44,5 × 29,7 mm en 60,60 cm³ op 1:1000. Alle hoofdbouwdelen dragen
rechtstreeks op de vlakke voet; nissen zijn blind, uitstekende details hebben
schuine bovenzijden of zijn geïntegreerd in de muur. Er is geen losse steun
nodig. De controle van naar beneden gerichte vlakken vindt alleen een
portaalrandje van circa 0,04 m² en afrondingsruis bij een aansluiting.

AHN-vergelijking binnen de gezamenlijke BAG-contour met 1 m inset: 9.643 geldige
punten, 100% gedekt, 90,7% binnen 1 m en 95,9% binnen 2 m; mediane hoogtefout
−0,05 m, 90e percentiel absolute fout 0,95 m. Die controle betreft de gemeten
dakvormen en bewijst de geveldetails niet.

Een volledige uitsnede van 150 × 150 m is geëxporteerd op 1:1000, grondplaat
1 mm, hoogteversterking 1 en overhang 45°. De preview bevat 460 objecten en
het hele model. De echte export blijft gesloten; onderste doorsneden op 1 en
5 mm vormen één contour. De export voegt 4,8% volume toe, hoofdzakelijk de
verbinding van de vlakke kerkvoet met de lagere grondplaat van de uitsnede.
De afzonderlijke STL is zonder deze ondergrondverbinding printbaar.

De regressietest in `tests/landmark-models.test.ts` controleert drie afzonderlijke
nokken, de kortere zuidelijke hal, de consistorie en portaalspits en het
behoud van de volledige noordelijke en lage oostelijke aanbouwen.

Vier schuine renderhoeken op 30° hoogte zijn naast de identieke PDOK-preview
beoordeeld, met schuine foto's als referentie:

| Hoek | Meer detail dan PDOK |
| --- | --- |
| −35° | Koornissen, steunberen en dakkapellen; afzonderlijke polygonale koorsluitingen. |
| 55° | Noordportaal met achtzijdige spits, zeszijdige traptoren, hoekpinakels en blinde boognissen; eigen daken van de noordelijke aanbouwen. |
| 145° | Consistorie met achtzijdige kap en gevelnissen; westelijke dakschilden en dakkapellen. |
| 235° | Zuidelijk vensterritme, steunberen, dakkapellen en laag zuidportaal. |

Controlebeelden en preview-export blijven buiten de repository.

## Geschat en weggelaten

Geschat: exacte vensterhoogtes en -breedtes, steunbeerafschuiningen,
portaalpinakels, traptorenkap, dakkapellen, fronton- en lijstprofielen.
De top van de portaalspits is uit de AHN-piek genomen; het beeld van Michael,
kruisen, windvanen, maaswerk, leien, balusters, ornamenten en dakgootdetails
kleiner dan 0,9 m zijn weggelaten. De balustrade is in de massieve gevelrand
vereenvoudigd; geen vrije horizontale balusters of open portaalbogen.
Dit is een printmodel van het huidige gebouw, geen reconstructie van de
in 1682 ingestorte westtoren.

## Bronnen en licenties

- [BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0),
  [AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0),
  [PDOK luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): CC0.
- [3D BAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000000169),
  [catechisatielokaal](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000004645),
  [Hoofdwacht](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0193100000018194):
  TU Delft/3DGI, CC BY 4.0.
- [Rijksmonumentenregister 41666](https://monumentenregister.cultureelerfgoed.nl/monumenten/41666).
- [Schuine foto vanuit de Peperbus](https://commons.wikimedia.org/wiki/File:Basiliek_van_Onze-Lieve-Vrouw-Tenhemelopneming_-_Zwolle_-_View_from_the_tower_towards_the_east_-_Grote_of_Sint-Micha%C3%ABlskerk.jpg): CC BY-SA 4.0, alleen visuele referentie.
- [Noordoostzijde, RCE](https://commons.wikimedia.org/wiki/File:Exterieur_noord-oost_zijde_-_Zwolle_-_20229095_-_RCE.jpg),
  [zuidzijde, RCE](https://commons.wikimedia.org/wiki/File:Zuidzijde_van_de_kerk_met_bomen_en_een_parkeerplaats_met_auto%27s_op_de_voorgrond_-_Zwolle_-_20402477_-_RCE.jpg):
  A.J. van der Wal/RCE, CC BY-SA 4.0, alleen visuele referentie.
- [Noordelijke aanbouwen](https://commons.wikimedia.org/wiki/File:Grote_of_Sint-Micha%C3%ABlskerk_-_BB_-_2.jpg): Ben Bender, CC BY-SA 3.0, alleen visuele referentie.
- [Ter Kuile, Noord- en Oost-Salland](https://www.dbnl.org/tekst/kuil005noor01_01/kuil005noor01_01_0016.php): plattegrond en historische bouwbeschrijving als controle; geen afbeelding overgenomen.

Geraadpleegd 10 oktober 2026. Foto's zijn niet opgenomen in GLB of repository.
