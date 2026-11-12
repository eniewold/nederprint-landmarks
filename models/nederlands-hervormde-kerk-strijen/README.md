# Nederlands Hervormde Kerk Strijen (Cillaarshoek)

Zaalkerk van de Hervormde Gemeente Cillaarshoek, Keizersdijk 159; de monumentenbeschrijving dateert de kerk uit 1838, hoewel BAG als bouwjaar 1917 vermeldt. De pastorie is een afzonderlijk pand en maakt geen deel uit van dit model.

## Bronnen en afmetingen

- BAG/3DBAG pand 0617100000714864: plattegrond circa 21,8 × 8,4 m; RD-oorsprong 96997,5 / 420790,4, as [0,99974, -0,0228].
- AHN5 DSM 0,5 m: maaiveld circa NAP -0,43 m, nok circa 12,1 m boven maaiveld; dakruiter en spits samen circa 21,8 m. De fijne spits is op luchtfoto en AHN onzeker en daarom geschat.
- [Rijksmonument 26549](https://monumentenregister.cultureelerfgoed.nl/monumenten/26549) en [foto's van de vier gevels](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Cillaarshoek); de PDOK-reconstructie mist het bovenste gedeelte van de slanke spits.

## Model en print

Zadeldak uit dakvlakken, gesloten dakruiter met vlakke nissen en vereenvoudigde naald; vijf vensternissen per lange zijde en een afgeschuinde gevelrozet. Voor 1:1000 zijn kleine raamstijlen, de windvaan en balustrade weggelaten; breedte en posities van nissen, dakruiter en spits zijn geschat vanaf foto's. De gevelrozet is als ruit vereenvoudigd om zonder steun te printen. De top van de spits is 0,9 m breed en dus steviger dan in werkelijkheid.

Genereer met `node scripts/generate-nederlands-hervormde-kerk-strijen.mjs --scale 1000` en `--scale 100`. Het resultaat is één gesloten onderdeel, zonder grondplaat, met een ondersteek van 0,5 m voor aansluiting op terrein. De doorsneden en ondersteuningscontrole worden getest in `tests/landmark-models.test.ts` van de webshop.


Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
