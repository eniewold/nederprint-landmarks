# Walburgiskerk, Zutphen

Model op 1:1000 uit afzonderlijke bouwdelen en dakvlakken: drie langsdaken
met westelijke schilden, drie transeptdelen, hoog koor met dakruiter,
schuin gerangschikte koorkapellen, polygonale koorsluiting, lage Librije,
Mariaportaal, zuidelijke aanbouwen en de westtoren met achtkant, klokvormige
kap en gesloten lantaarn. Inclusief steunberen, pinakels, gesloten
balustradebanden en blinde vensternissen. Geen gestapelde AHN-hoogtelagen.

## Bestanden, plaatsing en bronnen

- `walburgiskerk.glb`: meters, glTF Y omhoog; één gesloten `building:kerk`-node.
- `walburgiskerk.json`: RD-oorsprong `[210347,461575]`, +X 16° met de klok mee
  vanaf oost; Z omhoog. Vervangt uitsluitend `NL.IMBAG.Pand.0301100000003887`.
- `walburgiskerk-1-1000.stl`: millimeters, Z omhoog; 82,5 × 67,0 × 71,4 mm.
- Regenereren: `node scripts/generate-walburgiskerk.mjs`.
- Maaiveld NAP +9,6 m; onderkant −0,65 m, `groundOffsetMetres=-0.3`.
  Bemeten PDOK-punten `[-41,-1]`, `[0,-38]`, `[-19,20]`:
  53,342 / 52,968 / 53,566 m ellipsoïdisch. Fallback 52,968 m.

Onderzoek op 10 oktober 2026:

- [BAG WFS](https://service.pdok.nl/lv/bag/wfs/v2_0),
  [AHN DSM/DTM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0) en
  [PDOK-luchtfoto](https://service.pdok.nl/hwh/luchtfotorgb/wms/v1_0): CC0.
- [3D BAG LoD2.2](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0301100000003887):
  3D BAG, TU Delft / 3D geoinformation group, CC BY 4.0. Iedere koorkap is
  een verticaal prisma op het convexe grondvlak van zijn dakvlakken,
  afgeknipt door de bijbehorende regelmatige dakvlakken; goten liggen op
  een doorlopende koorwand. Geen automatisch hoogtelagenmodel.
- [Rijksmonument 41195](https://monumentenregister.cultureelerfgoed.nl/monumenten/41195)
  en [Walburgiskerk](https://walburgiskerk.nl/): kerk, Librije en bouwdelen.
- Schuine foto's: [zuidzijde en bekroning](https://commons.wikimedia.org/wiki/File:Zutphen_Walburgiskirche.jpg),
  [dakplan vanaf de toren](https://commons.wikimedia.org/wiki/File:Dak_van_de_St._Walburgskerk_te_Zutphen_gezien_vanaf_de_toren_-_Zutphen_-_20226815_-_RCE.jpg),
  [noordkoor](https://commons.wikimedia.org/wiki/File:Het_koor_van_de_St._Walburgskerk_te_Zutphen_gezien_vanuit_het_noorden_-_Zutphen_-_20226529_-_RCE.jpg),
  [Mariaportaal](https://commons.wikimedia.org/wiki/File:Overzicht_noordportaal_-_Zutphen_-_20373757_-_RCE.jpg).
  Foto's alleen als referentie bekeken, geen fotobestanden opgenomen.

Nokken: schip NAP +35,60 m, noordbeuk +33,39 m, zuidbeuk +32,78 m;
koor circa +38,65 m. Torenbekroning tot +80,3 m, hoogste bruikbare AHN-punt;
de dunne windvaan erboven ontbreekt. Koorruiter tot +48 m uit foto's geschat.

## Controle voor rapportage

Manifold `NoError`, één volume, genus 0, 4734 driehoeken, 57,08 cm³ op
1:1000. Geen interne holtes. Geen neerwaartse vlakken boven de voet met
meer dan 45° overhang. Steunberen en pinakels sluiten naar beneden aan;
nisdiepte 0,35 m, boogtop met steile vlakken; balustrades dicht, minimaal
0,95 m dik. Fine maaswerk, sculpturen, kruisen en windvanen kleiner dan
0,9 mm weggelaten. Geen losse printsteun nodig op 1:1000.

AHN-vergelijking gebruikt 9575 geldige punten binnen de 1 m ingekrompen
BAG-contour, dekking 100%; circa 78% binnen 1 m en 84% binnen 2 m,
mediane afwijking +0,02 m. Grootste afwijkingen bij torenranden en pinakels,
het noordportaal en genormaliseerde aansluitingen van transept en koor.

[Controlekaart](http://localhost:3000/kaart/52.13959/6.19570/350/1x1/0)
daadwerkelijk met landmarks aan/uit geopend. Volledige preview van
150 × 150 m, 1:1000, hoogtefactor 1, grondplaat 1 mm, overhang 45°, bomen
uit; HTTP-preview en volledige filament-3MF geslaagd. Printpipeline:
toegevoegde inhoud 5569,586 mm³ is uitsluitend de voet 2755,021 mm² ×
2,021586 mm tot de grondplaat. Geen bouwkundige overhang opgevuld.

Vier renderparen naast PDOK met gelijke camera's, kijkhoogte 30°, beoordeeld
tegen de bovenstaande schuine foto's:

| Hoek | Beoordeling |
| --- | --- |
| −35° | Librije blijft lager dan koor, polygonale koorsluiting en kapellen kloppen. |
| 55° | Noordtransept, Mariaportaal, koorkappen en grote koornissen aanwezig. |
| 145° | Westelijke dakschilden, torengeledingen en lantaarn op de juiste zijde. |
| 235° | Zuidelijke aanbouwen, lange zijbeuk, steunberen en dakruiter aansluiten. |

Monumenttest in de webshop controleert plaatsing, lage Librije, oostkoor,
torentop, koorruiter, noordtransept en portaal.

## Geschat en nakijken

Nisprofielen, steunberen, pinakels, balustrades, klokkap tussen gemeten
punten, lantaarn, koorruiter en Mariaportaalfronton zijn uit foto's geschat.
De LoD2.2-portalcap onderschat de hoge voorgevel; die is met twee steile
frontonvlakken aangevuld. De Librije volgt haar afzonderlijke lage dakvlakken.
Nakijken of de Librije laag blijft, de schuine koorkappen en dakruiter goed
staan en de torenbekroning en het Mariaportaal herkenbaar zijn.
