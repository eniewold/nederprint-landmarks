# Catalogusformaat

Elk landmark staat in een eigen map `models/<slug>/`, met een `README.md` die
het model beschrijft. De catalogus van NederPrint leest alleen
`<slug>/<slug>.json`; die JSON beschrijft één GLB in dezelfde map (glTF 2.0,
meters, Y omhoog) en de plaatsing ervan in RD (EPSG:28992). De STL's ernaast zijn er alleen om los te printen, want slicers
lezen geen GLB.

```json
{
  "name": "Nationaal Monument op de Dam",
  "file": "nationaal-monument-dam.glb",
  "unitsPerMetre": 1,
  "className": "building",
  "crs": "EPSG:28992",
  "origin": [121391.68, 487330.33],
  "xAxis": [-0.453, -0.892],
  "groundOffsetMetres": -0.3,
  "replacesBuildings": ["NL.IMBAG.Pand.0363100012185598"],
  "printFiles": ["nationaal-monument-dam-1-100.stl"]
}
```

- `file` en `printFiles` zijn bestandsnamen in dezelfde map, zonder
  padcomponenten.
- `origin` is het RD-punt waar de scène-oorsprong van de GLB komt te liggen,
  na de standaardomzetting van Y omhoog (glTF) naar Z omhoog.
- `xAxis` is de RD-richting van de lokale +X-as; de +Y-as staat er 90 graden
  linksom op. Weglaten betekent noord-georiënteerd (X = oost, Y = noord).
- `unitsPerMetre` zet de modeleenheden om naar meters; glTF is in meters, dus 1.
- Elke node met een mesh is een eigen onderdeel. Een nodenaam van de vorm
  `klasse:label` (bijvoorbeeld `road:treden`) bepaalt de materiaalklasse van
  dat onderdeel: `base`, `building`, `road`, `water`, `terrain`, `vegetation`,
  `separation` of `other`. Nodes zonder voorvoegsel krijgen `className`
  (standaard `building`).
- z = 0 van het model komt op de laagste PDOK-maaiveldhoogte rond de
  voetafdruk, plus `groundOffsetMetres`. `groundSamplePoints` (punten in
  modelcoördinaten) vervangt de bemonstering rond de voetafdruk;
  `groundHeight` is een optionele vaste terugvalhoogte.
- `replacesBuildings` (optioneel) somt de BAG-panden op die het model
  vervangt, als `NL.IMBAG.Pand.<16 cijfers>` zoals de `identificatie` in de
  PDOK-gebouwtegels. Met de landmarkmodellen aan laten kaart en export de
  automatische PDOK-reconstructie van die panden weg.
- Overige velden (`description`, `realWorld`, `sources`) zijn documentatie en
  worden door de catalogus genegeerd.

Ongeldige JSON of een ontbrekende GLB wordt door de catalogus gelogd en
overgeslagen. Maak in `models/` daarom geen andere submappen aan: elke submap
wordt als catalogusitem gelezen.
