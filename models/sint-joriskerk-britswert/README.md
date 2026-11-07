# Sint Joriskerk Britswert

Twaalfde-eeuwse eenbeukige kerk met halfrond koor en een westtoren die in 1883 is vernieuwd (rijksmonument 8483). Het model bevat een zadeldak met ronde koorsluiting, vensternissen, zuidingang, drie torengeledingen en een achtzijdige ingesnoerde spits. De PDOK-reconstructie mist de spits. BAG-pand 0140100000169344 wordt vervangen.

## Bronnen en afmetingen

- [Stichting Alde Fryske Tsjerken](https://aldefrysketsjerken.nl/britswert): bouwgeschiedenis, toren en gevelindeling.
- [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0140100000169344): plattegrond en dakvorm; de torenspits ontbreekt in de reconstructie.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Joriskerk_(Britswert)): foto's uit verschillende richtingen, waaronder RCE 20043516, 20043518 en 20043520.
- AHN4 DSM/DTM via PDOK: maaiveld nabij de kerk ongeveer NAP +2,2 m; hoogste gemeten punt op de torenspits NAP +30,03 m. Binnen de contour zijn zeven van 783 halve-metercellen zonder waarde; die liggen bij de toren, waar naastgelegen metingen de top begrenzen.

Modeloorsprong RD (174399, 569522), lengteas 9° ten noorden van oost. De top van de spits is op 27,8 m boven het laagste maaiveld gemodelleerd; de gevelindeling, exacte spitscontour, portaal en torenlijsten zijn deels naar foto's geschat en vereenvoudigd. De kleine windvaan en dunne raamtraceringen zijn weggelaten. De halfcirkelvormige koorsluiting is met negen vlakken benaderd.

## Genereren en printen

`node scripts/generate-sint-joriskerk-britswert.mjs` genereert de GLB, JSON en een STL voor schaal 1:1000. Het model is één gesloten volume. De 45°-steuncontrole en doorsnedes zijn geslaagd; volledige uitsneden van 150 × 150 m zijn met en zonder landmark geëxporteerd en vier aanzichten zijn naast PDOK en referentiefoto's vergeleken. Controle-URL: http://localhost:3000/kaart/53.11213/5.67690/200/1x1/0.
