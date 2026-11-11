# Sint-Adriaanskerk (Dreischor)

De middeleeuwse Sint-Adriaanskerk is een tweebeukige hallenkerk met westtoren en grafkapel, gelegen op een omgracht kerkhof. Het model bestaat uit GLB, catalogus-JSON en STL's op 1:100 en 1:1000. Oorsprong RD (57912, 412103), X-as (0,998; -0,061) langs de nok oostwaarts. Het model vervangt BAG-pand 1676100000428646.

Beide schepen hebben eigen zadeldaken. Westtoren, koorsluiting, lage kapellen en steunberen zijn opgebouwd als bouwdelen met schuine dakvlakken. Vensters en toegang zijn blinde nissen. Het maaswerk, het kruis en de windvaan zijn weggelaten; de spitspunt is verbreed tot circa 0,96 m voor printbaarheid. Vensterindeling, torengeleding en kapeldetails zijn vereenvoudigd. De onderzijde ligt 0,5 m onder maaiveld.

3DBAG gebruikt AHN5 uit 2024 en noemt maaiveld circa +1,115 m NAP; de twee nokken liggen ongeveer 14,9 en 16,4 m boven maaiveld. Het hoogste AHN-punt op de toren is +40,77 m NAP; de modeltop is 39,65 m boven maaiveld. AHN DTM op vijf punten vlak bij de voet varieert circa +1,23 tot +1,41 m NAP; verder van de terp ligt het terrein lager. Daarom gebruikt de JSON expliciete `groundSamplePoints` op de terp en bevat de GLB geen dubbele heuvel. Hoogte van de punt en vorm van de torenspits zijn mede uit foto's benaderd.

## Controle

De generator rapporteert één gesloten manifold met genus 0. De gerichte test controleert catalogusplaatsing, samenhang en 45-gradenopvulling in doorsneden. Vier schuine modelrenders zijn vergeleken met de PDOK-reconstructie en foto's: de twee kappen, oostelijk koor, aanbouwen en westtoren zijn herkenbaar; de torenspits ontbreekt grotendeels in PDOK maar is zichtbaar op foto's en AHN. Binnen 12 m is geen ander PDOK-pand aangetroffen. Kaart en preview worden afzonderlijk gecontroleerd; let daarbij extra op de aansluiting op de terp en controleer dat het lagere terrein en de gracht de modelhoogte niet bepalen.

## Bronnen

- [3DBAG pand en AHN5](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1676100000428646)
- [AHN DSM en DTM via PDOK](https://service.pdok.nl/rws/ahn/wcs/v1_0)
- [Rijksmonumentenregister 11162](https://monumentenregister.cultureelerfgoed.nl/monumenten/11162)
- [Wikimedia Commons: foto's](https://commons.wikimedia.org/wiki/Category:Sint_Adriaanskerk_(Dreischor))
