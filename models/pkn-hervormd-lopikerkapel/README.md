# PKN Hervormd Lopikerkapel

De Lopiker- of Jaarsvelderkapel is een eenbeukige, gepleisterde kerk met hoger vijfzijdig koor, zijportaal en kleine westelijke dakruiter. De kern dateert volgens het rijksmonumentenregister uit de 15e eeuw. Het model vervangt BAG-pand 0331100000259104.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0331100000259104): omtrek en ligging, maaiveld NAP +1,966 m en dakhoogten op basis van AHN5 2023.
- [AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0): schipnok ongeveer 12 m boven maaiveld, koornok circa 12,8 m en hoogste ruitermeting circa 16,47 m; de spits is in het model op 17,3 m geschat.
- [Rijksmonumentenregister 26263](https://monumentenregister.cultureelerfgoed.nl/monumenten/26263) en [plaatselijke kerkgeschiedenis](https://hervormdlopikerkapel.nl/geschiedenis/): datering, kerk en bouwgeschiedenis.
- [Foto oostzijde](https://commons.wikimedia.org/wiki/File:LOPIKERKAPEL_HERVORMDE_KERK_01.jpg) en [foto westzijde](https://commons.wikimedia.org/wiki/File:LOPIKERKAPEL_HERVORMDE_KERK_02.jpg), aangevuld met [RCE-opname](https://commons.wikimedia.org/wiki/File:Exterieur_naar_het_noord-westen_-_Lopikerkapel_-_20142517_-_RCE.jpg).

Schip, hoger koor, portaal, dakruiter en steunberen zijn gesloten bouwdelen met hellende dakvlakken. Ligging en hoofdcontour volgen BAG en AHN; vensters, steunberen, dakruiter en portaal zijn naar foto's en PDOK geschat. De spitstop is tot 0,94 m afgevlakt voor 1:1000; klok, uurwerk, weerhaan en fijn raamwerk zijn weggelaten. Ramen zijn ingesneden spitsboognissen.

## Controle

De generator controleert één gesloten manifoldvolume; een onbedoelde tunnel bij het portaal is verholpen en de definitieve mesh heeft genus 0. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, verbinding, genus en extra volume en doorsneden na 45-graden steungeneratie en slaagt voor 1:1000. Vier definitieve schuine modelaanzichten zijn naast PDOK en foto's van de verschillende gevels bekeken: schip, verhoogd koor, vijfzijdige sluiting en portaal komen overeen; dakruiter en vensternissen zijn op foto en AHN gebaseerd. Buurpanden 0331100000252113 op 4,52 m, 0331100000273023 op 6,07 m en 0331100000258774 op 6,77 m overlappen niet; hun plaatselijke AHN-waarden zijn gecontroleerd.

Regenereren: `node scripts/generate-pkn-hervormd-lopikerkapel.mjs` vanuit de landmarks-repository.
