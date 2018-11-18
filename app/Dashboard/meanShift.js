

//mean shift
function fit(data,radius){

    var centroids = [];
    for(let i=0;i<data.length;i++){
        centroids[i]=data[i];
    }

    while(true){
        let new_centroids = [];
        let new_centroids_points = [];

        for(let i=0;i<centroids.length;i++){

            let in_bandwidth=[];
            var centroid = centroids[i];
            for(let i=0;i<data.length;i++){
                if(getDistance(data[i],centroid)<radius){
                    in_bandwidth.push(data[i]);
                }
            }
            let new_centroid = getAverage(in_bandwidth);
            new_centroids.push(new_centroid);

            //new centroids with points
            let new_centroid_points = {};
            new_centroid_points.centroid = new_centroid;
            new_centroid_points.points = in_bandwidth;
            new_centroids_points.push(new_centroid_points);
        }

        var uniques = removeDupFromMultiArr(new_centroids);
        var prev_centroids = JSON.parse(JSON.stringify(centroids));

        centroids = [];
        for(let i=0;i<uniques.length;i++){
            centroids[i] = uniques[i];
        }
        var optimized = true;

        for(let i=0;i<centroids.length;i++){
            if(!arraysEqual(centroids[i],prev_centroids[i])){
                optimized = false;
            }
            if (!optimized){
                break;
            }
        }
        if(optimized){
            //return centroids;
            return [new_centroids_points,centroids];//return centroids with points and without points
            break;
        }

    }
}

function removeDupFromMultiArr( arr){

    var uniques = [];
    var centroid_distance = 2;

    for(var i = 0; i<arr.length; i++){

        let unique = true;
        for (var j = 0; j<uniques.length; j++){

            if((Math.abs(arr[i][0]-uniques[j][0])<centroid_distance)&&(Math.abs(arr[i][0]-uniques[j][0])<centroid_distance)){//if within range of 5, abandon this center
                unique = false;
                break;
            }

        }

        if(unique){
            uniques.push(arr[i]);
        }

    }

    return uniques;

}

function getDistance( arr1,  arr2){
    var diff_x = arr1[0]-arr2[0];
    var diff_y = arr1[1]-arr2[1];
    var dis_square = diff_x*diff_x + diff_y*diff_y;
    return Math.sqrt(dis_square);
}

function getAverage( arr){
    var num = arr.length;
    var sum_x=0;
    var sum_y=0;

    for(let i=0;i<arr.length;i++){
        sum_x = sum_x + arr[i][0];
        sum_y = sum_y + arr[i][1];
    }

    var x = sum_x / num;
    var y = sum_y / num;
    var tmp = [];
    tmp.push(+(x.toFixed(2)));
    tmp.push(+(y.toFixed(2)));

    return tmp;
}

function arraysEqual(a1,a2) {
    return JSON.stringify(a1)==JSON.stringify(a2);
}

// console.log(fit(data,radius));
module.exports = {
    fit : function (d, r) {
        return fit(d,r);
    }
};