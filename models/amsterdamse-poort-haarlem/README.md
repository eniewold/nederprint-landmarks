# Amsterdamse Poort — Haarlem

Eigen reconstructie van monument 19771. BAG-pand 0392100000036575 omvat de hoofdpoort, de twee overdekte weergangen en de voorpoort. RD-oorsprong [104559.6,488339.2], +X [0.965926,0.258819] wijst naar de veldzijde (oostnoordoost); stadszijde is −X. GLB in meters, Y omhoog. Alleen dit BAG-pand wordt vervangen; brug, water en omliggende bebouwing blijven PDOK.

AHN4 DSM/DTM 0,5 m (8 oktober 2026, bbox 104520,488290,104620,488390) geeft straatniveau circa NAP +1 m en hoogste punt +22,19 m. Het hoofdgebouw is circa 9,4 × 8,85 m. Zadeldak en westelijke trapgevel reiken tot circa 21,2 m boven straatniveau; de lage veldtorens tot circa 13,5 m. Hun ronde onderbouw gaat over in een achtkant. De hoge traptorens zijn over hun volle hoogte achtkant. De twee stadspinakels zitten aan de westgevel.

Alleen bouwdelen: gevelvolume, zadeldak, geëxtrudeerde trapgevel, torenprisma's, achtzijdige spitsen, weergangen en voorpoort. Geen gestapelde hoogtelagen. Bouwhoogtes en dakvormen zijn op AHN en actuele schuine foto's afgestemd; geledinghoogtes, vensters, pinakels en uurwerkschijf blijven schattingen. Baksteenfriezen, wapens, maaswerk en kleine ornamenten vervallen op 1:1000. Spitstoppen zijn verdikt tot 0,9 mm.

Beide doorgangen blijven open. Hun oorspronkelijk ronde gewelf is voor steunvrij printen vereenvoudigd tot een steil puntprofiel: breedte 3,5 m, aanzet 3,1 m, top 5,5 m, helling circa 54°. Hogere ontlastingsbogen zijn blind reliëf. Waterbogen onder de weergangen zijn blind om losse horizontale plafonds boven het water te vermijden. Alle voeten lopen tot −2 m door zodat de torens ook langs het water aansluiten op het ruwe PDOK-terrein.

Genereren: `node scripts/generate-amsterdamse-poort-haarlem.mjs`. STL op 1:1000 in millimeters, Z omhoog: circa 18,1 × 11,2 × 23,3 mm; één gesloten model, genus 1, 6298 driehoeken, Manifold NoError. De export met 45° printhoek voegt circa 0,1% volume toe. Test controleert beide torenparen, hoogte, vervanging en open boogdaken op dezelfde loopas.

Controle: vier aanzichten naast PDOK, actuele schuine foto's, bron-GLB via GLTFLoader, volledige preview/3MF op 1:1000 van RD [104520,488290,104620,488390], en [controlekaart](http://localhost:3001/kaart/52.38062/4.64646/350/1x1/0) met landmarkschakelaar. Onder alle 171 gecontroleerde voetvertices ligt de onderkant minstens 2 m in het PDOK-terrein.

Bronnen:

- [RCE monument 19771](https://monumentenregister.cultureelerfgoed.nl/monumenten/19771), bouwkundige beschrijving.
- [Schuin aanzicht veldzijde](https://commons.wikimedia.org/wiki/File:Amsterdamse_Poort_in_Haarlem_1.jpg).
- [Stadszijde](https://commons.wikimedia.org/wiki/File:Amsterdamse_Poort_2011_BS_Amsterdam_Netherlands_(2).jpg).
- PDOK BAG WFS, AHN4 DSM/DTM en actuele orthoHR.
