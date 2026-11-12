# Uffelter Kerk

De Uffelter Kerk aan de Schoolstraat is een bescheiden, recht gesloten zaalkerk met zadeldak en houten dakruiter. Het model vervangt BAG-pand 1701100000208026.

## Bronnen en metingen

- [BAG en 3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1701100000208026): rechthoekige grondvorm van circa 14,56 bij 7,51 m, maaiveld NAP +5,70 m en nok NAP +14,352 m; geen ontbrekende AHN4-cellen binnen het pand.
- [AHN4 DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): hoogste cel bij de dakruiter NAP +16,954 m.
- [Exterieurfoto](https://www.ghardeman.nl/fotos600p/uffeltesel.htm) en [geschiedenis van de kerkgemeente](https://uffelterkerk.nl/geschiedenis/): dakruiter en voor- en zijgevels.
- [Monumenten in Nederland: Drenthe](https://www.dbnl.org/tekst/sten009monu07_01/sten009monu07_01_0088.php): bouwjaar 1910 en de recht gesloten vorm.

## Model en schattingen

Schip en houten dakruiter zijn als gesloten bouwdelen gevormd; het geheel vormt één gesloten volume. De vierzijdige vergelijking met PDOK en een schuin exterieurbeeld bevestigt hoofdvorm en plaatsing; PDOK mist de dakruiter. Afmetingen van de dakruiter, ramen en deur zijn met de foto en AHN geschat. De openingen in de klokkenstoel zijn weggelaten voor een stevige print en de kleine kap wordt door een oplopende voet ondersteund. Met een driehoeksnormaalcontrole zijn op de 1:1000-STL geen overhangen steiler dan 45° boven het grondvlak gevonden.

- `prot-gem-uffelte.glb`: kaartmodel
- `prot-gem-uffelte.json`: catalogus en plaatsing
- `prot-gem-uffelte-1-100.stl`: printmodel 1:100
- `prot-gem-uffelte-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-prot-gem-uffelte.mjs`. Genereer beide printschalen met `--scale 1000` en `--scale 100`.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
