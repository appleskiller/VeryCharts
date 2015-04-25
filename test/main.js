requirejs.config({
    baseUrl: "../src" ,
    paths: {
        "d3": "../test/lib/d3" ,
        
        "oop": "core/oop" ,
        "evts": "core/evts" ,
        "display": "core/display" ,
        
        "verycharts": "verycharts" ,
        "verycharts/consts": "core/consts" ,
        "verycharts/helper": "core/helper" ,
        "verycharts/htmlUtil": "util/htmlUtil" ,
        
        "verycharts/Chart": "core/Chart" ,
        "verycharts/ChartDefault": "core/ChartDefault" ,
        "verycharts/ChartRenderer": "core/ChartRenderer" ,
        "verycharts/ChartFactory": "core/ChartFactory" ,
        "verycharts/ChartPlot": "core/ChartPlot" ,
        "verycharts/Component": "core/Component" ,
        
        "verycharts/Component/Title": "component/Title" ,
    } ,
    shim: {
        "d3":{
            exports: "d3"
        }
    }
});

requirejs(["verycharts"] , function (verycharts) {
    var chart = verycharts.create(document.getElementById("chart"));
    chart.options({});
})