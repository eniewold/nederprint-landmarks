# Lange Jaap (Den Helder)

`lange-jaap.glb`: meters, glTF Y omhoog; `lange-jaap.json`: catalogus;
`lange-jaap-1-1000.stl`: millimeters, Z omhoog, vlakke onderkant.
Reproduceer met `node scripts/generate-lange-jaap.mjs`.

Oorsprong RD **110593,90; 552253,30**, maaiveld NAP circa +0,8 m.
Lokale +X wijst zuid, −Y naar het westelijke toegangspad. Onderkant −0,5 m.
Vervangt BAG **0400100000024142**; samples op 6 m rond het torenhart.

Eén gesloten node: zestienzijdige conische romp, spitsboogdeur en acht
vensterrijen als blinde nissen, twee omgangen, lichtkuip en beglaasd
lichthuis met blinde paneelnissen, gebogen koepel en radar. De romp is één
omhullend vlak per zijde, geen stapel hoogteschijven. De schuine kragen
onder de omgangen vervangen de dunne consoles; parapetten zijn dichte
ringen van 0,9 m. De radarbalk is tot 0,9 m verbreed.

BAG bepaalt hart en voet; AHN bepaalt de lineaire versmalling, maaiveld
en top (NAP +65,40 m). Romp tot +54,55 m, kap tot +62,40 m en radar tot
+64,60 m boven maaiveld. Bronnen noemen 55/55,5 m voor de historische
toren en 63,45 m als totale hoogte; dit model volgt de gemeten AHN-top
inclusief radar. Hoogtes van de omgangen/lichtkuip, koepelprofiel,
venstermaten en -ritme, en radarvorm zijn uit foto's en het sparse AHN
geschat. Bouten, plaatnaden, interieur, dunne consoles, antennekabels,
tralies en omheining weggelaten. Er is geen aangebouwd BAG-pand.

Controle: NoError, één verbonden volume, 4008 driehoeken; 10,7 × 10,7 ×
65,1 mm op 1:1000. API- en plaatsingstest geslaagd. Volledige 80 × 80 m
uitsnede met PDOK-terrein naar preview en 3MF; printbare overhang 45°
geeft circa 0,1% extra volume. Vier schuine vergelijkingen met PDOK:
de taps toelopende romp, twee randen en kap vervangen de recht omhoog
getrokken PDOK-doos. Bron-GLB ook met GLTFLoader gecontroleerd.
Controlebeelden worden buiten de repository bewaard.

Bronnen (8 oktober 2026):

- PDOK BAG, AHN4 DSM/DTM 0,5 m, actuele orthoHR, bbox 110555,552210,110635,552290.
- [RCE monument 335626](https://monumentenregister.cultureelerfgoed.nl/monumenten/335626).
- [Nederlandse Vuurtoren Vereniging, beschrijving december 2021](https://heldersehistorischevereniging.nl/wp-content/uploads/2022/01/Beschrijving-en-waardering-vuurtoren-Lange-Jaap-1-december-2021.pdf).
- [Rijkswaterstaat, schuine foto](https://www.rijkswaterstaat.nl/nieuws/archief/2024/07/gietijzeren-vuurtorens-groot-onderhoud-succesvol-aanbesteed).
- [Zeilen, foto Ben Rutte](https://www.zeilen.nl/actueel/nieuws/hoogste-vuurtoren-van-nederland-staat-op-instorten), uitsluitend visuele referentie.

Eigen vereenvoudigde geometrie; bronfoto's niet meegeleverd.
