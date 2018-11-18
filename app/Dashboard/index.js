// Root File for Page Dashboard
import React from 'react';
import {inject, observer} from 'mobx-react';
import {Panel, FormSet, NavBar, FixTable} from 'Components';
import io from 'socket.io-client';
import Echarts from 'Echarts/Echarts';

@inject("FormsetStore", "StackedgraphStore", "ScatterStore", "BubbleStore", "BinStore")
@observer
export default class Dashboard extends React.Component {
    componentDidMount() {
        if (!this.socket) {
            this.socket = io.connect('/');
            this.socket.on('newDataPoint', function (data) {
                if (data.body.id == 0) this.props.StackedgraphStore.addDataPoints(data.body.x, data.body.y, data.body.gateIndex);
                if (data.body.id == 0) this.props.ScatterStore.addDataPoints(data.body.x, data.body.y, data.body.gateIndex);

                if (data.body.id == 1) this.props.StackedgraphStore.addDataPoints(data.body.x, data.body.y, data.body.gateIndex);
                if (data.body.id == 1) this.props.ScatterStore.addDataPoints(data.body.x, data.body.y, data.body.gateIndex);

            }.bind(this));
            this.socket.on('setArray', function (data) {
                if (data.body.id == 0) this.props.StackedgraphStore.setArray(data.array, data.body.gateIndex);
                if (data.body.id == 0) this.props.ScatterStore.setArray(data.array, data.body.gateIndex);

                if (data.body.id == 1) this.props.StackedgraphStore.setArray(data.array, data.body.gateIndex);
                if (data.body.id == 1) this.props.ScatterStore.setArray(data.array, data.body.gateIndex);

            }.bind(this));

            this.socket.on('BubbleDataPoint', function (data) {

                if (data.body.id == 2)
                    this.props.BubbleStore.addDataPoints(data.body.x, data.body.y, data.body.car_brand, data.body.size, data.body.clusterList, data.body.points);
                if (data.body.id == 3)
                    this.props.BubbleStore.addDataPoints(data.body.x, data.body.y, data.body.car_brand, data.body.size, data.body.clusterList, data.body.points);

            }.bind(this));

            this.socket.on('newGridDataPoint', function (data) {

                this.props.BinStore.addDataPoints(data.body);
            }.bind(this));
        }
    }

    render() {
        const StackedgraphStore_stackedgraph = this.props.StackedgraphStore.stackedGraph;
        const ScatterStore_scatter = this.props.ScatterStore.scatter;
        const bubbleStore_data = this.props.BubbleStore.scatter;
        const binStore_data = this.props.BinStore.bin;

        return <div><Panel title="Stackedgraph"> <Echarts style={{width: '100%', height: '365px'}}
                                                          option={StackedgraphStore_stackedgraph}/> </Panel>
            <Panel title="Scatter"> <Echarts style={{width: '100%', height: '365px'}} option={ScatterStore_scatter}/>
                <Echarts style={{width: '100%', height: '365px'}} option={bubbleStore_data}/>
                <Echarts style={{width: '100%', height: '365px'}} option={binStore_data}/>
            </Panel>
        </div>
    }
};