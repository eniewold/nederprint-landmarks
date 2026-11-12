# Magnuskerk (Anloo)

Vereenvoudigd model van de middeleeuwse Magnuskerk en haar zadeldaktoren. Het schip is grotendeels elfde-eeuws, de toren twaalfde-eeuws; de trapgevels dateren uit 1895. De invoerwaarde 1900 is niet het oorspronkelijke bouwjaar. De kerk en toren zijn rijksmonumenten.

## Bestanden en ligging

- `magnuskerk-anloo.glb`: meters, glTF Y omhoog; één gesloten `building:kerk-en-toren`-node.
- `magnuskerk-anloo.json`: RD-oorsprong `[242905.8, 562599.7]`, X-as `[0.99999, 0.003]` in de lengterichting naar het koor; vervangt BAG-pand `1680100000008375`.
- `magnuskerk-anloo-1-1000.stl` en `magnuskerk-anloo-1-100.stl`: printmodellen in millimeters op 1:1000 en 1:100.
- Generator: `scripts/generate-magnuskerk-anloo.mjs`.

## Onderdelen en aannames

Het schip heeft een zadeldak, het lagere koor een zadeldak met driezijdige sluiting en steunberen. De toren heeft een zadeldak tussen twee trapgevels en draagt een dakruiter. Dakvlakken volgen AHN en 3D BAG; de nokken van schip, koor en toren liggen rond NAP +28,1 m, +27,1 m en +37,9 m, de punt van de dakruiter circa NAP +44,2 m. Het maaiveld is circa NAP +14,2 m. Het AHN-raster bevat in de BAG-contour geen ontbrekende meetcellen; de 3D BAG gebruikt voor deze locatie AHN4 uit 2022, omdat AHN5 nog niet beschikbaar was.

De raam- en deuropeningen zijn blinde nissen voor de print; plaats, afmetingen en diepte zijn uit foto's geschat. De trapgevels zijn vereenvoudigd tot vijf brede treden en de dakruiter is plaatselijk verdikt tot minimaal circa 0,9 m, met een gesloten basis. Kleinere voegen, galmgatmiddeltjes en de windhaan zijn weggelaten omdat zij op 1:1000 te dun zijn.

## Controle

Het generatorscript geeft `NoError`, één verbonden deel en een afmeting van ongeveer 42,3 × 11,4 × 30,3 mm op 1:1000. Een modeltest controleert catalogus, BAG-vervanging, plaatsing, gesloten mesh en overhangopvulling. De vierzijdige vergelijking met de PDOK-gebouwtegel is uitgevoerd; de kaart en een steunvrije preview op 1:1000 zijn gecontroleerd.

## Bronnen

- [3D BAG: pand 1680100000008375](https://api.3dbag.nl/collections/pand/items/NL.IMBAG.Pand.1680100000008375)
- [Nationaal Park Drentsche Aa: Magnuskerk en toren](https://www.drentscheaa.nl/drentsche-aa-verhaal/mens-landschap/kerktorens-bakens/)
- [PDOK AHN WCS](https://service.pdok.nl/rws/ahn/wcs/v1_0), DSM 0,5 m, en PDOK actuele luchtfoto.
- [Wikimedia Commons: foto's Magnuskerk](https://commons.wikimedia.org/wiki/Category:Nederlands_Hervormde_Kerk,_Anloo)

