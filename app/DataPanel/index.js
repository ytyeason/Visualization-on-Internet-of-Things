// Root File for Page Data Panel
import React from 'react';import {inject, observer} from 'mobx-react';import {Panel, FormSet, NavBar, FixTable} from 'Components';import io from 'socket.io-client';import Echarts from 'Echarts/Echarts';
@inject("FormsetStore","StackedgraphStore","ScatterStore","BubbleStore")
@observer
export default class DataPanel extends React.Component {
componentDidMount(){                            if(!this.socket) {                                this.socket = io.connect('/');                                this.socket.on('newDataPoint', function(data){                                    if(data.body.id==0)this.props.StackedgraphStore.addDataPoints(data.body.x, data.body.y, data.body.gateIndex)
if(data.body.id==0)this.props.ScatterStore.addDataPoints(data.body.x, data.body.y, data.body.gateIndex)}.bind(this));                                this.socket.on('setArray', function(data){if(data.body.id==0)this.props.StackedgraphStore.setArray(data.array, data.body.gateIndex)
if(data.body.id==0)this.props.ScatterStore.setArray(data.array, data.body.gateIndex)}.bind(this));}}
render(){const FormsetStore_formset = this.props.FormsetStore.formset;
const FormsetStoreConfig = {                        reset: this.props.FormsetStore.reset.bind(this.props.FormsetStore),                        changeValue: this.props.FormsetStore.changeValue.bind(this.props.FormsetStore)                    }
return <div><Panel title = "Formset">                        <FormSet {...FormsetStore_formset} {...FormsetStoreConfig } />                    </Panel>
</div>}
};