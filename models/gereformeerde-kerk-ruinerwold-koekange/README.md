# Gereformeerde Kerk Ruinerwold-Koekange (Berghuizen)

Kerk met wit gepleisterde kopgevel, aangebouwd ingangsportaal, zadeldak, dakruiter met open lantaarn en een dwarsvleugel met lage achterbouw. Het model omvat het BAG-pand 1690100000004885.

## Bronnen en maten

- [BAG/3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1690100000004885): grondvorm, maaiveld NAP +3,947 m en nok NAP +15,472 m. De AHN4-bron heeft geen ontbrekende cellen op het pand.
- [AHN4 DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0): nokken, circa +21,50 m NAP bij de top van de dakruiter en lage platte achterbouw circa +7,1 m NAP.
- [Exterieurfoto van de kerkgemeente](https://middelpuntberghuizen.nl/berghuizen-in-beeld/) en [informatiebord](https://middelpuntberghuizen.nl/wp-content/uploads/2021/07/informatiebord_kerk_berghuizen_lr_3-22.pdf): plaats en vorm van de dakruiter, het portaal en de vensters.
- [Gemeentelijk bestemmingsplan](https://acc.digitaleplannen.nl/1690/6CE08C43-AFAC-4AA6-BE8D-075AB361574F/t_NL.IMRO.1690.2023BP2008001-ON01.html): bouwjaar kerk 1875. Het in BAG vermelde jaar 1743 betreft vermoedelijk het historische orgel.

## Model en schattingen

De dakvlakken zijn als afzonderlijke bouwdelen gemodelleerd; het geheel is één gesloten volume. De dakruiter en lantaarn zijn op grond van foto en AHN vereenvoudigd tot gesloten, printbare delen met nissen; de opengewerkte lantaarn en balustrade ontbreken. Hoogtes en vlakken van de vleugel zijn op basis van AHN-steekproeven benaderd; vensters, ingangsdetails en spitsvorm zijn geschat op basis van de foto. De 0,9 m brede top is verdikt voor 1:1000.

De controle vanuit vier richtingen vergelijkt de export met de PDOK-reconstructie en een schuin exterieurbeeld. PDOK reconstrueert de dakruiter niet volledig; het model volgt daar AHN en foto.

- `gereformeerde-kerk-ruinerwold-koekange.glb`: kaartmodel
- `gereformeerde-kerk-ruinerwold-koekange.json`: catalogus en plaatsing
- `gereformeerde-kerk-ruinerwold-koekange-1-100.stl`: printmodel 1:100
- `gereformeerde-kerk-ruinerwold-koekange-1-1000.stl`: printmodel 1:1000

Bron: `scripts/generate-gereformeerde-kerk-ruinerwold-koekange.mjs`. De generator schrijft beide STL-bestandsnamen in de catalogus; draai met `--scale 1000` en `--scale 100` voor beide exports.

De kaart is in perspectief gecontroleerd en de preview bevat de volledige kerk op 1:1000 zonder ondersteuning.
