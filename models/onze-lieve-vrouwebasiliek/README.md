# Onze-Lieve-Vrouwebasiliek, Maastricht

Model op 1:1000 uit benoemde bouwdelen en regelmatige dakvlakken, zonder
gestapelde AHN-hoogtelagen. Omvat het hoge basilicale schip, de dwarse
zijbeukkappen, beide transepten, het ronde oostkoor, de twee oosttorens met
zadeldaken, het westwerk met ronde traptorens en kegelspitsen, de
noordwestkapel met portaal, de kleinere apsiden, lage aanbouwen en drie
kloostergangen rond de **open pandhof**. Alleen het eigen BAG-pand wordt vervangen.

## Bestanden en plaatsing

- `onze-lieve-vrouwebasiliek.glb`: meters, glTF Y omhoog; één gesloten node.
- `onze-lieve-vrouwebasiliek.json`: RD-oorsprong `[176585,317556]`, +X 5°
  tegen de klok in ten opzichte van oost; model Z omhoog.
- `onze-lieve-vrouwebasiliek-1-1000.stl`: millimeters, Z omhoog.
- Generator: `node scripts/generate-onze-lieve-vrouwebasiliek.mjs`.
- Vervangt `NL.IMBAG.Pand.0935100000021253`, inclusief de kloostergangen.
- Maaiveldreferentie NAP +48,6 m; onderkant −1,8 m voor het aflopende
  terrein aan de zuidzijde. `groundOffsetMetres=-0.3`.
- PDOK-maaiveld op lokale punten `[-39,-8]`, `[39,-8]`, `[-4,21]`:
  94,253 / 94,159 / 95,152 m ellipsoïdisch. Fallback is het minimum 94,159 m.

## Metingen en bronnen

Onderzoek en controles: 10 oktober 2026. BAG-contour met pandhof, AHN DSM/DTM
op 0,5 m, PDOK-luchtfoto en afzonderlijke LoD2.2-dakvlakken gebruikt.
Nok schip NAP +73,82 m; westwerk +79,6 m; westelijke spitsen +90,3/+89,35 m;
zadeldaknokken oosttorens +77,5 m. De ronde torens zijn 32-zijdig gemodelleerd.

- [BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0),
  [AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0),
  [PDOK-luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): CC0.
- [3D BAG LoD2.2](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0935100000021253):
  3D BAG, TU Delft / 3D geoinformation group, CC BY 4.0; dakmetingen en regularisatie.
- [Rijksmonument 27454](https://monumentenregister.cultureelerfgoed.nl/monumenten/27454)
  en [Centre Céramique / Zicht op Maastricht](https://www.zichtopmaastricht.nl/locaties/onze-lieve-vrouwebasiliek-het-kerkgebouw):
  bouwdelen en onderscheid tussen westwerk, oosttorens en kloostergang.
- Schuine foto's: [oostkoor en zadeldaken](https://commons.wikimedia.org/wiki/File:Maastricht_Basiliek_Onze_Lieve_Vrouwe_ten_Tenhemelopneming_Apsis_2.jpg),
  [westelijke traptoren](https://commons.wikimedia.org/wiki/File:Maastricht_RK_OLV_basiliek_7905.jpg),
  [pandhof](https://commons.wikimedia.org/wiki/File:Maastricht_RK_OLV_pandhof_7918.jpg),
  [verhoogde RCE-opname van westwerk en transept](https://commons.wikimedia.org/wiki/File:West_toren_en_transept_vanaf_een_punt_pl.m._2_meter_boven_de_nok_van_het_dak_van_de_school_in_de_Stokstraat_-_Maastricht_-_20146457_-_RCE.jpg).
  Foto's alleen bekeken als vormreferentie; geen fotobestanden overgenomen.

## Print- en kaartcontrole

Eén gesloten volume, `NoError`, 5200 driehoeken, genus 1: het ene doorgaande
gat is uitsluitend de pandhof. Geen interne holtes. STL 69,6 × 68,3 × 43,5 mm,
52,24 cm³. Vensternissen zijn blind, 0,35 m diep, met steile tweeledige
boogtop. Ronde waterlijsten lopen maximaal 0,25 m uit op steile ondervlakken.
Geen vrij overspannende balken; fine maaswerk, kruisen en windvanen kleiner
dan 0,9 mm zijn weggelaten. Zonder losse steun op 1:1000.

Op 9332 geldige AHN-punten binnen de BAG-contour: dekking 100%, 87,3% binnen
1 m, 92,2% binnen 2 m; mediane afwijking +0,02 m, p90 absoluut 1,37 m.
Verschillen liggen bij genormaliseerde dakkappen, torenranden en vegetatie.

De controle-URL is daadwerkelijk geopend met landmarks aan en uit:
[kaart Maastricht](http://localhost:3000/kaart/50.84762/5.69344/350/1x1/0).
Volledige 140 × 140 m uitsnede geëxporteerd op 1:1000, hoogtefactor 1,
grondplaat 1 mm, maximale overhang 45°, bomen uit. HTTP-preview geslaagd;
volledige filamentexport naar 3MF en preview-mesh eveneens geslaagd.
De export houdt de pandhof open: twee contouren op z=1 en z=5 mm.
Toegevoegde inhoud 677,677 mm³ is exact de voet 2710,714 mm² × 0,25 mm
tot de grondplaat; **geen opvulling van bouwkundige overhang**.

Vier renderparen met dezelfde camera's, links PDOK en rechts landmark,
kijkhoogte 30°, vergeleken met bovenstaande foto's:

| Kijkhoek | Controle |
| --- | --- |
| −35° | Rond oostkoor, koornissen en lage zuidelijke aanbouwen sluiten aan. |
| 55° | Noordelijke kloosterkappen en open pandhof; westspitsen blijven rond. |
| 145° | Breed massief westwerk en beide ronde traptorens, kapel en portaal. |
| 235° | Zijbeukkappen, oostelijke zadeldaken en beide kleine apsiden aanwezig. |

Monumenttest in de webshop controleert georeferentie, leeg binnenhof,
kloostervleugels, beide westspitsen, twee lange oosttorennokken en rond koor.

## Geschat en nakijken

Nisbreedten, nishoogten, waterlijsten, westwerkdakkapellen en het vereenvoudigde
profiel van de kegelspitsen zijn uit foto's geschat. De dakvlakken en contour
zijn bemeten; de kleine apsiskappen zijn regelmatige vormen tussen AHN-punten.
Nakijken of het ronde oostkoor, de twee zadeldaktorens en de open pandhof
goed staan, en of de zuidelijke aanbouwen op het aflopende maaiveld aansluiten.
