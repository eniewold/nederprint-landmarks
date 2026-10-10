# Oosterscheldekering (Zeeland) — sluitgat Schaar

Deelmodel van het volledige sluitgat Schaar, ten noorden van Neeltje Jans: zeventien pijlers, zestien schuiven, N57 en werkweg. Het model beslaat circa 914 m langs de kering; de andere sluitgaten en eilanden van de circa 9 km lange kering horen niet bij dit deelmodel. De losse bedieningshuisjes op de landhoofden blijven oorspronkelijke PDOK-panden.

## Bestanden en plaatsing

`node scripts/generate-oosterscheldekering.mjs` schrijft `oosterscheldekering.glb`, `oosterscheldekering.json` en `oosterscheldekering-1-1000.stl`. GLB is in meters en Y-up; STL in millimeters op 1:1000 en Z-up. De vaste broncontouren en AHN-toppen staan in de generator.

Het STL is één gesloten printdeel, `NoError`, **916,29 × 36,72 × 29,44 mm**, inclusief de grondplaat. De gezamenlijke printopvulling voegt circa 7.815 m³ op ware grootte toe, vooral onder de bordessen en dwarsbalken.

RD-oorsprong `[39393.582,407659.754]`, lokale +x langs de kering richting `[0.464607984,0.885516472]`; +y wijst naar zee. De grondreferentie wordt op drie waterpunten gemeten; de laagste PDOK-hoogte is 43,390022 m. De plaatselijke geometrie gebruikt NAP als verticaal datum, met de voeten tot NAP −1,2 m. Het N57-dek ligt op NAP +12,17 m en de werkweg op +5,85 m. De zeventien cilinderhoogten volgen afzonderlijk de AHN-toppen, van +19,40 tot +27,24 m.

## Onderdelen en schattingen

Opbouw uit betonnen voeten, twee pijlerbenen, schouders, dwarsbalken, bordessen, hydraulische cilinders, blinde nissen, zigzagtrappen en doorlopende dekvlakken. Iedere schuif heeft een vlakke voorplaat en een naar de zeezijde gebogen ruimtelijk vakwerk met gekruiste staven. Geen gestapelde hoogtecontouren. Details zijn gecontroleerd aan schuine foto's; de exacte pijlerkopvorm, onderkant van de dwarsbalk, bordes- en trapmaten, nisritme en cilinderdoorsnede zijn geschat. Vakwerkstaven zijn tot 0,95 m en bedieningsstangen tot 1 m verdikt voor 1:1000. Relingen, kabels, losse machines en opschriften zijn weggelaten.

De N57 heeft een permanente doorlopende 45°-onderbouw en de lage achterspanten hebben schuine voeten. Achter de vakwerken staat een gesloten gebogen kern; de driehoekige velden zijn circa 0,35 m diepe blinde nissen tussen de uitstekende staven. Deze printaanpassingen vullen een deel van de vrije ruimte onder het dek en in de schuiven; de herkenbare pijlerkoppen, cilinders en vakwerkribben blijven zichtbaar. Alle onderdelen worden samen opgevuld voor maximaal 45° overhang, met één grondplaat van 1 mm; geen losse steunen nodig. Het complete losse STL is langer dan een gangbaar printbed; gebruik matrixtegels voor het complete sluitgat.

De constructie en de twee afzonderlijke weg-nodes zijn onderling uitgesneden. De 0,5 m dikke N57-weglaag behoudt BGT `rijbaan autoweg` / `gesloten verharding`. De werkweg heeft een eigen laag van 0,5 m; `rijbaan lokale weg` / `gesloten verharding` is overgenomen van de aansluitende BGT-werkwegen, omdat het verhoogde middenstuk alleen als overbruggingsdeel is geregistreerd. Drie volledig bedekte verhoogde BGT-overbruggingsdelen worden vervangen; water, pijlervoeten en de twee BAG-bedieningshuisjes blijven staan.

## Controle

Vier aanzichten en detailaanzichten naast de oorspronkelijke PDOK-dekken en schuine foto's; kaartcontrole met landmarkschakelaar en rode N57-regel; volledige preview en matrixexport van een uitsnede van **1000 × 1000 m / mm** op **1:1000**, centrum RD `[39390,407650]`, hoogtefactor 1. Alle **25 tegels van 200 mm** zijn gesloten gesneden; de export omvat alle zeventien pijlers, zestien schuiven en beide landhoofden. De drie landmarkonderdelen hebben positief volume. Doorsneden op NAP +2, +6 en +9 m bevestigen langs het hele N57-dek één doorlopende wand van minstens 0,8 mm. Tests controleren vervanging van de drie dekvlakken, de zeventien toppen, zestien schuifplaten, BGT-attributen en verticale stralen over het dek op dubbele bovenvlakken.

[Kaartcontrole](http://localhost:3054/kaart/51.6458415/3.7168215/2600/1x1/0?matrix=1&printScale=1000&rules=r.f.rijbaan%20autoweg.10200): controleer het volledige sluitgat Schaar, de cilinders boven de pijlers, de schuifvakwerken aan de zeezijde en de aansluiting van de rode N57 op beide landhoofden.

## Bronnen

- PDOK BAG, BGT, luchtfoto `Actueel_ortho25`, AHN DSM/DTM 0,5 m, RD-bbox `[39150,407200,39680,408100]`. Posities en omtrekken uit BGT, afzonderlijke cilinderhoogten en dekpeilen uit AHN. Publieke geodata, CC0.
- [Rijkswaterstaat: conserveren schuiven](https://www.rijkswaterstaat.nl/water/projectenoverzicht/oosterscheldekering-conserveren-schuiven), [renovatie bewegingswerken](https://www.rijkswaterstaat.nl/water/projectenoverzicht/oosterscheldekering-renovatie-bewegingswerken): functie, onderhoudsweg en hydraulische bewegingswerken.
- Wikimedia Commons: [Oosterscheldekering-vrata.jpg](https://commons.wikimedia.org/wiki/File:Oosterscheldekering-vrata.jpg) en [Oosterscheldekering-pohled.jpg](https://commons.wikimedia.org/wiki/File:Oosterscheldekering-pohled.jpg), Vladimír Šiman, CC BY 3.0; [Oosterscheldekering 2016 1.JPG](https://commons.wikimedia.org/wiki/File:Oosterscheldekering_2016_1.JPG), Steven Lek, CC BY-SA 4.0; [Oosterschelde-Sperrwerk, Detail.jpg](https://commons.wikimedia.org/wiki/File:Oosterschelde-Sperrwerk,_Detail.jpg), Rolf Kranz, CC BY-SA 4.0; [Vrouwenpolder (NL), Oosterscheldekering -- 2022 -- 5025.jpg](https://commons.wikimedia.org/wiki/File:Vrouwenpolder_(NL),_Oosterscheldekering_--_2022_--_5025.jpg), Dietmar Rabich, CC BY-SA 4.0.
