# Hervormde Kerk Welsum

Een zaalkerk uit 1828–1830 met ingebouwde laatmiddeleeuwse toren, zadeldak tussen topgevels en een lagere consistorie aan de oostkant. Het kerkdak eindigt daar met een schild. De toren heeft geen naaldspits. Het model bestaat uit gesloten bouwdelen en dakvlakken; galmgaten, deuren en vensters zijn blinde nissen.

## Maten, plaatsing en print

- BAG-pand 1773100000002860; RD-oorsprong (203009, 483345), X-as (0,9915; −0,1301), maaiveld circa NAP +4,71 m.
- 3DBAG/AHN4: grondoppervlak circa 217,86 m², kerknok circa 10,96 m en torennok circa 15,52 m boven maaiveld.
- De positie, grootte en diepte van de gevelnissen, het uurwerk en de details bij de consistorie zijn uit foto's geschat en op printschaal vereenvoudigd.
- GLB in meters. STL op 1:1000, circa 25,7 × 8,8 × 16,0 mm; voet 0,5 m onder maaiveld. Generator controleert één gesloten volume en ondervlakken op 45 graden.

## Bronnen

- [Rijksmonument kerk 31450](https://monumentenregister.cultureelerfgoed.nl/monumenten/31450) en [toren 31451](https://monumentenregister.cultureelerfgoed.nl/monumenten/31451)
- [3DBAG, BAG en AHN4](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1773100000002860)
- [Foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Hervormde_kerk_(Welsum))
- [Geschiedenis van de kerkelijke gemeente](https://www.kerkwelsum.nl/historie/kerkgebouw)

## Controle en onzekerheid

Vergelijking vanuit vier richtingen met de PDOK-tegel en foto's toont het schip, de zadeldaktoren en lagere aanbouw; de foto vanaf oost laat het schild van het kerkdak zien. Fijne raamindeling, pinakels en windvaan zijn op 1:1000 weggelaten. De beelden van gevels en galmgaten zijn vereenvoudigd.

De directe buurpanden zijn lokaal tegen het AHN-DSM getoetst. Bij BAG 1773100010107492, circa 11 m zuidelijk, is er een grote afwijking; volgens BAG stamt dit pand uit 2025 en het 3DBAG-hoogtemodel gebruikt AHN4 uit 2022. Het DSM is dus ouder dan het pand, waardoor de afwijking geen grond biedt voor vervanging. Controleer de actuele omgeving op de kaart.

`node scripts/generate-hervormde-kerk-welsum.mjs --components` schrijft GLB, metadata en STL. De gerichte webshoptest controleert plaatsing, één verbonden volume en de ondersteuningsberekening.
