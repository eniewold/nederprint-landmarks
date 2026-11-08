# Hervormde kerk, Ressen

De kerk aan de Kerkenhofstraat heeft een romaans schip en een romaanse westtoren, een hoger gotisch koor met driezijdige sluiting en een kapel aan de zuidzijde. Elk dak bestaat uit afzonderlijke vlakken. De vensters, galmgaten en de westingang zijn als ondiepe nissen uitgevoerd. De toren staat in werkelijkheid enkele centimeters los van het schip; voor schaal 1:1000 is die voeg gesloten zodat het model één verbonden printbaar volume vormt.

## Bronnen en plaatsing

- [Mijn Gelderland: kerk en kosterij](https://mijngelderland.nl/inhoud/routes/ommetje-ressen/kerk-en-kosterij): bouwgeschiedenis en de onderlinge plaats van schip, koor, toren en kapel.
- [Archimon: Hervormde kerk Ressen](https://www.archimon.nl/gelderland/ressenherv.html): foto's van toren, koor, kapel en zijgevels.
- [3DBAG, pand 1705100000001213](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1705100000001213): contour en afzonderlijke dakvlakken; dit pand omvat kerk en toren.
- [AHN-WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0): DSM en DTM van 0,5 m. Het maaiveld aan de voet ligt rond +10,45 m NAP. Het DSM bevat op de torenspits geldige cellen tot +30,41 m NAP, zonder rastergat op de toren. De nok van het koor is over enkele meters gemeten op circa +20,1–20,3 m NAP. Een aaneengesloten deel van het noordelijke dakvlak van het koor ontbreekt; dit dakvlak is lineair tussen de gemeten nok en goot gereconstrueerd en aan de 3DBAG en foto's getoetst.

De RD-oorsprong is 188112, 433611; de X-as volgt de kerk naar het oosten. Het model meet circa 23,45 × 10,6 × 19,85 m inclusief ingegraven voet. De vorm en maten van steunberen, venster- en galmgaten, ingang en de verhoudingen van de torenspits zijn geschat uit het AHN en foto's. Klein metselreliëf, de windvaan en de echte smalle voeg tussen toren en schip zijn vereenvoudigd of weggelaten.

## Genereren en controleren

`node scripts/generate-hervormde-kerk-ressen.mjs` schrijft GLB, JSON en STL 1:1000; `--scale 100` maakt de losse STL 1:100. De geometrie is één verbonden gesloten component, genus 0. De plaatsing en ondersteuning op 1:1000 zijn getest; twee echte kaartuitsneden van 150 × 150 m met en zonder landmark zijn geëxporteerd. Vier richtingen zijn naast de PDOK-reconstructie en schuine foto's bekeken. Controleer op de kaart vooral de torenpositie, de vorm van het koor en de zuidkapel.
