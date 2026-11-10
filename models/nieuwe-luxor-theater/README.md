# Nieuwe Luxor Theater, Rotterdam

Vereenvoudigd printbaar landmark van het Nieuwe Luxor Theater (Bolles+Wilson, 2001), Posthumalaan 1. De GLB gebruikt meters, Y omhoog, één gesloten node `building:theater`; de STL is op 1:1000. De catalogus plaatst de oorsprong op RD (93335, 435755), met lokale X naar oost en Y naar noord, en vervangt BAG-pand 0599100000702518. De referentiehoogte is NAP +3,366 m.

## Opbouw en bronnen

- De BAG-contour en de 3D-BAG-dakvlakken zijn gecontroleerd met de PDOK-ortho en AHN5 DSM (0,5 m). De zaal heeft een licht hellend vlak, de toneeltoren reikt tot NAP +39,92 m, en de lagere foyerdaken liggen op circa +22 tot +26,7 m. Dakvlakken zijn als polygonen en vlakvergelijkingen opgebouwd.
- De architect beschrijft de laadweg als deels inpandig en toont de gevels en het uitstekende vakwerk: [Bolles+Wilson](https://bolles-wilson.com/project/luxor-theatre/). Voor aanvullende beelden zie [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Luxor_Rotterdam_(2001)).
- [Archiweb](https://www.archiweb.cz/en/b/nieuwe-luxor-theater) toont de watergevel en het doorgaande vakwerk, naast de uitstekende brug.
- [3D BAG pand 0599100000702518](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0599100000702518): AHN5-opname 2022, LoD2.2 RMSE 0,44 m.

## Schattingen en vereenvoudigingen

De locatie, lengte en hoogte van de laadweg zijn op luchtfoto's en schuine foto's geschat. De dunne tralies zijn vergroot, het vakwerk langs de watergevel is als aangesloten reliëf vereenvoudigd en de onderzijde van de uitstekende brug is tot het maaiveld doorgezet; driehoekige openingen hebben een spitse top, zodat het deel zonder losse steun op 1:1000 kan worden geprint. De gevelvensters zijn ondiepe vereenvoudigde nissen met geschat ritme en plaats, geen precieze reproductie van het schrijnwerk. Letters, dunne hekken en details onder 0,9 m zijn weggelaten. De maat en plaatsing van de twee verhoogde dakinstallaties zijn vereenvoudigd uit de 3D BAG.

Generator: `scripts/generate-nieuwe-luxor-theater.mjs`. De beschikbare STL is een controleprint; de GLB is de bron voor de kaart en de export.
