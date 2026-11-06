# Watertoren (Noordwijk)

Vereenvoudigd, gesloten model van de watertoren uit 1917 naar ontwerp van F.A. Warners. Het model toont de veelhoekige schacht op de duin, de aangebouwde traptoren, het uitzichtdek en het bolle koepeldak. De brede dakrand is voor de print op een schuine kraag gelegd; de uitzichtopeningen zijn blinde nissen onder de rand.

- `watertoren-noordwijk.glb`: één node `building:watertoren`, meters.
- `watertoren-noordwijk.json`: RD-plaatsing en vervanging van BAG-pand `0575100000024061`.
- `watertoren-noordwijk-1-1000.stl` en `watertoren-noordwijk-1-100.stl`: Z omhoog, millimeters. Genereren met `node scripts/generate-watertoren-noordwijk.mjs --scale 100` en daarna `--scale 1000`.

De oorsprong ligt op RD (90086,6; 473093,8); de X-as is -30° ten opzichte van RD-oost. De voetafdruk is afgeleid van BAG. BAG geeft maaiveld NAP +19,007 m; AHN DSM meet de koepeltop NAP +42,754 m zonder rastergat. De top ligt in het model 23,75 m boven maaiveld. Terreinsamples liggen direct rond de voet op de duin; de heuvel zelf wordt niet dubbel gemodelleerd. De onderkant van het model ligt 0,5 m onder maaiveld.

Geschat zijn de vorm van de traptorenkap, de precieze vensterindeling en de hoogte van de kijkopeningen. Die zijn voor de 1:1000-print verlaagd, gesloten en vereenvoudigd tot nissen; de vrij uitstekende dakrand is schuin ondersteund. Fijne raampartijen, sierlijsten en dakpanelen zijn weggelaten. De print meet 11,68 × 9,61 × 24,25 mm, is één volume met genus 0 en slaagt voor de 45°-steuncontrole. Volledige 150 × 150 m uitsneden zijn met en zonder landmark geëxporteerd en vier aanzichten zijn met PDOK en bronfoto's vergeleken; kijkhoeken zijn benaderend.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0575100000024061), [AHN DSM/DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0), [rijksmonument 511994](https://monumentenregister.cultureelerfgoed.nl/monumenten/511994), [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Watertower_Noordwijk).
