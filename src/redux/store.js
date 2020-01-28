import AsyncStorage from '@react-native-community/async-storage'
import { applyMiddleware, createStore } from 'redux'
import { persistReducer, persistStore } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducer'


const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    stateReconciler: autoMergeLevel2,
}

const pReducer = persistReducer(persistConfig, rootReducer)

export const store = createStore(pReducer, applyMiddleware(thunkMiddleware))

export const persistor = persistStore(store)