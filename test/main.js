requirejs.config({
    baseUrl: "../src" ,
    paths: {
        "d3": "../test/lib/d3" ,
        "oop": "core/oop"
    }
});

requirejs(["chart/distribution"] , function (DistributionChart) {
    var chart = new DistributionChart();
    
})