# Montelbaanstoren — Amsterdam

Eigen reconstructie van monument 4025: ronde bakstenen verdedigingstoren, stenen achtkant, uurwerksverdieping en twee versmallende houten klokkengeledingen. RD-oorsprong [122206.3,487237.8], +X [0.97815,-0.20791] naar oostzuidoost; entree westzijde. GLB in meters, Y omhoog. Alleen BAG-pand 0363100012181906 wordt vervangen; de kade, brug en omliggende panden blijven PDOK.

AHN4 DSM/DTM 0,5 m (8 oktober 2026, bbox 122150,487180,122260,487290) geeft straatniveau circa NAP +2 m en hoogste gemeten dakpunt +43,5 m. De ronde romp heeft straal circa 5,05 m en reikt tot 12,6 m boven straat; het stenen achtkant tot 21,3 m. Uurwerkgeleding 21,65–25,55 m, onderste klokkengeleding 26,25–31,9 m, bovenste 33,95–38,2 m. De houten kap met bol reikt tot circa 41,5 m.

De dunne hoogste windwijzer ontbreekt in AHN. De totale hoogte is daarom uit de schuine foto's op **45 m** geschat. Beschrijvingen noemen **48 m**, zonder een sluitend meetpunt ten opzichte van het huidige straatniveau; die afwijking is niet opgelost en moet bij review worden nagekeken. Vensterritme, klokschijven, geledinghoogtes, koepelprofiel en windwijzer zijn eveneens vereenvoudigde schattingen. Klokwijzers, ornamenten en kleine hoekversieringen vervallen op 1:1000.

Model opgebouwd uit ronde en achtzijdige prisma's, afzonderlijke gevel- en klokkenbouwdelen, schuine dakvlakken en een doorlopend koepelprofiel; geen gestapelde DSM-hoogtelagen. Open klokkenkamers zijn gesloten volumes met 0,38 m diepe blinde boognissen. De omgang heeft een gesloten borstwering van 0,9 m dik, de windwijzer is minimaal 0,9 m dik. Vier uurwerkschijven overlappen het achtkant en vormen geen losse onderdelen. De voet loopt tot −1,8 m door; maaiveldbemonstering ligt aan de landzijde van de kade.

Genereren: `node scripts/generate-montelbaanstoren.mjs`. STL op 1:1000 in millimeters, Z omhoog: 11,5 × 11,5 × 46,8 mm; één gesloten volume, genus 0, 3492 driehoeken, Manifold NoError. De printvoorbereiding met 45° overhanggrens voegt minder dan 0,1% volume toe. De test controleert georeferentie, BAG-vervanging, voet, romp, versmallende bovenbouw en totale hoogte.

Controle: vier schuine aanzichten naast PDOK, twee schuine bronfoto's, bron-GLB via GLTFLoader, volledige preview/3MF op 1:1000 van RD [122165,487195,122245,487275], en [controlekaart](http://localhost:3001/kaart/52.37204/4.90563/350/1x1/0) met landmarkschakelaar. Alle 16 gecontroleerde voetvertices liggen minstens 1,8 m onder het plaatselijke PDOK-terrein; geen zwevende voet.

Bronnen:

- [RCE monument 4025](https://monumentenregister.cultureelerfgoed.nl/monumenten/4025), ronde onderbouw en achtzijdige houten opbouw.
- [Amsterdam Monumentenstad](https://www.amsterdam-monumentenstad.nl/database/grachtenboek_objecten.php?id=5391), historische beschrijving en genoemde hoogte van 48 m.
- [Schuin aanzicht uit 2024](https://commons.wikimedia.org/wiki/File:2024_Montelbaanstoren_gf99.jpg).
- [RCE aanzicht vanaf de brug](https://commons.wikimedia.org/wiki/File:Overzicht_ronde_bakstenen_toren_met_een_achtzijdige_houten_bovenbouw_en_bekroning,_gezien_vanaf_de_brug_-_Amsterdam_-_20408352_-_RCE.jpg).
- PDOK BAG WFS, AHN4 DSM/DTM en actuele orthoHR.
