# Onze Lieve Vrouw Presentatiekerk, Aarle-Rixtel

Het model vervangt BAG-pand `NL.IMBAG.Pand.1659100000007829`. Deze waterstaatskerk heeft een lang schip, lagere zij- en achteraanbouwen en een vierkante toren met achthoekige lantaarn en koepel. De voet ligt 0,5 m onder het maaiveld. De open lantaarn is voor een print op 1:1000 zonder steun weergegeven met een massieve kern en zelfdragende nissen.

## Bronnen en maten

- [3DBAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1659100000007829): BAG-contour, 1130,59 m², maaiveld NAP +16,151 m en daknok rond NAP +37,02 m.
- Officiële [AHN5 WCS](https://api.ellipsis-drive.com/v3/ogc/wcs/a4a8a27b-e36e-4dd5-a75b-f7b6c18d33ec?service=WCS&request=GetCapabilities): hoogste torenpunt NAP +54,18 m; modeltop 38 m boven maaiveld.
- [BHIC](https://www.bhic.nl/ontdekken/verhalen/de-kerk-van-onze-lieve-vrouwe-presentatie-in-aarle-rixtel): geschiedenis van de waterstaatskerk.
- [Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Kerk_van_Onze_Lieve_Vrouw_Presentatie,_Aarle-Rixtel): foto's van de toren, voorgevel en zijgevel.

Lantaarnopeningen, koepel, voorgevelnissen en laagbouw zijn naar foto's en AHN vereenvoudigd en geschat; de zeer dunne windvaan is weggelaten. Oorsprong RD (172465,25, 391284,25), x-as (-0,214, 0,977).

## Genereren

```sh
node scripts/generate-kerk-onze-lieve-vrouw-presentatie-aarle-rixtel.mjs --scale 1000
node scripts/generate-kerk-onze-lieve-vrouw-presentatie-aarle-rixtel.mjs --scale 100
```
