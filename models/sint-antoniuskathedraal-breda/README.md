# Sint-Antoniuskathedraal (Breda)

Neoclassicistische hallenkerk met monumentale voorgevel, vierkante klokgeleding en vereenvoudigde achtkantige lantaarn. Het model bestaat uit verbonden bouwdelen en schuine dakvlakken.

- GLB en JSON: catalogusmodel met node `building:kathedraal`, vervangt BAG-pand 0758100000050778.
- STL: zelfstandig model op 1:1000, circa 55,2 × 26,3 × 48,8 mm.
- Genereren: `node scripts/generate-sint-antoniuskathedraal-breda.mjs --components`.

Oorsprong RD (112730,75, 400032,25), X-as (0,54, -0,841665) langs het schip; onderzijde 0,5 m onder maaiveld. 3D BAG geeft maaiveld NAP +3,16 m en nok NAP +28,22 m; AHN DSM meet de toren tot NAP +51,62 m. De hoogten van de kerk, lantaarn en toren zijn op deze gegevens gebaseerd. Het BAG-pand omvat ook de lage achterbouw, die is mee gemodelleerd.

De vier voorgevelzuilen zijn 1,44 m breed en ruim 0,9 m naar voren gebracht; de zuilen, het portaal en het overige gevelreliëf zijn verdikt en vereenvoudigd, de open lantaarn is gesloten met nissen. De precieze gevelopeningen, voorgevel, achterbouw, zuilen en torenbekroning zijn geschat uit foto's en de dakvlakken; dunne ornamenten en het kruis zijn weggelaten.

De generator controleert geslotenheid, Float32-rondgang en overhang; het resultaat is één gesloten component met genus 0. De 45-graden-steuncontrole en een volledige uitsnede op 1:1000 zijn gecontroleerd.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0758100000050778), [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/10227), [buitenfoto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Exterior_of_Sint-Antoniuskathedraal,_Breda), [architectuurbeschrijving](https://www.ensie.nl/monumenten-in-noord-brabant/de-rk-st-antoniuskerk-in-breda).

