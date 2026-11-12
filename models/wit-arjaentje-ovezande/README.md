# Wit Arjaentje, Ovezande

Voormalige Sint-Petrus-en-Pauluskerk, een wit gepleisterd eenbeukig schip met bakstenen westtoren en spits. Het tegen de oostzijde aangebouwde dwarse huis ligt in hetzelfde BAG-pand en is daarom mee gemodelleerd. Het verdwenen koor en transept zijn niet teruggebouwd.

## Bronnen en maatvoering

- [BAG/3D BAG pand 0654100000003531](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0654100000003531): contour, oriëntatie en dakvlakken. De nok van het schip ligt ongeveer 10,3 m boven maaiveld.
- PDOK AHN DSM 0,5 m: maaiveld circa NAP +1,8 m, hoogst gevonden torenmeting NAP +23,25 m. De torenspits ontbreekt in de PDOK-reconstructie en is op basis van deze hoogte en foto's hersteld.
- [Rijksmonumentenregister 10018](https://monumentenregister.cultureelerfgoed.nl/monumenten/10018), [historische en actuele foto's](https://commons.wikimedia.org/wiki/Category:Sint_Petrus_en_Paulus_(Ovezande)) en [Kerkenvisie Borsele](https://www.borsele.nl/sites/borsele/files/2023-11/Kerkenvisie%20Borsele.pdf): vorm, geschiedenis en huidige toestand.

De precieze spitsvorm en aansluiting van toren en schip zijn uit foto's geschat, evenals afmetingen en positie van de ondiepe vensternissen. Fijne details en het windvaantje zijn weggelaten op printschaal.

## Genereren en controle

`node scripts/generate-wit-arjaentje-ovezande.mjs --scale 1000 --components` en `--scale 100 --components` leveren de GLB, metadata en STL's. Het model is één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en extra ondersteuningsvolume bij 45 graden. Vergelijking van vier kanten met de PDOK-reconstructie en schuine foto's is gemaakt; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
