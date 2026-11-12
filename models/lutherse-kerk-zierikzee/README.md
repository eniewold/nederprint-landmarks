# Lutherse Kerk, Zierikzee

Compacte lutherse zaalkerk met een onregelmatige plattegrond, een hoog schilddak en een lagere achteraanbouw. De gevel heeft rondboogvensters en een toegang onder een van de vensters. De kerk kreeg haar huidige gedaante bij de uitbreiding van 1755.

## Bronnen en maatvoering

- [3D BAG pand 1676100000454340](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000454340): plattegrond, ligging en dakvlakken; maaiveld NAP +0,20 m en nok circa 14,4 m boven maaiveld.
- PDOK AHN DSM 0,5 m: de nok ligt rond NAP +14,6 m; een hoogst gemeten punt van NAP +15,83 m kan het ornament op de nok bevatten.
- [Rijksmonument 40554](https://monumentenregister.cultureelerfgoed.nl/monumenten/40554), [RCE-foto's van voor- en zijgevel](https://commons.wikimedia.org/wiki/Category:Lutherse_Kerk_Zierikzee) en [Zeeuwse Ankers](https://www.zeeuwseankers.nl/verhaal/lutheranen-in-zierikzee): vorm en bouwgeschiedenis.

Posities en afmetingen van de ondiepe vensternissen en exacte hellingen van de schilddakvlakken zijn benaderd; het kleine nokornament is op printschaal weggelaten. Naast de achteraanbouw ligt apart BAG-pand 1676100000449474; dit blijft behouden.

## Genereren en controle

`node scripts/generate-lutherse-kerk-zierikzee.mjs --scale 1000 --components` en `--scale 100 --components` leveren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
