
function graph(user,room,name) {
    $(function () {
        
        Highcharts.setOptions({
            global: {
                useUTC: false
            }
        });

        chartOptions = {

            chart : {
                zoomType: 'x',
                renderTo: 'graph_container',
                animation: false
            },

            rangeSelector: {
                buttons: [{
                    type: 'day',
                    count: 1,
                    text: 'Day'
                }, {
                    type: 'week',
                    count: 3,
                    text: 'Week'
                }],
                selected: 0
            },

            title: {
                text: name
            },
        
            subtitle: {
                text: ''
            },
            xAxis: {
                type: 'datetime'
            },
            yAxis: {
                title: {
                    text: 'Value'
                }  
            },

            //series :  [{turboThreshold:0}],

            legend: {
                enabled: true,
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            credits: {
                enabled: false
            }
        }    
        chart = new Highcharts.StockChart(chartOptions);
        chart.showLoading();

        getData("user/"+user+"/room/"+room+"/sensors", function(sensors) {
            $.each(sensors, function(index, sensor) {
                if (index == sensors.length-1) {
                    chart.hideLoading();
                }
                getMeasurements(user, room, sensor.quantity, 'week', 0, function(data) {
                    if (sensor.unitTypeId == 17) { // online occupancy detection
                        //console.log("add PLotbands")
                        for (i=0;i<data.length-1;i++) {
                            if (i==0 && data[i].value == 0) {
                                chart.xAxis[0].addPlotBand({
                                    color: '#ffe990',
                                    from: chart.xAxis[0].min,
                                    to: data[i].timestamp
                                })

                            }
                            else if (data[i].value == 1) {
                                chart.xAxis[0].addPlotBand({
                                    color: '#ffe990',
                                    from: data[i].timestamp,
                                    to: data[i+1].timestamp
                                })  
                            }
                        }
                               
                    }
                    else if (sensor.unitTypeId == 13) { // iBeacons
                        //console.log("add PLotbands")
                        for (i=0;i<data.length-1;i++) {
                            if (i==0 && data[i].value == 0) {
                                chart.xAxis[0].addPlotBand({
                                    color: 'rgba(46,154,254,0.5)',
                                    from: chart.xAxis[0].min,
                                    to: data[i].timestamp
                                })

                            }
                            else if (data[i].value == 1) {
                                chart.xAxis[0].addPlotBand({
                                    color: 'rgba(46,154,254,0.5)',
                                    from: data[i].timestamp,
                                    to: data[i+1].timestamp
                                })  
                            }
                        }
                               
                    }
                    else if (sensor.unitTypeId == 12) { // groundtruth
                        console.log("groundTruth unittype 12");
                        for (i=0;i<data.length-1;i++) {
                            if (i==0 && data[i].value == 0) {
                                chart.xAxis[0].addPlotBand({
                                    color: '#00FF00',
                                    from: chart.xAxis[0].min,
                                    to: data[i].timestamp
                                })

                            }
                            else if (data[i].value == 1) {
                                chart.xAxis[0].addPlotBand({
                                    color: '#00FF00',
                                    from: data[i].timestamp,
                                    to: data[i+1].timestamp
                                })  
                            }
                        }
                               
                    }
                    else if (sensor.unitTypeId == 7 ) { // PIR motion detectors
                        console.log("PIR")
                        $.each(data, function(i,point) {
                            chart.xAxis[0].addPlotLine({
                                value: parseInt(point.timestamp),
                                color: '#D3D3D3',
                                width : 2
                            })    
                        }); 
                    }
                    else {
                        $.each(data, function(i,point) {
                            point.x = parseInt(point.timestamp);
                            point.y = point.value;
                        }); 
                        chart.addSeries({
                            type : 'spline',
                            name : sensor.name,
                            data : data,
                            enableMouseTracking : false,
                            turboThreshold: 0,
                            dataGrouping: {
                                enabled: true,
                                units: [ ['hour', [1,2,3,4,5,6] ] ]
                            }
                        });
                    }    
                }); 
            })
            
        })   

           
    
    });
}    

function getMeasurements(user, room, quantity, period, delta, callback) {
        //console.log("Inside getData");
        $.getJSON('http:///213.165.92.187:8080/api/user/'+user+'/room/'+room+'/quantity='+quantity+'&period='+period+'?callback=?', function(result) {
            callback(result);
        })
    }  