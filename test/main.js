requirejs.config({
    baseUrl: "../src" ,
    paths: {
        "d3": "../test/lib/d3" ,
        
        "oop": "core/oop" ,
        "evts": "core/evts" ,
        
        "verycharts": "verycharts" ,
        "verycharts/Chart": "core/Chart" ,
        "verycharts/ChartDefault": "core/ChartDefault" ,
        "verycharts/ChartFactory": "core/ChartFactory" ,
        "verycharts/Component": "core/Component" ,
        "verycharts/Element": "core/Element" ,
        "verycharts/helper": "core/helper" ,
    }
});

requirejs(["chart/distribution"] , function (DistributionChart) {
    var chart = new DistributionChart();
    
})