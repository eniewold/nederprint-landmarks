# Sint-Lambertuskerk Vessem

Neogotische kerk van Hermanus Bekkers uit 1882, gebouwd tegen de oudere Kempense toren uit de 15e eeuw. Het model toont het hoge schip, lage zijbeuken, koor, sacristie en kapel, de toren met spits en steunberen, en verdiept aangebrachte spitsboogvensters.

- Kerk en toren vallen in BAG-pand `0770100000000880`; [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0770100000000880), [kerkgeschiedenis](https://www.openmonumentendag.nl/monument/lambertuskerk-vessem/), [monument 37240](https://monumentenregister.cultureelerfgoed.nl/monumenten/37240), [gevel- en koorfoto's](https://commons.wikimedia.org/wiki/Category:Sint-Lambertuskerk_(Vessem)).
- BAG-contour en AHN5 DSM/DTM 0,5 m via PDOK WCS bepalen positie en dakprofielen. Maaiveld NAP +25,26 m, nok schip circa NAP +40,9 m, top toren in AHN circa NAP +63,9 m. De 3D-BAG/PDOK-reconstructie mist de torenspits; die is met AHN en foto's gemodelleerd.
- Oorsprong RD (148196,8, 380903,4), X-as (0,881, 0,473); onderzijde 0,5 m onder maaiveld. De exacte spitsvorm, details van toren en koor, kleine aanbouwdaken en vensternissen zijn vereenvoudigd en geschat op basis van foto's; maaswerk ontbreekt voor printbaarheid.
- Generator: `node scripts/generate-sint-lambertuskerk-vessem.mjs --scale 1000` en `--scale 100`. De 1:1000-STL meet circa 31 × 15 × 40 mm, heeft één verbonden vlakke voet en is op printbaarheid zonder extra ondersteuning getoetst.
- Controle: http://localhost:3000/kaart/51.41726/5.28955/200/1x1/0
