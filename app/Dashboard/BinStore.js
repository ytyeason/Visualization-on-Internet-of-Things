//Store File for BubbleStore
import {autorun, observable, computed} from 'mobx';

import echarts from "echarts";

let low_x = 0;
let high_x = 100;
let low_y = 0;
let high_y = 100;
let bin_size = 10;
let x_list = [];
let y_list = [];

for(let i = low_x; i<=high_x; i=i+bin_size){
    x_list.push(i);
}
for(let i = low_y; i<=high_y; i=i+bin_size){
    y_list.push(i);
}

let grid_dict = {};//store the index of each grid in grid_list
let grid_list = [];//store the actual grids i the format of [x,y,temp,points,count]
let device_dict = {};

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
                        if(device%5==0){
                            list += "</br>";
                        }
                        list = list + data.data[4][device] + " ";

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

        let data1 = body.data;

        let grid1 = [parseInt(data1[0]/body.bin_size,10), parseInt(data1[1]/body.bin_size,10), data1[2], data1[3]];//[y,x,temp,device_id] in echart binstore format

        if(device_dict[grid1[3]]==undefined){//new device,add data points to grid list

            device_dict[grid1[3]] = [grid1[0],grid1[1],grid1[2]];//add the device id and (location,temp) pair to the device dictionary

        }else{//old device, delete from old grid

            console.log("old device");
            //delete this device from the old grid
            let old_location = device_dict[grid1[3]].slice(0,2);// get the old location of this device
            let old_temp = device_dict[grid1[3]][2];//get the old temperature from the device dictionary using the device id as key
            let old_grid = grid_list[grid_dict[old_location]];//use the old location to get the index from grid_dict, then use this index to get old grid from grid_list
            //remove the old temperature, remove the device from device list and decrease the counter
            old_grid[3].splice(old_grid[3].indexOf(grid1[3]));
            let new_grid = [old_grid[0], old_grid[1], old_grid[2]-old_temp, old_grid[3], old_grid[4]-1];

            grid_list[grid_dict[old_location]] = new_grid;

            //refresh location of this device
            device_dict[grid1[3]] = [grid1[0],grid1[1],grid1[2]];
        }

        //add this point to other grids
        if(grid_dict[grid1.slice(0,2)] == undefined){//new grid

            grid_dict[grid1.slice(0,2)] = grid_list.length;
            let new_grid = [grid1[0], grid1[1], grid1[2], [grid1[3]], 1];
            grid_list.push(new_grid); //[y,x,temp,[device_id],count]

        }else{
            let old_grid = grid_list[grid_dict[grid1.slice(0,2)]];
            old_grid[3].push(grid1[3]);//update device list here
            let new_grid = [old_grid[0], old_grid[1], old_grid[2]+grid1[2], old_grid[3], old_grid[4]+1];//update temp and count
            grid_list[grid_dict[grid1.slice(0,2)]] = new_grid;
        }

        if((low_x!==body.low_x)||(high_x!==body.high_x)||(bin_size!==body.bin_size)){
            x_list = [];
            for(let i = body.low_x; i<=body.high_x; i=i+body.bin_size){
                x_list.push(i);
            }
        }

        if((low_y!==body.low_y)||(high_y!==body.high_y)||(bin_size!==body.bin_size)){
            y_list = [];
            for(let i = body.low_y; i<=body.high_y; i=i+body.bin_size){
                y_list.push(i);
            }
        }

        this.x = x_list;
        this.y = y_list;
        this.grids = grid_list;

    };

}

var store = window.store = new BinStore();
export default store