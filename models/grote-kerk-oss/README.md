# Grote Kerk (Oss)

De neogotische kruisbasiliek met stompe toren, dwarsschip, zijkapellen en kooromgang is opgebouwd uit bouwdelen en dakvlakken.

- GLB/JSON: één node `building:kerk` in meters; vervangt BAG-pand 0828100001484067.
- STL op 1:1000: circa 70,5 × 36,6 × 53,8 mm.
- Genereren: `node scripts/generate-grote-kerk-oss.mjs --components`.

De oorsprong ligt op RD (164313, 420070), +X langs het schip naar het koor in richting (0,987, 0,160), de onderkant 0,5 m onder maaiveld. Het 3D BAG-maaiveld ligt op circa NAP +7,74 m; de nok op NAP +35,0 m. De stompe torentop is in AHN DSM en 3D BAG op circa NAP +61 m gemeten. Een publicatie noemt een torenhoogte van 58 m; in dit model is de gemeten hoogte circa 53,3 m boven maaiveld aangehouden.

De opengewerkte bakstenen balustrade op de toren is voor een steunloze print gesloten met nissen. Pinakels, vensters, steunberen, zijkapellen, de kooromgang en dakruiter zijn op basis van foto's en 3D BAG geschat en vereenvoudigd; de vrijstaande beeldengroep en maaswerk zijn weggelaten.

De generator controleert geslotenheid, Float32-rondgang en overhang; het resultaat is één gesloten component met genus 0. De 45-graden-steuncontrole en 150 × 150 m-uitsneden op 1:1000 met en zonder landmark zijn gecontroleerd.

Bronnen: [3D BAG](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.0828100001484067), [AHN DSM](https://service.pdok.nl/rws/ahn/wcs/v1_0), [Rijksmonumentenregister](https://monumentenregister.cultureelerfgoed.nl/monumenten/31870), [foto's Wikimedia Commons](https://commons.wikimedia.org/wiki/Category:Onze-Lieve-Vrouw_Onbevlekt_Ontvangenkerk_(Oss)), [architectuurbeschrijving](https://www.monumenten.nl/monument/31870), [torenhoogte](https://www.kliknieuwsoss.nl/nieuws/religie/237376/rondleiding-en-torenbeklimming-grote-kerk).
