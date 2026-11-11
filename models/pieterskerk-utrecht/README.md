# Pieterskerk Utrecht

De romaanse Pieterskerk werd in 1048 ingewijd. De westtorens gingen na de storm van 1674 verloren; het model toont de bestaande basiliek, het dwarsschip, koor, zuidelijke zijkapel en de kleine vieringruiter. BAG-pand 0344100000023250 wordt vervangen.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0344100000023250): omtrek, ligging en AHN5-gegevens 2023; maaiveld NAP +4,128 m en nok NAP +26,858 m.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoofd- en dwarskap circa 22,7 m boven maaiveld en hoogste ruitermeting circa 29,3 m.
- [Gemeente Utrecht](https://erfgoed.utrecht.nl/verhalen/rondom-de-pieterskerk): geschiedenis van de kerk en verdwenen westtorens; [rijksmonumentenregister 18297](https://monumentenregister.cultureelerfgoed.nl/monumenten/18297).
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Pieterskerk,_Utrecht), waaronder RCE-opnamen van [koor](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_koor_oostzijde_-_Utrecht_-_20233663_-_RCE.jpg), [zuid-oostzijde](https://commons.wikimedia.org/wiki/File:Exterieur_overzicht_zuid-oost_zijde_-_Utrecht_-_20233662_-_RCE.jpg) en [noordgevel](https://commons.wikimedia.org/wiki/File:Exterieur_noordgevel_-_Utrecht_-_20233658_-_RCE.jpg).

Middenbeuk, lagere zijbeuken, dwarskap, koor en zijkapel zijn gesloten bouwdelen met rechte dakvlakken. De vieringruiter is aan de hand van foto's en AHN toegevoegd, maar de open klokkenstoel is vervangen door een 0,96 m brede dragende kern met vereenvoudigde koepel. Vorm en hoogte van de zijbeuken, zijkapel en dakruiter, evenals plaats en omvang van de vensters, zijn geschat; fijne raamverdelingen en windvaan zijn weggelaten. De ondiepe boognissen zijn voor steunvrije printbaarheid vereenvoudigd.

## Controle

De generator controleert één gesloten manifoldvolume zonder genus. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, verbinding, genus en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine modelaanzichten zijn naast de PDOK-reconstructie en foto's van de verschillende zijden bekeken; hoofdvolume, dwarsschip, koor en zijkapel komen overeen, met een sterker geschematiseerde vieringruiter. De begrenzing van het dwarsschip is gecorrigeerd tegen aangrenzend pand 0344100000034484; de afstand is circa 0,03 m en er is geen overlap. Pand 0344100000017847 grenst aan de lage noordvleugel zonder oppervlakte-overlap; lokaal AHN is bekeken.

Regenereren: `node scripts/generate-pieterskerk-utrecht.mjs` vanuit de landmarks-repository.
