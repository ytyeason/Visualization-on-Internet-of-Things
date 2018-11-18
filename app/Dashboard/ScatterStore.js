//Store File for ScatterStore
import {autorun, observable, computed} from 'mobx';

class ScatterStore {
    reset() {
        this.map = this.map.map(e => {
            return 0
        })
    }

    changeValue(value, param) {
        this.map[param] = value;
    }

    @observable array = [[], []];

    @computed get scatter() {

        // console.log(this.array);
        var devices = this.array.toJSON().map(device => (device.toJSON()));
        var data = [];
        devices.forEach(function (e) {
            data.push(e.map(dataPoints => dataPoints.toJSON()))
        });

        var option = {
            title: {
                subtext: '',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross'
                }
            },
            legend: {
                data: data.map((e, idx) => {
                    return 'Device-' + idx;
                })
            },
            dataZoom: {
                show: true,
                start: 70
            },
            xAxis: {
                type: 'value',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
            },
            yAxis: {
                type: 'value',
                min: 1.5,
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true
            },
            series: data.map((e, idx) => {
                var obj = {};
                obj.name = 'Device-' + idx;
                obj.type = 'scatter';
                obj.label = {
                    emphasis: {
                        show: true,
                        position: 'left'
                    }
                }
                obj.data = e;
                return obj;
            })
        };
        return option;
    }

    addDataPoints(x, y, gateIndex) {
        for (var i = 0; i < gateIndex - this.array.length + 1; i++) {
            this.array.push([]);
        }
        this.array[gateIndex].push([x, y])
    };

    setArray(array, gateIndex) {
        for (var i = 0; i < gateIndex - this.array.length + 1; i++) {
            this.array.push([]);
        }
        this.array[gateIndex] = array;
    };
}

var store = window.store = new ScatterStore;
export default store