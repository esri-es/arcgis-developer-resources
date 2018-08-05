# Tips and tricks: ArcGIS Online

You can find more information about [advanced search capabitilies here](http://doc.arcgis.com/en/arcgis-online/reference/search.htm#ESRI_SECTION1_18FD99A1020547BA864FCEBECBE267F3)

There is some info in the [Items and item types](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Items_and_item_types/02r3000000ms000000/)

## Web Map Viewer

Did you know you can embed the ArcGIS Online Viewer?

## Search items

We have build the [ArcGIS Online advanced (items) search](https://esri-es.github.io/arcgis-developer-tips-and-tricks/arcgis-online/search) interface to help you find items in ArcGIS Online.

### Search by typekeywords

Examples:

* VR360: [typekeywords:VR360](http://www.arcgis.com/home/search.html?q=typekeywords%3AVR360&t=content&start=1&sortOrder=desc&sortField=relevance)
* Web Map (Collector Ready): [type:"Web Map" typekeywords:Collector](http://www.arcgis.com/home/search.html?q=type%3A%22Web%20Map%22%20typekeywords%3ACollector&t=content&start=1&sortOrder=desc&sortField=relevance)
* Web Map (Offline Ready): [type:"Web Map" typekeywords:Offline](http://www.arcgis.com/home/search.html?q=type%3A%22Web%20Map%22%20typekeywords%3AOffline&t=content&start=1&sortOrder=desc&sortField=relevance)

> Find more examples at [ArcGIS Online advanced (items) search](https://esri-es.github.io/arcgis-developer-tips-and-tricks/arcgis-online/search)

### Search by type

Examples:

* Geocoding Service: [type:"Geocoding Service"](http://www.arcgis.com/home/search.html?q=type%3A"Geocoding%20Service"&t=content&start=1&sortOrder=desc&sortField=relevance)
* Mobile Map Package: [type:"Mobile Map Package"](http://www.arcgis.com/home/search.html?q=type%3A%22Mobile%20Map%20Package%22&t=content&start=1&sortOrder=desc&sortField=relevance)
* CityEngine Web Scene:[type:"CityEngine Web Scene"](http://www.arcgis.com/home/search.html?q=type%3A%22CityEngine%20Web%20Scene%22&t=content&start=1&sortOrder=desc&sortField=relevance)

> Find more examples at [ArcGIS Online advanced (items) search](https://esri-es.github.io/arcgis-developer-tips-and-tricks/arcgis-online/search)

### Search by owner

Use the keyword `owner:[REPLACE_WITH_USERNAME]`.

Example:

* [owner:CityEngine](http://www.arcgis.com/home/search.html?q=owner%3ACityEngine&restrict=false&start=1&sortOrder=desc&sortField=relevance)
* [owner:Esri](http://www.arcgis.com/home/search.html?q=owner%3Aesri&restrict=false&start=1&sortOrder=desc&sortField=relevance)

> Find more examples at [ArcGIS Online advanced (items) search](https://esri-es.github.io/arcgis-developer-tips-and-tricks/arcgis-online/search)

### Useful searches

There are some searches that you may want to do but there is no specific metadata for those.

You can find them at: [ArcGIS Search interface](https://esri-es.github.io/arcgis-developer-tips-and-tricks/arcgis-online/search) or [useful-searches.json](./useful-searches.json)

### Groups

* [Groups owned by the user 'Esri'](http://www.arcgis.com/home/search.html?q=owner%3Aesri&t=groups&focus=groups&start=1&sortOrder=desc&sortField=relevance)
* [Groups owned by the organization that belongs the user 'Esri'](http://www.arcgis.com/home/search.html?q=orgid%3AP3ePLMYs2RVChkJx&start=1&sortOrder=desc&sortField=relevance#groups)

### Search by organization ID

This search will allow you to find public content from any user inside an organization.

Search by organization id, e.g-> [orgid:AP3ePLMYs2RVChkJx](http://www.arcgis.com/home/search.html?q=orgid%3AP3ePLMYs2RVChkJx&t=content&start=1&sortOrder=desc&sortField=relevance)

You can find an organization id from:

* The item metadata (field orgId): [item metadata example](http://www.arcgis.com/sharing/rest/content/items/4d29eb6f07e94b669c0b90c2aa267100?f=json)

* The URL of any hosted service: https://services.arcgis.com/P3ePLMYs2RVChkJx/arcgis/rest/services/usa_cbsa/FeatureServer <- P3ePLMYs2RVChkJx

> You can only list all users of an organization if you have priviledges using the ['/users' endpoint](http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Users/02r30000009q000000/) like this: **https://www.arcgis.com/sharing/rest/portals/self/users?f=json&token=*TOKEN***

## Awesome list for ArcGIS Developers

[Find more resources about ArcGIS Online](https://esri-es.github.io/awesome-arcgis/arcgis/products/arcgis-online/)
