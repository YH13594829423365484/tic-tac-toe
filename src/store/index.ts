import { createStore, applyMiddleware, Store } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from '../reducers/index';

/**
 *
 * @returns 明确指定 Store 的类型
 */
const configureStore = (): Store<ReturnType<typeof rootReducer>> => {
    return createStore(rootReducer, applyMiddleware(thunk as any)); // 使用 as any 临时解决类型问题
};

export default configureStore;
