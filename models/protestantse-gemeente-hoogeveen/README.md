# Protestantse Gemeente Hoogeveen — Hoofdstraatkerk

De Hoofdstraatkerk uit 1904 is gemodelleerd als zaalkerk met zadeldak en twee dwarskappen, voorportaal, twee hoekpinakels en centrale dakruiter. De kerktoren is aangevuld op grond van foto's omdat de PDOK-reconstructie deze mist. Het model vervangt BAG-pand 0118100000129129 en heeft een grondinsteek van 0,3 m.

## Bronnen en maatvoering

- [Historie en foto's van de Hoofdstraatkerk](https://gereformeerdekerken.info/2017/08/26/de-hoofdstraatkerk-te-hoogeveen/)
- [3DBAG pandreconstructie](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0118100000129129) en PDOK 3D Basisvoorziening.
- [AHN hoogtegegevens](https://service.pdok.nl/rws/ahn/wcs/v1_0): maaiveld circa NAP +12,28 m, nok circa +34,45 m en hoogste gemeten spits circa +44,62 m.

De plaats en de helling van de dwarskappen, afmetingen van de pinakels, dakruiter en raamnissen zijn geschat op basis van reconstructie en foto's. Zeven aaneengesloten AHN-cellen naast de dakruiter ontbreken; de hoogte van de spits is afgeleid uit naburige geldige meetpunten. Het open klokkenhuis is voor de schaal als gesloten vorm weergegeven; dunne sierdetails en de windvaan zijn weggelaten.

## Export en controle

De generator `scripts/generate-protestantse-gemeente-hoogeveen.mjs` schrijft de GLB, catalogusmetadata en STL-bestanden voor 1:1000 en 1:100. De vormen zijn uit bouwdelen en dakvlakken opgebouwd en vormen één gesloten volume. De test controleert plaatsing, topologie en steunvrij printen bij 45 graden. De kaart is met en zonder landmarklaag en schuin bekeken; de volledige uitsnede is op 1:1000 zonder ondersteuning in de printpreview gecontroleerd. Kaartcontrole: http://localhost:3000/kaart/52.72457/6.47848/200/1x1/0.
