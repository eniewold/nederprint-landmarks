# Sint-Jozefkapel, Smakt

Dit model vervangt BAG-pand `NL.IMBAG.Pand.0984100000409510`. Het eenbeukige gebouw met driezijdig koor, gezwenkte voorgevel en dakruiter is opgebouwd uit bouwdelen en dakvlakken. De voet ligt 0,5 m onder het maaiveld. De open klokkenstoel is op 1:1000 als massieve kern met zelfdragende nissen weergegeven; de spits is afgeknot tot een printbare breedte.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0984100000409510): oppervlak 66,9 m², maaiveld NAP +17,246 m, nok circa NAP +24,01 m en BAG-grondvorm.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): dakruiter bereikt circa NAP +27,2 m; top in model is 9,9 m boven maaiveld.
- [Historisch Erfgoed Smakt](https://historischerfgoedsmakt.nl/smakt/st-jozeflaan/st-jozefkapel/): beschrijving van de kapel en de dakruiter.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Sint-Jozefkapel_(Smakt)): gevel-, zijaanzicht- en detailfoto's.

De voorgevel is vereenvoudigd naar de foto's; nisdiepten, raamvormen en de precieze dikte van de dakruiter zijn geschat. De zeer dunne windvaan is weggelaten en de punt is verbreed. Oorsprong RD (197735,82, 397930,63), x-as (0,9986, -0,0527).

## Genereren

```sh
node scripts/generate-sint-jozefkapel-smakt.mjs --scale 1000
node scripts/generate-sint-jozefkapel-smakt.mjs --scale 100
```
