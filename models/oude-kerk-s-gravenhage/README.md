# Oude Kerk, Scheveningen

Laatgotische pseudobasilicale kerk met breed schip, hoger vijfzijdig gesloten koor en een westtoren met achtkantige bovenbouw en naaldspits. De lagere straatzijdige consistorie en de kleine kapel aan het koor zijn mee gemodelleerd omdat ze binnen hetzelfde BAG-pand liggen.

## Bronnen en maatvoering

- [3D BAG pand 0518100000275768](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0518100000275768): contour, dakvlakken en ligging. Maaiveld NAP +3,11 m; nok van het schip circa 17,1 m en van het koor circa 18,6 m boven maaiveld.
- PDOK AHN DSM 0,5 m: hoogste steekproef bij de toren NAP +45,48 m, circa 42,37 m boven maaiveld. De bovenste spits is onvolledig in de PDOK-reconstructie en is naar AHN en foto's hersteld.
- [Rijksmonument 17617](https://monumentenregister.cultureelerfgoed.nl/monumenten/17617), [historische en actuele foto's](https://commons.wikimedia.org/wiki/Category:Oude_Kerk,_Scheveningen) en [beschrijving van de kerk](https://haagsorgelkontakt.nl/kerk/oude-kerk-scheveningen/): koorvorm, lagere zijmuren, toren en aanbouwen.

De profielen van de steunberen, exacte aansluiting en helling van consistoriedak en torenspits en de afmetingen van gevelnissen zijn geschat op basis van foto's en hoogtevlakken. Klein maaswerk en de windvaan zijn weggelaten op printschaal.

## Genereren en controle

`node scripts/generate-oude-kerk-s-gravenhage.mjs --scale 1000 --components` en `--scale 100 --components` leveren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export volgen bij afronding.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
