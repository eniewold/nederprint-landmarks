# Ned. Hervormde Kerk Bunschoten-Spakenburg

De voormalige Sint-Catharinakerk is een laatgotische eenbeukige kerk met zware westtoren en lage aangebouwde vleugel. Koor en dwarspanden zijn volgens het rijksmonumentenregister in 1790 gesloopt; het model toont de huidige situatie. Het vervangt BAG-pand 0313100000188820.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0313100000188820): plattegrond, ligging, maaiveld NAP +0,842 m en scheepsnok NAP +18,731 m, gebaseerd op AHN5 2023.
- [AHN-hoogtekaart](https://service.pdok.nl/rws/ahn/wcs/v1_0): punt op de spits circa 38,57 m boven maaiveld. De PDOK-mesh kapt de spits af rond 27 m boven maaiveld.
- [Rijksmonumentenregister 11295](https://monumentenregister.cultureelerfgoed.nl/monumenten/11295): kerkgeschiedenis en inspringende toren met afgeschuinde hoeken. [Erfgoed Bunschoten](https://collecties.erfgoedbunschoten.nl/detail.php?id=4186013&volgnummer=0) dateert de bouw globaal 1475–1500; BAG vermeldt 1450.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Bunschoten): foto's van toren, schip, steunberen en aanbouw.

Schip, dakschild, aanbouw, vierkante torenvoet, afgeschuinde bovenbouw, traptoren, spits en steunberen zijn afzonderlijke gesloten bouwdelen. Omtrek, ligging en nok volgen BAG en AHN. De bovenbouw en spits zijn op AHN en foto's gereconstrueerd; vensters, galmgaten, traptoren en aanbouwdak zijn naar foto's geschat. De spitstop is tot 0,94 m verdikt voor schaal 1:1000; fijne balustrades, uurwerk en maaswerk zijn weggelaten.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, vervanging, plaatsing, verbinding, spitshoogte en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn met de PDOK-reconstructie en foto's vergeleken: schip, steunberen en aanbouw komen overeen; de torenspits en ingesnoerde torenbovenbouw zijn naar AHN en foto's vollediger weergegeven dan in PDOK. Naburig pand 0313100000187941 ligt 10,66 m weg zonder overlap; PDOK-dak NAP circa +6,30 m tegen AHN p95 +6,55 m. Pand 0313100000210045 ligt 16,23 m weg zonder overlap; PDOK circa +10,85 m tegen AHN +11,00 m.

Regenereren: `node scripts/generate-nedhervormde-kerk-bunschoten-spakenburg.mjs` vanuit de landmarks-repository.
