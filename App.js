import React from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import AppNavigator from './src/navigation/AppNavigator'
import { persistor, store } from './src/redux/store'

export default class App extends React.Component {
  render() {
    console.disableYellowBox = true
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <AppNavigator />
        </PersistGate>
      </Provider>
    )
  }
}
