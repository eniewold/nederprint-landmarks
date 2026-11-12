# Voormalige Doopsgezinde kerk, Assen

Vereenvoudigd landmark van de voormalige doopsgezinde kerk aan de Oranjestraat 13. De kerk bestaat uit een zaal met afgeknot schilddak, uitspringende entree, twee hoekvolumes met tentdaken en een latere lagere achterbouw. Volgens de [beschrijving van de monumentencommissie](https://www.assenstad.nl/woningen/5691-te-koop-in-assen-beeldbepalend-kerk-gebouw) is de kerk gebouwd in 1909 en een gemeentelijk monument; dit wijkt af van de oorspronkelijke taakgegevens.

## Bronnen en plaatsing

- [3D BAG: pand 0106100000001577](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0106100000001577) voor de omtrek en dakvlakken; dit BAG-pand wordt vervangen.
- AHN5-DSM op 0,5 m via PDOK WCS voor het dak en hoogte: rondom circa NAP +9,8 m, dakplateau circa +17,6 m en hoogste gemeten punt circa +19,4 m. Alle 1.034 cellen binnen de BAG-contour zijn geldig.
- [Assen Stad](https://www.assenstad.nl/woningen/5691-te-koop-in-assen-beeldbepalend-kerk-gebouw) voor gevel, bouwgeschiedenis en dakvormen.
- Oorsprong RD (234233, 557040,7); lokale +X loopt bijna oostwaarts en +Y naar de achterzijde. Onderkant ligt op −0,5 m onder lokaal maaiveld.

## Aannames en print

De uitspringende entree, de tentdaken en de blinde nissen zijn naar foto's vereenvoudigd. Aantal en plaats van zijramen zijn geschat; raamdetails, pirons en gevelreliëf kleiner dan 0,9 m zijn weggelaten. De deuropening en vensters zijn blinde nissen, met voldoende brede en spitse bovenzijde voor 1:1000. Afmetingen zijn in meters op ware grootte; de binaire STL-bestanden zijn in millimeters op 1:1000 en 1:100.

`node scripts/generate-doopsgezinde-kerk-voormalig-assen.mjs --components` schrijft GLB, JSON en STL en controleert de manifoldstatus, overhang en Float32-rondgang.

## Bestanden en controle

- `doopsgezinde-kerk-voormalig-assen.glb` en `.json`: catalogusmodel en plaatsing.
- `doopsgezinde-kerk-voormalig-assen-1-1000.stl` en `doopsgezinde-kerk-voormalig-assen-1-100.stl`: losse printmodellen op 1:1000 en 1:100.
- Het model is op vier zijden vergeleken met de PDOK-reconstructie; een bruikbare buitenfoto is alleen van de voorzijde gevonden. Plaats en aantal van de zijvensters blijven daarom geschat. De gerichte test controleert catalogusplaatsing, geslotenheid en 45-gradenondersteuning.
