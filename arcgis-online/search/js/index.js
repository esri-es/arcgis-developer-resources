//copy($APP.ouptut)
var searchParams={
    q:'typekeywords:"Scene" AND typekeywords:"Service"',
    num:100,
    sortOrder:'desc',
    start:1,
    bbox:"-18.606063096102055,33.83293982733711,4.772843153891731,44.1971130946328"
}
window.$APP={
    ouptut:[]
}

var columns = [

    {
        field: "Thumbnail",
        value: "'<img src=\"https://www.arcgis.com/sharing/rest/content/items/'+elem.id+'/info/'+elem.thumbnail+'\">'"
    },
    {
        field: "Title",
        value: "elem.title"
    },
    {
        field: "Details",
        value: "'<a href=\"https://www.arcgis.com/home/item.html?id='+elem.id+'\">Details</a>'"
    },
    {
        field: "Type",
        value: "elem.type"
    },
    {
        field: "Owner",
        value: "elem.owner"
    },
    {
        field: "Views",
        value: "elem.numViews"
    }
];


function advancedSearchItems(searchParams){
    (function ($APP) {

        var s = document.createElement('script');
        s.setAttribute('src', '//cdn.polyfill.io/v2/polyfill.js?features=es5,Promise,fetch');
        s.addEventListener('load', function(){
            console.log('Polyfills loaded');
        });
        document.body.appendChild(s);

        var d = document.createElement('script');
        d.setAttribute('src', '//unpkg.com/@esri/arcgis-rest-request@1.6.0/dist/umd/request.umd.js');
        d.addEventListener('load', function(){
            console.log('ArcGIS REST loaded');
            searchParams.f='json';

            var params={
                httpMethod: "GET",
                params:searchParams
            }
            arcgisRest.request("https://www.arcgis.com/sharing/rest/search",params).then(response => {
                console.log(response);
                $APP.ouptut=$APP.ouptut.concat(response.results.map(function(elem){

                    var output = [];
                    for(i=0; i<columns.length; i++){
                        output.push(eval(columns[i].value));
                    }
                    return output;
                }));


                if(response.nextStart!==-1 && response.nextStart < searchParams.num){
                    searchParams.start=response.nextStart;
                    advancedSearchItems(searchParams);
                }else{

                    console.table($APP.ouptut);
                    var template = $.templates("#itemTmpl");

                    var htmlOutput = template.render({
                        searchParams: searchParams,
                        columns: columns,
                        results: $APP.ouptut
                    });

                    $("#results").html(htmlOutput);
                }
            });
        });
        document.body.appendChild(d);
    })($APP);
}

$(document).ready(function(){
    $('#search-form').submit(function(){
        searchParams.q = $('input[name="q"]').val()
        advancedSearchItems(searchParams);
        return false;
    })

    var template = $.templates("#usefulSearchesTmpl");
    $.getJSON( "../useful-searches.json",function(data){
        console.log(data);
        var htmlOutput = template.render({data: data});

        $("#list-useful-searches").html(htmlOutput);
    });



})
