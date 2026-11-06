# Sint-Martinusbasiliek (Venlo)

Het model omvat de driebeukige hallenkerk met drie langskappen en koorsluitingen, dwarsschip, noordelijke kapellen, sacristie, dakruiter en de naoorlogse toren. Het is opgebouwd uit dakvlakken en verbonden bouwdelen; nissen geven het gevelreliëf aan.

- `sint-martinusbasiliek-venlo.glb`: één gesloten node `building:kerk`, meters.
- `sint-martinusbasiliek-venlo.json`: RD-plaatsing en vervanging van BAG-pand `0983100000005649`.
- `sint-martinusbasiliek-venlo-1-1000.stl`: losse print, millimeters, Z omhoog, circa 66 × 46 × 63,5 mm.
- Genereer met `node scripts/generate-sint-martinusbasiliek-venlo.mjs --components`.

De oorsprong ligt op RD (209630, 376040), de X-as [0,983, -0,184] volgt de kerk naar het oosten; de onderkant ligt 0,5 m onder maaiveld. 3D BAG geeft NAP +19,071 m als maaiveld en de hoofdnokken circa NAP +45,5 m. Het AHN DSM meet maximaal NAP +81,94 m boven de toren, inclusief kleine bekroning; het model gebruikt circa 63 m boven maaiveld. De oude neogotische toren is in 1945 ingestort. De huidige vierkante toren werd in 1951–1953 gebouwd.

De hoogten en exacte vormen van de koorsluitingen, kapellen, steunberen, vensternissen, torenlantaarn, sacristie en vieringruiter zijn op grond van 3D BAG en foto's geschat en voor 1:1000 vereenvoudigd. Open galmgaten en lantaarns zijn blinde nissen, kleine details en ornamenten zijn weggelaten. De zichtbare dakvlakken volgen de gemeten nokrichting; AHN heeft plaatselijk gaten op steile daken.

De generator controleert de geslotenheid, Float32-rondgang en neerwaartse vlakken. Eén aaneengesloten volume, genus 0. Een printcontrole met 45° overhang vergelijkt volumes en doorsneden. Uitsneden van 150 × 150 m zijn met en zonder landmark geëxporteerd, waarna vier aanzichten naast PDOK en foto's zijn gelegd.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0983100000005649), [PDOK AHN](https://service.pdok.nl/rws/ahn/wcs/v1_0), [kerkgeschiedenis en toren](https://www.kerkgebouwen-in-limburg.nl/kerken/venlo/martinus-basiliek), [Open Monumentendag](https://www.openmonumentendag.nl/monument/sint-martinus-basiliek/), [foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Martinusbasiliek_(Venlo)).
