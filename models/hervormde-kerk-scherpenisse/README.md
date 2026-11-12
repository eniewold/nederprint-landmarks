# Hervormde Kerk, Scherpenisse

Driebeukige voormalige Mariakerk met hoog middenschip, lagere zijbeuken, zware steunberen en een onvoltooide westtoren met kleine kap. De lage aanbouw aan de oostzijde hoort bij hetzelfde BAG-pand en is mee gemodelleerd.

## Bronnen en maatvoering

- [3D BAG pand 0716100000070776](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0716100000070776): positie, grondvorm en dakvlakken. Maaiveld circa NAP +0,79 m, nok circa 20,3 m boven maaiveld en torenkap circa 22,6 m boven maaiveld.
- PDOK AHN DSM 0,5 m: controle van de kaphoogtes; de nok van het schip meet circa NAP +21 m, de toren is hoger; een uitschieter bij de toren van NAP +26,37 m kan ook het kleine kruis bevatten.
- [Rijksmonument 35397](https://monumentenregister.cultureelerfgoed.nl/monumenten/35397), [foto's](https://commons.wikimedia.org/wiki/Category:Hervormde_Kerk_(Scherpenisse)) en [kerkenvisie Tholen](https://www.erfgoedzeeland.nl/media/3xnnaw2g/kerkenvisie-tholen-aangepast-20042023.pdf): bouwkundige vorm en actuele toestand.

De hoogte en contour van de klokkenkamer en kap, de precieze venster- en nisafmetingen en steunbeerprofielen zijn uit AHN, 3D BAG en foto's benaderd. Sierwerk en het kleine kruis zijn op de printschaal weggelaten.

## Genereren en controle

`node scripts/generate-hervormde-kerk-scherpenisse.mjs --scale 1000 --components` en `--scale 100 --components` maken de modelbestanden. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
