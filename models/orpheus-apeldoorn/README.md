# Orpheus Apeldoorn

Een vereenvoudigd, gesloten model van het theatercomplex, met de westelijke zaal met gebogen kap, het toneelhuis, de oudere zaal en lagere foyers. Ondiepe nissen tonen het ritme van de glazen gevels.

## Meetstelsel en maten

- Oorsprong RD: `[193650, 470325]`; lokale X-as oost, Y-as noord; model Z=0 bij NAP +17,11 m (maaiveld uit 3D BAG). Maaiveldoffset −0,3 m, voet −0,7 m.
- BAG-pand `NL.IMBAG.Pand.0200100000700144`; de naastgelegen BAG-contour `0200100000961729` overlapt 182 m², circa 4% van dat pand, en is geen onderdeel van het model.
- Voetafdruk circa 124 × 96 m; hoogte circa 27,9 m boven modelmaaiveld. De gebogen kap reikt volgens de 3D BAG tot circa NAP +45,0 m, de oude zaal tot circa +29,8 m en het toneelhuis tot circa +39,9 m. De lage zuidvleugel ligt rond NAP +23,2 m.

## Bouw en vereenvoudiging

De contour komt uit de BAG, de platte bouwdelen en hoogtepeilen zijn afgeleid van AHN en 3D BAG; de westelijke kap volgt een uit de AHN-DSM per twee meter gemeten, met rechte raakvlakken vereenvoudigde doorsnede en is geëxtrudeerd. Glas is gesloten en door blinde nissen aangeduid. Glasverdeling, kapkromming tussen meetvlakken en diepte van de nissen zijn geschat uit foto en vereenvoudigd voor 1:1000. Belettering en dunne leuningen zijn weggelaten; binnendelen zijn opgevuld. De oude entreeluifel is conform de taakopdracht weggelaten. De buitentrap bij de zuidwestelijke kap is afgeleid uit luchtfoto en AHN (+19,6 tot +24,8 m NAP); de traptreden zijn voor 1:1000 vergroot naar circa 1,2 m en leuningen zijn weggelaten.

## Controle

Gerichte geometrie- en printbaarheidstest in `tests/landmark-models.test.ts`: gesloten volume, verbonden component, catalogusplaatsing en 45-graden steuncontrole. De kaart en een volledige uitsnede van 200 × 200 m zijn bekeken; createModelBundle heeft de preview en 3MF bij 1:1000 gemaakt. De actuele vierzijdige vergelijking met de PDOK-gebouwtegel en foto's toont de gebogen kap, gevelnissen en de zuidwestelijke trap; de fotohoeken zijn benaderd en de noordgevel is deels door bomen afgedekt. Een volledige 1:1000-3MF bevat geen afzonderlijk Orpheus-steunobject.

## Genereren

```sh
node scripts/generate-orpheus-apeldoorn.mjs
```

GLB in meters (glTF Y omhoog); STL in millimeters op 1:1000.

## Bronnen

- PDOK BAG-pand 0200100000700144, luchtfoto en AHN4 DSM 0,5 m, geraadpleegd 10 november 2026.
- [3D BAG LoD2.2 van het pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0200100000700144), TU Delft, CC BY 4.0.
- [Architectuur.org: Theater Orpheus](https://www.architectuur.org/bouwwerk/266/Theater_Orpheus.html), foto's van de oude gevel en westelijke zaal.
- [Wikimedia Commons: Schouwburg Orpheus](https://commons.wikimedia.org/wiki/Category:Schouwburg_Orpheus,_Apeldoorn).
- [Geschiedenis van het theater](https://www.orpheus.nl/geschiedenis-h34z).
- [Quadrat: Orpheus Apeldoorn](https://quadrat.nl/buitenruimte/orpheus-apeldoorn.html), foto van de buitentrap en stedenbouwkundige context.
- [IJsseling + Van der Werff: Theater Orpheus](https://www.ijsselingvanderwerff.com/0207OrA01.html), beelden van de westgevel.


