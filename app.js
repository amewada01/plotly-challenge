function buildMetadata(sample) {
 
    var url = "/metadata/" + sample;
    d3.json(url).then(function(sample) {

             var sample_metadata = d3.select("#sample-metadata");

             sample_metadata.html("");
 
            Object.entries(sample).forEach(([key, value]) => {
                    var row = sample_metadata.append("p");
                    row.text(`${key}: ${value}`);

                }) 
        })  
};  

function buildBarChart(sample) {
     var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {
        var ybar = data.otu_ids;
        var xbar = data.sample_values;
        var barHover = data.otu_labels;

         var trace1 = {
            y: ybar.slice(0, 10).map(object => `OTU ${object}`).reverse(),
            x: xbar.slice(0, 10).reverse(),
            hovertext: barHover.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }
        var data = [trace1];

         var layout = {
            title: "Top 10 OTUs",
            showlegend: true,
            margin: {
                l: 75,
                r: 75,
                t: 75,
                b: 75
            }  
        };  

         Plotly.newPlot("plot", data, layout);
    }); 
}  

 function buildGaugeChart(sample) {

     var url = `/metadata/${sample}`;
    d3.json(url).then(function(data) {
         var freqValues = data.WFREQ;
         var data2 = [{
                type: "indicator",
                mode: "gauge+number",
                value: freqValues,
                title: { text: "Belly Button Washing Frequency</b> <br> Scrubs per Week", font: { size: 18 } },
                gauge: {
                    axis: { range: [null, 9], tickwidth: 1, tickcolor: "black" },  
                    bar: { color: "black" },  
                    borderwidth: 3,
                    bordercolor: "black",
                     steps: [
                        { range: [0, 1], color: "lightcoral" },
                        { range: [1, 2], color: "lightpink" },
                        { range: [2, 3], color: "yellowgreen" },
                        { range: [3, 4], color: "lightgreen" },
                        { range: [4, 5], color: "green" },
                        { range: [5, 6], color: "lightblue" },
                        { range: [6, 7], color: "cyan" },
                        { range: [7, 8], color: "royalblue" },
                        { range: [8, 9], color: "blue" }
                    ],  
                }  
            }  

        ]; 

        var layout2 = {
            width: 500,
            height: 500,
            margin: { t: 15, r: 15, l: 15, b: 15 },
            font: { color: "black", family: "Arial" }
        };  

          Plotly.newPlot("gauge", data2, layout2);
    });  
}  
 function buildPieChart(sample) {

     var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {
        var values = data.sample_values.slice(0, 10);
        var labels = data.otu_ids.slice(0, 10);
        var display = data.otu_labels.slice(0, 10);

        var data3 = [{
            values: values,
            labels: labels,
            hovertext: display,
            type: 'pie',
            marker: {
                colorscale: "Earth"
            }
        }];

        var layout3 = {
            title: 'Percent OTUs',
            showlegend: true,
            height: 600,
            width: 600
        };
        Plotly.newPlot('pie', data3, layout3);
    });
}

 function buildCharts(sample) {

     var url = `/samples/${sample}`;
    d3.json(url).then(function(data) {

         var xValues = data.otu_ids;
        var yValues = data.sample_values;
        var tValues = data.otu_labels;
        var mSize = data.sample_values;
        var mClrs = data.otu_ids;

        var trace_bubble = {
            x: xValues,
            y: yValues,
            text: tValues,
            mode: 'markers',
            marker: {
                size: mSize,
                color: mClrs
            }  
        }; 

        var data4 = [trace_bubble];

        var layout4 = {
            xaxis: { title: "OTU ID" }
        };  

        Plotly.newPlot('bubble', data4, layout4);

    });  
}  

function init() {
     var selector = d3.select("#selDataset");

     d3.json("/names").then((sampleNames) => {
        sampleNames.forEach((sample) => {
            selector
                .append("option")
                .text(sample)
                .property("value", sample);
        }); 


        const firstSample = sampleNames[0];
        buildBarChart(firstSample);
        buildPieChart(firstSample);
        buildGaugeChart(firstSample);
        buildCharts(firstSample);
        buildMetadata(firstSample);
    }); 
}; 

function optionChanged(newSample) {
    buildBarChart(newSample);
    buildPieChart(newSample);
    buildGaugeChart(newSample);
    buildCharts(newSample);
    buildMetadata(newSample);

}; 


init();