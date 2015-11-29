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
        "verycharts/Component/DataGrid": "component/dataGrid" 
    } ,
    shim: {
        "d3":{
            exports: "d3"
        }
    } ,
    waitSeconds: 20
});

requirejs(["d3" , "verycharts" , "verycharts/ChartRenderer" , "verycharts/Component/DataGrid"] , function (d3 , verycharts , ChartRenderer , dataGrid) {
    // var chart = verycharts.create(document.getElementById("chart"));
    // chart.options({});
    var dg = new dataGrid.DataGrid(this , new ChartRenderer(d3.select(document.getElementById("chart"))
                                            .append("svg")
                                            .attr("width" , 600)
                                            .attr("height" , 400)
                                            .node()))
    dg.options({viewModel: "full"})
        .data({
            header: [
                {groupType: "row" , name: "性别"} , {groupType: "row" , name: "姓名"} , 
                {groupType: "row" , name: "籍贯"} , {groupType: "row" , name: "年龄" , fieldType: "measure"}
            ] ,
            data: [
                ["A" , "a" , "AA" , 19] ,
                ["A" , "b" , "AA" , 20] ,
                ["C" , "c" , "AA" , 21] ,
                ["D" , "d" , "BB" , 22] ,
                ["D" , "e" , "BB" , 23] ,
                ["F" , "f" , "BB" , 24]
            ]
        })
        .layout({x: 0 , y: 0 , width: 600 , height: 400});
    dg.render();
})