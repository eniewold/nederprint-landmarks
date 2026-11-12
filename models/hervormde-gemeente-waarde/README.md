# Hervormde Gemeente, Waarde

Het gebouw is het bewaard gebleven deel van een laatmiddeleeuwse hallenkerk, met een naast het schip geplaatste toren, driezijdige sluiting en een dwars gebouwd lager deel. Na de brand van 1589 bleef van de hallenkerk slechts de zuidbeuk bewaard; verdwenen bouwdelen zijn niet gereconstrueerd.

## Bronnen en maatvoering

- [3D BAG pand 0703100000016030](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0703100000016030): grondvlak, ligging en dakvlakken. Maaiveld NAP +1,09 m en nok van het schip circa 12,3 m boven maaiveld.
- PDOK AHN DSM 0,5 m: hoogste steekproef op de toren NAP +33,10 m, circa 32,0 m boven maaiveld.
- [Rijksmonument 32425](https://monumentenregister.cultureelerfgoed.nl/monumenten/32425) en [foto's](https://commons.wikimedia.org/wiki/Category:Onze-Lieve-Vrouwekerk_(Waarde)): vorm en bouwgeschiedenis, plaatsing van de toren en de smallere spits.

De precieze maten van torenkap, gevelnissen en steunbeerprofielen zijn benaderd op basis van de foto's en de puntenwolk. Klein sierwerk en het torenkruis zijn weggelaten op printschaal.

## Genereren en controle

`node scripts/generate-hervormde-gemeente-waarde.mjs --scale 1000 --components` en `--scale 100 --components` leveren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert de plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en schuine foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
