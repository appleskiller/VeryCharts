define(function (require , exports , module) {
    module.exports = {
        groupType: {
            COLUMN: "column" ,
            ROW: "row" ,
            VALUE: "value" ,
            COLOR: "color" ,
            SIZE: "size" ,
            LEGEND: "legend" ,
            ATTRIBUTE: "attribute"
        } ,
        viewModel: {
            FULL: "full" ,
            FIT_WIDTH: "fitwidth" ,
            FIT_HEIGHT: "fitheigh" ,
            NORMAL: "normal"
        } ,
        prop2css: {
            "fontSize": "font-size" ,
            "fontWeight": "font-weight" ,
            "fontFamily": "font-family"
        }
    };
});