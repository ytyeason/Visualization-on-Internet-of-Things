//Store File for BubbleStore
import {autorun, observable, computed} from 'mobx';

import echarts from "echarts";


class BinStore {

    @observable x = [];
    @observable y = [];
    @observable grids = [];
    
    @computed get bin() {

        let x_list = this.x.toJSON();
        let y_list = this.y.toJSON();
        let grid_list = this.grids.toJSON().map( d => d.toJSON());

        let data = grid_list.map(function (item) {
            return [item[0], item[1], +((item[2]/item[4]).toFixed(2)) || '-', item[4],item[3].toJSON()];
        });

        console.log(data);

        let option = {
            tooltip: {
                position: 'top',
                formatter: function(data){
                    let list = "";
                    for(let device in data.data[4]){
                        list = list + data.data[4][device] + " ";
                        if(device%5==0){
                            list += "</br>";
                        }
                    }
                    return "Average temperature: " + data.data[2] +"</br>" + "number of devices: " + data.data[3] + " </br> devices: " + list;
                }
            },
            animation: false,
            grid: {
                height: '50%',
                y: '10%'
            },
            xAxis: {
                name:"Latitude",
                type: 'category',
                data: x_list,
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                name:"Longitude",
                type: 'category',
                data: y_list,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: 10,
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '15%',
                dimension: 1
            },
            series: [{
                name: 'Temperature',
                type: 'heatmap',
                data: data,
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }]
        };

        return option;

    }

    addDataPoints(body) {

        this.x = body.x_list;
        this.y = body.y_list;
        this.grids = body.grid_list;

    };

}

var store = window.store = new BinStore();
export default store