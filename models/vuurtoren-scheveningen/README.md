# Vuurtoren van Scheveningen

Vereenvoudigd landmark in meters, GLB met Y omhoog, STL op 1:1000. Generator: `scripts/generate-vuurtoren-scheveningen.mjs`; uitvoeren met Node vanuit nederprint-landmarks. Geen hoogteplakken: twaalfhoekig schachtprisma met taps profiel, schuine galerijkraag, omwentelingskoepel, afzonderlijke bouwdelen en twee vlakke dakhellingen per woningpaar.

RD-oorsprong [78341.845, 457912.531], hart van het BAG-pand. +X noordoost, naar Vuurbaakstraat; +Y noordwest. De vijf vervangen BAG-panden staan in de JSON: toren en vier oorspronkelijke wachterswoningen. Omringende nieuwbouw en duinterrein blijven PDOK.

## Bronnen en gemeten maten

- [Nederlandse Vuurtoren Vereniging](https://www.vuurtorens.org/vuurtoren/scheveningen/), [historische waardebepaling mei 2024](https://www.vuurtorens.org/wp-content/uploads/2024/05/De-vuurtoren-van-Scheveningen-mei-2024.pdf) en [RCE 18111](https://monumentenregister.cultureelerfgoed.nl/monumenten/18111): twaalfzijdige gietijzeren toren, twee deuren, zestien historische vensters, kuipuitbouw en twee dubbele wachterswoningen.
- [Rijksmuseum, beschrijving van het historische model](https://www.rijksmuseum.nl/en/collection/object/Model-of-a-Lighthouse--d94f8bc7eea97acea2e251c38a333a39): diameter 7,3–3 m. Alleen de tekstuele maat gebruikt, geen geometrie van het museumobject.
- PDOK BAG/BGT en Actueel_orthoHR: positie, twaalfhoek, huisvoetafdrukken circa 17,48 × 8,94 en 17,35 × 8,88 m; rechte nokken in noordoostrichting.
- AHN DSM/DTM 0,5 m: grond circa NAP +14,84 m, nokken +21,88 m en goten +19,05 m; schoorsteenpieken circa +22,3–22,6 m. Het bovenste torenpunt is +51,948 m: circa **37,11 m boven het plaatselijke maaiveld**. De vereniging en RCE-literatuur noemen 30 m objecthoogte; dit verschil is onopgelost en wordt niet stilzwijgend gelijkgesteld. Het gemeten silhouet en de PDOK-reconstructie volgen de hogere top.
- [Commons-foto's](https://commons.wikimedia.org/wiki/Category:Vuurtoren_van_Scheveningen): straatzijde, zeezijde en schuine details van beide kanten; luchtfoto en AHN missen de vensters en glazen bovenbouw.

## Geschat en vereenvoudigd

Galerijhoogte 29,75 m, kuip 31,25 m, glas tot 34,65 m, koepel 36,55 m en bol 37,11 m volgen fotoverhoudingen binnen de AHN-omhullende; de AHN-wandreturns zijn onvoldoende om ieder galerijniveau apart vast te leggen. Vensterposities/-hoogtes, kustwachtvensters, deurmaten, blinde reliëfplaten en de kleine westelijke kuipuitbouw zijn schattingen. De zestien spitsvensters zijn gegroepeerd op vier vlakken; geen exact gevelarchief.

De huisdaken zijn doorlopende vlakken op gemeten goot/nok. Drie schoorstenen per paar en vier brede dakkapellen per paar volgen foto's en pieken; plaats, breedte en diepte zijn geschat. Kleine afwijkingen van de oude BAG-hoeken zijn rechtgetrokken in hetzelfde dakstelsel. Nissen zijn 0,35 m diep; dragende kernen blijven massief. Schoorstenen minimaal 1 m breed, bol diameter 1,1 m, andere toegevoegde details minimaal 0,9 m. Dunne antennes, windvaan, zeemeermin, spijlen, kabels en bevestigingsbouten zijn onder 0,9 m en weggelaten. Metalen galerijschoren zijn een gesloten schuine kraag; de lage borstwering/kuip is massief. Kleine losse tuinobjecten horen niet bij de vijf vervangen gebouwen.

## Controle

Vijf gesloten NoError-nodes, elk één verbonden deel met positief volume; de losse woningparen worden in de stadsprint door terrein verbonden. STL circa 17,5 × 33,4 × 37,4 mm. Gedeelde 45°-overhangcontrole vergroot het volume circa 0,163%; doorsneden op 18, 27 en 30 m blijven gelijk. Hele model geëxporteerd met `createModelBundle`, 80 × 80 m naar 80 × 80 mm, onderplaat 1 mm, geen rand, z=1 en 45°. Preview en kaart visueel gecontroleerd; controlebeelden buiten de repo.

Vier schuine renders op 30° kijkhoogte naast dezelfde PDOK-hoek en Commons-foto's: −35° voegt galerij, vensters en dakkapellen toe; 55° voegt deur, kuip en voorgevelnissen toe; 145° voegt zeezijdige vensterrij en beide huisgevels toe; 235° voegt achterste vensters, dakdetails en schoorstenen toe. De PDOK-toren is een vlak prisma met een punt; de ronde bovenbouw ontbreekt daarin. Permanente test controleert alle vijf vervangingen, gescheiden woningen, nokken, top, gesloten geometrie en behoud bij 45° opvulling.

Controle-URL: http://localhost:3000/kaart/52.10413/4.26824/220/1x1/0?size=80

Nakijken: de twaalfzijdige schacht met vensterrijen, de kuip/koepel en beide dubbele woningen; vooral of het gemeten hogere silhouet overtuigt tegenover de gepubliceerde 30 m.
