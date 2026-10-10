// Maasbrug (Stadsbrug) Venlo: staal-betonplaatliggers met drie rivierpijlers.
// Letterlijke actuele BGT-contouren, AHN-lengteprofiel, vlakke dekplaat en
// afzonderlijke liggers; geen hoogtelagen. Meters, NAP minus 10,5; +X oost.
import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0?argv[i+1]:f;};
const scale=Number(flag("--scale","1000")),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),"maasbrug-venlo");
const wasm=await Module();wasm.setup();const {Manifold,Mesh,CrossSection}=wasm;
const BASE=-1,GROUND_NAP=10.5,GROUND_OFFSET=-.1,GROUND_HEIGHT=57.356541221362235;
const union = (parts) => Manifold.union(parts);
const boxFromTo = (x0, x1, y0, y1, z0, z1) => {
  const lo = [Math.min(x0, x1), Math.min(y0, y1), Math.min(z0, z1)];
  const hi = [Math.max(x0, x1), Math.max(y0, y1), Math.max(z0, z1)];
  return Manifold.cube(hi.map((v, i) => v - lo[i]), false).translate(lo);
};
const area2 = (pts) => {
  let a = 0;
  pts.forEach(([x0, y0], i) => {
    const [x1, y1] = pts[(i + 1) % pts.length];
    a += x0 * y1 - x1 * y0;
  });
  return a / 2;
};
const ccw = (pts) => (area2(pts) > 0 ? pts : [...pts].reverse());
// Plattegrond (lokale x/y) uitgetrokken van z0 tot z1.
const prism = (poly, z0, z1) => Manifold.extrude([ccw(poly)], z1 - z0).translate([0, 0, z0]);
// Doorsnede in het XZ-vlak (polygoon of CrossSection), uitgetrokken langs Y van y0 tot y1.
const extrudeY = (shape, y0, y1) =>
  Manifold.extrude(shape, y1 - y0)
    .rotate([90, 0, 0])
    .translate([0, y1, 0]);
const profileY = (points, y0, y1) => extrudeY([ccw(points)], y0, y1);
// Loft langs X: per station een convexe doorsnede in het YZ-vlak (tegen de
// klok in, y naar rechts en z omhoog, steeds evenveel punten).
function loftX(stations) {
  const n = stations[0].section.length;
  const verts = [];
  for (const { x, section } of stations) for (const [y, z] of section) verts.push(x, y, z);
  const tris = [];
  const id = (i, j) => i * n + (j % n);
  for (let i = 0; i + 1 < stations.length; i++) {
    for (let j = 0; j < n; j++) {
      tris.push(id(i, j), id(i, j + 1), id(i + 1, j + 1));
      tris.push(id(i, j), id(i + 1, j + 1), id(i + 1, j));
    }
  }
  const last = stations.length - 1;
  for (let j = 1; j + 1 < n; j++) {
    tris.push(id(0, 0), id(0, j + 1), id(0, j));
    tris.push(id(last, 0), id(last, j), id(last, j + 1));
  }
  const solid = new Manifold(
    new Mesh({ numProp: 3, vertProperties: Float32Array.from(verts), triVerts: Uint32Array.from(tris) }),
  );
  if (solid.status() !== "NoError") throw new Error(`loft: ${solid.status()}`);
  if (solid.volume() <= 0) throw new Error("loft: omgekeerde doorsnede");
  return solid;
}
// Stations van x0 tot x1 om de `step` meter, met de uiteinden exact.
const stationsX = (x0, x1, step) => {
  const n = Math.max(1, Math.round((x1 - x0) / step));
  return Array.from({ length: n + 1 }, (_, i) => x0 + ((x1 - x0) * i) / n);
};
const lerp = (a, b, t) => a + (b - a) * t;
// Lineaire interpolatie in een tabel [[x, ...waarden]], buiten de tabel
// lineair doorgetrokken.
function table(rows, x, k) {
  let i = rows.findIndex(([rx]) => rx > x) - 1;
  if (i < 0) i = x < rows[0][0] ? 0 : rows.length - 2;
  i = Math.min(Math.max(i, 0), rows.length - 2);
  const [x0] = rows[i];
  const [x1] = rows[i + 1];
  return lerp(rows[i][k], rows[i + 1][k], (x - x0) / (x1 - x0));
}



const DECK=[
  [
    113.482,
    11.236
  ],
  [
    -106.656,
    11.23
  ],
  [
    -106.575,
    11.309
  ],
  [
    -106.577,
    11.463
  ],
  [
    -106.799,
    11.976
  ],
  [
    -107.053,
    12.178
  ],
  [
    -107.475,
    12.287
  ],
  [
    -112.654,
    12.223
  ],
  [
    -121.798,
    12.388
  ],
  [
    -123.804,
    12.487
  ],
  [
    -128.716,
    -12.065
  ],
  [
    -117.351,
    -11.71
  ],
  [
    -112.104,
    -11.704
  ],
  [
    -111.354,
    -11.512
  ],
  [
    -111.07,
    -11.182
  ],
  [
    -71.896,
    -11.511
  ],
  [
    6.334,
    -11.134
  ],
  [
    109.185,
    -11.243
  ],
  [
    116.09,
    -11.027
  ],
  [
    116.096,
    -11.377
  ],
  [
    116.248,
    -11.71
  ],
  [
    116.52,
    -11.953
  ],
  [
    116.868,
    -12.065
  ],
  [
    125.473,
    -12.007
  ],
  [
    129.103,
    12.009
  ],
  [
    121.134,
    12.004
  ],
  [
    120.856,
    11.888
  ],
  [
    120.642,
    11.69
  ],
  [
    120.389,
    11.024
  ]
];

const PROFILE=[
  [
    -127.0,
    23.027
  ],
  [
    -122.0,
    23.136
  ],
  [
    -117.0,
    23.246
  ],
  [
    -112.0,
    23.35
  ],
  [
    -107.0,
    23.436
  ],
  [
    -102.0,
    23.523
  ],
  [
    -97.0,
    23.609
  ],
  [
    -92.0,
    23.691
  ],
  [
    -87.0,
    23.771
  ],
  [
    -82.0,
    23.855
  ],
  [
    -77.0,
    23.944
  ],
  [
    -72.0,
    24.024
  ],
  [
    -67.0,
    24.116
  ],
  [
    -62.0,
    24.195
  ],
  [
    -57.0,
    24.273
  ],
  [
    -52.0,
    24.351
  ],
  [
    -47.0,
    24.434
  ],
  [
    -42.0,
    24.503
  ],
  [
    -37.0,
    24.57
  ],
  [
    -32.0,
    24.622
  ],
  [
    -27.0,
    24.697
  ],
  [
    -22.0,
    24.741
  ],
  [
    -17.0,
    24.782
  ],
  [
    -12.0,
    24.814
  ],
  [
    -7.0,
    24.852
  ],
  [
    -2.0,
    24.857
  ],
  [
    3.0,
    24.87
  ],
  [
    8.0,
    24.869
  ],
  [
    13.0,
    24.88
  ],
  [
    18.0,
    24.845
  ],
  [
    23.0,
    24.819
  ],
  [
    28.0,
    24.777
  ],
  [
    33.0,
    24.734
  ],
  [
    38.0,
    24.682
  ],
  [
    43.0,
    24.612
  ],
  [
    48.0,
    24.551
  ],
  [
    53.0,
    24.487
  ],
  [
    58.0,
    24.416
  ],
  [
    63.0,
    24.332
  ],
  [
    68.0,
    24.244
  ],
  [
    73.0,
    24.175
  ],
  [
    78.0,
    24.088
  ],
  [
    83.0,
    24.003
  ],
  [
    88.0,
    23.916
  ],
  [
    93.0,
    23.836
  ],
  [
    98.0,
    23.755
  ],
  [
    103.0,
    23.659
  ],
  [
    108.0,
    23.574
  ],
  [
    113.0,
    23.487
  ],
  [
    118.0,
    23.413
  ],
  [
    123.0,
    23.307
  ],
  [
    128.0,
    23.186
  ]
];

const BGT_ROADS=[
  {
    "id": "G0983.8516711bcc80464697938dcfc4607da6",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "open verharding",
      "plus_fysiekvoorkomen": "tegels"
    },
    "contour": [
      [
        125.543,
        -11.542
      ],
      [
        125.779,
        -9.98
      ],
      [
        116.329,
        -9.804
      ],
      [
        116.09,
        -11.027
      ],
      [
        116.557,
        -11.012
      ],
      [
        116.581,
        -11.383
      ],
      [
        116.863,
        -11.601
      ]
    ]
  },
  {
    "id": "G0983.e0c443adb4a5414eb8420d2ab744b450",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "open verharding",
      "plus_fysiekvoorkomen": "tegels"
    },
    "contour": [
      [
        126.215,
        -7.095
      ],
      [
        116.864,
        -7.058
      ],
      [
        116.329,
        -9.804
      ],
      [
        125.779,
        -9.98
      ]
    ]
  },
  {
    "id": "G0983.10f7cb59510e483aacff7f83019f123f",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        126.849,
        -2.905
      ],
      [
        127.34,
        0.352
      ],
      [
        118.234,
        -0.028
      ],
      [
        117.649,
        -3.032
      ]
    ]
  },
  {
    "id": "G0983.24f7651bd671443ca9843dfbfe6b341d",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -128.633,
        -11.64
      ],
      [
        -126.499,
        -11.515
      ],
      [
        -117.269,
        -11.301
      ],
      [
        -111.857,
        -11.328
      ],
      [
        -111.526,
        -11.133
      ],
      [
        -111.453,
        -10.752
      ],
      [
        -128.473,
        -10.842
      ]
    ]
  },
  {
    "id": "G0983.33a4df4468ef405ea54f73601d9c63a9",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -106.629,
        7.255
      ],
      [
        114.816,
        6.987
      ],
      [
        119.641,
        7.184
      ],
      [
        120.389,
        11.024
      ],
      [
        113.482,
        11.236
      ],
      [
        -105.848,
        11.231
      ]
    ]
  },
  {
    "id": "G0983.910c66e39a0f4f5eab3e2d3c00a08973",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -110.168,
        -10.746
      ],
      [
        105.554,
        -9.603
      ],
      [
        116.329,
        -9.804
      ],
      [
        116.864,
        -7.058
      ],
      [
        -109.451,
        -7.094
      ]
    ]
  },
  {
    "id": "G0983.96aee46a37ed4e21bc3a212e66809741",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -126.875,
        -2.857
      ],
      [
        -108.596,
        -2.751
      ],
      [
        -107.952,
        0.527
      ],
      [
        -126.239,
        0.317
      ]
    ]
  },
  {
    "id": "G0983.e08d7a06210d45999507c5a2631a4290",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -124.839,
        7.312
      ],
      [
        -106.629,
        7.255
      ],
      [
        -105.848,
        11.231
      ],
      [
        -107.084,
        11.264
      ],
      [
        -107.093,
        11.521
      ],
      [
        -107.188,
        11.687
      ],
      [
        -107.362,
        11.803
      ],
      [
        -107.601,
        11.814
      ],
      [
        -121.889,
        11.928
      ],
      [
        -123.899,
        12.014
      ]
    ]
  },
  {
    "id": "G0983.ec81a38ee3744041b6bdba4833d6ecf1",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -128.473,
        -10.842
      ],
      [
        -110.168,
        -10.746
      ],
      [
        -109.451,
        -7.094
      ],
      [
        -127.725,
        -7.102
      ]
    ]
  },
  {
    "id": "G0983.fed80a091ea24bd8a3091d300a8d57b0",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -107.952,
        0.527
      ],
      [
        -108.596,
        -2.751
      ],
      [
        117.649,
        -3.032
      ],
      [
        118.234,
        -0.028
      ]
    ]
  },
  {
    "id": "G0983.06e381355e094f268fc438290cc9009b",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -106.825,
        6.26
      ],
      [
        -125.046,
        6.28
      ],
      [
        -125.611,
        3.455
      ],
      [
        -107.388,
        3.394
      ]
    ]
  },
  {
    "id": "G0983.26537e4d4686408ea73b2a8e57ccc6b4",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        119.406,
        5.981
      ],
      [
        -106.825,
        6.26
      ],
      [
        -107.388,
        3.394
      ],
      [
        118.82,
        2.976
      ]
    ]
  },
  {
    "id": "G0983.5ff62b3582494af4bb0975386949b10f",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        127.34,
        0.352
      ],
      [
        127.784,
        3.286
      ],
      [
        118.82,
        2.976
      ],
      [
        118.234,
        -0.028
      ]
    ]
  },
  {
    "id": "G0983.625fe7ef5f534e4bad46adae553bb35b",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        117.063,
        -6.036
      ],
      [
        126.371,
        -6.062
      ],
      [
        126.849,
        -2.905
      ],
      [
        117.649,
        -3.032
      ]
    ]
  },
  {
    "id": "G0983.734309a56b6e40d898f76054a1ef2a84",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        105.554,
        -9.603
      ],
      [
        -110.99,
        -10.75
      ],
      [
        -111.07,
        -11.182
      ],
      [
        -71.896,
        -11.511
      ],
      [
        6.334,
        -11.134
      ],
      [
        109.185,
        -11.243
      ],
      [
        116.09,
        -11.027
      ],
      [
        116.329,
        -9.804
      ]
    ]
  },
  {
    "id": "G0983.be6ab098c44d4190918e8c23a0ff01f6",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -107.388,
        3.394
      ],
      [
        -107.952,
        0.527
      ],
      [
        118.234,
        -0.028
      ],
      [
        118.82,
        2.976
      ]
    ]
  },
  {
    "id": "G0983.d7f12e9a1c2d4f65bfea98c00f218200",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -109.241,
        -6.029
      ],
      [
        117.063,
        -6.036
      ],
      [
        117.649,
        -3.032
      ],
      [
        -108.596,
        -2.751
      ]
    ]
  },
  {
    "id": "G0983.daac6af8359b438b8c2dd245613d1bee",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -107.952,
        0.527
      ],
      [
        -107.388,
        3.394
      ],
      [
        -125.611,
        3.455
      ],
      [
        -126.239,
        0.317
      ]
    ]
  },
  {
    "id": "G0983.ddc9311520784d0ba9b6c8a49f5d49a2",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        -127.511,
        -6.032
      ],
      [
        -109.241,
        -6.029
      ],
      [
        -108.596,
        -2.751
      ],
      [
        -126.875,
        -2.857
      ]
    ]
  },
  {
    "id": "G0983.f68883fc894845be81fdbff8b7b05d1b",
    "function": "rijbaan lokale weg",
    "attributes": {
      "bgt_functie": "rijbaan lokale weg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        128.191,
        5.976
      ],
      [
        119.406,
        5.981
      ],
      [
        118.82,
        2.976
      ],
      [
        127.784,
        3.286
      ]
    ]
  },
  {
    "id": "G0983.73abc33975944ee489f9b919595e2d6f",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "open verharding",
      "plus_fysiekvoorkomen": "tegels"
    },
    "contour": [
      [
        121.134,
        12.004
      ],
      [
        120.744,
        11.802
      ],
      [
        120.508,
        11.43
      ],
      [
        119.641,
        7.184
      ],
      [
        128.343,
        6.98
      ],
      [
        129.035,
        11.563
      ],
      [
        128.053,
        11.565
      ],
      [
        128.054,
        12.003
      ]
    ]
  },
  {
    "id": "G0983.107f94b89d1d40c389c7ff4f6e633a1a",
    "function": "voetpad",
    "attributes": {
      "bgt_functie": "voetpad",
      "bgt_fysiekvoorkomen": "open verharding",
      "plus_fysiekvoorkomen": "gebakken klinkers"
    },
    "contour": [
      [
        -125.046,
        6.28
      ],
      [
        -106.825,
        6.26
      ],
      [
        -106.629,
        7.255
      ],
      [
        -124.839,
        7.312
      ]
    ]
  }
];

const BGT_PIERS=[
  {
    "id": "G0983.a950758003984379bcc53958875fc790",
    "contour": [
      [
        120.298,
        -12.026
      ],
      [
        123.153,
        6.977
      ],
      [
        123.905,
        11.98
      ],
      [
        121.134,
        12.004
      ],
      [
        120.751,
        11.808
      ],
      [
        120.511,
        11.439
      ],
      [
        116.09,
        -11.027
      ],
      [
        116.115,
        -11.448
      ],
      [
        116.334,
        -11.81
      ],
      [
        116.572,
        -11.98
      ],
      [
        116.868,
        -12.065
      ]
    ],
    "x": 120.0804295573343
  },
  {
    "id": "L0002.6215363b1a084899b63ce16b92c764c3",
    "contour": [
      [
        0.74,
        -9.518
      ],
      [
        0.691,
        -10.833
      ],
      [
        0.89,
        -11.537
      ],
      [
        1.24,
        -12.189
      ],
      [
        1.531,
        -12.602
      ],
      [
        1.895,
        -12.872
      ],
      [
        2.263,
        -12.989
      ],
      [
        2.66,
        -12.901
      ],
      [
        3.084,
        -12.604
      ],
      [
        3.74,
        -11.725
      ],
      [
        4.294,
        -10.369
      ],
      [
        8.394,
        8.529
      ],
      [
        8.427,
        9.902
      ],
      [
        8.159,
        11.248
      ],
      [
        7.639,
        11.988
      ],
      [
        7.148,
        12.154
      ],
      [
        6.581,
        11.994
      ],
      [
        5.798,
        11.383
      ],
      [
        5.438,
        10.972
      ],
      [
        4.846,
        9.912
      ],
      [
        4.45,
        8.358
      ]
    ],
    "x": 4.562318992303927
  },
  {
    "id": "L0002.bf7a318bc1724f538b365c5bc9cac147",
    "contour": [
      [
        62.316,
        -9.767
      ],
      [
        62.27,
        -10.458
      ],
      [
        62.338,
        -11.137
      ],
      [
        62.553,
        -11.916
      ],
      [
        63.123,
        -12.865
      ],
      [
        63.555,
        -13.186
      ],
      [
        63.952,
        -13.2
      ],
      [
        64.492,
        -13.005
      ],
      [
        64.912,
        -12.615
      ],
      [
        65.234,
        -12.172
      ],
      [
        65.633,
        -11.079
      ],
      [
        69.976,
        10.852
      ],
      [
        69.938,
        11.819
      ],
      [
        69.673,
        12.386
      ],
      [
        69.259,
        13.009
      ],
      [
        68.739,
        13.386
      ],
      [
        68.238,
        13.404
      ],
      [
        67.676,
        13.035
      ],
      [
        67.225,
        12.581
      ],
      [
        66.846,
        12.049
      ],
      [
        66.519,
        11.348
      ],
      [
        66.151,
        9.94
      ]
    ],
    "x": 66.07147737107667
  },
  {
    "id": "L0002.c823796e372a4677ba10cf3373954a86",
    "contour": [
      [
        -60.596,
        -9.671
      ],
      [
        -60.688,
        -10.604
      ],
      [
        -60.5,
        -11.532
      ],
      [
        -60.257,
        -12.168
      ],
      [
        -59.807,
        -12.717
      ],
      [
        -59.057,
        -12.925
      ],
      [
        -58.489,
        -12.727
      ],
      [
        -57.721,
        -12.052
      ],
      [
        -57.176,
        -11.021
      ],
      [
        -56.748,
        -9.557
      ],
      [
        -53.046,
        8.085
      ],
      [
        -52.895,
        10.057
      ],
      [
        -53.243,
        10.734
      ],
      [
        -53.901,
        11.303
      ],
      [
        -54.343,
        11.362
      ],
      [
        -55.167,
        10.952
      ],
      [
        -55.795,
        10.388
      ],
      [
        -56.297,
        9.58
      ],
      [
        -56.568,
        8.842
      ]
    ],
    "x": -56.792259556564176
  }
];

const x0=Math.min(...DECK.map(p=>p[0])),x1=Math.max(...DECK.map(p=>p[0]));
const xs=[...new Set([...stationsX(x0,x1,2),...DECK.map(p=>p[0]),...PROFILE.map(p=>p[0])])].filter(x=>x>=x0&&x<=x1).sort((a,b)=>a-b);
const road=x=>table(PROFILE,x,1)-GROUND_NAP;
const plan=prism(DECK,BASE,100);
const slab=loftX(xs.map(x=>({x,section:[[-14,road(x)-.8],[14,road(x)-.8],[14,road(x)],[-14,road(x)]]}))).intersect(plan);
// Vier plaatliggers: onderzijde en flenzen geschat uit het schuine bouwbeeld.
const girders=[-7.8,-2.6,2.6,7.8].flatMap(y=>[
 loftX(xs.map(x=>({x,section:[[y-.45,road(x)-2.35],[y+.45,road(x)-2.35],[y+.45,road(x)-.7],[y-.45,road(x)-.7]]}))),
 loftX(xs.map(x=>({x,section:[[y-.6,road(x)-2.4],[y+.6,road(x)-2.4],[y+.6,road(x)-2.05],[y-.6,road(x)-2.05]]})))
]);
const kerbY=[-11.1,-6.65,6.7,11.15];
const kerb=(y,m=0)=>loftX(xs.map(x=>({x,section:[[y-.45-m,road(x)-.2-m],[y+.45+m,road(x)-.2-m],[y+.45+m,road(x)+.6+m],[y-.45-m,road(x)+.6+m]]})));
const piers=BGT_PIERS.map(q=>prism(q.contour,BASE,road(q.x)-.7));
const abutments=[prism(DECK,BASE,50).intersect(boxFromTo(x0,x0+8,-15,15,BASE,road(x0)-.1)),prism(DECK,BASE,50).intersect(boxFromTo(x1-6,x1,-15,15,BASE,road(x1)-.1))];
// Vier Wachters van Tajiri: 9 m inclusief 3 m sokkel (Nationaal Comit�).
// Geschatte 1:1000-silhouetten: stam, pantser en twee hoorns, minstens .9 m.
const WATCHERS=[[-110,-10],[-110,10],[115,-10],[115,10]];
const watcherProfile=[[-.55,3],[.55,3],[.55,5.3],[1.65,6.8],[1.25,7.4],[1.25,8],[1.8,9],[.9,9],[.45,8],[-.45,8],[-.9,9],[-1.8,9],[-1.25,8],[-1.25,7.4],[-1.65,6.8],[-.55,5.3]];
const watchers=WATCHERS.flatMap(([x,y])=>[boxFromTo(x-1.1,x+1.1,y-1.1,y+1.1,road(x)-.15,road(x)+3.1),profileY(watcherProfile.map(([a,z])=>[a+x,z+road(x)]),y-.55,y+.55)]);
const watcherGuard=union(WATCHERS.map(([x,y])=>boxFromTo(x-1.12,x+1.12,y-1.12,y+1.12,BASE,100)));
const bridge=union([...watchers.map(m=>m.intersect(plan)),slab,...girders.map(m=>m.intersect(plan)),...kerbY.map(y=>kerb(y).intersect(plan)),...piers,...abutments]);
const strip=loftX(xs.map(x=>({x,section:[[-15,road(x)-.5],[15,road(x)-.5],[15,road(x)+1],[-15,road(x)+1]]}))).subtract(union(kerbY.map(y=>kerb(y,.02)))).subtract(watcherGuard);
const groups=new Map();
for(const q of BGT_ROADS){const key=JSON.stringify(q.attributes);if(!groups.has(key))groups.set(key,{attributes:q.attributes,polys:[],function:q.function});groups.get(key).polys.push(q.contour);}
const roadGroup=[...groups.values()].find(q=>q.function==='rijbaan lokale weg');
const cuts=[];let used=null;
for(const q of [...groups.values()].filter(q=>q!==roadGroup)){
 const full=union(q.polys.map(p=>prism(p,BASE,100)));const zone=used?full.subtract(used):full;used=used?union([used,zone]):zone;cuts.push([q,strip.intersect(zone).intersect(bridge)]);
}
cuts.unshift([roadGroup,strip.subtract(used).intersect(bridge)]);
const parts=[["building:maasbrug-venlo",bridge.subtract(strip)]];
const labels={"rijbaan lokale weg":"rijbaan",fietspad:"fietspad",voetpad:"voetpad"};
for(const[q,m]of cuts){if(m.volume()>.01)parts.push(["road:"+labels[q.function]+"-"+(q.attributes.plus_fysiekvoorkomen||'verhard'),m,q.attributes]);}
// Eigen printvoet alleen in STL, 50 graden met een scherm van minimaal .9 mm.
// De 3MF ondersteunt de volledige GLB gezamenlijk en wijst steun aan building toe.
const tan=Math.tan(50*Math.PI/180),screen=Math.max(.45,.4*scale/1000),w=14;
const foot=loftX(xs.map(x=>{const z=road(x)-2.4,low=z-tan*(w-screen),cut=low>BASE?screen:Math.max(screen,w-(z-BASE)/tan);return{x,section:[[-cut,BASE],[cut,BASE],[cut,Math.max(BASE+.001,low)],[w,z],[w,road(x)-.3],[-w,road(x)-.3],[-w,z],[-cut,Math.max(BASE+.001,low)]]};})).intersect(plan);
const printModel=union([bridge,foot]);
const report={};
for(const[n,m]of [...parts,["whole",bridge],["print",printModel]]){if(m.status()!=="NoError"||m.volume()<=0)throw Error(n+" "+m.status());report[n]={triangles:m.numTri(),volumeM3:m.volume(),genus:m.genus(),bounds:m.boundingBox()};}
if(Math.abs(parts.reduce((v,[,m])=>v+m.volume(),0)-bridge.volume())>.05)throw Error("partitie");
for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++)if(parts[i][1].intersect(parts[j][1]).volume()>.02)throw Error("overlap");
function unsupported(m){const q=m.getMesh(),v=q.vertProperties,st=q.numProp;let area=0;
 for(let t=0;t<q.triVerts.length;t+=3){const p=[0,1,2].map(k=>[0,1,2].map(a=>v[q.triVerts[t+k]*st+a]));if(Math.max(...p.map(a=>a[2]))<BASE+.005)continue;
 const u=p[1].map((z,i)=>z-p[0][i]),w=p[2].map((z,i)=>z-p[0][i]);const n=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]],len=Math.hypot(...n);
 if(n[2]<-Math.SQRT1_2*len-1e-5){area+=len/2;if(len/2>.02)console.log("overhang",p.map(a=>a.map(x=>+x.toFixed(3))),len/2);}}return area;}

report.printUnsupportedM2=unsupported(printModel);if(report.printUnsupportedM2>.02)throw Error("printoverhang "+report.printUnsupportedM2);
function toStl(manifold, label) {
  const mesh = manifold.getMesh();
  const v = mesh.vertProperties;
  const tri = mesh.triVerts;
  const stride = mesh.numProp;
  const count = tri.length / 3;
  const buffer = Buffer.alloc(84 + count * 50);
  buffer.write(label.slice(0, 79), 0, 80, "ascii");
  buffer.writeUInt32LE(count, 80);
  let offset = 84;
  for (let t = 0; t < count; t++) {
    const p = [0, 1, 2].map((k) => {
      const i = tri[t * 3 + k] * stride;
      return [v[i] * mmPerMetre, v[i + 1] * mmPerMetre, v[i + 2] * mmPerMetre];
    });
    const u = p[1].map((c, i) => c - p[0][i]);
    const w = p[2].map((c, i) => c - p[0][i]);
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    const len = Math.hypot(...n) || 1;
    for (const value of [...n.map((c) => c / len), ...p[0], ...p[1], ...p[2]]) {
      buffer.writeFloatLE(value, offset);
      offset += 4;
    }
    buffer.writeUInt16LE(0, offset);
    offset += 2;
  }
  return { buffer, triangles: count };
}

// ---------- GLB-export (glTF 2.0, meters, Y omhoog) ----------
function toGlb(namedParts, generator) {
  const chunks = [];
  let byteLength = 0;
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const pushView = (typedArray, target) => {
    const bytes = Buffer.from(typedArray.buffer, typedArray.byteOffset, typedArray.byteLength);
    const padded = Buffer.concat([bytes, Buffer.alloc((4 - (bytes.length % 4)) % 4)]);
    bufferViews.push({ buffer: 0, byteOffset: byteLength, byteLength: bytes.length, target });
    chunks.push(padded);
    byteLength += padded.length;
    return bufferViews.length - 1;
  };
  for (const [name, solid, attributes] of namedParts) {
    // Vertexnormalen met scherpe randen boven 40 graden; getMesh() levert ze
    // als properties 3..5, al meegedraaid met de toegepaste transformaties.
    const mesh = solid.calculateNormals(0, 40).getMesh();
    const stride = mesh.numProp;
    const count = mesh.vertProperties.length / stride;
    const positions = new Float32Array(count * 3);
    const normals = new Float32Array(count * 3);
    const min = [Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity];
    for (let i = 0; i < count; i++) {
      const v = mesh.vertProperties;
      // Z omhoog (model) naar Y omhoog (glTF): (x, y, z) -> (x, z, -y).
      const p = [v[i * stride], v[i * stride + 2], -v[i * stride + 1]];
      const n = stride >= 6 ? [v[i * stride + 3], v[i * stride + 5], -v[i * stride + 4]] : [0, 1, 0];
      for (let a = 0; a < 3; a++) {
        positions[i * 3 + a] = p[a];
        normals[i * 3 + a] = n[a];
        min[a] = Math.min(min[a], p[a]);
        max[a] = Math.max(max[a], p[a]);
      }
    }
    const indices = Uint32Array.from(mesh.triVerts);
    const positionView = pushView(positions, 34962);
    const normalView = pushView(normals, 34962);
    const indexView = pushView(indices, 34963);
    accessors.push(
      { bufferView: positionView, componentType: 5126, count, type: "VEC3", min, max },
      { bufferView: normalView, componentType: 5126, count, type: "VEC3" },
      { bufferView: indexView, componentType: 5125, count: indices.length, type: "SCALAR" },
    );
    const base = accessors.length - 3;
    meshes.push({
      name,
      primitives: [{ attributes: { POSITION: base, NORMAL: base + 1 }, indices: base + 2, mode: 4 }],
    });
    nodes.push({ name, mesh: meshes.length - 1, ...(attributes ? { extras: { attributes } } : {}) });
  }
  const json = Buffer.from(
    JSON.stringify({
      asset: { version: "2.0", generator },
      scene: 0,
      scenes: [{ nodes: nodes.map((_, i) => i) }],
      nodes,
      meshes,
      buffers: [{ byteLength }],
      bufferViews,
      accessors,
    }),
  );
  const jsonPadded = Buffer.concat([json, Buffer.alloc((4 - (json.length % 4)) % 4, 0x20)]);
  const bin = Buffer.concat(chunks);
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(12 + 8 + jsonPadded.length + 8 + bin.length, 8);
  const chunkHeader = (length, type) => {
    const b = Buffer.alloc(8);
    b.writeUInt32LE(length, 0);
    b.writeUInt32LE(type, 4);
    return b;
  };
  return Buffer.concat([header, chunkHeader(jsonPadded.length, 0x4e4f534a), jsonPadded, chunkHeader(bin.length, 0x004e4942), bin]);
}


await mkdir(outDir,{recursive:true});
await writeFile(path.join(outDir,"maasbrug-venlo.glb"),toGlb(parts,"NederPrint generate-maasbrug-venlo.mjs"));
const stlName=`maasbrug-venlo-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),"NederPrint Stadsbrug Venlo 1:"+scale).buffer);
const metadata={
  "name": "Maasbrug (Stadsbrug)",
  "file": "maasbrug-venlo.glb",
  "unitsPerMetre": 1,
  "className": "building",
  "crs": "EPSG:28992",
  "origin": [
    208900.3975864089,
    375794.98474320024
  ],
  "xAxis": [
    0.8774403134966757,
    -0.4796858307797463
  ],
  "groundOffsetMetres": -0.1,
  "groundHeight": 54,
  "groundSamplePoints": [
    [
      -30,
      -25
    ],
    [
      30,
      -25
    ]
  ],
  "replacesBuildings": [],
  "replacesTerrain": [
    "G0983.7aa5d4c01c5f4ddbb1b87015efec2526"
  ],
  "description": "Vier staal-betonplaatliggers, drie rivierpijlers en oostelijke oeverpijler met letterlijke BGT-contouren, oplopend AHN-dek en BGT-rijbaan, fietspad en voetpaden per bestrating. Wegdeklaag .5 m; gezamenlijke opvulling in de constructie. Liggereenheden, dekplaatdikte en schampkanten geschat voor 1:1000. NAP minus 10,5 m.",
  "realWorld": {
    "lengthM": 257.82,
    "deckWidthM": 24.55,
    "deckNapM": [
      23.02,
      24.88
    ],
    "riverPierX": [
      4.562,
      66.071,
      -56.792
    ]
  },
  "sources": [
    "https://bruggenstichting.nl/tijdschrift/ouder/48-bruggen-2002/588-evolutie-van-de-verschijningsvorm-van-vaste-bruggen-vanaf-1940",
    "https://commons.wikimedia.org/wiki/File:Bouw_brug_Maas_bij_Venlo,_Bestanddeelnr_908-2438.jpg",
    "https://commons.wikimedia.org/wiki/File:Nieuwe_verkeersbrug_over_de_Maas_bij_Venlo,_Bestanddeelnr_907-8991.jpg",
    "PDOK actuele BGT overbruggingsdeel en wegdelen, AHN DSM/DTM .5 m en actuele luchtfoto"
  ]
};metadata.printFiles=[stlName];metadata.groundHeight=GROUND_HEIGHT;metadata.realWorld.watcherHeightM=9;metadata.sources.push("https://www.4en5mei.nl/oorlogsmonumenten/zoeken/3000/venlo-de-wachters","https://commons.wikimedia.org/wiki/File:Venlo,_sculptuur_��n_van_de_Wachters_ontworpen_door_Shinkichi_Tajiri_IMG_7158_2023-07-10_18.20.jpg");
await writeFile(path.join(outDir,"maasbrug-venlo.json"),JSON.stringify(metadata,null,2));console.log(JSON.stringify(report,null,2));
