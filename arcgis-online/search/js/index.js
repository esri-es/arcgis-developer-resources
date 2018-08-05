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


function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function truncateDecimals(number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
};

function extentToString(elem) {
    var tl = elem[0].join(', ');
        br = elem[1].join(', ');
    return `[[${tl}], [${br}]]`;
}

/*var columns = [

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
];*/


function advancedSearchItems(searchParams, columns){
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
                        var val = eval(columns[i].value);
                        if( typeof(val) === "object" && val !== null){
                            val = val.join(", ");
                        }
                        output.push(val);
                    }
                    return output;
                }));


                if(response.nextStart!==-1 && response.nextStart < searchParams.num){
                    searchParams.start=response.nextStart;
                    advancedSearchItems(searchParams, columns);
                }else{

                    //console.table($APP.ouptut);
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
        var params = $("#fields input:checked").toArray();
        $APP.ouptut = [];
        columns = params.map(function(elem){
            return {
                field: elem.name,
                value: elem.value
            }
        });

        searchParams.q = $('input[name="q"]').val()
        advancedSearchItems(searchParams, columns);
        return false;
    })

    // Loading useful searches
    var template = $.templates("#usefulSearchesTmpl");
    $.getJSON( "../useful-searches.json",function(data){
        var htmlOutput = template.render({data: data});
        $("#list-useful-searches").html(htmlOutput);
    });



})
