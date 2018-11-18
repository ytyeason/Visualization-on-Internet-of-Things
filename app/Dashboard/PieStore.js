//Store File for PieStore
import {autorun, observable, computed} from 'mobx';

class PieStore {
    reset() {
        this.map = this.map.map(e => {
            return 0
        })
    }

    changeValue(value, param) {
        this.map[param] = value;
    }

    @observable array = [[], []];

    @computed get pie() {
        var devices = this.array.toJSON().map(device => (device.toJSON()));
        var data = [];
        devices.forEach(function (e) {
            data.push(e.map(dataPoints => dataPoints.toJSON()))
        });

        var option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}:{c}({d}%)"
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: data.map((e, idx) => {
                    return 'Device-' + idx
                })
            },
            series: [
                {
                    name: 'Device Distribution',
                    type: 'pie',
                    radius: ['50%', '70%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data: data.map((e, idx) => {
                        var obj = {};
                        obj.value = e.length;
                        obj.name = 'Device-' + idx;
                        return obj;
                    })
                }
            ]
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

var store = window.store = new PieStore;
export default store