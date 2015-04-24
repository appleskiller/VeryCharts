requirejs.config({
    baseUrl: "../src" ,
    paths: {
        "d3": "../test/lib/d3" ,
        
        "oop": "core/oop" ,
        "evts": "core/evts" ,
        "display": "core/display" ,
        
        "verycharts": "verycharts" ,
        "verycharts/Chart": "core/Chart" ,
        "verycharts/consts": "core/consts" ,
        "verycharts/helper": "core/helper" ,
        
        "verycharts/ChartDefault": "core/ChartDefault" ,
        "verycharts/ChartRenderer": "core/ChartRenderer" ,
        "verycharts/ChartFactory": "core/ChartFactory" ,
        "verycharts/ChartPlot": "core/ChartPlot" ,
        "verycharts/Component": "core/Component" ,
        "verycharts/Element": "core/Element" ,
        
        "verycharts/htmlUtil": "util/htmlUtil"
    }
});

requirejs(["chart/distribution"] , function (DistributionChart) {
    var chart = new DistributionChart();
    
})