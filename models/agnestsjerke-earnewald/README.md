# Agnestsjerke Earnewâld

Zaalkerk met driezijdige sluiting en gemetselde westtoren met ingesnoerde spits. De kerk is rijksmonument 35643; het model vervangt BAG-pand 0737100000022684.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0737100000022684): grondvorm, maaiveld NAP +0,688 m en nok NAP +11,134 m. De gebruikte AHN5 uit 2023 heeft circa 2,1% ontbrekende cellen op het pand.
- [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste torencel NAP +20,903 m.
- [Schuine exterieurfoto](https://tsjerkepaad.nl/overzicht-kerken): toren, naaldspits en zaalkerk.
- [Kerk & Orgel](https://www.kerk-en-orgel.nl/record.php?action=display_ordered&id=2159&item=818&province=fr): bouwjaar 1794; dit wijkt af van het BAG-jaar 1774.

## Model en schattingen

Zaalkerk, toren en spits zijn afzonderlijke bouwdelen met dakvlakken en samen één gesloten volume. In vier richtingen is vergeleken met PDOK en de schuine foto. PDOK mist de spits; die volgt de foto en AHN. Vorm en posities van vensters en galmgaten en de spitsverhoudingen zijn geschat. De spits is aan de top voor 1:1000 verbreed; fijne decoratie en de windvaan ontbreken. De 1:1000-STL heeft geen neerwaartse vlakken steiler dan 45° boven het grondvlak.

- `agnestsjerke-earnewald.glb`: kaartmodel
- `agnestsjerke-earnewald.json`: catalogus en plaatsing
- `agnestsjerke-earnewald-1-100.stl`: printmodel 1:100
- `agnestsjerke-earnewald-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-agnestsjerke-earnewald.mjs`. Genereer beide schalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
