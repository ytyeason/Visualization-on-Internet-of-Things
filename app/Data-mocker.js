const io = require('socket.io-client');
const socket = io('http://localhost:3000');
var clusterMaker = require('clusters');

var x = 0;
let Jeep_list = [];
let Ford_list = [];

let meanShift = require('./Dashboard/meanshift');


function randomIntInc(low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low)
}

// setInterval(() => {
//     var data = {};
//
//     data.x = x;
//     data.y = Math.floor((Math.random() * 30) + 1);
//     data.gateIndex = 0;
//     data.id = 0;
//     x++;
//     // console.log("pushed data.x: " + data.x + " data.y: " + data.y);
//     socket.emit('newDataPoint', data);
//
//     data.x = x;
//     data.y = Math.floor((Math.random() * 30) + 1);
//     data.gateIndex = 1;
//     data.id = 1;
//     x++;
//     // console.log("pushed data.x: " + data.x + " data.y: " + data.y);
//     socket.emit('newDataPoint', data);
// }, 500);

var buff_timeStamp = new Date().getTime();

setInterval(() => {

    Jeep_list.push([randomIntInc(10,20),randomIntInc(30,40)]);
    Jeep_list.push([randomIntInc(30,40),randomIntInc(50,60)]);
    // Jeep_list.push([randomIntInc(80,90),randomIntInc(80,90)]);
    // Jeep_list.push([randomIntInc(5,10),randomIntInc(20,30)]);
    // Jeep_list.push([randomIntInc(15,25),randomIntInc(25,35)]);
    // Jeep_list.push([randomIntInc(37,47),randomIntInc(58,68)]);
    // Jeep_list.push([randomIntInc(88,98),randomIntInc(88,99)]);

    let Jeep_meanshift_points;
    let Jeep_meanshift_centroids;
    let cluster_number;
    if((new Date().getTime()-buff_timeStamp)/1000 >= 2){//second

        let meanShift_result = meanShift.fit(Jeep_list,10,2);
        Jeep_meanshift_points = meanShift_result[0];
        Jeep_meanshift_centroids = meanShift_result[1];
        cluster_number = Jeep_meanshift_centroids.length;
        console.log(Jeep_meanshift_points);
    }


    if((new Date().getTime()-buff_timeStamp)/1000 >= 4){//second

        let cluster_name_list = [];
        for(let i = 0; i<cluster_number; i++){
            cluster_name_list.push("Jeep"+i);
        }

        for(let i =0; i<cluster_number; i++){
            let bubble_data = {};
            bubble_data.x = Jeep_meanshift_points[i].centroid[0];
            bubble_data.y = Jeep_meanshift_points[i].centroid[1];
            bubble_data.points = Jeep_meanshift_points[i].points;
            bubble_data.size = Jeep_meanshift_points[i].points.length;
            bubble_data.car_brand = "Jeep"+i;
            bubble_data.id = 2;
            if(i===0){
                bubble_data.clusterList = cluster_name_list;
            }
            // console.log("pushed bubble_data.x: " + bubble_data.x + " bubble_data.y: " + bubble_data.y);
            // console.log("pushed bubble_data.car_brand: " + bubble_data.car_brand);
            // console.log("pushed bubble_data.size: " + bubble_data.size);
            socket.emit('newBubbleDataPoint', bubble_data);
        }

        buff_timeStamp = new Date().getTime();

    }

}, 500);


//define ranges
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
let device_id = 0;
let device_dict = {};


setInterval(() => {
    let Grid_data = {};

    let data1 = [randomIntInc(60,80),randomIntInc(80,100),randomIntInc(1,10), ++device_id];//[x,y,temp,device_id]

    let grid1 = [parseInt(data1[0]/10,10), parseInt(data1[1]/10,10), data1[2], data1[3]];//[y,x,temp,device_id] in echart binstore format

    //for grid1
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
    // grid1 ends.........
    console.log("data1 ");
    console.log(grid_list);


    //for grid2
    let data2 = [randomIntInc(30,50),randomIntInc(60,80),randomIntInc(5,10), ++device_id];

    let grid2 = [parseInt(data2[0]/10,10), parseInt(data2[1]/10,10), data2[2], data2[3]];//[y,x,other,device_id] in echart binstore format
    //
    if(device_dict[grid2[3]]==undefined){//new device,add data points to grid list

        device_dict[grid2[3]] = [grid2[0],grid2[1],grid2[2]];//add the device id and (location,temp) pair to the device dictionary

    }else{//old device, delete from old grid

        console.log("old device");
        //delete this device from the old grid
        let old_location = device_dict[grid2[3]].slice(0,2);// get the old location of this device
        let old_temp = device_dict[grid2[3]][2];//get the old temperature from the device dictionary using the device id as key
        let old_grid = grid_list[grid_dict[old_location]];//use the old location to get the index from grid_dict, then use this index to get old grid from grid_list
        //remove the old temperature, remove the device from device list and decrease the counter
        old_grid[3].splice(old_grid[3].indexOf(grid2[3]));
        let new_grid = [old_grid[0], old_grid[1], old_grid[2]-old_temp, old_grid[3], old_grid[4]-1];

        grid_list[grid_dict[old_location]] = new_grid;

        //refresh location of this device
        device_dict[grid2[3]] = [grid2[0],grid2[1],grid2[2]];
    }

    //add this point to other grids
    if(grid_dict[grid2.slice(0,2)] == undefined){//new grid

        grid_dict[grid2.slice(0,2)] = grid_list.length;
        let new_grid = [grid2[0], grid2[1], grid2[2], [grid2[3]], 1];
        grid_list.push(new_grid); //[y,x,temp,[device_id],count]

    }else{
        let old_grid = grid_list[grid_dict[grid2.slice(0,2)]];
        old_grid[3].push(grid2[3]);//update device list here
        let new_grid = [old_grid[0], old_grid[1], old_grid[2]+grid2[2], old_grid[3], old_grid[4]+1];//update temp and count
        grid_list[grid_dict[grid2.slice(0,2)]] = new_grid;
    }
    // grid2 ends.........
    console.log("grid2 ");
    console.log(grid_list);

    Grid_data.grid_list = grid_list;
    Grid_data.x_list = x_list;
    Grid_data.y_list = y_list;

    socket.emit('newGridDataPoint', Grid_data);


}, 500);
