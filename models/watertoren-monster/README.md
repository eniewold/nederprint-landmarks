# Watertoren Monster

De watertoren van Monster is een ronde bakstenen toren uit 1886–1887 met een met hout beklede reservoirkop en een kegelvormige kap. Het model bevat het ketel- en machinegebouw dat met de toren hetzelfde BAG-pand vormt. Het is opgebouwd uit omwentelingsvormen, verbonden bouwdelen en schuine dakvlakken.

- `watertoren-monster.glb`: één gesloten node `building:watertoren`, in meters.
- `watertoren-monster.json`: plaatsing en vervanging van BAG-pand `1783100000004031`.
- `watertoren-monster-1-1000.stl`: Z omhoog, 18,2 × 29,0 × 38,5 mm.
- Generator: `node scripts/generate-watertoren-monster.mjs --components`.

De oorsprong ligt op RD (73723, 451465), X naar het oosten en Y naar het noorden. De onderkant ligt 0,5 m onder maaiveld; 3D BAG geeft maaiveld NAP +3,818 m, AHN-DSM de hoogste dakmeting NAP +42,258 m. Het model is 38,0 m boven maaiveld; de gepubliceerde hoogte is 37,8 m. De kegelkap volgt de gemeten glooiende hoogteverdeling van het dak.

De drie banden, verticale ribben, toegangs- en vensternissen, vier dakkapellen en de positie en dakvorm van de aangesloten gebouwen zijn naar BAG, AHN en foto’s vereenvoudigd en deels geschat. De fijne verticale bekleding, kleine luchtopeningen, detailleringen en de dunne topornamenten zijn voor 1:1000 weggelaten. Vensters zijn steunloze blinde nissen met schuine bovenzijde.

De generator controleert geslotenheid en uitkragingen. Het resultaat is één component met genus 0. Een 45°-steuncontrole geeft volumeverhouding 1,000006 en vrijwel identieke doorsneden; de export maakt een heel klein afzonderlijk steunobject. Volledige uitsneden van 150 × 150 m zijn met en zonder landmark geëxporteerd en vier aanzichten zijn naast PDOK en schuine foto's gelegd; fotohoeken zijn benaderend.

Bronnen: [Rijksmonumentenregister 525139](https://monumentenregister.cultureelerfgoed.nl/monumenten/525139), [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1783100000004031), [AHN-DSM/DTM](https://service.pdok.nl/rws/ahn/wcs/v1_0), [actuele luchtfoto en torenhoogte](https://www.raderadvies.nl/nieuws/drone-inspectie-378-meter-hoge-watertoren-monster/), [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Monster_watertoren.jpg), [Monumentaal Westland](https://www.monumentaalwestland.nl/monumenten/watertoren-monster/).
