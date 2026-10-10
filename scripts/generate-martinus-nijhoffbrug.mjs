// Martinus Nijhoffbrug: betonnen tuibrug met vier pylonen en 120 tuien.
// BGT-contouren, gebogen aanbrug en AHN-dekprofiel. Opbouw uit vlakken en
// bouwdelen; tuivlakken met spitsopeningen voor steunvrij printen op 1:1000.
import Module from "manifold-3d";
import {mkdir,writeFile} from "node:fs/promises";
import path from "node:path";
const argv=process.argv.slice(2),flag=(n,f)=>{const i=argv.indexOf(n);return i>=0?argv[i+1]:f;};
const scale=Number(flag("--scale","1000")),mmPerMetre=1000/scale;
const outDir=path.join(path.resolve(flag("--out",path.join(import.meta.dirname,"../models"))),"martinus-nijhoffbrug");
const wasm=await Module();wasm.setup();const {Manifold,Mesh,CrossSection}=wasm;
const BASE=-1,GROUND_NAP=3.55,GROUND_OFFSET=-.1,GROUND_HEIGHT=46.5138441096112;
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
    770.75,
    24.662
  ],
  [
    762.498,
    56.48
  ],
  [
    765.829,
    57.405
  ],
  [
    765.598,
    58.302
  ],
  [
    759.135,
    56.639
  ],
  [
    759.257,
    56.207
  ],
  [
    753.74,
    54.734
  ],
  [
    745.308,
    52.645
  ],
  [
    730.996,
    49.288
  ],
  [
    730.849,
    49.788
  ],
  [
    729.965,
    49.589
  ],
  [
    730.04,
    49.039
  ],
  [
    723.478,
    47.53
  ],
  [
    704.192,
    43.387
  ],
  [
    693.617,
    41.244
  ],
  [
    679.697,
    38.587
  ],
  [
    672.079,
    37.248
  ],
  [
    671.964,
    37.785
  ],
  [
    671.066,
    37.616
  ],
  [
    671.123,
    37.11
  ],
  [
    660.114,
    35.184
  ],
  [
    646.668,
    33.003
  ],
  [
    633.088,
    31.011
  ],
  [
    621.767,
    29.441
  ],
  [
    612.633,
    28.291
  ],
  [
    612.551,
    28.837
  ],
  [
    611.635,
    28.724
  ],
  [
    611.687,
    28.189
  ],
  [
    602.851,
    27.106
  ],
  [
    585.775,
    25.243
  ],
  [
    554.223,
    22.419
  ],
  [
    552.846,
    22.346
  ],
  [
    552.771,
    22.876
  ],
  [
    551.959,
    22.81
  ],
  [
    551.901,
    22.275
  ],
  [
    532.254,
    20.987
  ],
  [
    510.227,
    19.925
  ],
  [
    492.618,
    19.242
  ],
  [
    492.569,
    19.716
  ],
  [
    491.683,
    19.717
  ],
  [
    491.673,
    19.209
  ],
  [
    476.649,
    18.738
  ],
  [
    450.391,
    18.225
  ],
  [
    431.931,
    18.047
  ],
  [
    431.906,
    18.511
  ],
  [
    431.028,
    18.513
  ],
  [
    430.984,
    17.972
  ],
  [
    410.659,
    17.823
  ],
  [
    370.942,
    17.715
  ],
  [
    370.943,
    18.211
  ],
  [
    370.031,
    18.251
  ],
  [
    370.032,
    17.768
  ],
  [
    309.782,
    17.7
  ],
  [
    309.77,
    18.179
  ],
  [
    308.864,
    18.179
  ],
  [
    308.852,
    17.718
  ],
  [
    248.607,
    17.661
  ],
  [
    248.572,
    18.16
  ],
  [
    247.74,
    18.18
  ],
  [
    247.683,
    17.658
  ],
  [
    224.122,
    17.587
  ],
  [
    224.083,
    18.167
  ],
  [
    215.929,
    18.2
  ],
  [
    215.908,
    17.622
  ],
  [
    212.094,
    17.548
  ],
  [
    211.999,
    20.194
  ],
  [
    203.942,
    21.714
  ],
  [
    192.432,
    19.595
  ],
  [
    160.531,
    19.74
  ],
  [
    130.77,
    19.588
  ],
  [
    130.796,
    20.088
  ],
  [
    125.542,
    20.166
  ],
  [
    125.522,
    19.616
  ],
  [
    -63.685,
    19.394
  ],
  [
    -125.326,
    19.565
  ],
  [
    -125.322,
    20.068
  ],
  [
    -130.729,
    20.003
  ],
  [
    -130.733,
    19.568
  ],
  [
    -135.905,
    19.57
  ],
  [
    -151.13,
    19.324
  ],
  [
    -192.514,
    19.322
  ],
  [
    -203.925,
    21.269
  ],
  [
    -211.923,
    19.814
  ],
  [
    -212.062,
    17.137
  ],
  [
    -222.408,
    17.331
  ],
  [
    -222.385,
    16.449
  ],
  [
    -220.575,
    16.439
  ],
  [
    -220.482,
    -15.88
  ],
  [
    -222.394,
    -15.897
  ],
  [
    -222.387,
    -17.095
  ],
  [
    -211.951,
    -17.124
  ],
  [
    -211.922,
    -19.901
  ],
  [
    -203.932,
    -21.407
  ],
  [
    -192.293,
    -19.437
  ],
  [
    -130.632,
    -19.372
  ],
  [
    -130.643,
    -19.913
  ],
  [
    -124.95,
    -19.896
  ],
  [
    -124.944,
    -19.287
  ],
  [
    -124.5,
    -19.281
  ],
  [
    118.155,
    -19.133
  ],
  [
    125.604,
    -19.193
  ],
  [
    125.614,
    -19.902
  ],
  [
    130.697,
    -19.922
  ],
  [
    130.681,
    -19.218
  ],
  [
    170.147,
    -19.076
  ],
  [
    192.434,
    -19.125
  ],
  [
    203.558,
    -21.009
  ],
  [
    212.031,
    -19.504
  ],
  [
    212.034,
    -16.695
  ],
  [
    215.929,
    -16.807
  ],
  [
    215.938,
    -17.479
  ],
  [
    222.098,
    -17.466
  ],
  [
    222.166,
    -16.731
  ],
  [
    247.755,
    -16.739
  ],
  [
    247.803,
    -17.233
  ],
  [
    248.665,
    -17.237
  ],
  [
    248.648,
    -16.655
  ],
  [
    308.811,
    -16.658
  ],
  [
    308.796,
    -17.113
  ],
  [
    309.761,
    -17.166
  ],
  [
    309.784,
    -16.645
  ],
  [
    370.07,
    -16.548
  ],
  [
    370.126,
    -16.993
  ],
  [
    370.952,
    -17.052
  ],
  [
    370.978,
    -16.542
  ],
  [
    405.047,
    -16.516
  ],
  [
    431.28,
    -16.328
  ],
  [
    431.324,
    -16.805
  ],
  [
    432.305,
    -16.831
  ],
  [
    432.294,
    -16.34
  ],
  [
    471.754,
    -15.676
  ],
  [
    492.677,
    -15.111
  ],
  [
    492.764,
    -15.611
  ],
  [
    493.725,
    -15.607
  ],
  [
    493.724,
    -15.016
  ],
  [
    519.189,
    -14.017
  ],
  [
    541.337,
    -12.836
  ],
  [
    554.284,
    -11.912
  ],
  [
    554.344,
    -12.503
  ],
  [
    555.339,
    -12.447
  ],
  [
    555.324,
    -11.827
  ],
  [
    582.018,
    -9.595
  ],
  [
    601.165,
    -7.595
  ],
  [
    615.839,
    -5.845
  ],
  [
    615.978,
    -6.435
  ],
  [
    616.948,
    -6.331
  ],
  [
    616.877,
    -5.719
  ],
  [
    637.613,
    -2.841
  ],
  [
    652.283,
    -0.69
  ],
  [
    664.583,
    1.258
  ],
  [
    677.059,
    3.367
  ],
  [
    677.159,
    2.74
  ],
  [
    678.173,
    2.923
  ],
  [
    678.064,
    3.452
  ],
  [
    701.013,
    7.895
  ],
  [
    714.535,
    10.613
  ],
  [
    727.145,
    13.256
  ],
  [
    737.799,
    15.623
  ],
  [
    737.92,
    15.081
  ],
  [
    738.819,
    15.305
  ],
  [
    738.718,
    15.766
  ],
  [
    767.775,
    22.943
  ],
  [
    767.899,
    22.511
  ],
  [
    774.416,
    24.079
  ],
  [
    774.068,
    25.493
  ]
];

const PROFILE=[
  [
    -221.0,
    19.689,
    -17.093,
    17.305
  ],
  [
    -211.0,
    19.843,
    -20.075,
    19.982
  ],
  [
    -201.0,
    19.951,
    -20.911,
    20.77
  ],
  [
    -191.0,
    20.062,
    -19.435,
    19.322
  ],
  [
    -181.0,
    20.194,
    -19.42,
    19.323
  ],
  [
    -171.0,
    20.315,
    -19.406,
    19.323
  ],
  [
    -161.0,
    20.475,
    -19.392,
    19.324
  ],
  [
    -151.0,
    20.542,
    -19.381,
    19.326
  ],
  [
    -141.0,
    20.642,
    -19.377,
    19.488
  ],
  [
    -131.0,
    20.788,
    -19.374,
    19.568
  ],
  [
    -121.0,
    20.85,
    -19.278,
    19.563
  ],
  [
    -111.0,
    20.904,
    -19.271,
    19.548
  ],
  [
    -101.0,
    20.986,
    -19.264,
    19.515
  ],
  [
    -91.0,
    21.019,
    -19.259,
    19.483
  ],
  [
    -81.0,
    21.026,
    -19.263,
    19.451
  ],
  [
    -71.0,
    21.053,
    -19.268,
    19.418
  ],
  [
    -61.0,
    21.182,
    -19.272,
    19.4
  ],
  [
    -51.0,
    21.195,
    -19.264,
    19.422
  ],
  [
    -41.0,
    21.24,
    -19.252,
    19.444
  ],
  [
    -31.0,
    21.24,
    -19.24,
    19.466
  ],
  [
    -21.0,
    21.238,
    -19.228,
    19.488
  ],
  [
    -11.0,
    21.229,
    -19.216,
    19.498
  ],
  [
    -1.0,
    21.229,
    -19.205,
    19.504
  ],
  [
    9.0,
    21.251,
    -19.198,
    19.511
  ],
  [
    19.0,
    21.251,
    -19.191,
    19.518
  ],
  [
    29.0,
    21.233,
    -19.185,
    19.529
  ],
  [
    39.0,
    21.224,
    -19.178,
    19.541
  ],
  [
    49.0,
    21.208,
    -19.181,
    19.553
  ],
  [
    59.0,
    21.137,
    -19.184,
    19.565
  ],
  [
    69.0,
    21.125,
    -19.187,
    19.577
  ],
  [
    79.0,
    21.042,
    -19.182,
    19.587
  ],
  [
    89.0,
    21.002,
    -19.169,
    19.596
  ],
  [
    99.0,
    20.988,
    -19.157,
    19.606
  ],
  [
    109.0,
    20.907,
    -19.144,
    19.616
  ],
  [
    119.0,
    20.797,
    -19.14,
    19.625
  ],
  [
    129.0,
    20.769,
    -19.916,
    20.115
  ],
  [
    139.0,
    20.649,
    -19.181,
    19.617
  ],
  [
    149.0,
    20.54,
    -19.143,
    19.674
  ],
  [
    159.0,
    20.434,
    -19.112,
    19.732
  ],
  [
    169.0,
    20.328,
    -19.08,
    19.702
  ],
  [
    179.0,
    20.237,
    -19.095,
    19.656
  ],
  [
    189.0,
    20.116,
    -19.117,
    19.611
  ],
  [
    199.0,
    19.991,
    -20.237,
    20.805
  ],
  [
    209.0,
    19.991,
    -20.042,
    20.76
  ],
  [
    219.0,
    19.901,
    -17.473,
    18.188
  ],
  [
    229.0,
    19.614,
    -16.734,
    17.602
  ],
  [
    239.0,
    19.471,
    -16.737,
    17.632
  ],
  [
    249.0,
    19.328,
    -16.655,
    17.661
  ],
  [
    259.0,
    19.132,
    -16.653,
    17.671
  ],
  [
    269.0,
    19.001,
    -16.65,
    17.68
  ],
  [
    279.0,
    18.876,
    -16.648,
    17.69
  ],
  [
    289.0,
    18.748,
    -16.648,
    17.699
  ],
  [
    299.0,
    18.6,
    -16.653,
    17.708
  ],
  [
    309.0,
    18.457,
    -17.124,
    18.179
  ],
  [
    319.0,
    18.285,
    -16.629,
    17.706
  ],
  [
    329.0,
    18.168,
    -16.613,
    17.711
  ],
  [
    339.0,
    18.039,
    -16.596,
    17.717
  ],
  [
    349.0,
    17.909,
    -16.58,
    17.733
  ],
  [
    359.0,
    17.766,
    -16.565,
    17.749
  ],
  [
    369.0,
    17.582,
    -16.55,
    17.766
  ],
  [
    379.0,
    17.437,
    -16.536,
    17.718
  ],
  [
    389.0,
    17.382,
    -16.528,
    17.738
  ],
  [
    399.0,
    17.298,
    -16.521,
    17.777
  ],
  [
    409.0,
    17.021,
    -16.488,
    17.816
  ],
  [
    419.0,
    16.966,
    -16.416,
    17.884
  ],
  [
    429.0,
    16.777,
    -16.344,
    17.958
  ],
  [
    439.0,
    16.573,
    -16.227,
    18.115
  ],
  [
    449.0,
    16.512,
    -16.059,
    18.212
  ],
  [
    459.0,
    16.325,
    -15.891,
    18.393
  ],
  [
    469.0,
    16.193,
    -15.723,
    18.589
  ],
  [
    479.0,
    16.039,
    -15.48,
    18.812
  ],
  [
    489.0,
    15.845,
    -15.21,
    19.126
  ],
  [
    499.0,
    15.714,
    -14.809,
    19.489
  ],
  [
    509.0,
    15.612,
    -14.417,
    19.877
  ],
  [
    519.0,
    15.472,
    -14.024,
    20.348
  ],
  [
    529.0,
    15.362,
    -13.494,
    20.83
  ],
  [
    539.0,
    15.24,
    -12.961,
    21.429
  ],
  [
    549.0,
    15.093,
    -12.309,
    22.085
  ],
  [
    559.0,
    14.996,
    -11.527,
    22.834
  ],
  [
    569.0,
    14.875,
    -10.704,
    23.702
  ],
  [
    579.0,
    14.785,
    -9.852,
    24.612
  ],
  [
    589.0,
    14.732,
    -8.866,
    25.595
  ],
  [
    599.0,
    14.56,
    -7.821,
    26.686
  ],
  [
    609.0,
    14.472,
    -6.661,
    27.859
  ],
  [
    619.0,
    14.366,
    -5.424,
    29.093
  ],
  [
    629.0,
    14.243,
    -4.036,
    30.444
  ],
  [
    639.0,
    14.143,
    -2.638,
    31.879
  ],
  [
    649.0,
    14.133,
    -1.172,
    33.382
  ],
  [
    659.0,
    14.044,
    0.374,
    35.003
  ],
  [
    669.0,
    13.925,
    2.005,
    36.738
  ],
  [
    679.0,
    13.814,
    3.633,
    38.465
  ],
  [
    689.0,
    13.739,
    5.57,
    40.363
  ],
  [
    699.0,
    13.66,
    7.506,
    42.335
  ],
  [
    709.0,
    13.602,
    9.5,
    44.411
  ],
  [
    719.0,
    13.516,
    11.549,
    46.558
  ],
  [
    729.0,
    13.489,
    13.669,
    48.8
  ],
  [
    739.0,
    13.476,
    15.835,
    51.166
  ],
  [
    749.0,
    13.351,
    18.286,
    53.56
  ],
  [
    759.0,
    13.351,
    20.761,
    56.139
  ],
  [
    769.0,
    13.464,
    22.776,
    31.409
  ]
];

const BGT_ROADS=[
  {
    "id": "L0002.5ac5d366aa9d4ec280ae760ba00623f0",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "cementbeton"
    },
    "contour": [
      [
        554.161,
        21.441
      ],
      [
        563.791,
        22.189
      ],
      [
        587.594,
        24.387
      ],
      [
        603.645,
        26.163
      ],
      [
        617.882,
        27.923
      ],
      [
        631.995,
        29.847
      ],
      [
        644.818,
        31.735
      ],
      [
        660.908,
        34.342
      ],
      [
        676.86,
        37.044
      ],
      [
        690.465,
        39.618
      ],
      [
        706.576,
        42.84
      ],
      [
        719.134,
        45.531
      ],
      [
        732.147,
        48.473
      ],
      [
        747.766,
        52.27
      ],
      [
        762.568,
        56.014
      ],
      [
        762.465,
        56.412
      ],
      [
        750.434,
        53.327
      ],
      [
        734.519,
        49.475
      ],
      [
        718.131,
        45.784
      ],
      [
        703.016,
        42.565
      ],
      [
        688.05,
        39.611
      ],
      [
        670.887,
        36.451
      ],
      [
        660.489,
        34.636
      ],
      [
        646.745,
        32.434
      ],
      [
        633.768,
        30.51
      ],
      [
        606.199,
        26.942
      ],
      [
        595.15,
        25.679
      ],
      [
        579.397,
        24.051
      ],
      [
        565.525,
        22.816
      ],
      [
        544.433,
        21.236
      ],
      [
        531.901,
        20.485
      ],
      [
        502.459,
        19.096
      ],
      [
        471.763,
        18.197
      ],
      [
        442.369,
        17.562
      ],
      [
        405.498,
        17.283
      ],
      [
        328.927,
        17.289
      ],
      [
        205.174,
        17.094
      ],
      [
        195.492,
        17.237
      ],
      [
        178.7,
        17.179
      ],
      [
        153.069,
        17.271
      ],
      [
        134.596,
        17.24
      ],
      [
        131.057,
        16.932
      ],
      [
        125.421,
        16.888
      ],
      [
        122.228,
        17.221
      ],
      [
        79.107,
        17.123
      ],
      [
        -54.328,
        17.071
      ],
      [
        -85.097,
        16.911
      ],
      [
        -124.891,
        17.048
      ],
      [
        -124.898,
        16.724
      ],
      [
        -130.889,
        16.683
      ],
      [
        -135.133,
        17.046
      ],
      [
        -192.495,
        16.891
      ],
      [
        -211.189,
        16.721
      ],
      [
        -220.533,
        16.823
      ],
      [
        -220.526,
        16.389
      ],
      [
        -213.071,
        16.261
      ],
      [
        -202.971,
        16.238
      ],
      [
        -103.838,
        16.394
      ],
      [
        96.337,
        16.539
      ],
      [
        126.114,
        16.489
      ],
      [
        166.077,
        16.585
      ],
      [
        209.148,
        16.523
      ],
      [
        242.68,
        16.669
      ],
      [
        393.667,
        16.75
      ],
      [
        439.579,
        17.078
      ],
      [
        454.402,
        17.235
      ],
      [
        467.9,
        17.518
      ],
      [
        501.794,
        18.538
      ],
      [
        534.48,
        20.149
      ]
    ]
  },
  {
    "id": "L0002.6dce7926a0994cbaaba471366e66bb75",
    "function": "rijbaan autosnelweg",
    "attributes": {
      "bgt_functie": "rijbaan autosnelweg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        552.327,
        -11.038
      ],
      [
        574.367,
        -9.222
      ],
      [
        598.447,
        -6.835
      ],
      [
        615.851,
        -4.856
      ],
      [
        633.144,
        -2.545
      ],
      [
        647.786,
        -0.437
      ],
      [
        662.052,
        1.77
      ],
      [
        673.938,
        3.793
      ],
      [
        686.074,
        5.968
      ],
      [
        698.48,
        8.358
      ],
      [
        724.407,
        13.652
      ],
      [
        737.635,
        16.652
      ],
      [
        770.689,
        24.696
      ],
      [
        764.25,
        49.528
      ],
      [
        745.024,
        45.176
      ],
      [
        731.159,
        41.876
      ],
      [
        718.046,
        38.964
      ],
      [
        700.854,
        35.326
      ],
      [
        685.924,
        32.426
      ],
      [
        667.61,
        29.117
      ],
      [
        644.568,
        25.423
      ],
      [
        620.426,
        21.995
      ],
      [
        595.974,
        19.042
      ],
      [
        565.834,
        16.162
      ],
      [
        553.804,
        15.108
      ],
      [
        535.617,
        13.888
      ],
      [
        518.032,
        12.971
      ],
      [
        501.219,
        12.199
      ],
      [
        475.256,
        11.377
      ],
      [
        453.06,
        10.957
      ],
      [
        428.826,
        10.609
      ],
      [
        374.987,
        10.357
      ],
      [
        278.31,
        10.366
      ],
      [
        200.69,
        10.199
      ],
      [
        185.977,
        10.299
      ],
      [
        150.106,
        10.272
      ],
      [
        67.574,
        10.098
      ],
      [
        -129.975,
        10.098
      ],
      [
        -164.105,
        9.995
      ],
      [
        -220.507,
        10.069
      ],
      [
        -220.439,
        -15.828
      ],
      [
        -169.58,
        -15.9
      ],
      [
        -142.408,
        -15.795
      ],
      [
        -97.701,
        -15.85
      ],
      [
        -6.759,
        -15.808
      ],
      [
        82.654,
        -15.643
      ],
      [
        114.688,
        -15.51
      ],
      [
        136.554,
        -15.66
      ],
      [
        193.503,
        -15.354
      ],
      [
        210.879,
        -15.342
      ],
      [
        245.541,
        -15.557
      ],
      [
        395.216,
        -15.358
      ],
      [
        446.383,
        -15.016
      ],
      [
        470.908,
        -14.503
      ],
      [
        488.463,
        -14.04
      ],
      [
        511.01,
        -13.288
      ],
      [
        532.337,
        -12.218
      ]
    ]
  },
  {
    "id": "L0002.e8b483924d604f06a823a78d13e2e342",
    "function": "fietspad",
    "attributes": {
      "bgt_functie": "fietspad",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        741.986,
        45.53
      ],
      [
        763.789,
        51.305
      ],
      [
        762.568,
        56.014
      ],
      [
        747.766,
        52.27
      ],
      [
        732.147,
        48.473
      ],
      [
        719.134,
        45.531
      ],
      [
        706.576,
        42.84
      ],
      [
        690.465,
        39.618
      ],
      [
        676.86,
        37.044
      ],
      [
        660.908,
        34.342
      ],
      [
        644.818,
        31.735
      ],
      [
        631.995,
        29.847
      ],
      [
        617.882,
        27.923
      ],
      [
        603.645,
        26.163
      ],
      [
        587.594,
        24.387
      ],
      [
        563.791,
        22.189
      ],
      [
        554.161,
        21.441
      ],
      [
        534.48,
        20.149
      ],
      [
        501.794,
        18.538
      ],
      [
        467.9,
        17.518
      ],
      [
        454.402,
        17.235
      ],
      [
        424.118,
        16.94
      ],
      [
        393.667,
        16.75
      ],
      [
        242.68,
        16.669
      ],
      [
        209.148,
        16.523
      ],
      [
        166.077,
        16.585
      ],
      [
        126.114,
        16.489
      ],
      [
        96.337,
        16.539
      ],
      [
        -103.838,
        16.394
      ],
      [
        -192.491,
        16.242
      ],
      [
        -213.071,
        16.261
      ],
      [
        -220.526,
        16.389
      ],
      [
        -220.511,
        11.391
      ],
      [
        -203.711,
        11.214
      ],
      [
        -81.574,
        11.391
      ],
      [
        -52.014,
        11.331
      ],
      [
        -23.249,
        11.435
      ],
      [
        145.001,
        11.494
      ],
      [
        236.677,
        11.706
      ],
      [
        285.809,
        11.678
      ],
      [
        415.343,
        11.846
      ],
      [
        468.105,
        12.48
      ],
      [
        490.131,
        13.151
      ],
      [
        520.751,
        14.347
      ],
      [
        544.429,
        15.703
      ],
      [
        553.876,
        16.392
      ],
      [
        568.815,
        17.615
      ],
      [
        582.489,
        18.863
      ],
      [
        596.576,
        20.333
      ],
      [
        623.022,
        23.563
      ],
      [
        640.345,
        25.983
      ],
      [
        659.323,
        28.909
      ],
      [
        674.0,
        31.357
      ],
      [
        689.254,
        34.13
      ],
      [
        706.642,
        37.594
      ],
      [
        723.8,
        41.326
      ]
    ]
  },
  {
    "id": "L0002.5faef8c0badc4da08e8e48ddc6b2648a",
    "function": "rijbaan autosnelweg",
    "attributes": {
      "bgt_functie": "rijbaan autosnelweg",
      "bgt_fysiekvoorkomen": "gesloten verharding",
      "plus_fysiekvoorkomen": "asfalt"
    },
    "contour": [
      [
        763.789,
        51.305
      ],
      [
        741.986,
        45.53
      ],
      [
        723.8,
        41.326
      ],
      [
        706.642,
        37.594
      ],
      [
        689.254,
        34.13
      ],
      [
        674.0,
        31.357
      ],
      [
        659.323,
        28.909
      ],
      [
        640.345,
        25.983
      ],
      [
        623.022,
        23.563
      ],
      [
        596.576,
        20.333
      ],
      [
        582.489,
        18.863
      ],
      [
        568.815,
        17.615
      ],
      [
        553.876,
        16.392
      ],
      [
        544.429,
        15.703
      ],
      [
        520.751,
        14.347
      ],
      [
        504.67,
        13.671
      ],
      [
        468.105,
        12.48
      ],
      [
        415.343,
        11.846
      ],
      [
        285.809,
        11.678
      ],
      [
        236.677,
        11.706
      ],
      [
        145.001,
        11.494
      ],
      [
        -23.249,
        11.435
      ],
      [
        -52.014,
        11.331
      ],
      [
        -81.574,
        11.391
      ],
      [
        -203.711,
        11.214
      ],
      [
        -220.511,
        11.391
      ],
      [
        -220.507,
        10.069
      ],
      [
        -164.105,
        9.995
      ],
      [
        -129.975,
        10.098
      ],
      [
        67.574,
        10.098
      ],
      [
        150.106,
        10.272
      ],
      [
        185.977,
        10.299
      ],
      [
        200.69,
        10.199
      ],
      [
        278.31,
        10.366
      ],
      [
        374.987,
        10.357
      ],
      [
        428.826,
        10.609
      ],
      [
        453.06,
        10.957
      ],
      [
        475.256,
        11.377
      ],
      [
        501.219,
        12.199
      ],
      [
        518.032,
        12.971
      ],
      [
        535.617,
        13.888
      ],
      [
        553.804,
        15.108
      ],
      [
        565.834,
        16.162
      ],
      [
        595.974,
        19.042
      ],
      [
        620.426,
        21.995
      ],
      [
        644.568,
        25.423
      ],
      [
        667.61,
        29.117
      ],
      [
        685.924,
        32.426
      ],
      [
        700.854,
        35.326
      ],
      [
        718.046,
        38.964
      ],
      [
        731.159,
        41.876
      ],
      [
        745.024,
        45.176
      ],
      [
        764.25,
        49.528
      ]
    ]
  }
];

const BGT_PIERS=[
  {
    "id": "L0002.816a2171c6d648afad6708980cf5dbb5",
    "x": 765.3163638662043,
    "y": 39.93945411254491,
    "contour": [
      [
        770.786,
        24.722
      ],
      [
        762.559,
        56.446
      ],
      [
        765.889,
        57.37
      ],
      [
        765.551,
        58.433
      ],
      [
        761.965,
        57.644
      ],
      [
        758.965,
        56.727
      ],
      [
        767.844,
        22.446
      ],
      [
        773.701,
        23.948
      ],
      [
        774.477,
        24.042
      ],
      [
        774.105,
        25.553
      ]
    ]
  },
  {
    "id": "L0002.8f38a7d3cce84fb2922652b8228d37f3",
    "x": 127.51572342982949,
    "y": 2.3678972282839202e-11,
    "contour": [
      [
        127.53,
        -21.221
      ],
      [
        129.397,
        -20.695
      ],
      [
        130.096,
        -19.927
      ],
      [
        130.927,
        19.461
      ],
      [
        130.717,
        20.161
      ],
      [
        130.046,
        21.044
      ],
      [
        129.134,
        21.491
      ],
      [
        128.145,
        21.57
      ],
      [
        126.342,
        21.393
      ],
      [
        125.739,
        21.066
      ],
      [
        125.066,
        20.404
      ],
      [
        124.005,
        -20.023
      ],
      [
        124.567,
        -20.754
      ],
      [
        125.404,
        -21.227
      ]
    ]
  },
  {
    "id": "L0002.36765009aef0451396848da0435926f0",
    "x": -203.81827843021767,
    "y": 0.17194296158631356,
    "contour": [
      [
        -205.285,
        -20.694
      ],
      [
        -203.405,
        -20.896
      ],
      [
        -202.319,
        -20.678
      ],
      [
        -202.292,
        20.766
      ],
      [
        -204.29,
        20.955
      ],
      [
        -205.375,
        20.809
      ]
    ]
  },
  {
    "id": "L0002.7cc8b47aec044b6eb6741e40ccd31f37",
    "x": -219.55614075660912,
    "y": -1.1274887071685928,
    "contour": [
      [
        -222.438,
        -17.063
      ],
      [
        -217.959,
        -17.03
      ],
      [
        -218.845,
        17.328
      ],
      [
        -222.459,
        17.396
      ],
      [
        -222.432,
        16.851
      ],
      [
        -220.629,
        16.771
      ],
      [
        -220.532,
        -15.831
      ],
      [
        -222.444,
        -15.847
      ]
    ]
  },
  {
    "id": "L0002.adc9b84f834f4a7a8e69067be0dbbb5e",
    "x": -127.51572343001902,
    "y": 1.2909272325456508e-11,
    "contour": [
      [
        -130.737,
        -19.831
      ],
      [
        -129.993,
        -20.597
      ],
      [
        -129.024,
        -21.177
      ],
      [
        -128.02,
        -21.307
      ],
      [
        -126.239,
        -21.276
      ],
      [
        -125.21,
        -20.821
      ],
      [
        -124.647,
        -20.256
      ],
      [
        -124.087,
        -19.262
      ],
      [
        -124.249,
        18.809
      ],
      [
        -124.68,
        19.75
      ],
      [
        -125.699,
        20.809
      ],
      [
        -126.946,
        21.435
      ],
      [
        -128.294,
        21.574
      ],
      [
        -129.137,
        21.373
      ],
      [
        -130.209,
        20.769
      ],
      [
        -130.829,
        18.973
      ],
      [
        -130.939,
        15.878
      ]
    ]
  }
];

const x0=Math.min(...DECK.map(p=>p[0])),x1=Math.max(...DECK.map(p=>p[0]));
const xs=[...new Set([...stationsX(x0,x1,2),...DECK.map(p=>p[0]),...PROFILE.map(p=>p[0])])].filter(x=>x>=x0&&x<=x1).sort((a,b)=>a-b);
const road=x=>table(PROFILE,x,1)-GROUND_NAP,yc=x=>(table(PROFILE,x,2)+table(PROFILE,x,3))/2;
const plan=prism(DECK,BASE,100);
const slab=loftX(xs.map(x=>({x,section:[[-60,road(x)-.9],[80,road(x)-.9],[80,road(x)],[-60,road(x)]]}))).intersect(plan);
const mainBox=loftX(xs.filter(x=>x<213).map(x=>({x,section:[[-11,road(x)-3.1],[11,road(x)-3.1],[16.5,road(x)-.7],[-16.5,road(x)-.7]]}))).intersect(plan);
const approachBoxes=[-8,8].map(y=>loftX(xs.filter(x=>x>210).map(x=>({x,section:[[yc(x)+y-2.7,road(x)-3],[yc(x)+y+2.7,road(x)-3],[yc(x)+y+4,road(x)-.7],[yc(x)+y-4,road(x)-.7]]}))).intersect(plan));
// Zijkanten en scheiding fietspad/motorweg; middenberm van het wegdek behouden.
function kerb(side,inner=false,grow=0){return loftX(xs.map(x=>{const y=side<0?table(PROFILE,x,2)+.65:table(PROFILE,x,3)-.65;const c=inner?y-side*4.3:y;return{x,section:[[c-.45-grow,road(x)-.2-grow],[c+.45+grow,road(x)-.2-grow],[c+.45+grow,road(x)+.6+grow],[c-.45-grow,road(x)+.6+grow]]};})).intersect(plan);}
const kerbs=[-1,1].flatMap(s=>[kerb(s),kerb(s,true)]);
// BGT-pijlers bij pylonen en zuidelijke oever; noordelijke steunpunten uit
// regelmatige aanbrugvakken geschat, twee kolommen en een dekbrede oplegkop.
const piers=BGT_PIERS.map(q=>prism(q.contour,BASE,road(q.x)-.7));
const approachPierX=[211,281.5,352,422.5,493,563.5,634,704.5];
for(const x of approachPierX){const y=yc(x),z=road(x);piers.push(boxFromTo(x-1.6,x+1.6,y-13,y+13,z-4,z-.8));for(const dy of [-9,9])piers.push(boxFromTo(x-1.6,x+1.6,y+dy-1.5,y+dy+1.5,BASE,z-3.7));}
const pylons=[];const sails=[];const guards=[];let cableCount=0;
const pylonX=[-127.51572343,127.51572343],pylonY=18.3,tan=Math.tan(50*Math.PI/180),topNap=84;
for(const xp of pylonX)for(const side of [-1,1]){
 const y=side*pylonY,z=road(xp),zt=topNap-GROUND_NAP;
 pylons.push(Manifold.hull([[xp-2.7,y-2.2,z-.9],[xp+2.7,y-2.2,z-.9],[xp-2.7,y+2.2,z-.9],[xp+2.7,y+2.2,z-.9],[xp-1.57,y-1.57,zt],[xp+1.57,y-1.57,zt],[xp-1.57,y+1.57,zt],[xp+1.57,y+1.57,zt]]));
 pylons.push(boxFromTo(xp-2.7,xp+2.7,y-2.2,y+2.2,BASE,z));
 guards.push(boxFromTo(xp-2.72,xp+2.72,y-2.22,y+2.22,BASE,100));
 for(const dir of [-1,1]){
  const inner=(xp<0?dir===1:dir===-1),n=inner?16:14,maxD=inner?124:86;
  const X=d=>xp+dir*d,attach=80-GROUND_NAP;
  const floor=Math.min(...stationsX(0,maxD,2).map(d=>road(X(d))))-2;
  const plate=profileY([[X(0),floor],[X(maxD),floor],[X(maxD),road(X(maxD))+.4],[X(0),attach]],y-.45,y+.45);
  const holes=[],lines=[];
  for(let j=1;j<=n;j++){const d=maxD*j/n,za=attach-5*(1-j/n),zb=road(X(d))+.4;lines.push({d,f:t=>za+(zb-za)*t/d});}
  // Openingen passen tussen twee aangrenzende tuiribben; elke bovenzijde
  // blijft 50 graden, dus geen afgeknipte zwevende kabel onder een flauwe hoek.
  for(let k=0;k<lines.length;k++){
   const lo=lines[k],hi=lines[k+1],end=lo.d-1,start=4;
   const lower=t=>k===0?road(X(t))+1.3:lines[k-1].f(t)+1;
   const upper=t=>lo.f(t)-1;
   const sample=(a,b,f)=>Math.max(...Array.from({length:31},(_,j)=>f(a+(b-a)*j/30)));
   function fits(a,b){const zb=sample(a,a+b,lower);for(let j=0;j<=40;j++){const t=a+b*j/40;if(zb+tan*Math.min(t-a,a+b-t)>upper(t))return null;}return zb;}
   for(let a=start;a+2.2<end;){if(fits(a,2.2)===null){a+=.5;continue;}let l=2.2,h=end-a;for(let j=0;j<25;j++){const b=(l+h)/2;if(fits(a,b)===null)h=b;else l=b;}const b=Math.floor(l*20)/20,zb=fits(a,b);holes.push(profileY([[X(a),zb],[X(a+b),zb],[X(a+b/2),zb+tan*b/2]],y-.65,y+.65));a+=b+1;}
  }
  let panel=holes.length?plate.subtract(union(holes)):plate;
  const ribs=[];
  for(let j=1;j<=n;j++){const d=maxD*j/n,za=attach-5*(1-j/n),xb=X(d),zb=road(xb)+.4;
   // Verdikte rib op een draagvlak, geen loshangend draadje van .2 mm.
   const dx=xb-xp,dz=zb-za,len=Math.hypot(dx,dz),px=-dz/len*.48,pz=dx/len*.48;
   ribs.push(profileY([[xp-px,za-pz],[xb-px,zb-pz],[xb+px,zb+pz],[xp+px,za+pz]],y-.45,y+.45).intersect(plate));cableCount++;
  }
  sails.push(union([panel,...ribs]).intersect(plan));
  guards.push(boxFromTo(Math.min(xp,X(maxD))-.55,Math.max(xp,X(maxD))+.55,y-.57,y+.57,BASE,100));
 }
}
if(cableCount!==120)throw Error('aantal tuien');
const abutments=[boxFromTo(x0,x0+4,-60,80,BASE,road(x0)-.1).intersect(plan),boxFromTo(x1-5,x1,-60,80,BASE,road(x1)-.1).intersect(plan)];
const bridge=union([slab,mainBox,...approachBoxes,...kerbs,...piers,...pylons,...sails,...abutments]);
const strip=loftX(xs.map(x=>({x,section:[[-60,road(x)-.5],[80,road(x)-.5],[80,road(x)+1],[-60,road(x)+1]]}))).subtract(union([...[-1,1].flatMap(s=>[kerb(s,false,.02),kerb(s,true,.02)]),...guards]));
const groups=new Map();for(const q of BGT_ROADS){const key=JSON.stringify(q.attributes);if(!groups.has(key))groups.set(key,{attributes:q.attributes,polys:[],function:q.function});groups.get(key).polys.push(q.contour);}
const main=[...groups.values()].find(q=>q.function==='rijbaan autosnelweg');const cuts=[];let used=null;
for(const q of [...groups.values()].filter(q=>q!==main)){let zone=union(q.polys.map(p=>prism(p,BASE,100)));if(used)zone=zone.subtract(used);used=used?union([used,zone]):zone;cuts.push([q,strip.intersect(zone).intersect(bridge)]);}
cuts.unshift([main,(used?strip.subtract(used):strip).intersect(bridge)]);
const parts=[["building:martinus-nijhoffbrug",bridge.subtract(strip)]];for(const[q,m]of cuts)if(m.volume()>.01)parts.push(["road:"+(q.function==='fietspad'?'fietspad':'rijbaan')+'-'+q.attributes.plus_fysiekvoorkomen,m,q.attributes]);
// Printvoet onder het dek; van de onderzijde van de kokers, geen vrijhangende
// kokerbodem. Slechts in STL, gezamenlijke 3MF-opvulling blijft in building.
const screen=Math.max(.45,.4*scale/1000);
const foot=loftX(xs.map(x=>{const c=yc(x),w=(table(PROFILE,x,3)-table(PROFILE,x,2))/2+2,z=road(x)-3.1,low=z-tan*(w-screen),cut=low>BASE?screen:Math.max(screen,w-(z-BASE)/tan);return{x,section:[[c-cut,BASE],[c+cut,BASE],[c+cut,Math.max(BASE+.001,low)],[c+w,z],[c+w,road(x)-.3],[c-w,road(x)-.3],[c-w,z],[c-cut,Math.max(BASE+.001,low)]]};})).intersect(plan);
const printModel=union([bridge,foot]);const report={};
for(const[n,m]of [...parts,["whole",bridge],["print",printModel]]){if(m.status()!=="NoError"||m.volume()<=0)throw Error(n+' '+m.status());report[n]={triangles:m.numTri(),volumeM3:m.volume(),genus:m.genus(),bounds:m.boundingBox()};}
if(Math.abs(parts.reduce((v,[,m])=>v+m.volume(),0)-bridge.volume())>.05)throw Error('partitie');
for(let i=0;i<parts.length;i++)for(let j=i+1;j<parts.length;j++)if(parts[i][1].intersect(parts[j][1]).volume()>.02)throw Error('overlap');
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


await mkdir(outDir,{recursive:true});await writeFile(path.join(outDir,"martinus-nijhoffbrug.glb"),toGlb(parts,"NederPrint generate-martinus-nijhoffbrug.mjs"));
const stlName=`martinus-nijhoffbrug-1-${scale}.stl`;await writeFile(path.join(outDir,stlName),toStl(printModel.translate([0,0,-BASE]),"NederPrint Nijhoffbrug 1:"+scale).buffer);
const metadata={
  "name": "Martinus Nijhoffbrug",
  "file": "martinus-nijhoffbrug.glb",
  "unitsPerMetre": 1,
  "className": "building",
  "crs": "EPSG:28992",
  "origin": [
    146235.73278093402,
    425523.44653571636
  ],
  "xAxis": [
    -0.10906430011234479,
    0.9940346967993644
  ],
  "groundOffsetMetres": -0.1,
  "groundHeight": 47.5,
  "groundSamplePoints": [
    [
      -30,
      -35
    ],
    [
      30,
      -35
    ]
  ],
  "replacesBuildings": [],
  "replacesTerrain": [
    "L0002.52b681f147c5438a89dd464d42da993c"
  ],
  "description": "Vier betonnen pylonen tot NAP +84 m, 120 verdikte tuiribben op .9 m tuivlakken met 50 graden spitsopeningen, betonnen kokerdek met AHN-lengteprofiel en gebogen noordelijke aanbrug volgens BGT. Drie road-nodes met BGT-autosnelweg en twee soorten fietspad. Constructie van de wegdeklaag .5 m gescheiden inclusief guards voor volledige tuivlakken. Geschatte koker- en pijlerdetails, tuianchors en printaanpassingen. NAP minus 3.55 m.",
  "realWorld": {
    "lengthM": 996.82,
    "mainSpanM": 255.031,
    "pylonX": [
      -127.51572343,
      127.51572343
    ],
    "pylonYNapM": 18.3,
    "pylonTopNapM": 84,
    "cableCount": 120,
    "approachPierX": [
      211,
      281.5,
      352,
      422.5,
      493,
      563.5,
      634,
      704.5
    ]
  },
  "sources": [
    "https://bruggenstichting.nl/70-bruggen/bruggen-2003/bruggen-september-2003/540-martinus-nijhoffbrug",
    "https://www.cultureelerfgoed.nl/site/binaries/site-content/collections/documents/2006/01/01/bruggen-categoriaal-onderzoek-wederopbouw-1940-1965/bruggen.pdf",
    "https://commons.wikimedia.org/wiki/File:20140722_Martinus_Nijhoffbrug_02.jpg",
    "https://commons.wikimedia.org/wiki/File:Martinus_Nijhoffbrug_2016.jpg",
    "PDOK actuele BGT, AHN DSM/DTM .5 m, actuele luchtfoto"
  ]
};metadata.printFiles=[stlName];metadata.groundHeight=GROUND_HEIGHT;await writeFile(path.join(outDir,"martinus-nijhoffbrug.json"),JSON.stringify(metadata,null,2));console.log(JSON.stringify(report,null,2));