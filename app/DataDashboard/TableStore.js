//Store File for TableStore
import {autorun, observable, computed} from 'mobx';

class TableStore {
    reset() {
        this.map = this.map.map(e => {
            return 0
        })
    }

    changeValue(value, param) {
        this.map[param] = value;
    }

    @observable array = [["Device 1", "Active", "9281-45537", "Jun 7 16:34:32", "2016-Mar", "1860 crois. Bishop", "Montreal", "Quebec", "J4X1K8"], ["Device 2", "Inactive", "9281-45247", "Mar 3 16:34:32", "2016-Apr", "123 Harvard Street", "Montreal", "Quebec", "Q2X9S3"]]

    @computed get table() {

        const headers = [{"type": "plain", "valueLabel": "Device"}, {
            "type": "plain",
            "valueLabel": "Status"
        }, {"type": "plain", "valueLabel": "Operating Name"}, {
            "type": "plain",
            "valueLabel": "Log Time"
        }, {"type": "plain", "valueLabel": "Register Date"}, {
            "type": "plain",
            "valueLabel": "Street"
        }, {"type": "plain", "valueLabel": "City"}, {"type": "plain", "valueLabel": "Province"}, {
            "type": "plain",
            "valueLabel": "Postal Code"
        }]
        var centerBody = this.array.map(entry => {
            return (entry.map(e => {
                return {type: 'plain', valueLabel: e};
            }));
        }).map(e => {
            return {className: '', list: e};
        });
        var arrayOfCheckBoxes = this.array.map(e => {
            return ({
                className: '',
                list: [{type: 'checkbox', param: 1, value: false, trigger: 'setCheckBox', className: 'td-text-center'}]
            });
        });
        return {
            leftHeader: [{type: 'checkbox', value: false, trigger: 'selectAll', className: 'td-text-center'}],
            leftBody: arrayOfCheckBoxes,
            rightHeader: [],
            centerHeader: headers,
            rightBody: [],
            centerBody: centerBody
        }
    }
}

var store = window.store = new TableStore;
export default store