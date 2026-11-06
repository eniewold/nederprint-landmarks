# Martinikerk Groningen

Dit model omvat het kerkgebouw van de Martinikerk en sluit aan op de afzonderlijk bestaande Martinitoren. De laatgotische hallenkerk heeft vijf dwarskappen met puntgevels, een hoger koor met veelhoekige sluiting en kooromgang, een noorderkapel en een zuidportaal. Het model is opgebouwd uit dakvlakken en bouwdelen.

## Plaatsing en maten

- Vervangt uitsluitend BAG-pand `0014100010953153`. Torenpand `0014100010924795` blijft onder het bestaande model `martinitoren` vallen.
- De oorsprong RD (233884,04, 582065,19), lokale X-as (0,94409, 0,32969), meetpunten voor het maaiveld en terrein-offset −0,3 m zijn gelijk aan die van de Martinitoren. De kerk begint bij lokale X +7,4 m en overlapt daarmee beperkt met de torenvoet voor een aaneengesloten aansluiting.
- 3D BAG LoD2.2 geeft de plattegrond, ligging en vormen van de vijf dwarsdaken en het koor. AHN DSM meet op de koornok NAP +41,0 tot +41,2 m; op dwarskappen circa NAP +29,7 tot +30,5 m. AHN DTM meet op de drie gekozen vrije punten bij de toren NAP +6,73 tot +6,81 m. De gekozen nokhoogten zijn circa 24 m voor de dwarsdaken en 34,5 m voor het koor boven het maaiveld van de toren.
- Afmetingen en details van steunberen, portaal, gevelopeningen, kapel, kooromgang en de precieze aansluiting op de toren zijn geschat met behulp van de dakvlakken en foto's. Vensters zijn ondiepe nissen; maaswerk en kleine versieringen zijn weggelaten.

## Bronnen

- [3D BAG, pand 0014100010953153](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0014100010953153).
- [AHN DSM/DTM via PDOK WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), 0,5 m.
- [Rijksmonumentenregister 18555](https://monumentenregister.cultureelerfgoed.nl/monumenten/18555).
- [Martinikerk in beeld, Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Martinikerk_(Groningen)).
- Bestaande catalogusbron `martinitoren` voor de aansluiting en terreininstellingen.

## Genereren en controle

`node scripts/generate-martinikerk-groningen.mjs --components` maakt de GLB, metadata en STL op schaal 1:1000. Het kerkmodel meet circa 81,2 × 43,1 × 35 mm op die schaal en vormt één gesloten onderdeel. De generator controleert de overhang; de 45°-controle met `supportedSolid` geeft geen relevante volumetoename. Een proefuitsnede van 150 × 150 m met de kerk en toren is met en zonder landmarkmodellen geëxporteerd.
