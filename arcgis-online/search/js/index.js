//copy($APP.ouptut)
var searchParams = {
    q: 'typekeywords:"Scene" AND typekeywords:"Service"',
    num: 100,
    sortOrder: 'desc',
    start: 1,
    bbox: "-18.606063096102055,33.83293982733711,4.772843153891731,44.1971130946328" // Spain
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

function generateThumbnail(elem){
    if(!elem.thumbnail){
        //console.warn(`Thumbnail not found for item: ${elem.id} (setting default img)`);
        elem.thumbnail = 'imgs/ago_downloaded.png';
    }else{
        elem.thumbnail = `https://www.arcgis.com/sharing/rest/content/items/${elem.id}/info/${elem.thumbnail}`;
    }
    return `<img
                src="${elem.thumbnail}"
                alt="Thumbnail">`;
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

// Recover search params from HTML and return object
function prepareSearchParams(){
    var tmp = searchParams;
    tmp.q = $('input[name="q"]').val();
    tmp.num = $('input[name="numResults"]').val();
    tmp.sortField = $('select[name="sortField"]').val();
    tmp.sortOrder = $('select[name="sortOrder"]').val();
    tmp.start = 1;
    if(tmp.sortField === 'relevance'){
        delete tmp.sortField;
        delete tmp.sortOrder;
    }
    if(!$('input[name="extension"]')[0].checked){
        delete tmp.bbox;
    }
    return tmp;
}

function advancedSearchItems(searchParams, columns){
    (function ($APP) {

        var s = document.createElement('script');
        s.setAttribute('src', '//cdn.polyfill.io/v2/polyfill.js?features=es5,Promise,fetch');
        s.addEventListener('load', function(){
            //console.log('Polyfills loaded');
        });
        document.body.appendChild(s);

        var d = document.createElement('script');
        d.setAttribute('src', '//unpkg.com/@esri/arcgis-rest-request@1.6.0/dist/umd/request.umd.js');
        d.addEventListener('load', function(){
            //console.log('ArcGIS REST loaded');
            searchParams.f='json';

            var params={
                httpMethod: "GET",
                params:searchParams
            }
            arcgisRest.request("https://www.arcgis.com/sharing/rest/search",params).then(response => {
                //console.log(response);
                $APP.totalResults = response.total;
                $APP.ouptut = $APP.ouptut.concat(response.results.map(function(elem){

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
                        results: $APP.ouptut,
                        totalResults: $APP.totalResults
                    });

                    $("#results").html(htmlOutput);
                }
            });
        });
        document.body.appendChild(d);
    })($APP);
}

window.onpopstate = function(event) {
  //console.log("location: " + document.location + ", state: " + JSON.stringify(event.state));
  $('#search-form').deserialize(event.state);
  executeSearch();
};

function executeSearch(){
    var params = $("#fields input:checked").toArray();
    $APP.ouptut = [];
    columns = params.map(function(elem){
        return {
            field: elem.name,
            value: elem.value
        }
    });

    searchParams = prepareSearchParams();
    advancedSearchItems(searchParams, columns);
    if($("#searchParams").is(':visible')){
        $("#btn-showParams").click();
    }
}

$(document).ready(function(){
    var searchForm = $('#search-form');

    searchForm.submit(function(){
        executeSearch();

        // Update state & change URL
        var state = searchForm.serializeParams(),
            stateTitle = 'Search: '+$('input[name="q"]').val(),
            newUrl = window.location.pathname+'?'+searchForm.serializeParams();

        window.history.pushState(state, stateTitle, newUrl);

        return false;
    });

    // If query string restore form and search

    var qs = window.location.search.substr(1);
    if(qs){
        //searchParams = prepareSearchParams();
        searchForm.deserialize(qs);
        searchForm.submit();
    }

    $('select[name="sortField"]').change(function(){
        if($(this).val() === 'relevance'){
            $('select[name="sortOrder"]').attr("disabled", "disabled");
        }else{
            $('select[name="sortOrder"]').removeAttr("disabled");
        }


    });

    $("#btn-showParams").click(function() {
        var txt = $("#searchParams").is(':visible') ? 'Show params' : 'Hide params';
        document.getElementById('extensionMap').contentWindow.postMessage(searchParams.bbox, '*');
        $(this).text(txt);
        $("#searchParams").slideToggle();
        return false;
    });

    // Loading useful searches
    var template = $.templates("#usefulSearchesTmpl");
    $.getJSON( "../useful-searches.json",function(data){
        var htmlOutput = template.render({data: data});
        $("#list-useful-searches").html(htmlOutput);
    });

    // Quickfix (to avoid loading iframe if not neccesary)
    $('[data-modal="modal-experts"]').click(function(){
        var iframe = $('#experts-iframe');
        if(!iframe.attr('src')){
            iframe.attr('src', 'https://esri-es.github.io/arcgis-experts/?awesome=false&header=false&suggestions=false');
        }
    });

})

$.fn.serializeParams = function (){

    var tmp = this.serialize();
    if(tmp.indexOf('&extension=on')){
        //console.log('Filtering by extension');
        tmp=tmp.replace('&extension=on',`&extension=on&bbox=${encodeURIComponent(searchParams.bbox)}`);
    }
    return tmp;
};

$.fn.deserialize = function (serializedString)
{
    var $form = $(this);
    $form[0].reset();    // (A) optional
    serializedString = serializedString.replace(/\+/g, '%20'); // (B)
    var formFieldArray = serializedString.split("&");

    $('#search-form input[type="checkbox"]').prop('checked', false);

    // Loop over all name-value pairs
    $.each(formFieldArray, function(i, pair){
        var nameValue = pair.split("=");
        var name = decodeURIComponent(nameValue[0]); // (C)
        var value = decodeURIComponent(nameValue[1]);
        // Find one or more fields
        var $field = $form.find('[name="' + name + '"]');

        // Checkboxes and Radio types need to be handled differently
        if($field[0] && $field[0].type){
            if ($field[0].type == "radio" || $field[0].type == "checkbox")
            {
                var $fieldWithValue = $field.filter('[value="' + value + '"]');
                var isFound = ($fieldWithValue.length > 0);
                // Special case if the value is not defined; value will be "on"
                if (!isFound && value == "on") {
                    $field.first().prop("checked", true);
                } else {
                    $fieldWithValue.prop("checked", isFound);
                }
            } else { // input, textarea
                $field.val(value);
            }
        } else{
            // CUSTOM CODE TO SET IFRAME EXTENSION
            if(serializedString.indexOf('&extension=on&bbox=')!==-1){
                console.log("Need to SET IFRAME EXTENSION")
                console.log("bbox=",value)
                searchParams.bbox=value;
                document.getElementById('extensionMap').contentWindow.postMessage(value, '*');
            }

        }
    });



    return this;
}

window.onmessage = function(e){
    if(e.data != null){
        $APP.projectedExtent = e.data;
        //console.log("From parent=",$APP.projectedExtent)
        searchParams.bbox = `${e.data.xmin}, ${e.data.ymin}, ${e.data.xmax}, ${e.data.ymax}`
    }
};
