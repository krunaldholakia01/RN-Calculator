import React from 'react'
import { Text, View } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { clearHistory } from '../redux/action'


class History extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            pday: null
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'History',
            headerTintColor: '#fc0',
            headerStyle: {
                backgroundColor: '#000',
                elevation: 0,
                height: 58
            },
            headerLeft: ({ tintColor }) => (
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => navigation.goBack()} >
                    <SimpleLineIcons name='arrow-left' size={25} color={tintColor} />
                </TouchableOpacity>
            ),
            headerRight: ({ tintColor }) => (
                <TouchableOpacity style={{ paddingHorizontal: 10 }} onPress={() => navigation.state.params.clear()} >
                    <MaterialCommunityIcons name='cancel' size={30} color={tintColor} />
                </TouchableOpacity>
            )
        }
    }

    UNSAFE_componentWillMount() {
        this.props.navigation.setParams({
            clear: this.clear.bind(this)
        })
    }

    clear = () => {
        this.props.clearHistory()
    }

    render() {
        const Month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#000',
                height: '100%'
            }}>
                <View style={{
                    width: '100%',
                    height: 2,
                    backgroundColor: '#222'
                }} />
                <ScrollView>
                    {this.props.calculator.history.map((data, index) => {
                        const { day, month, year } = data
                        return (
                            <View
                                key={index}
                                style={{
                                    margin: 10,
                                    flexDirection: 'column',
                                    width: '100%'
                                }}
                            >
                                <View style={{
                                    flexDirection: 'row',
                                }}>
                                    <Text style={{
                                        color: '#fc0',
                                        marginHorizontal: 5,
                                        fontSize: 16
                                    }}>
                                        {day}
                                    </Text>
                                    <Text style={{
                                        color: '#fc0',
                                        marginHorizontal: 5,
                                        fontSize: 16
                                    }}>
                                        {Month[month]},
                                        </Text>
                                    <Text style={{
                                        color: '#fc0',
                                        marginHorizontal: 5,
                                        fontSize: 16
                                    }}>
                                        {year}
                                    </Text>
                                </View>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    marginTop: 10,
                                    marginBottom: 20,
                                    marginHorizontal: 15
                                }}>
                                    <ScrollView horizontal={true}>
                                        <Text style={{
                                            fontSize: 20,
                                            color: '#777',
                                            marginHorizontal: 5
                                        }}>
                                            {data.expression.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/\*/g, ' x ').replace(/\//g, ' ÷ ').replace(/\+/g, ' + ').replace(/\-/g, ' - ').replace(/\%/g, ' % ').replace(/\*\(/g, ' ( ').replace(/\)\*/g, ' ) ').replace(/\)\(/g, ' )( ').replace(/Math.PI/g, 'π').replace(/Math.asin/g, 'sin⁻¹').replace(/Math.acos/g, 'cos⁻¹').replace(/Math.atan/g, 'tan⁻¹').replace(/Math.sqrt/g, '√').replace(/Math./g, '')}
                                        </Text>
                                    </ScrollView>
                                    <ScrollView horizontal={true}>
                                        <Text style={{
                                            fontSize: 28,
                                            color: '#fff',
                                            marginHorizontal: 5
                                        }}>
                                            {data.result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        </Text>
                                    </ScrollView>
                                </View>
                            </View>
                        )
                    })}
                </ScrollView>
            </View>
        )
    }
}


const mapStateToProps = state => {
    return {
        calculator: state.calculator
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            clearHistory
        }, dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(History)