requirejs.config({
    baseUrl: "../src" ,
    paths: {
        "d3": "../test/lib/d3" ,
        "oop": "core/oop" ,
        "evts": "core/events" ,
        
        "verycharts/Chart": "core/Chart" ,
        "verycharts/Component": "core/Component" ,
        "verycharts/Element": "core/Element" ,
    }
});

requirejs(["chart/distribution"] , function (DistributionChart) {
    var chart = new DistributionChart();
    
})