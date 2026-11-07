# Protestantse kerk, Gendt

Het middeleeuwse schip is verdwenen: de bakstenen toren staat vrij van het voormalige koor, dat nu als kerk dienstdoet. Het model bevat daarom twee losse bouwdelen en twee zelfstandig printbare STL-bestanden. BAG-panden `1705100000022683` (toren) en `1705100000022686` (kerk) worden beide vervangen.

## Bronnen en aannames

- [3DBAG kerk](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000022686) en [3DBAG toren](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000022683) voor ligging, gebouwcontouren en hoogten; terrein bij de kerk circa 12,216 m NAP.
- [Rijksmonumentenregister kerk 16080](https://monumentenregister.cultureelerfgoed.nl/monumenten/16080) en [toren 16081](https://monumentenregister.cultureelerfgoed.nl/monumenten/16081).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk_(Gendt)) voor foto's van de losse toren en het koor.
- [AHN via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste meetpunt torenspits circa 36,8 m NAP. De slanke top is op 24,58 m boven het referentiemaaiveld geschat.

De spits, galmgaten, aanbouwen, vensters en steunberen zijn geschat en vereenvoudigd voor 1:1000; de windvaan is weggelaten. De voormalige schipruimte is niet dichtgemaakt. Elk onderdeel is een gesloten volume met een vlakke voet. De test controleert beide pandvervangingen, plaatsing, topologie en benodigde ondersteuning. Een 150 m uitsnede met en zonder landmark is geëxporteerd en vanuit vier gelijke richtingen naast beide PDOK-gebouwen en schuine foto's gecontroleerd.

Genereren: `node scripts/generate-protestantse-kerk-gendt.mjs`.
