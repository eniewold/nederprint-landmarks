// Moerdijkbrug: een brede trapeziumkoker op negen hergebruikte rivierpijlers.
// Letterlijke actuele BGT-plannen, AHN-dekprofiel, afzonderlijke bouwdelen.
// Geen hoogtelagen. Meters, NAP minus .7; +X naar Dordrecht.
import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0?argv[i+1]:f;};
const scale=Number(flag("--scale","1000")),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),"moerdijkbrug");
const wasm=await Module();wasm.setup();const {Manifold,Mesh,CrossSection}=wasm;
const BASE=-1,GROUND_NAP=.7,GROUND_OFFSET=-.1,GROUND_HEIGHT=44.03235065512057;
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
    -510.546,
    -21.666
  ],
  [
    -521.996,
    -21.732
  ],
  [
    -521.995,
    -22.291
  ],
  [
    -510.587,
    -22.333
  ],
  [
    -510.587,
    -22.156
  ],
  [
    -508.22,
    -22.165
  ],
  [
    -508.225,
    -21.749
  ],
  [
    -410.087,
    -21.707
  ],
  [
    -410.103,
    -22.838
  ],
  [
    -407.637,
    -22.849
  ],
  [
    -407.637,
    -21.715
  ],
  [
    -204.652,
    -21.732
  ],
  [
    203.16,
    -21.614
  ],
  [
    495.511,
    -21.598
  ],
  [
    495.508,
    -22.745
  ],
  [
    497.884,
    -22.719
  ],
  [
    497.899,
    -21.592
  ],
  [
    506.799,
    -21.602
  ],
  [
    506.812,
    -22.037
  ],
  [
    509.271,
    -22.023
  ],
  [
    509.276,
    -22.223
  ],
  [
    520.497,
    -22.212
  ],
  [
    520.517,
    -21.498
  ],
  [
    509.642,
    -21.445
  ],
  [
    509.737,
    21.52
  ],
  [
    520.511,
    21.493
  ],
  [
    520.529,
    22.253
  ],
  [
    509.25,
    22.31
  ],
  [
    509.245,
    22.174
  ],
  [
    506.811,
    22.112
  ],
  [
    506.807,
    21.676
  ],
  [
    493.064,
    21.73
  ],
  [
    493.069,
    22.695
  ],
  [
    490.837,
    22.686
  ],
  [
    490.816,
    21.716
  ],
  [
    307.266,
    21.797
  ],
  [
    307.255,
    22.718
  ],
  [
    304.932,
    22.723
  ],
  [
    304.931,
    21.838
  ],
  [
    -408.654,
    21.486
  ],
  [
    -508.258,
    21.502
  ],
  [
    -508.257,
    21.973
  ],
  [
    -510.595,
    21.977
  ],
  [
    -510.596,
    22.074
  ],
  [
    -513.067,
    22.102
  ],
  [
    -513.078,
    22.694
  ],
  [
    -514.074,
    22.723
  ],
  [
    -514.083,
    22.131
  ],
  [
    -521.825,
    22.095
  ],
  [
    -521.842,
    21.598
  ],
  [
    -510.552,
    21.438
  ]
];

const PROFILE=[
  [
    -520.0,
    11.064
  ],
  [
    -515.0,
    11.127
  ],
  [
    -510.0,
    11.199
  ],
  [
    -505.0,
    11.267
  ],
  [
    -500.0,
    11.3
  ],
  [
    -495.0,
    11.347
  ],
  [
    -490.0,
    11.381
  ],
  [
    -485.0,
    11.429
  ],
  [
    -480.0,
    11.474
  ],
  [
    -475.0,
    11.581
  ],
  [
    -470.0,
    11.633
  ],
  [
    -465.0,
    11.661
  ],
  [
    -460.0,
    11.726
  ],
  [
    -455.0,
    11.733
  ],
  [
    -450.0,
    11.792
  ],
  [
    -445.0,
    11.863
  ],
  [
    -440.0,
    11.923
  ],
  [
    -435.0,
    11.975
  ],
  [
    -430.0,
    12.064
  ],
  [
    -425.0,
    12.137
  ],
  [
    -420.0,
    12.197
  ],
  [
    -415.0,
    12.273
  ],
  [
    -410.0,
    12.352
  ],
  [
    -405.0,
    12.388
  ],
  [
    -400.0,
    12.365
  ],
  [
    -395.0,
    12.409
  ],
  [
    -390.0,
    12.507
  ],
  [
    -385.0,
    12.531
  ],
  [
    -380.0,
    12.522
  ],
  [
    -375.0,
    12.616
  ],
  [
    -370.0,
    12.684
  ],
  [
    -365.0,
    12.713
  ],
  [
    -360.0,
    12.684
  ],
  [
    -355.0,
    12.741
  ],
  [
    -350.0,
    12.788
  ],
  [
    -345.0,
    12.82
  ],
  [
    -340.0,
    12.862
  ],
  [
    -335.0,
    12.904
  ],
  [
    -330.0,
    12.944
  ],
  [
    -325.0,
    12.997
  ],
  [
    -320.0,
    13.051
  ],
  [
    -315.0,
    13.097
  ],
  [
    -310.0,
    13.137
  ],
  [
    -305.0,
    13.231
  ],
  [
    -300.0,
    13.215
  ],
  [
    -295.0,
    13.225
  ],
  [
    -290.0,
    13.269
  ],
  [
    -285.0,
    13.276
  ],
  [
    -280.0,
    13.294
  ],
  [
    -275.0,
    13.31
  ],
  [
    -270.0,
    13.339
  ],
  [
    -265.0,
    13.378
  ],
  [
    -260.0,
    13.388
  ],
  [
    -255.0,
    13.451
  ],
  [
    -250.0,
    13.46
  ],
  [
    -245.0,
    13.487
  ],
  [
    -240.0,
    13.511
  ],
  [
    -235.0,
    13.556
  ],
  [
    -230.0,
    13.595
  ],
  [
    -225.0,
    13.679
  ],
  [
    -220.0,
    13.701
  ],
  [
    -215.0,
    13.7
  ],
  [
    -210.0,
    13.749
  ],
  [
    -205.0,
    13.775
  ],
  [
    -200.0,
    13.795
  ],
  [
    -195.0,
    13.813
  ],
  [
    -190.0,
    13.827
  ],
  [
    -185.0,
    13.871
  ],
  [
    -180.0,
    13.871
  ],
  [
    -175.0,
    13.877
  ],
  [
    -170.0,
    13.922
  ],
  [
    -165.0,
    13.874
  ],
  [
    -160.0,
    13.899
  ],
  [
    -155.0,
    13.906
  ],
  [
    -150.0,
    13.96
  ],
  [
    -145.0,
    13.978
  ],
  [
    -140.0,
    14.0
  ],
  [
    -135.0,
    14.005
  ],
  [
    -130.0,
    14.064
  ],
  [
    -125.0,
    14.068
  ],
  [
    -120.0,
    14.117
  ],
  [
    -115.0,
    14.142
  ],
  [
    -110.0,
    14.149
  ],
  [
    -105.0,
    14.168
  ],
  [
    -100.0,
    14.179
  ],
  [
    -95.0,
    14.212
  ],
  [
    -90.0,
    14.221
  ],
  [
    -85.0,
    14.223
  ],
  [
    -80.0,
    14.23
  ],
  [
    -75.0,
    14.181
  ],
  [
    -70.0,
    14.201
  ],
  [
    -65.0,
    14.219
  ],
  [
    -60.0,
    14.227
  ],
  [
    -55.0,
    14.242
  ],
  [
    -50.0,
    14.255
  ],
  [
    -45.0,
    14.248
  ],
  [
    -40.0,
    14.239
  ],
  [
    -35.0,
    14.244
  ],
  [
    -30.0,
    14.325
  ],
  [
    -25.0,
    14.346
  ],
  [
    -20.0,
    14.309
  ],
  [
    -15.0,
    14.319
  ],
  [
    -10.0,
    14.372
  ],
  [
    -5.0,
    14.398
  ],
  [
    0.0,
    14.381
  ],
  [
    5.0,
    14.328
  ],
  [
    10.0,
    14.362
  ],
  [
    15.0,
    14.366
  ],
  [
    20.0,
    14.309
  ],
  [
    25.0,
    14.275
  ],
  [
    30.0,
    14.226
  ],
  [
    35.0,
    14.247
  ],
  [
    40.0,
    14.255
  ],
  [
    45.0,
    14.265
  ],
  [
    50.0,
    14.264
  ],
  [
    55.0,
    14.279
  ],
  [
    60.0,
    14.197
  ],
  [
    65.0,
    14.192
  ],
  [
    70.0,
    14.251
  ],
  [
    75.0,
    14.238
  ],
  [
    80.0,
    14.243
  ],
  [
    85.0,
    14.247
  ],
  [
    90.0,
    14.279
  ],
  [
    95.0,
    14.303
  ],
  [
    100.0,
    14.332
  ],
  [
    105.0,
    14.285
  ],
  [
    110.0,
    14.256
  ],
  [
    115.0,
    14.19
  ],
  [
    120.0,
    14.159
  ],
  [
    125.0,
    14.109
  ],
  [
    130.0,
    14.055
  ],
  [
    135.0,
    14.083
  ],
  [
    140.0,
    14.081
  ],
  [
    145.0,
    14.037
  ],
  [
    150.0,
    14.034
  ],
  [
    155.0,
    14.079
  ],
  [
    160.0,
    14.08
  ],
  [
    165.0,
    14.049
  ],
  [
    170.0,
    13.994
  ],
  [
    175.0,
    13.946
  ],
  [
    180.0,
    13.932
  ],
  [
    185.0,
    13.888
  ],
  [
    190.0,
    13.869
  ],
  [
    195.0,
    13.865
  ],
  [
    200.0,
    13.862
  ],
  [
    205.0,
    13.901
  ],
  [
    210.0,
    13.908
  ],
  [
    215.0,
    13.818
  ],
  [
    220.0,
    13.756
  ],
  [
    225.0,
    13.72
  ],
  [
    230.0,
    13.679
  ],
  [
    235.0,
    13.677
  ],
  [
    240.0,
    13.644
  ],
  [
    245.0,
    13.553
  ],
  [
    250.0,
    13.529
  ],
  [
    255.0,
    13.511
  ],
  [
    260.0,
    13.465
  ],
  [
    265.0,
    13.497
  ],
  [
    270.0,
    13.485
  ],
  [
    275.0,
    13.423
  ],
  [
    280.0,
    13.359
  ],
  [
    285.0,
    13.327
  ],
  [
    290.0,
    13.305
  ],
  [
    295.0,
    13.282
  ],
  [
    300.0,
    13.257
  ],
  [
    305.0,
    13.241
  ],
  [
    310.0,
    13.199
  ],
  [
    315.0,
    13.152
  ],
  [
    320.0,
    13.066
  ],
  [
    325.0,
    13.02
  ],
  [
    330.0,
    13.048
  ],
  [
    335.0,
    12.975
  ],
  [
    340.0,
    12.926
  ],
  [
    345.0,
    12.843
  ],
  [
    350.0,
    12.793
  ],
  [
    355.0,
    12.75
  ],
  [
    360.0,
    12.739
  ],
  [
    365.0,
    12.715
  ],
  [
    370.0,
    12.67
  ],
  [
    375.0,
    12.583
  ],
  [
    380.0,
    12.545
  ],
  [
    385.0,
    12.492
  ],
  [
    390.0,
    12.461
  ],
  [
    395.0,
    12.42
  ],
  [
    400.0,
    12.385
  ],
  [
    405.0,
    12.351
  ],
  [
    410.0,
    12.288
  ],
  [
    415.0,
    12.232
  ],
  [
    420.0,
    12.183
  ],
  [
    425.0,
    12.148
  ],
  [
    430.0,
    12.041
  ],
  [
    435.0,
    11.977
  ],
  [
    440.0,
    11.944
  ],
  [
    445.0,
    11.869
  ],
  [
    450.0,
    11.854
  ],
  [
    455.0,
    11.795
  ],
  [
    460.0,
    11.705
  ],
  [
    465.0,
    11.685
  ],
  [
    470.0,
    11.588
  ],
  [
    475.0,
    11.547
  ],
  [
    480.0,
    11.494
  ],
  [
    485.0,
    11.446
  ],
  [
    490.0,
    11.381
  ],
  [
    495.0,
    11.339
  ],
  [
    500.0,
    11.298
  ],
  [
    505.0,
    11.238
  ],
  [
    510.0,
    11.173
  ],
  [
    515.0,
    11.084
  ]
];

const BGT_ROADS=[
  {
    "id": "L0002.3bc2cd1bb7184031992ba9d0d4daa94b",
    "function": "rijbaan autosnelweg",
    "attributes": {
      "bgt_functie": "rijbaan autosnelweg",
      "bgt_fysiekvoorkomen": "gesloten verharding"
    },
    "contour": [
      [
        -9.167,
        -21.569
      ],
      [
        509.592,
        -21.406
      ],
      [
        509.687,
        21.461
      ],
      [
        305.221,
        21.653
      ],
      [
        -9.17,
        21.502
      ]
    ]
  },
  {
    "id": "L0002.6fc031646f884a98970e66638098d05c",
    "function": "rijbaan autosnelweg",
    "attributes": {
      "bgt_functie": "rijbaan autosnelweg",
      "bgt_fysiekvoorkomen": "gesloten verharding"
    },
    "contour": [
      [
        -9.167,
        -21.569
      ],
      [
        -9.17,
        21.502
      ],
      [
        -408.705,
        21.331
      ],
      [
        -510.502,
        21.389
      ],
      [
        -510.496,
        -21.616
      ]
    ]
  }
];

const BGT_PIERS=[
  {
    "id": "L0002.09274b16b5ca4ae291c1a9ceaf655e99",
    "contour": [
      [
        -522.046,
        -22.34
      ],
      [
        -510.534,
        -22.379
      ],
      [
        -510.543,
        -22.201
      ],
      [
        -508.179,
        -22.216
      ],
      [
        -508.208,
        22.025
      ],
      [
        -510.558,
        22.022
      ],
      [
        -510.552,
        22.115
      ],
      [
        -513.014,
        22.15
      ],
      [
        -513.013,
        22.743
      ],
      [
        -514.123,
        22.772
      ],
      [
        -514.128,
        22.189
      ],
      [
        -521.874,
        22.145
      ],
      [
        -521.894,
        21.549
      ],
      [
        -510.602,
        21.389
      ],
      [
        -510.596,
        -21.616
      ],
      [
        -522.046,
        -21.681
      ]
    ],
    "x": -510.28842394033467
  },
  {
    "id": "L0002.07e097da0c6548649933bf36122c1df4",
    "contour": [
      [
        200.938,
        -8.891
      ],
      [
        201.907,
        -10.282
      ],
      [
        203.492,
        -10.886
      ],
      [
        205.074,
        -10.276
      ],
      [
        206.038,
        -8.88
      ],
      [
        206.0,
        8.721
      ],
      [
        205.031,
        10.111
      ],
      [
        203.446,
        10.715
      ],
      [
        201.865,
        10.106
      ],
      [
        200.9,
        8.71
      ]
    ],
    "x": 203.4690429376351
  },
  {
    "id": "L0002.3deedb31c4594e4a8ff638545390f873",
    "contour": [
      [
        98.939,
        -8.89
      ],
      [
        99.908,
        -10.281
      ],
      [
        101.493,
        -10.885
      ],
      [
        103.075,
        -10.275
      ],
      [
        104.039,
        -8.879
      ],
      [
        104.002,
        8.722
      ],
      [
        103.033,
        10.112
      ],
      [
        101.448,
        10.716
      ],
      [
        99.866,
        10.107
      ],
      [
        98.902,
        8.711
      ]
    ],
    "x": 101.47028491151083
  },
  {
    "id": "L0002.50ff6893382140a6a36e922d59d8142f",
    "contour": [
      [
        -3.06,
        -8.889
      ],
      [
        -2.091,
        -10.28
      ],
      [
        -0.506,
        -10.884
      ],
      [
        1.076,
        -10.274
      ],
      [
        2.04,
        -8.878
      ],
      [
        2.003,
        8.723
      ],
      [
        1.034,
        10.113
      ],
      [
        -0.551,
        10.717
      ],
      [
        -2.133,
        10.108
      ],
      [
        -3.097,
        8.712
      ]
    ],
    "x": -0.5284731146368254
  },
  {
    "id": "L0002.77349222ebc64594aa756e077a377f57",
    "contour": [
      [
        -309.187,
        -8.86
      ],
      [
        -308.218,
        -10.251
      ],
      [
        -306.633,
        -10.855
      ],
      [
        -305.051,
        -10.245
      ],
      [
        -304.087,
        -8.849
      ],
      [
        -304.125,
        8.751
      ],
      [
        -305.094,
        10.142
      ],
      [
        -306.679,
        10.746
      ],
      [
        -308.26,
        10.136
      ],
      [
        -309.225,
        8.74
      ]
    ],
    "x": -306.65594581885733
  },
  {
    "id": "L0002.7bbfbec47a6a40c98e9e31d3036f0c2f",
    "contour": [
      [
        302.937,
        -8.892
      ],
      [
        303.905,
        -10.283
      ],
      [
        305.49,
        -10.887
      ],
      [
        307.072,
        -10.277
      ],
      [
        308.036,
        -8.881
      ],
      [
        307.999,
        8.72
      ],
      [
        307.03,
        10.11
      ],
      [
        305.445,
        10.714
      ],
      [
        303.863,
        10.105
      ],
      [
        302.899,
        8.708
      ]
    ],
    "x": 305.4678009637587
  },
  {
    "id": "L0002.7ca7ce50465140acb3ae18d982f2d4ff",
    "contour": [
      [
        520.563,
        21.579
      ],
      [
        520.58,
        22.303
      ],
      [
        509.202,
        22.362
      ],
      [
        509.2,
        22.225
      ],
      [
        506.763,
        22.158
      ],
      [
        506.764,
        -22.087
      ],
      [
        509.218,
        -22.072
      ],
      [
        509.225,
        -22.276
      ],
      [
        520.546,
        -22.262
      ],
      [
        520.556,
        -21.465
      ],
      [
        509.302,
        -21.523
      ],
      [
        509.291,
        -17.885
      ],
      [
        509.7,
        -17.884
      ],
      [
        509.779,
        17.911
      ],
      [
        509.149,
        17.908
      ],
      [
        509.131,
        21.571
      ]
    ],
    "x": 509.0102096884411
  },
  {
    "id": "L0002.a3ab650c280f4ccda35a2a481e390330",
    "contour": [
      [
        -207.198,
        -8.8
      ],
      [
        -206.229,
        -10.191
      ],
      [
        -204.644,
        -10.795
      ],
      [
        -203.062,
        -10.185
      ],
      [
        -202.098,
        -8.789
      ],
      [
        -202.136,
        8.811
      ],
      [
        -203.105,
        10.202
      ],
      [
        -204.689,
        10.806
      ],
      [
        -206.271,
        10.196
      ],
      [
        -207.236,
        8.8
      ]
    ],
    "x": -204.66685386361533
  },
  {
    "id": "L0002.c3f3ce9aae344a068be2b97924f33c0d",
    "contour": [
      [
        404.935,
        -8.893
      ],
      [
        405.904,
        -10.284
      ],
      [
        407.489,
        -10.888
      ],
      [
        409.071,
        -10.278
      ],
      [
        410.035,
        -8.882
      ],
      [
        409.998,
        8.718
      ],
      [
        409.029,
        10.109
      ],
      [
        407.444,
        10.713
      ],
      [
        405.862,
        10.103
      ],
      [
        404.898,
        8.707
      ]
    ],
    "x": 407.4665589898933
  },
  {
    "id": "L0002.f5ddda701e0445188d4427a84f6de705",
    "contour": [
      [
        -105.059,
        -8.888
      ],
      [
        -104.09,
        -10.279
      ],
      [
        -102.505,
        -10.883
      ],
      [
        -100.923,
        -10.273
      ],
      [
        -99.959,
        -8.877
      ],
      [
        -99.996,
        8.724
      ],
      [
        -100.965,
        10.114
      ],
      [
        -102.55,
        10.718
      ],
      [
        -104.132,
        10.109
      ],
      [
        -105.096,
        8.713
      ]
    ],
    "x": -102.5272311407742
  },
  {
    "id": "L0002.d799585d3d574fb190e9821127e44cb2",
    "contour": [
      [
        -408.653,
        10.721
      ],
      [
        -410.235,
        10.111
      ],
      [
        -411.199,
        8.715
      ],
      [
        -411.161,
        -8.885
      ],
      [
        -410.192,
        -10.276
      ],
      [
        -408.607,
        -10.88
      ],
      [
        -407.026,
        -10.27
      ],
      [
        -406.061,
        -8.874
      ],
      [
        -406.099,
        8.726
      ],
      [
        -407.068,
        10.117
      ]
    ],
    "x": -408.63022205475625
  }
];

const x0=Math.min(...DECK.map(p=>p[0])),x1=Math.max(...DECK.map(p=>p[0]));
const xs=[...new Set([...stationsX(x0,x1,2),...DECK.map(p=>p[0]),...PROFILE.map(p=>p[0])])].filter(x=>x>=x0&&x<=x1).sort((a,b)=>a-b);
const road=x=>table(PROFILE,x,1)-GROUND_NAP;
const plan=prism(DECK,BASE,100);
// Bronhoogte van de hele constructie: 3.50 m. Breedten geschat uit bouwfoto.
const slab=loftX(xs.map(x=>({x,section:[[-24,road(x)-.8],[24,road(x)-.8],[24,road(x)],[-24,road(x)]]}))).intersect(plan);
const koker=loftX(xs.map(x=>({x,section:[[-9.8,road(x)-3.5],[9.8,road(x)-3.5],[20.5,road(x)-.7],[-20.5,road(x)-.7]]}))).intersect(plan);
// Continue schampkanten met een dicht middenprofiel; min .9 mm op 1:1000.
const kerbY=[-21.1,0,21.1];
const kerb=(y,m=0)=>loftX(xs.map(x=>({x,section:[[y-.45-m,road(x)-.2-m],[y+.45+m,road(x)-.2-m],[y+.45+m,road(x)+.6+m],[y-.45-m,road(x)+.6+m]]})));
const riverPiers=BGT_PIERS.filter(q=>Math.abs(q.x)<450);
const pierParts=riverPiers.flatMap(q=>{
 const base=prism(q.contour,BASE,3.2-GROUND_NAP);
 const tops=[-6.6,6.6].map(y=>loftX([
  {x:q.x-2.2,section:[[y-3.3,3.2-GROUND_NAP],[y+3.3,3.2-GROUND_NAP],[y+2.1,road(q.x)-3.48],[y-2.1,road(q.x)-3.48]]},
  {x:q.x+2.2,section:[[y-3.3,3.2-GROUND_NAP],[y+3.3,3.2-GROUND_NAP],[y+2.1,road(q.x)-3.48],[y-2.1,road(q.x)-3.48]]}
 ]));
 return [base,...tops];
});
const abutments=[plan.intersect(boxFromTo(x0,x0+13,-24,24,BASE,road(x0)-.1)),plan.intersect(boxFromTo(x1-13,x1,-24,24,BASE,road(x1)-.1))];
const bridge=union([slab,koker,...kerbY.map(y=>kerb(y).intersect(plan)),...pierParts,...abutments]);
const strip=loftX(xs.map(x=>({x,section:[[-24,road(x)-.5],[24,road(x)-.5],[24,road(x)+1],[-24,road(x)+1]]}))).subtract(union(kerbY.map(y=>kerb(y,.02))));
// Alle twee actuele BGT-wegdelen delen dezelfde letterlijke attribuutset.
// Ook de randstroken heten in BGT rijbaan autosnelweg, geen verzonnen fietspad.
const attrs=BGT_ROADS[0].attributes;
if(BGT_ROADS.some(q=>JSON.stringify(q.attributes)!==JSON.stringify(attrs)))throw Error("onverwachte BGT-attributen");
const roads=strip.intersect(bridge),parts=[["building:moerdijkbrug",bridge.subtract(strip)],["road:rijbaan",roads,attrs]];
// Eigen printvoet alleen in STL: 50 graden vanaf de kokerbodem, ��n wand.
// De 3MF ondersteunt GLB-nodes gezamenlijk en geeft steun aan building.
const tan=Math.tan(50*Math.PI/180),screen=Math.max(.45,.4*scale/1000),w=24;
const foot=loftX(xs.map(x=>{const z=road(x)-3.5,low=z-tan*(w-screen),cut=low>BASE?screen:Math.max(screen,w-(z-BASE)/tan);return{x,section:[[-cut,BASE],[cut,BASE],[cut,Math.max(BASE+.001,low)],[w,z],[w,road(x)-.3],[-w,road(x)-.3],[-w,z],[-cut,Math.max(BASE+.001,low)]]};})).intersect(plan);
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
await writeFile(path.join(outDir,"moerdijkbrug.glb"),toGlb(parts,"NederPrint generate-moerdijkbrug.mjs"));
const stlName=`moerdijkbrug-1-${scale}.stl`;
await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),"NederPrint Moerdijkbrug 1:"+scale).buffer);
const metadata={
  "name": "Moerdijkbrug",
  "file": "moerdijkbrug.glb",
  "unitsPerMetre": 1,
  "className": "building",
  "crs": "EPSG:28992",
  "origin": [
    103133.96263658878,
    414561.6174078211
  ],
  "xAxis": [
    -0.34287669759172834,
    0.9393804182803633
  ],
  "groundOffsetMetres": -0.1,
  "groundHeight": 44.5,
  "groundSamplePoints": [
    [
      -30,
      -30
    ],
    [
      30,
      -30
    ]
  ],
  "replacesBuildings": [],
  "replacesTerrain": [
    "L0002.c63bd45d152149c392d8d6050d9ef2e6"
  ],
  "description": "Brede trapeziumkoker (bronhoogte 3,50 m), negen letterlijke BGT-rivierpijlerbasissen met dubbele taps toelopende kolommen, gemeten AHN-dekprofiel en twee actuele BGT-autosnelwegdelen als ��n wegdekvolume. Geen afzonderlijk fietspad in de actuele BGT. Kolommen, kokerbreedte en schampkanten geschat. Wegdeklaag .5 m; gezamenlijke opvulling in de constructie. NAP minus .7 m.",
  "realWorld": {
    "lengthM": 1042.525,
    "deckWidthM": 45.57,
    "deckNapM": [
      11.064,
      14.398
    ],
    "constructionHeightM": 3.5,
    "riverPierX": [
      203.469,
      101.47,
      -0.528,
      -306.656,
      305.468,
      -204.667,
      407.467,
      -102.527,
      -408.63
    ]
  },
  "sources": [
    "https://bruggenstichting.nl/71-bruggen/bruggen-2003/bruggen-juni-2003/530-evolutie-van-de-verschijningsvorm-van-vaste-bruggen-vanaf-1940",
    "https://commons.wikimedia.org/wiki/File:Road_bridge_motor_way_A16_Moerdijk.jpg",
    "https://commons.wikimedia.org/wiki/File:Nieuw_brugdeel_Moerdijkbrug_geplaatst_het_nieuwe_deel_tussen_de_twee_oude_brugd,_Bestanddeelnr_928-4998.jpg",
    "PDOK actuele BGT overbruggingsdeel en wegdelen, AHN DSM/DTM .5 m en actuele luchtfoto"
  ]
};metadata.printFiles=[stlName];metadata.groundHeight=GROUND_HEIGHT;
await writeFile(path.join(outDir,"moerdijkbrug.json"),JSON.stringify(metadata,null,2));console.log(JSON.stringify(report,null,2));
