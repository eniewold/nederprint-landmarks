# Oorlogsmuseum Overloon

Gebouwmodel van de museumhal met lage zuidvleugel, de oudere entreevleugel en het vrijstaande noordwestelijke paviljoen. Drie `building:`-nodes, meters, script Z omhoog, GLB `(x,z,-y)`. Oorsprong RD `[194570,398065]`, +X langs de grote hal op −5,21° vanaf RD-oost. Vervangt alleen BAG-panden `0756100000000007`, `0756100000000088` en `0756100000003207`; het kleine westelijke bijgebouw en het bos blijven PDOK.

## Bronnen en maten

- [Museum](https://www.oorlogsmuseum.nl/nl/het-museum/) en [Wikipedia](https://nl.wikipedia.org/wiki/Oorlogsmuseum_Overloon): scope van het museum en de materieelcollectie.
- [Commons](https://commons.wikimedia.org/wiki/Category:Overloon_War_Museum), met name `2019 12 01 Kriegsmuseum Overloon (1).jpg` en `Oorlogsmuseum Overloon.JPG`: entreehoek, glaspuien en luifel. De eerste foto toont de actuele donkere bekleding; de tweede de glaspuien. Foto's alleen in de tijdelijke controlemap.
- [3D BAG hoofdgebouw](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0756100000000007), [entree](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0756100000000088) en [paviljoen](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0756100000003207), CC BY 4.0: LoD2.2-dakvlakken, gecontroleerd met BAG-contouren, BGT, PDOK Actueel_orthoHR en AHN DSM/DTM 0,5 m op 11 oktober 2026.

De grote hal heeft circa 135 × 90 m hoofdoppervlak, met westelijke en zuidelijke lage vleugels. Dakhoogtes: noordhal NAP 30,88–31,66 m, zuidhal 31,36–31,82 m; lage vleugel ongeveer 28,52–28,72 m; bestaande lichtstraat tot 30,52 m. Entree circa 28,48–31,66 m en paviljoen 29,30 m. AHN meet onder andere 31,27 m op het noorden, 31,66 m op het zuiden en 28,85 m op de lage vleugel. Maaiveld rond NAP 23,27–23,41 m; de hogere entree ligt op plaatselijk oplopend terrein.

## Opbouw en schattingen

De dakvlakken worden als gesloten verticale prisma's opgebouwd. Driehoeken verdelen uitsluitend vlakken, geen hoogtelagen. Een lage BAG-voet sluit de aansluiting onder de dakvlakken. Coplanaire nulvlakken worden verwijderd; ieder gebouw is één positief verbonden volume.

Elf lange lichtstraten zijn uit luchtfoto en AHN gegroepeerd. Het kleine echte hoogteverschil is tot 0,5 m verhoogd voor leesbaarheid op 1:1000. Breedte 2,2 m en lengtes 15–16 m zijn afgeronde schattingen. De entree heeft drie blinde glasnissen van circa 4 m breed, 0,35 m diep, met afgeschuinde bovenkant; de luifel is als vast reliëf geschat. Geveldetails van de achterzijde zijn beperkt tot de betrouwbare bouwmassa: de open referenties geven vooral de entree weer.

Weggelaten: afzonderlijke zonnepanelen, letters, dunne profielstijlen, interieur en los materieel zoals tanks. De buitenliggende fietsbrug en parkbeelden zijn geen onderdeel van dit afzonderlijke gebouwmodel. Deze weglatingen voorkomen dat een willekeurige boscontour of museumcollectie in de gebouwmassa terechtkomt.

## Plaatsing en printcontrole

Modeldatum NAP 23,4 m; voet −0,3 m. PDOK-grondsamples 67,58108, 67,64712 en 67,49262 m ellipsoïdisch, catalogusminimum 67,4926213815 m en offset −0,15 m. Modeldatum op de kaart 67,3426213815 m. Geen terrein vervangen of dubbel onder het gebouw gelegd.

`node scripts/generate-oorlogsmuseum-overloon.mjs --scale 1000` schrijft GLB, JSON en STL. Losse STL 197,1 × 127,1 × 9,04 mm. Alle drie nodes `NoError`, ieder één positief volume. Gedeelde 45°-overhangcontrole: 116078,655 → 116071,298 m³, −0,00634% doordat de gedeelde controle dubbel volume bij aansluitingen tussen nodes verwijdert; geen toegevoegd steunvolume. De echte preview/3MF-export van de volledige uitsnede op 1:1000 meet 230 × 230 mm. Vier schuine renders op 30° boven de horizon (−35°, 55°, 145°, 235°) zijn naast PDOK, luchtfoto en de entreefoto bekeken: vooral de lichtstraten en het glasreliëf voegen detail toe, terwijl de dakvlakken hun oorspronkelijke helling behouden.

De webshoptest controleert vervanging van precies drie BAG-panden, drie verbonden gesloten nodes, hoogte, lichtstraten, entreegevel, plaatsing en de geringe numerieke verandering bij overhangcontrole.

[Controlekaart](http://localhost:3000/kaart/51.57028/5.95778/650/1x1/0?size=230): controleer de geschatte lichtstraten en entreepuien, en de aansluiting van de drie gebouwen op het terrein. Tijdens controle wordt de bestaande server via een tijdelijke proxy met actuele catalogus gebruikt.
