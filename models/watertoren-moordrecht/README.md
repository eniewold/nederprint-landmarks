# Watertoren (Moordrecht)

Vereenvoudigd, gesloten model van de vierkante watertoren uit 1924, ontworpen door P.D. Stuurman. Het model bestaat uit een schacht met twee rijen hoge vensternissen, een terugliggende reservoirgeleding, een kleinere klokgeleding en een lage westelijke aanbouw. De zichtbare wijzerplaat is weergegeven als blinde nis; fijne wijzers en baksteenpatronen zijn te klein voor schaal 1:1000.

- `watertoren-moordrecht.glb`: één node `building:watertoren` in meters.
- `watertoren-moordrecht.json`: plaatsing en vervanging van BAG-pand `1892100000640291`.
- `watertoren-moordrecht-1-1000.stl` en `watertoren-moordrecht-1-100.stl`: Z omhoog, millimeters. Genereer met `node scripts/generate-watertoren-moordrecht.mjs --scale 100` en daarna `--scale 1000`.

De oorsprong ligt op RD (105697,02; 443998,31), de X-as wijst oost. Het gebouw volgt de vierkante BAG-voetafdruk van ongeveer 10,6 × 10,6 m; de lage aanbouw op de westkant hoort bij hetzelfde BAG-pand. Het maaiveld is volgens 3D BAG NAP +4,018 m. AHN DSM meet top NAP +37,82 m, met een dichtgemeten dakvlak; het model is 33,0 m boven maaiveld, overeenkomstig de genoemde hoogte. De onderkant ligt 0,5 m onder maaiveld; het model vormt één volume met genus 0.

Geschat en vereenvoudigd zijn de maten en verdeling van vensternissen, klokvlakken, de deurnis, de reservoirlijst en de westelijke aanbouw. Slanke baksteenversieringen, wijzers en een eventuele externe noodtrap zijn weggelaten omdat zij op schaal 1:1000 te fijn zijn. De 1:1000-print meet circa 14,4 × 10,6 × 33,5 mm. De plaatsings- en 45°-steuncontrole zijn geslaagd; volledige uitsneden van 150 × 150 m met en zonder landmark zijn geëxporteerd. Vier renders zijn met PDOK en schuine foto's vergeleken; de fotohoeken zijn benaderend.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1892100000640291), [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonument 511045](https://monumentenregister.cultureelerfgoed.nl/monumenten/511045), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Watertoren_(Moordrecht)).
