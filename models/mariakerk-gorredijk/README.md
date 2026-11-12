# Mariakerk Gorredijk

De Mariakerk in Kortezwaag/Gorredijk is een zaalkerk uit 1797 met driezijdige sluiting en houten gevelruiter. Het model vervangt BAG-pand `0086100000350800`; de taak noemt 1920 maar de gemeentelijke bron en Friesland.nl noemen 1797.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0086100000350800): plattegrond, oriëntatie en kap; maaiveld NAP +1,534 m, volledige AHN5-dekking van het pand.
- [AHN-DSM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): 983 van 988 geldige cellen in de kerk-uitsnede; hoogste meting NAP +20,902 m bij de ruiter.
- [Gemeente Opsterland](https://www.opsterland.nl/8-mariakerk): exterieurfoto en beschrijving.
- [Friesland.nl](https://www.friesland.nl/nl/locaties/1958243273/mariakerk): bouwjaar en geschiedenis.
- PDOK 3D: vier zijden naast model en exterieurfoto vergeleken; de spits is in de reconstructie onvolledig.

De hoofdvorm is circa 18,2 × 8,2 m; de ruiterspits is circa 19,4 m boven het gekozen maaiveld. De ruiter is verbreed voor 1:1000 en de spitstop, nisdieptes en koorvlakken zijn vereenvoudigd of geschat. Lijstwerk en windvaan zijn weggelaten.

## Bestanden en controles

- `mariakerk-gorredijk.glb` en `.json`: model en plaatsing.
- `mariakerk-gorredijk-1-1000.stl`: printbestand 1:1000.
- `mariakerk-gorredijk-1-100.stl`: printbestand 1:100.
- `scripts/generate-mariakerk-gorredijk.mjs`: reproduceerbare opbouw uit vlakken en bouwdelen.

De generator levert één verbonden gesloten solid met genus 0. De vierzijdige vorm is naast PDOK en de gemeentelijke exterieurfoto beoordeeld.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
