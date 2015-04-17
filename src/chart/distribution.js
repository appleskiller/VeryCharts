define(function (require , exports , module) {
    "use strict";
    require("d3");
    
    function DistributionChart() {
        console.log(d3.scale.linear().ticks(10));
        d3.select("#chart")
            .data(d3.scale.linear().ticks(10))
            .enter()
            .append("div")
            .html("asdf")
    }
    
    
    module.exports = DistributionChart;
})