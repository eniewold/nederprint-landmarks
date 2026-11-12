# OLV-ten-Hemelopnemingkerk Assen

Traditionalistische rooms-katholieke zaalkerk uit 1933–1934, ontworpen door J. van Dongen jr. en J.F.A. Göbel. De kerk is rijksmonument 468967 en vervangt in dit model BAG-pand 0106100000000530; de aanpalende parochievleugel maakt onderdeel uit van hetzelfde pand. Het op het bord genoemde bouwjaar 1900 is niet het werkelijke bouwjaar van deze kerk.

## Bronnen en maatvoering

- [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/468967): identiteit, bouwjaar, rechthoekig koor, zadeldaktoren en de bijgebouwen.
- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000000530): plattegrond, oriëntatie en kapvlakken. De AHN DSM 0,5 m levert de torennok op NAP +34,90 m. Een deel van het torenvenster heeft geen meetwaarden; de nok en het tegenoverliggende dakvlak zijn wel gemeten, en de symmetrische dakvorm is ondersteund door foto's en de monumentbeschrijving.
- [Commons](https://commons.wikimedia.org/wiki/Category:Dr._Nassaulaan_3b,_Assen): gevel en toren; [parochie](https://www.franciscus-parochie.nl/historie): geschiedenis.

De oorsprong is RD (233670, 556696); de lokale X-as (0,49685, −0,86784) loopt vanaf de toren naar het koor. Het gebruikte maaiveld ligt op NAP +11,012 m, de torennok op circa 23,9 m boven maaiveld. De onderkant ligt op −0,5 m voor aansluiting op het terrein; er is geen grondplaat.

## Interpretatie en print

Het lage platte achterdeel van de parochievleugel is op basis van de PDOK-reconstructie en 3D BAG toegevoegd. De dakvorm van de gekoppelde vleugel, de steunberen, galmgaten en raamafmetingen zijn benaderd op grond van de beschikbare data en foto's. Kleine glasroeden en het dunne kruis op de toren zijn weggelaten. Het model bestaat uit bouwdelen met dakvlakken en vormt één gesloten volume. De 1:1000-export meet circa 43,9 × 44,4 × 24,4 mm. De generator controleert geslotenheid na Float32-conversie en ondervlakken op printbaarheid zonder steun.

## Genereren

```sh
node scripts/generate-olv-ten-hemelopnemingkerk-assen.mjs --scale 1000 --components
node scripts/generate-olv-ten-hemelopnemingkerk-assen.mjs --scale 100
```

## Bestanden en controle

De map bevat de GLB, de catalogus-JSON en STL-bestanden op 1:100 en 1:1000. De vier aanzichten zijn vergeleken met de PDOK-gebouwreconstructie en de beschikbare gevelbeelden. De modeltest controleert catalogusplaatsing, één gesloten component, genus nul en overhangondersteuning. Positie, vervanging van het BAG-pand en maaiveldaansluiting worden op de kaart en in de preview beoordeeld.
