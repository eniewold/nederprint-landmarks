# Nicolaas Pieckkerk, Gorinchem

Voormalige waterstaatskerk uit 1838 naar ontwerp van J. van Nune. Na herbestemming als appartementencomplex zijn de lange zijgevels en lage dakopbouwen aangepast; het model volgt de huidige gebouwmassa, met zadeldak, ronde achteruitbouw en kleine voorgeveltoren. De open klokkenkamer is voor printbaarheid als gesloten volume met nissen weergegeven.

## Bronnen en maatvoering

- [3D BAG pand 0512100000038380](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0512100000038380): contour, bouwdelen en dakvlakken. Maaiveld circa NAP +1,55 m; nok circa 23,8 m boven maaiveld.
- PDOK AHN DSM 0,5 m: hoogste torensteekproef NAP +38,68 m, circa 37,1 m boven maaiveld.
- [Rijksmonument 354418](https://monumentenregister.cultureelerfgoed.nl/monumenten/354418), [RCE-foto's van voor-, zij- en achterzijde](https://commons.wikimedia.org/wiki/Category:Waterstaatskerk_Gorinchem) en [Open Monumentendag](https://www.openmonumentendag.nl/monument/nicolaas-pieckkerk/): huidige vorm, herbestemming en bouwgeschiedenis.

De maten van de kleine toren en dakopbouwen, gevelnissen en het profiel van de ronde achteruitbouw zijn benaderd op basis van foto's en AHN. Klein ornament en het kruis zijn weggelaten op printschaal. Gevelopeningen zijn vereenvoudigd en stellen niet elk afzonderlijk raam van de appartementen voor.

## Genereren en controle

`node scripts/generate-nicolaas-pieckkerk-gorinchem.mjs --scale 1000 --components` en `--scale 100 --components` leveren GLB, metadata en STL's. Het model bestaat uit één gesloten genus-0-solid; de gerichte test in `tests/landmark-models.test.ts` controleert plaatsing en steunbehoefte bij 45 graden. Vier zijden zijn vergeleken met de PDOK-reconstructie en foto's; kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.

Kaartcontrole en preview-export van de volledige uitsnede zijn uitgevoerd.
