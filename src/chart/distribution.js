define(function (require , exports , module) {
    "use strict";
    require("d3");
    
    function DistributionChart() {
        var tickData = d3.scale.linear().ticks(10);
        var svg = d3.select("#chart")
                    .append("svg")
                    .attr("width" , 600)
                    .attr("height" , 400)
                    .append("g")
        
        svg.selectAll(".tick")
            .data(tickData)
            .enter()
            .append("rect")
            .attr("class" , "tick")
            .attr("x" , function (v , ind) {
                return ind * 10;
            })
            .attr("width" , 9)
            .attr("height" , 4);
        svg.selectAll(".label")
            .data(tickData)
            .enter()
            .append("text")
            .text(function (v) {
                return v
            })
            .attr("class" , "label")
            .attr("x" , function (v , ind) {
                return ind * 24;
            })
            .attr("y" , 20)
    }
    
    module.exports = DistributionChart;
})