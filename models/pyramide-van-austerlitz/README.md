# Pyramide van Austerlitz (Woudenberg)

De GLB bevat de obelisk en de zuidwestelijke toegangstrap. De bestaande
PDOK-grasheuvel blijft op de kaart en in de export staan. De zelfstandige
`pyramide-van-austerlitz-1-1000.stl` bevat ook de volledige piramide en een
vlakke voet: circa 52,3 × 52 × 32 mm, één gesloten onderdeel zonder losse steun.

- `pyramide-van-austerlitz.glb`: meters, Y omhoog; gebouw- en weg-node.
- `pyramide-van-austerlitz.json`: plaatsing en vervanging van BAG-pand
  `0351100000008766`.
- Generator: `../../scripts/generate-pyramide-van-austerlitz.mjs`;
  `node scripts/generate-pyramide-van-austerlitz.mjs` werkt zonder netwerk.

Oorsprong RD [151956.297, 455795.396], op het plateau; +X wijst naar het
noordoosten ([0.57584, 0.81756]). De AHN-punten van de obelisk liggen circa
vier meter naast het BAG-pand; het model volgt het AHN. Plateau NAP +66,48 m,
omringend pad circa +48,83 m, hoogste geldige DSM-punt +80,334 m.
De drie grondmonsters op het plateau geven PDOK-hoogtes 110,050 tot 110,087 m
ellipsoïdisch; de terugval is het minimum 110,049915 m.

De vier schachtvlakken versmallen van 3,06 naar 2,14 m. Elke gevel krijgt
drie blinde vensterspleten, een gesloten lantaarn met driehoekig reliëf en
een dak met vier vlakken. De trap is een doorlopend zijprofiel met verdikte
zijwanden en een gedenkplaat aan de voet. De STL-heuvel bestaat uit vier
vlakken met ondiep terrasreliëf; hij is niet uit DSM-hoogtelagen opgebouwd.

Geschat uit foto's: lantaarnhoogte, vensterlengte, diepte van de spleten en
gedenkplaat. Voor 1:1000 zijn de spleten verbreed tot 0,9 m, zijwanden tot
0,9 m en de 81 echte treden gegroepeerd tot twintig. Traphoogtes krijgen
marge boven het AHN vanwege het grovere PDOK-terrein. Fijne leuningen,
bliksemafleider en opschriften zijn weggelaten. Het losse kaartverkooppaviljoen
blijft het oorspronkelijke BAG-model.

Controle: gesloten manifolds, één verbonden volledige STL, vier schuine
vergelijkingen met dezelfde PDOK-heuvel en Commons-foto's, kaartcontrole en
een volledige 200 × 200 m preview-export op 1:1000. De export bevat 45
objecten en circa 199.510 driehoeken. De obeliskopvulling blijft onder 1%;
de trap draagt over de volle breedte tot in het talud. De tests controleren
plaatsing, twee materiaalklassen, vensters, top en het trapprofiel.

Bronnen:
- [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM/DTM 0,5 m,
  bbox 151870,455715,152005,455850; [BAG](https://service.pdok.nl/lv/bag/wfs/v2_0)
  en [BGT](https://api.pdok.nl/lv/bgt/ogc/v1), CC0.
- [Stichting Monument De Pyramide van Austerlitz](https://www.monumentdepyramidevanausterlitz.nl/).
- [081207 NL Pyramide van Austerlitz](https://commons.wikimedia.org/wiki/File:081207_NL_Pyramide_van_Austerlitz.JPG),
  Kattjosh, CC BY 3.0.
- [Pyramide van Austerlitz 2017](https://commons.wikimedia.org/wiki/File:Pyramide_van_Austerlitz_2017.jpg),
  Maxine Roberta, CC BY-SA 4.0.
- [Pyramid of Austerlitz oct 2022](https://commons.wikimedia.org/wiki/File:Pyramid_of_Austerlitz_oct_2022.jpg),
  Gewild, CC BY-SA 4.0.
- [Pyramide van Austerlitz P1010572](https://commons.wikimedia.org/wiki/File:Pyramide_van_Austerlitz_P1010572.jpg),
  G. Lanting, CC BY-SA 4.0.

