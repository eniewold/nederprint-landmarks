# Sint Johannes de Doperkerk, Sint Jansteen

De kerk is een driebeukige hallenkerk van P.J. Soffers met een westtoren, achtkantige klokkenkamer en naaldspits. De dubbele kapellen aan weerszijden en het veelhoekig gesloten koor zijn als afzonderlijke bouwdelen opgebouwd; de lagere aanbouwen bij het koor horen bij hetzelfde BAG-pand.

## Bronnen en maatvoering

- [3D BAG pand 0677100000615104](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0677100000615104): ligging, plattegrond en dakvlakken. Maaiveld NAP +2,68 m; hoofdnok ongeveer 18,0 m daarboven.
- PDOK AHN DSM 0,5 m: de hoogste steekproef van de torenspits meet NAP +48,33 m, circa 45,65 m boven maaiveld. De PDOK-reconstructie mist de bovenste torengeleding en spits; deze zijn naar foto's en AHN hersteld.
- [Rijksmonument 22796](https://monumentenregister.cultureelerfgoed.nl/monumenten/22796) en [foto's van de kerk](https://commons.wikimedia.org/wiki/Category:Sint_Joannes_De_Doperkerk,_Sint_Jansteen): silhouet, portaal, vensters en bouwgeschiedenis.

De exacte geledingshoogte van de klokkenkamer, de spitsbreedte en plaats en maat van ondiepe nissen zijn benaderd. Een kier van 0,15 m tussen aangrenzende aanbouwen is gesloten voor printbaarheid; kleine versieringen en het kruis zijn niet opgenomen. Op een historische foto is een kleine dakruiter zichtbaar, waarvan de actuele aanwezigheid niet is vastgesteld en die daarom niet is toegevoegd.

## Genereren en controle

`node scripts/generate-sint-johannes-de-doperkerk-sint-jansteen.mjs --scale 1000 --components` en `--scale 100 --components` leveren de GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert de plaatsing en de steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
