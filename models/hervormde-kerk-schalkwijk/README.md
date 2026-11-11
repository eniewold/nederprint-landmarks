# Hervormde kerk Schalkwijk

De Brinkkerk bestaat uit een oude westtoren, een later herbouwd lager schip en een koorsluiting. Het model vervangt BAG-pand 0321100000002002.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0321100000002002): BAG-contour, ligging en AHN5-maten 2023; maaiveld NAP +2,601 m en scheepsnok NAP +12,950 m.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste punt van de torenspits circa 33,11 m boven maaiveld. De PDOK-mesh kapt de spits af rond 21 m boven maaiveld.
- [Rijksmonumentenregister 22687](https://monumentenregister.cultureelerfgoed.nl/monumenten/22687): romaanse torenonderbouw en laatgotisch bovendeel; [VVV Kromme Rijnstreek](https://www.vvvkrommerijnstreek.nl/nl/locaties/1051177414/nh-kerk-schalkwijk) vermeldt de bewaard gebleven toren bij herbouw van het schip.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk,_Schalkwijk): schuine foto's van toren, schip en koor.

Schip, koor, torenschacht en spits zijn gesloten bouwdelen met rechte dakvlakken. De hoofdcontour volgt BAG, de dak- en spitshoogten volgen AHN; vensters, galmgaten, koordak en de dikte van de torenspits zijn geschat naar foto's en PDOK. De spits is tot 0,94 m afgevlakt voor 1:1000. Raamverdelingen, klokwijzers en windvaan zijn weggelaten.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, verbinding, genus en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn met PDOK en foto's van de verschillende gevels vergeleken: de lage schip- en koorkappen komen overeen, de spitstoren is naar AHN en foto's hersteld. Buurpand 0321100000000313 ligt 8,95 m weg zonder overlap; de lokale AHN-waarden zijn door bomen beïnvloed en ongeschikt als precieze dakhoogtecontrole.

Regenereren: `node scripts/generate-hervormde-kerk-schalkwijk.mjs` vanuit de landmarks-repository.
