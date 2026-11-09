# Sint-Martinuskerk (Eindhoven)

Sint-Martinuskerk aan 't Hofke in Tongelre: neogotische driebeukige kruisbasiliek van Emmanuel Corbey (1888-1891), rijksmonument 518790. De voorgevel ligt op het westzuidwesten, het koor op het oostnoordoosten. De torens zijn nooit voltooid en hebben een leien tentdak in plaats van de ontworpen spitsen. Het model vervangt BAG-pand 0772100000302308; dat pand omvat ook de pastorie ten zuiden van de kerk, die daarom mee is gemodelleerd. (De BAG noemt 1917 als bouwjaar; Wikipedia en het register geven 1888-1891.)

## Bestanden en plaatsing

- `sint-martinuskerk-eindhoven.glb`: gesloten model in meters met node `building:kerk`.
- `sint-martinuskerk-eindhoven.json`: RD-oorsprong (164133,3, 384365,87) in de viering, X-as `[0.9239, 0.3827]` (22,5 graden) van de voorgevel naar het koor, maaiveldreferentie NAP +18,30 m.
- `sint-martinuskerk-eindhoven-1-100.stl` en `sint-martinuskerk-eindhoven-1-1000.stl`: afdrukmodellen.
- `scripts/generate-sint-martinuskerk-eindhoven.mjs`: reproduceert het model uit bouwdelen en dakvlakken.

## Onderdelen

- Schip en koor onder één kap van 56,7 graden (goot 14,65 m, nok 20,35 m), met twee dakkapelletjes per dakvlak en vijf lichtbeukvensters per zijde.
- Zijbeuken met lessenaarsdak (10,45 m tegen de lichtbeuk, 33 graden), vijf traveeën met steunberen, vensters en drie dakkapelletjes per zijde.
- Korte transeptarmen met dezelfde kap, topgevels met roosvenster, lancetten en een pinakel op de top; ervoor een lage portaalbouw met lessenaarsdak, aan de noordzijde met twee topgeveltjes boven ronde vensters.
- Vijfzijdige koorsluiting met een lager dak (goot 12,8 m, nok 18,3 m), vijf hoge vensters en steunberen op de hoeken; daarboven de topgevel van het koor.
- Achtzijdige dakruiter op de viering: lantaarn tot 24,0 m en naald tot 30,5 m.
- Twee vierkante torens van 5,5 x 5 m voor de zijbeuken: muren tot 21,3 m met een kroonlijst (kraag van 45 graden), tentdak tot 23,6 m, hoekpinakels, hoeksteunberen, galmgaten en vensters als nissen.
- Voorgevel van het schip tussen de torens met roosvenster, pinakel op de top en een portaal met spitse topgevel en twee pinakels.
- Sacristie rechts achter het koor (zadeldak dwars op de as, nok 9,2 m) met een lage tussenbouw, en aan de noordzijde van het koor een aanbouw met lessenaarsdak en de hoge schoorsteen (20,5 m).
- Pastorie: hoofdhuis met mansardekap (steil tot circa 11,8 m, flauw tentdak tot 14,2 m), topgevel naar 't Hofke, vier dakkapellen, drie schoorstenen, een lage oostelijke aanbouw, een vleugel met flauw zadeldak (8,15 m) en een platte verbinding van 3,8 m met de zuidtoren.

## Maten en vereenvoudiging

De BAG geeft de omtrek en de as (22,5 graden in RD; de nok in het AHN ligt over de hele lengte op dezelfde v). Nok-, goot- en torenhoogtes en de dakhellingen komen uit dwarsprofielen in het AHN5-DSM op 0,5 m (mediaan over 17 m schip); de dakruiter staat in het DSM op NAP +47,85 m, de naald is op 30,5 m boven maaiveld gezet. Geschat uit Commons-foto's: de dakruiterlantaarn, de pinakels, het portaal, de dakkapellen, de steunbeerhoogtes en alle vensters, roosvensters en galmgaten; de pastoriekap is een vereenvoudigde mansarde op AHN-hoogtes. Weggelaten: de erker aan de westgevel van de pastorie (minder dan 0,9 m uit de gevel), balustrades, friezen, kruisen en het tegeltableau.

## Controle

Eén gesloten manifold met genus 0. De gerichte test controleert plaatsing, pandvervanging, hoogte en de 45-graden-overhangopvulling op 1:1000 (supportRatio 1,00). Het model is van vier schuine kanten en van voren, van het noorden en vanaf het koor vergeleken met de 3DBAG-reconstructie (LoD2.2) van het pand en met foto's van de voorgevel, de noordzijde, de koorsluiting en de pastorie.

## Bronnen

- [Wikipedia: Sint-Martinuskerk (Tongelre)](https://nl.wikipedia.org/wiki/Sint-Martinuskerk_(Tongelre))
- [Rijksmonumentenregister 518790](https://monumentenregister.cultureelerfgoed.nl/monumenten/518790)
- [3DBAG pand](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0772100000302308)
- [OpenStreetMap way 272118491](https://www.openstreetmap.org/way/272118491)
- [AHN5](https://www.ahn.nl/dataroom)
- [Wikimedia Commons: Sint Martinuskerk, Eindhoven](https://commons.wikimedia.org/wiki/Category:Sint_Martinuskerk,_Eindhoven)
