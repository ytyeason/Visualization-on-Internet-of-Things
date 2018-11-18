// Root File for The Tree Flow app
import React from 'react';// Import boilerplates
import ReactDOM from 'react-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import {Provider} from 'mobx-react';
import {BrowserRouter as Router, Route, hashHistory} from 'react-router-dom';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';
import {NavBar} from 'Components';

const app = document.getElementById('app');// Import Mobx Stores :
import FormsetStore from './DataPanel/FormsetStore';

;
import StackedgraphStore from './Dashboard/StackedgraphStore';

;
import ScatterStore from './Dashboard/ScatterStore';

;
import BubbleStore from './Dashboard/BubbleStore';
import BinStore from './Dashboard/BinStore';
import DataPanel from './DataPanel';
import Dashboard from './Dashboard'

const browserHistory = createBrowserHistory();
const RoutingStore = new RouterStore();
var stores = {RoutingStore, FormsetStore, StackedgraphStore, ScatterStore, BubbleStore, BinStore};
var routes = [{dispLabel: 'DataPanel', route: '/data-panel'}, , {dispLabel: 'Dashboard', route: '/dashboard'},];
ReactDOM.render(<Provider {...stores}><Router history={browserHistory}>
    <div><NavBar routes={routes}/><Route path='/data-panel' component={DataPanel}/>
        <Route path='/dashboard' component={Dashboard}/></div>
</Router></Provider>, app)