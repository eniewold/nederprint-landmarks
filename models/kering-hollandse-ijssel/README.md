# Stormvloedkering Hollandse IJssel — Krimpen aan den IJssel

Vier heftorens, twee geheven schuiven, het vaste vakwerk en de gebogen oostelijke oprit van de Algerabrug. De nabijgelegen losse bedieningsgebouwen en groene eilanden blijven PDOK-geometrie. Het model vervangt de twee BAG-panden van de oostelijke heftorens en de volledig bedekte BGT-brugvlakken; de westelijke torens ontbreken in de oorspronkelijke BAG-reconstructie.

## Bronnen en maatvoering

- [Rijkswaterstaat: Hollandsche IJsselkering](https://www.rijkswaterstaat.nl/water/waterbeheer/bescherming-tegen-het-water/waterkeringen/deltawerken/hollandsche-ijsselkering): vier torens van circa 45 m, twee schuiven en doorvaart.
- PDOK BAG, BGT, luchtfoto `Actueel_ortho25`, AHN DSM/DTM 0,5 m: RD-bbox `[99200,436660,99630,437020]`. Torenvoeten en wegcontouren volgen BGT; vier gemeten DSM-toppen liggen rond NAP +44,65 m. Brugdek volgt één doorgaand langsprofiel, van NAP +5,04 tot +10,08 m.
- RCE-foto's op Wikimedia Commons, alle Jan van Galen, CC BY-SA 4.0: [luchtfoto 20398120](https://commons.wikimedia.org/wiki/File:Vogelvluchtperspectief_van_de_stormvloedkering_in_de_Hollandse_IJssel_-_Krimpen_aan_den_IJssel_-_20398120_-_RCE.jpg), [noordelijke schuif 20398123](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_binnenzijde_van_de_noordelijke_stalen_stormvloedschuif_met_de_twee_betonnen_heftorens_-_Krimpen_aan_den_IJssel_-_20398123_-_RCE.jpg), [zuidelijke schuif 20398130](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_zuidelijke_stalen_stormvloedschuif_met_de_twee_betonnen_heftorens,_schutsluis_op_de_voorgrond_en_links_de_Algerabrug_-_Krimpen_aan_den_IJssel_-_20398130_-_RCE.jpg), [buitenzijde 20398132](https://commons.wikimedia.org/wiki/File:Overzicht_van_de_buitenzijde_van_de_zuidelijke_stalen_stormvloedschuif_met_de_betonnen_heftoren_-_Krimpen_aan_den_IJssel_-_20398132_-_RCE.jpg).

Oorsprong RD `[99433.62,436831.25]`; lokale +x langs de schuif, richting `[0.9395,-0.3425]`. Maaiveld wordt op het westelijke eiland bemonsterd: PDOK-hoogte 46,455861 m correspondeert met AHN NAP +2,863 m. De torentop staat daardoor op 88,233 m in het PDOK-stelsel, vrijwel gelijk aan de oorspronkelijke oostelijke torentoppen. Waterhoogte gebruiken als grondreferentie zou de constructie te hoog plaatsen.

## Model en schattingen

Opbouw uit torenvoeten, taps uitlopende schouders, machinekamers, dakvlakken, blinde raamnissen, bordessen, zigzagtrappen, schuifplaten, gebogen vakwerken en doorlopende dekvlakken. Geen gestapelde hoogtecontouren. Nissen zijn 0,35 m diep; bordessen hebben afgeschuinde onderzijden. Raamritme, trappen, kademuurdetails en balkdoorsneden zijn geschat uit de foto's; vakwerkstaven zijn tot 0,95–1,05 m verdikt. De laatste tien meter van de oostelijke dekhelling is lineair geëxtrapoleerd buiten de AHN-uitsnede. De zichtbare schuifplaat is 78 m tussen de geleidingen; de nominale doorvaart is circa 80 m. Kleine relingen, kabels en opschriften zijn weggelaten.

De vier afzonderlijke weg-nodes behouden `bgt_functie` en `bgt_fysiekvoorkomen`; drie vlakken horen bij de bascule en één bij de regionale weg. Materiaalvolumes zijn onderling uitgesneden. Brug- en schuifconstructie vormen één constructie-node. Kademuren zijn smalle randen; het oorspronkelijke groene eiland wordt niet opnieuw gemodelleerd.

## Print en controle

`node scripts/generate-kering-hollandse-ijssel.mjs` schrijft GLB, catalogus-JSON en STL. GLB is in meters en Y-up; STL is in millimeters op 1:1000. Het STL bevat dezelfde gecombineerde 45°-opvulling als de webshop en een grondplaat van 1 mm: één gesloten printdeel, `NoError`, circa **370,8 × 174,0 × 46,4 mm**. Geheven schuiven en brugdek krijgen permanente printopvulling; geen losse steunen nodig. Daarvoor is een printbed van ten minste 371 mm nodig, of matrixtegels in de webshop.

Controle uitgevoerd met vier aanzichten naast de PDOK-reconstructie en schuine RCE-foto's, landmarkschakelaar op de kaart, en een complete **400 × 400 m / mm** uitsnede op **1:1000**, centrum RD `[99490,436800]`, hoogtefactor 1 en 45° overhang. De 3MF-preview bevat alle vier torens, beide schuiven en de gehele oprit. De bestaande westelijke groene ondergrond blijft zichtbaar. Tests controleren BAG/BGT-vervanging, torentoppen, wegattributen en verticale stralen over het dek op dubbele bovenvlakken.

[Kaartcontrole](http://localhost:3052/kaart/51.91722/4.57917/600/1x1/0?rules=r.f.fietspad.10200): controleer de vier heftorens, de twee geheven schuiven en het rode fietspad op het beweegbare brugdeel.
