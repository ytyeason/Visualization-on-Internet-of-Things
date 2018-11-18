// Root File for Page Data Dashboard
import React from 'react';
import {inject, observer} from 'mobx-react';
import {Panel, FormSet, NavBar, FixTable} from 'Components';
import io from 'socket.io-client';
import Echarts from 'Echarts/Echarts';

@inject("FormsetStore", "TableStore")
@observer
export default class DataDashboard extends React.Component {
    render() {
        const TableStore_table = this.props.TableStore.table;
        return <div><Panel title="Table"> <FixTable leftCol='1' rightCol='0' left='45' right='0'
                                                    className='td-inner-txt' tableList={TableStore_table}/> </Panel>
        </div>
    }
};