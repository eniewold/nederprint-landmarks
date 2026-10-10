# Ir. D.F. Woudagemaal — Lemmer

Machinehal met een doorlopend zadeldak, zes lagere dwarskappen en tuitgevels, het haaks geplaatste ketelhuis met verhoogde lichtkap en de taps toelopende schoorsteen. Het bestaande bezoekerscentrum, dienstwoningen, olietanks en inlaat-/uitlaatwerken blijven PDOK-geometrie.

## Bronnen en maten

- [Eigen architectuurbeschrijving](https://www.woudagemaal.nl/over-ons/ir-d-f-woudagemaal/architectuur): machinehal circa 62 × 15 m, ketelhuis circa 32 × 15 m, zes lagere dwarskappen, lichtkap en schoorsteen van circa 60 m.
- [Wouda's Wiki: gebouw](https://wiki.woudagemaal.nl/w/index.php/Ontwerp_en_inrichting_gebouw) en [schoorsteen](https://wiki.woudagemaal.nl/w/index.php?title=Schoorsteen).
- PDOK BAG, luchtfoto 0,25 m en AHN DSM/DTM 0,5 m, RD-bbox `[174650,539880,174800,540010]`. BAG `0082100000149207` voor beide hallen en `0082100000155861` voor de schoorsteen. De as volgt de gemeten nokrichting, niet een minimumrechthoek. De machinehalnok ligt op NAP +16,52 m; de dakhellingen zijn circa 0,607 m per meter. Dwarsnokhoogtes +14,37 / +15,56 / +14,37 m. Ketelhuisnok +14,37 m, lichtkap +16,22 m, schoorsteentop +61,27 m.
- Schuine Commons-foto's: [Woudagemaal-the-Netherlands.jpg](https://commons.wikimedia.org/wiki/File:Woudagemaal-the-Netherlands.jpg), CC BY-SA 3.0; [Ir. D.F. Woudagemaal 1.jpg](https://commons.wikimedia.org/wiki/File:Ir._D.F._Woudagemaal_1.jpg), Uberprutser, CC BY-SA 3.0 NL; [Woudagemaal sea side.JPG](https://commons.wikimedia.org/wiki/File:Woudagemaal_sea_side.JPG), Reboelje, CC BY-SA 3.0; [zijde stroomkanaal](https://commons.wikimedia.org/wiki/File:Woudagemaal_zijde_stroomkanaal.jpg), Ellywa, CC BY-SA 4.0.

## Model en schattingen

Oorsprong RD `[174730,539927]`, +X langs de machinehal naar het zuidoosten, +Y naar de noordoostzijde. Hoogten in de generator zijn NAP; de GLB trekt de lokale datum +2,55 m af. PDOK-maaiveld wordt op twee punten naast de machinehal bemonsterd, minimum 44,729549 m in het PDOK-stelsel. De lage schoorsteenvoet loopt door onder die datum.

Alle dakvlakken zijn prisma's en omhullende vlakken met kilgoten door vereniging. Gevelramen zijn ondiepe nissen, met brede lateien en entreeportalen. Vensterafmetingen, natuursteendetails en portaalvormen zijn geschat uit foto's. Het schoorsteenprofiel is geschat tussen de BAG-voet en AHN-top; de bovenste kroon en rookopening zijn vereenvoudigd. Kleine roeden, belettering, bliksemafleider en dakpannen zijn weggelaten. De bestaande sluiswerken worden niet dubbel gemodelleerd.

## Print en controle

`node scripts/generate-woudagemaal.mjs` schrijft de GLB (meters, Y-up), JSON en STL (millimeters, Z-up, 1:1000). De STL bevat dezelfde permanente 45°-opvulling als de webshop en een grondplaat van 1 mm: één gesloten deel, `NoError`, circa **92,87 × 39,04 × 61,02 mm**. Raamnissen en dakranden krijgen slechts kleine opvullingen; bij de machinehal bedraagt die circa 0,16% van het volume.

Controle uitgevoerd met vier volledige schuine aanzichten naast dezelfde PDOK-camera's en referentiefoto's, op de kaart en met een complete **200 × 200 m/mm** preview-export op **1:1000**. Alle drie modelonderdelen blijven gesloten en hebben positief volume in de export. De permanente test bewaakt de zes dwarsgevels, de lange hellende dakvlakken, lichtkap, schoorsteentop en beide vervangen BAG-panden. Model- en API-tests: 302 geslaagd.

[Kaartcontrole](http://localhost:3055/kaart/52.8465/5.6800/350/1x1/0): bekijk de zes dwarskappen, lichtkap, schoorsteenkroon en aansluiting op de oorspronkelijke sluiswerken.
