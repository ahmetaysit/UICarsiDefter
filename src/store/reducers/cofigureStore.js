import {createStore} from 'redux';
import reducers from './index'

const configureStore = ()=>{
    return createStore(reducers);
}

export default configureStore