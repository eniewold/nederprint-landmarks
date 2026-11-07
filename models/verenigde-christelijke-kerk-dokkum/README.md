# Verenigde christelijke kerk, Dokkum

Neoclassicistische zaalkerk uit 1852 aan de Legeweg 14, rijksmonument 13153. Het model toont een zaalkerk met fronton, drie gevelvelden en een vierkante uurwerktoren met open klokkenkamer; het vervangt BAG-pand 0058100000212970. De klokkenkamer heeft omwille van 1:1000 vier 1 m brede hoekstijlen en spitse doorgangen in plaats van de dunnere stijlen en rondbogen van het origineel.

## Bronnen en maten

- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0058100000212970): BAG-contour, hoofdas en dakvlakken van de zaal en lagere achterbouw. Maaiveld NAP +1,699 m en hoofdnok ca. NAP +13,3 m.
- [AHN DSM 0,5 m](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste gemeten punt nabij het torentje NAP +23,91 m; in een 7,5 × 7,5 m raster rond dit punt zijn alle 225 cellen geldig. De dunne windvaan is weggelaten; de modeltop ligt op 20,4 m boven maaiveld (NAP +22,10 m).
- [Monumentenregister 13153](https://monumentenregister.cultureelerfgoed.nl/monumenten/13153), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Verenigde_christelijke_kerk,_Dokkum) en [Tsjerkepaad](https://www.tsjerkepaad.nl/overzicht-kerken/dokkum-ver-chr-gemeente): geschiedenis en voorgevel.

De oorsprong ligt op RD (195579,5; 593419), met de +X-as (0,989; -0,147) langs de zaal. De onderste 0,5 m reikt in de ondergrond. De gevelvelden, het vereenvoudigde uurwerk en de hoogte en proporties van de open klokkenkamer zijn uit foto's geschat; de zij- en achtergevels zijn slechts beperkt op foto's zichtbaar en de vensterverdeling daar is geschat. Windvaan, balustrade, opschriften en ornamenten zijn vanwege de schaal weggelaten. De belfry-openingen zijn aangepast naar spitse bogen om zonder steun te printen.

## Genereren en controleren

`node scripts/generate-verenigde-christelijke-kerk-dokkum.mjs` schrijft GLB, JSON en een STL op 1:1000. Het gebouw is één gesloten component met drie topologische openingen. De controle met 45° overhangopvulling gaf volumeverhouding 1,0 en gelijke doorsneden. Volledige 150 × 150 m-uitsneden zijn met en zonder landmark geëxporteerd; vier modelaanzichten zijn met PDOK en beschikbare schuine foto's vergeleken. PDOK geeft de karakteristieke open klokkenkamer niet weer.
