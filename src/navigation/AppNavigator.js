import { createAppContainer } from "react-navigation"
import { createStackNavigator } from "react-navigation-stack"
import History from '../screens/History'
import MainScreen from '../screens/MainScreen'

const StackNavigator = createStackNavigator(
    {
        MainScreen: MainScreen,
        History: History
    },
    {
        initialRouteName: 'MainScreen'
    }
)

const AppNavigator = createAppContainer(StackNavigator)

export default AppNavigator