# Catharinakerk (Etten-Leur)

Het bewaard gebleven eenbeukige gotische kerkdeel met vijfzijdig gesloten koor en de classicistische toren van 1771 met klokgeleding en lantaarn. Het model vervangt BAG-pand 0777100000151750.

## Bestanden en plaatsing

- `catharinakerk-etten-leur.glb`: gesloten model in meters met node `building:kerk`.
- `catharinakerk-etten-leur.json`: RD-oorsprong (102866, 398088), X-as `[0.99734, 0.0729]`, maaiveldreferentie NAP +8,927 m.
- `catharinakerk-etten-leur-1-100.stl` en `catharinakerk-etten-leur-1-1000.stl`: afdrukmodellen.
- `scripts/generate-catharinakerk-etten-leur.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Maten en vereenvoudiging

BAG geeft de omtrek en positie. AHN5 toont de hoogste torenmeting op NAP +58,89 m en de nok op circa NAP +27,65 m. De kapvlakken zijn geïnterpoleerd tussen meetpunten; 3DBAG meldt circa 2,3% ontbrekende AHN4-waarden en 1,2% in AHN5. Hoogte en vorm van de lantaarn, de koorsluiting, torenhoeken, steunberen en vensters zijn geschat uit foto's en het AHN. De open lantaarn is gesloten met blinde nissen en de kleine torenpunten zijn op printbreedte gebracht. Uurwijzers, leuningen en details onder 0,9 m zijn weggelaten.

## Controle

Eén gesloten manifold zonder gaten. De gerichte test controleert plaatsing, pandvervanging, hoogte en 45-graden-overhangopvulling op 1:1000. Previewexports met en zonder landmark zijn gemaakt voor een uitsnede van 150 bij 150 m. De modellen zijn uit vier richtingen vergeleken met PDOK en foto's van voor-, achter- en zijkanten.

## Bronnen

- [Rijksmonumentenregister 15401](https://monumentenregister.cultureelerfgoed.nl/monumenten/15401)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0777100000151750)
- [AHN5](https://www.ahn.nl/dataroom)
- [Wikimedia Commons: buitenfoto's](https://commons.wikimedia.org/wiki/Category:Exterior_of_Catharinakerk_(Etten-Leur))
