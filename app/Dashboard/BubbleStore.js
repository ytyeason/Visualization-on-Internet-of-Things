//Store File for BubbleStore
import {autorun, observable, computed} from 'mobx';

import echarts from "echarts";

let dictionary = {};
let old_s = [];

class BubbleStore {

    @observable s = [];

    @computed get scatter() {

        let legend_list = Object.keys(dictionary);

        let first_layer = this.s.toJSON();

        let second_layer = first_layer.map( d => d.toJSON());

        let third_layer = second_layer.map( d => d.map( e => e.toJSON()));
        console.log("third_layer: ");
        console.log(third_layer);

        old_s = third_layer;

        let option = {
            backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
                offset: 0,
                color: '#f7f8fa'
            }, {
                offset: 1,
                color: '#cdd0d5'
            }]),
            title: {
                text: 'brand car distribution'
            },
            legend: {
                right: 10,
                data: legend_list
            },
            xAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true
            },
            // series: this.generateSeries(third_layer, legend_list)
            series: third_layer.map((d,index) => {

                let legend_name = Object.keys(dictionary).find(key => dictionary[key] === index);
                console.log(legend_name);
                console.log(d);

                var obj = {};
                obj.name = legend_name;
                obj.data = d;
                obj.type = 'scatter';
                obj.label = {
                    emphasis: {
                        show: true,
                        position: 'left',
                        formatter: function(){ return legend_name+ ", size "+ d[0][2]; }
                    }
                };
                obj.symbolSize = function(){ return Math.min(d[0][2],50); };
                obj.itemStyle =  {
                    normal: {
                        shadowBlur: 10,
                        shadowColor: 'rgba(25, 100, 150, 0.5)',
                        shadowOffsetY: 5,
                        color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                            offset: 0,
                            color: 'rgb(251, 118, 123)'
                        }, {
                            offset: 1,
                            color: 'rgb(204, 46, 72)'
                        }])
                    }
                };
                return obj;
            })
        };

        return option;
    }

    addDataPoints(x, y, carbrand, size, clusterList, points) {

        if(clusterList !== undefined){//new clusterList
            let old_dictionary = dictionary;
            dictionary = {};
            let new_s = [];
            clusterList.forEach(function (name) {//refresh dictionary,remove old extra cluster and add new cluster

                dictionary[name] = new_s.length;//keep the index of each brand in the array, do it before s changes
                var o = [];
                if(old_s[old_dictionary[name]]===undefined){//new cluster
                    o.push([x,y,size]);
                }else{
                    if(carbrand===name){
                        o.push([x,y,size]);//update
                    }else{
                        o.push(old_s[old_dictionary[name]][0]);//old_s[old_dictionary[name]] is a double array
                    }
                }

                new_s.push(o);
            });
            this.s = new_s;//refresh s

        }else{//clusterList has been defined
            this.s[dictionary[carbrand]] = [[x,y,size]];//replace the cluster point for that group
        }

    };

}

var store = window.store = new BubbleStore;
export default store