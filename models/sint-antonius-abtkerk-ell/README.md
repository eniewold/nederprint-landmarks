# Sint-Antonius Abtkerk (Ell)

Een vereenvoudigd, printbaar model van de driebeukige kerk met rond gesloten koor en de noordelijk aangebouwde toren met vierzijdig tentdak. De kerk is in 1912 gebouwd; na oorlogsschade zijn de toren en uitbreiding in 1953 herbouwd.

## Bestanden en plaatsing

- `sint-antonius-abtkerk-ell.glb`: model in meters voor de kaart.
- `sint-antonius-abtkerk-ell.json`: plaatsing en vervanging van BAG-pand `1640100000057008`.
- `sint-antonius-abtkerk-ell-1-100.stl` en `sint-antonius-abtkerk-ell-1-1000.stl`: gesloten printmodellen in millimeters, Z omhoog.
- Generator: `scripts/generate-sint-antonius-abtkerk-ell.mjs`.

De oorsprong is RD `[183449.27, 359033.52]` aan de westkant van de nok; de lokale X-as `[0.793, -0.608]` loopt richting het koor. Het maaiveld ligt rond NAP +29,6 m. Het model zakt 0,5 m in de ondergrond voor een aansluiting op het terrein.

## Vorm en aannames

Het schip, de lagere zijbeuken, het ronde koor met dak, de toren, de aanbouwen en ondiepe nissen zijn afzonderlijke bouwdelen met vlakke daken. De hoogtes en omtrek zijn afgeleid uit de 3D BAG en het AHN: het schip reikt ongeveer 16,3 m boven maaiveld en de afgeknotte torendakpunt circa 27,8 m. De AHN-piek is NAP +59,34 m en bevat vermoedelijk het dunne topornament; dakvlakpixels geven circa 26,8 m boven maaiveld. De maaiveldhoogte in de omgeving varieert. Afzonderlijke vensters, hun afmetingen, het ronde westvenster, de aanbouwen, de galmgaten en de kerktop zijn vereenvoudigd of op basis van foto's geschat. Klein beeldhouwwerk en het dunne kruis ontbreken op printschaal. De geometrie is één gesloten manifold en is ontworpen voor 1:1000 zonder extra steun.

## Controle en bronnen

Controlekaart: http://localhost:3000/kaart/51.21985/5.79462/200/1x1/0. Controleer de noordelijke toren, aansluiting op maaiveld en vervanging van het PDOK-pand.

- [3D BAG, pand 1640100000057008](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1640100000057008), dakvlakken en oriëntatie.
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), hoogtemeting DSM en DTM.
- [Gemeente Leudal, kerkenvisie](https://cuatro.sim-cdn.nl/leudal/uploads/rapportage-_kerkenvisie_gemeente_leudal.pdf), bouwgeschiedenis en gebouwomschrijving.
- [Wikimedia Commons, foto's](https://commons.wikimedia.org/wiki/Category:Sint-Antonius_Abtkerk_(Ell_(Limburg))), vorm en gevels.
