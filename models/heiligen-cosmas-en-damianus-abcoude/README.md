# Heiligen Cosmas en Damianus Abcoude

De driebeukige neogotische kruisbasiliek met westtoren en veelhoekige transepten is in 1887–1888 gebouwd naar ontwerp van Alfred Tepe. Het model vervangt BAG-pand 0305100000000811.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0305100000000811): ligging, omtrek en dakvlakken; maaiveld NAP −0,936 m en kerknok NAP +23,065 m (AHN5, 2023).
- [AHN-hoogtekaart](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoofdgebouw circa 24 m boven maaiveld en gemeten hoogste spitspunten circa 54 m boven maaiveld; PDOK-reconstructie kapt de spits zichtbaar af rond 40 m.
- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/6978) en [RCE-kerkbeschrijving](https://kennis.cultureelerfgoed.nl/index.php/Monumenten/6978): bouwgeschiedenis en kerkplattegrond.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Cosmas_en_Damianus,_Abcoude): schuine opnamen van toren, zuidgevel en transept.

De hoofd- en zijbeuken, veelhoekige transepten, koor en westtoren zijn uit gesloten bouwdelen en dakvlakken opgebouwd. De hoofdcontour en nokhoogte volgen BAG en AHN. De spitse toren is gereconstrueerd op basis van AHN en foto's, met verdikte top voor 1:1000. Vensterposities, nisdiepten, steunberen, de kleine traptoren en annexdaken zijn naar foto's en de reconstructie geschat en vereenvoudigd. Klein maaswerk, kruis en decoraties zijn weggelaten; dakvensters kleiner dan 0,9 m zijn niet gemodelleerd.

## Controle

De generator controleert een gesloten manifoldvolume met één component en genus 0. De gerichte test in `tests/landmark-models.test.ts` controleert catalogus, BAG-vervanging, plaatsing, geslotenheid, spitshoogte en volume en doorsneden bij 45-graden steungeneratie; deze slaagt voor 1:1000. Vier definitieve schuine aanzichten zijn naast PDOK en foto's bekeken: de kerk heeft een vollediger, op AHN en foto's gebaseerde spits, de transeptsluitingen zijn vereenvoudigd en de vensternissen zijn explicieter. Het dichtbijgelegen PDOK-pand 0305100000005762 is met zijn AHN-hoogte gecontroleerd; na een kleine begrenzingscorrectie is er geen overlap en circa 0,1 m afstand. Pand 0305100000000817 ligt circa 9,3 m weg en overlapt niet.

Regenereren: `node scripts/generate-heiligen-cosmas-en-damianus-abcoude.mjs` vanuit de landmarks-repository.
