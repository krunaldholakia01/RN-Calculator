import React from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, ToastAndroid, Vibration, View } from 'react-native'
import { ScrollView, TouchableNativeFeedback, TouchableOpacity } from 'react-native-gesture-handler'
import Feather from 'react-native-vector-icons/Feather'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { saveState } from '../redux/action'


class MainScreen extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            expression: '',
            result: null,
            parentheses: 0,
            punctuation: true,
            toggleDrawer: false,
            inverse: false,
            degree: false,
        }
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerTitle: 'Calculator',
            headerTintColor: '#fc0',
            headerStyle: {
                backgroundColor: '#000',
                elevation: 0,
                height: 82,
            },
            headerRight: ({ tintColor }) => (
                <TouchableOpacity style={{ marginHorizontal: 10 }} onPress={() => navigation.navigate('History')} >
                    <MaterialCommunityIcons name='history' size={30} color={tintColor} />
                </TouchableOpacity>
            )
        }
    }

    handleParentheses = () => {
        let length = this.state.expression.length - 1
        if (this.state.parentheses !== 0) {
            if (this.state.expression[length] === '(') {
                this.setState({
                    expression: this.state.expression + '(',
                    parentheses: this.state.parentheses + 1,
                    punctuation: true
                }, this.calculateResult)
                return
            } else if (this.state.expression[length] === ')') {
                this.setState({
                    expression: this.state.expression + ')',
                    parentheses: this.state.parentheses - 1,
                    punctuation: true
                }, this.calculateResult)
                return
            } else if (!/\d/.test(this.state.expression[length])) {
                this.setState({
                    expression: this.state.expression + '(',
                    parentheses: this.state.parentheses + 1,
                    punctuation: true
                }, this.calculateResult)
                return
            } else {
                this.setState({
                    expression: this.state.expression + ')',
                    parentheses: this.state.parentheses - 1,
                    punctuation: true
                }, this.calculateResult)
                return
            }
        }
        else {
            if (this.state.expression) {
                if (/\d/.test(this.state.expression[length])) {
                    this.setState({
                        expression: this.state.expression + '*(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                    return
                } else if (this.state.expression[length] === ')') {
                    this.setState({
                        expression: this.state.expression + '*(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                    return
                } else {
                    this.setState({
                        expression: this.state.expression + '(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                    return
                }
            } else {
                this.setState({
                    expression: this.state.expression + '(',
                    parentheses: this.state.parentheses + 1,
                    punctuation: true
                }, this.calculateResult)
                return
            }
        }
    }

    handleOperators = (op) => {
        let expression = this.state.expression
        let length = this.state.expression.length - 1
        if (this.state.expression) {
            if (op === '.') {
                if (this.state.punctuation && /\d/.test(expression[length])) {
                    this.setState({
                        expression: expression + '.',
                        punctuation: false
                    }, this.calculateResult)
                    return
                }
            } else if (/\!/.test(expression[length])) {
                this.setState({
                    expression: expression + op,
                    punctuation: true
                }, this.calculateResult)
            } else if (op === '%' || op === '/' || op === '*' || op === '+') {
                if (expression[length] === '(') {
                } else if (/\d/.test(expression[length]) || expression[length] === ')') {
                    this.setState({
                        expression: expression + op,
                        punctuation: true
                    }, this.calculateResult)
                    return
                } else if (expression[length] === '-') {
                    if (expression[length - 1] === '%' || expression[length - 1] === '/' || expression[length - 1] === '*' || expression[length - 1] === '-') {
                        this.setState({
                            expression: expression.slice(0, length - 1) + op,
                            punctuation: true
                        }, this.calculateResult)
                        return
                    } else {
                        this.setState({
                            expression: expression.slice(0, length) + op,
                            punctuation: true
                        }, this.calculateResult)
                        return
                    }
                } else if (/[a-zA-Z]/.test(expression[length])) {
                    this.setState({
                        expression: expression + op,
                        punctuation: true
                    }, this.calculateResult)
                    return
                } else {
                    this.setState({
                        expression: expression.slice(0, length) + op,
                        punctuation: true
                    }, this.calculateResult)
                    return
                }
            } else if (op === '-') {
                if (expression[length] === '(') {
                } else if (expression[length] !== '-' && expression[length] !== '.' && expression[length] !== '+') {
                    this.setState({
                        expression: expression + op,
                        punctuation: true
                    }, this.calculateResult)
                    return
                } else {
                    if (expression[length - 1] === '%' || expression[length - 1] === '/' || expression[length - 1] === '*') {
                        this.setState({
                            expression: expression.slice(0, length - 1) + op,
                            punctuation: true
                        }, this.calculateResult)
                        return
                    } else {
                        this.setState({
                            expression: expression.slice(0, length) + op,
                            punctuation: true
                        }, this.calculateResult)
                        return
                    }
                }
            }
        } else {
            if (op === '-') {
                this.setState({
                    expression: expression + op,
                    punctuation: true
                }, this.calculateResult)
                return
            }
        }
    }

    handleDrawerButtons = (val) => {
        let expression = this.state.expression
        let length = this.state.expression.length - 1
        if (expression[length] === '.')
            return
        else {
            if (val === 'pi') {
                if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!') {
                    this.setState({
                        expression: expression + '*Math.PI',
                        punctuation: true
                    }, this.calculateResult)
                } else {
                    this.setState({
                        expression: expression + 'Math.PI',
                        punctuation: true
                    }, this.calculateResult)
                }
                return
            } else if (val === 'e') {
                if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!') {
                    this.setState({
                        expression: expression + '*Math.E',
                        punctuation: true
                    }, this.calculateResult)
                } else {
                    this.setState({
                        expression: expression + 'Math.E',
                        punctuation: true
                    }, this.calculateResult)
                }
                return
            } else if (val === 'sin') {
                if (this.state.inverse) {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.asin(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.asin(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                } else {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.sin(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.sin(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                }
            } else if (val === 'cos') {
                if (this.state.inverse) {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.acos(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.acos(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                } else {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.cos(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.cos(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                }
            } else if (val === 'tan') {
                if (this.state.inverse) {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.atan(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.atan(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                } else {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.tan(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.tan(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                }
            } else if (val === '!') {
                if (/\d/.test(expression[length])) {
                    if (/\.\d+$/.test(expression)) {
                        return
                    }
                    this.setState({
                        expression: expression + '!',
                        punctuation: true
                    }, this.calculateResult)
                }
                return
            } else if (val === 'log') {
                if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                    this.setState({
                        expression: expression + '*Math.log(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                } else {
                    this.setState({
                        expression: expression + 'Math.log(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                }
                return
            } else if (val === 'ln') {
                if (this.state.inverse) {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.exp(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.exp(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                } else {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.ln(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.ln(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                }
            } else if (val === '^') {
                if (this.state.inverse) {
                    if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                        this.setState({
                            expression: expression + '*Math.pow(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    } else {
                        this.setState({
                            expression: expression + 'Math.pow(',
                            parentheses: this.state.parentheses + 1,
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                } else {
                    if (this.state.parentheses) {
                        this.setState({
                            expression: expression + ',',
                            punctuation: true
                        }, this.calculateResult)
                    }
                    return
                }
            } else if (val === 'root') {
                if (/\d/.test(expression[length]) || expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
                    this.setState({
                        expression: expression + '*Math.sqrt(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                } else {
                    this.setState({
                        expression: expression + 'Math.sqrt(',
                        parentheses: this.state.parentheses + 1,
                        punctuation: true
                    }, this.calculateResult)
                }
                return
            }
        }
    }

    handleDelete = () => {
        let expression = this.state.expression
        let length = this.state.expression.length - 1
        if (expression[length] === '(') {
            if (/[a-zA-Z]/.test(expression[length - 1])) {
                this.setState({
                    expression: expression.slice(0, length).replace(/[a-zA-Z]+\.[a-zA-Z]+$/, '')
                }, this.calculateResult)
            } else {
                this.setState({
                    expression: expression.slice(0, length),
                    parentheses: this.state.parentheses - 1
                }, this.calculateResult)
            }
            return
        } else if (expression[length] === ')') {
            this.setState({
                expression: expression.slice(0, length),
                parentheses: this.state.parentheses + 1
            }, this.calculateResult)
            return
        } else if (/[a-zA-Z]/.test(expression[length])) {
            this.setState({
                expression: expression.replace(/[a-zA-Z]+\.[a-zA-Z]+$/, '')
            }, this.calculateResult)
        } else {
            this.setState({
                expression: expression.slice(0, length)
            }, this.calculateResult)
        }

        if (/.\d+\.\d+$/.test(this.state.expression)) {
            this.setState({
                punctuation: false
            }, this.calculateResult)
            return
        } else {
            this.setState({
                punctuation: true
            }, this.calculateResult)
            return
        }
    }

    factorial = num => {
        let res = 1
        while (num > 1) {
            res = res * num--
        }
        return res
    }

    handleState = () => {
        if (this.state.result !== 'Bad Expression' && this.state.result !== null && this.state.result !== 'Infinity or Undefined') {
            this.props.saveState({ expression: this.state.expression, result: this.state.result, day: new Date().getDate(), month: new Date().getMonth(), year: new Date().getFullYear() })
            this.setState({
                expression: this.state.result,
                punctuation: this.state.result % 1 !== 0 ? false : true,
            })
        } else {
            if (this.state.expression) {
                ToastAndroid.show('Bad Expression', 500)
                Vibration.vibrate(100)
            }
            return
        }
    }

    handleOperand = (operand) => {
        let expression = this.state.expression
        let length = this.state.expression.length - 1
        if (expression[length] === ')' || expression[length] === '!' || expression[length] === 'I' || expression[length] === 'E') {
            this.setState({
                expression: this.state.expression + '*' + operand,
            }, this.calculateResult)
            return
        }
        this.setState({
            expression: this.state.expression + operand,
        }, this.calculateResult)
        return
    }

    calculateResult = async () => {
        let res = null
        let expression = this.state.expression
        if (expression) {
            try {
                if (this.state.degree) {
                    expression = expression.replace(/sin\(/g, 'sin((Math.PI/180)*').replace(/asin\(/g, 'asin((Math.PI/180)*').replace(/cos\(/g, 'cos((Math.PI/180)*').replace(/acos\(/g, 'acos((Math.PI/180)*').replace(/tan\(/g, 'tan((Math.PI/180)*').replace(/atan\(/g, 'atan((Math.PI/180)*')
                }
                if (/\!/.test(expression)) {
                    const found = expression.match(/\d+!/g)
                    if (found[found.length - 1] > 170) {
                    } else {
                        found.forEach(exp => expression = expression.replace(/\d+!/, this.factorial(parseInt(exp.split('!')[0]))))
                    }
                }
                res = await eval(expression)
                if (res !== Infinity) {
                    if (res % 1 !== 0)
                        await res.toFixed(9)
                    res = await res !== null ? res.toString().length > 12 ? res.toExponential(9).toString() : res.toString() : res
                } else {
                    res = 'Infinity or Undefined'
                }
            } catch (e) {
                res = 'Bad Expression'
            }
        }
        this.setState({ result: res })
    }

    render() {
        let length = this.state.expression.length
        return (
            <View style={{
                backgroundColor: '#000',
                height: '100%',
                elevation: 24
            }}>
                <StatusBar
                    backgroundColor='#000'
                    barStyle='light-content'
                />
                <View style={{
                    width: '100%',
                    height: 1,
                    backgroundColor: '#222'
                }} />

                <View style={{
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                }}>
                    <Text style={{ fontSize: 16, color: '#777', marginVertical: 10, marginHorizontal: 20 }}>
                        {
                            this.state.toggleDrawer ?
                                this.state.degree ? 'DEG' : 'RAD' : null
                        }
                    </Text>
                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                }}>

                    {/* -------------------------------------------------------------- */}
                    {/* -------------------------------------------------------------- */}
                    {/* -------------------------------------------------------------- */}

                    <View style={{
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        marginBottom: this.state.toggleDrawer ? 0 : 40,
                        elevation: 0
                    }}>
                        <ScrollView
                            ref={ref => this.expression = ref}
                            horizontal={true}
                            style={{
                                marginHorizontal: 10,
                                marginBottom: length < 9 ? 0 :
                                    length < 10 ? 8 :
                                        length < 11 ? 12 :
                                            length < 13 ? 16 :
                                                length < 16 ? 20 : 25
                            }}
                            onContentSizeChange={() => {
                                this.expression.scrollToEnd({ animated: true })
                            }}>
                            <Text style={{
                                fontSize: this.state.toggleDrawer ?
                                    length < 9 ? 60 :
                                        length < 10 ? 55 :
                                            length < 11 ? 50 :
                                                length < 13 ? 40 :
                                                    length < 16 ? 35 : 30
                                    :
                                    length < 9 ? 70 :
                                        length < 10 ? 65 :
                                            length < 11 ? 60 :
                                                length < 13 ? 50 :
                                                    length < 16 ? 40 : 35,
                                color: '#fff',
                            }}>
                                {this.state.expression.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',').replace(/\*/g, ' x ').replace(/\//g, ' ÷ ').replace(/\+/g, ' + ').replace(/\-/g, ' - ').replace(/\%/g, ' % ').replace(/\*\(/g, ' ( ').replace(/\)\*/g, ' ) ').replace(/\)\(/g, ' )( ').replace(/Math.PI/g, 'π').replace(/Math.asin/g, 'sin⁻¹').replace(/Math.acos/g, 'cos⁻¹').replace(/Math.atan/g, 'tan⁻¹').replace(/Math.sqrt/g, '√').replace(/Math./g, '')}
                            </Text>
                        </ScrollView>
                        <ScrollView
                            ref={ref => this.result = ref}
                            horizontal={true}
                            style={{
                                marginHorizontal: 10
                            }}
                            onContentSizeChange={() => {
                                this.result.scrollToEnd({ animated: true })
                            }}>
                            <Text style={{
                                fontSize: this.state.toggleDrawer ? 30 : 35,
                                color: '#777'
                            }}>
                                {this.state.result ?
                                    this.state.result.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                                    : null
                                }
                            </Text>
                        </ScrollView>
                    </View>

                    {/* -------------------------------------------------------------- */}
                    {/* -------------------------------------------------------------- */}
                    {/* -------------------------------------------------------------- */}

                    <TouchableNativeFeedback
                        background={TouchableNativeFeedback.Ripple('#333')}
                        onPress={() => this.setState({ toggleDrawer: !this.state.toggleDrawer })}
                        style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '100%',
                            height: 22,
                            backgroundColor: '#202020',
                            borderTopLeftRadius: 12,
                            borderTopRightRadius: 12
                        }}>
                        <View style={{
                            width: 30,
                            height: 4,
                            backgroundColor: '#444',
                            borderRadius: 2
                        }} />
                    </TouchableNativeFeedback>

                    {
                        !this.state.toggleDrawer ?
                            null :
                            <View style={{
                                width: '100%',
                                backgroundColor: '#101010',
                                elevation: 0
                            }}>

                                {/* -------------------------------------------------- */}
                                {/* -------------------------------------------------- */}
                                {/* -------------------------------------------------- */}

                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.setState({ degree: !this.state.degree })}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={[styles.slideDrawerButtonText]}>
                                                {this.state.degree ? 'RAD' : 'DEG'}
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.setState({ inverse: !this.state.inverse })}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={[styles.slideDrawerButtonText, { color: this.state.inverse ? '#fc0' : '#fff' }]}>
                                                INV
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('pi')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={styles.slideDrawerButtonText}>
                                                <MaterialCommunityIcons name='pi' size={22} color='#fff' />
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('e')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={[styles.slideDrawerButtonText, { fontSize: 22, paddingBottom: 4 }]}>
                                                e
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                {/* -------------------------------------------------- */}
                                {/* -------------------------------------------------- */}
                                {/* -------------------------------------------------- */}

                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('sin')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
                                                <Text style={[styles.slideDrawerButtonText, { lineHeight: 24, fontSize: 18 }]}>
                                                    sin
                                                </Text>
                                                {!this.state.inverse ? null : <Text style={{ fontSize: 12, textAlignVertical: 'top', color: '#fff', lineHeight: 12 }}>-1</Text>}
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('cos')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
                                                <Text style={[styles.slideDrawerButtonText, { lineHeight: 24, fontSize: 18 }]}>
                                                    cos
                                                </Text>
                                                {!this.state.inverse ? null : <Text style={{ fontSize: 12, textAlignVertical: 'top', color: '#fff', lineHeight: 12 }}>-1</Text>}
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('tan')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
                                                <Text style={[styles.slideDrawerButtonText, { lineHeight: 24, fontSize: 18 }]}>
                                                    tan
                                                </Text>
                                                {!this.state.inverse ? null : <Text style={{ fontSize: 12, textAlignVertical: 'top', color: '#fff', lineHeight: 12 }}>-1</Text>}
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('!')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={[styles.slideDrawerButtonText, { fontSize: 18 }]}>
                                                n!
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>

                                {/* -------------------------------------------------- */}
                                {/* -------------------------------------------------- */}
                                {/* -------------------------------------------------- */}

                                <View style={{
                                    flexDirection: 'row'
                                }}>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('log')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={styles.slideDrawerButtonText}>
                                                log
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('ln')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <View style={{ justifyContent: 'flex-start', alignItems: 'flex-start', flexDirection: 'row' }}>
                                                {
                                                    this.state.inverse ?
                                                        <Text style={[styles.slideDrawerButtonText, { lineHeight: 24, fontSize: 22 }]}>
                                                            e
                                                        </Text> :
                                                        <Text style={[styles.slideDrawerButtonText, { lineHeight: 24, fontSize: 18 }]}>
                                                            ln
                                                        </Text>
                                                }
                                                {!this.state.inverse ? null : <Text style={{ fontSize: 12, textAlignVertical: 'top', color: '#fff', lineHeight: 12 }}>x</Text>}
                                            </View>
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('^')}>
                                        <View style={styles.slideDrawerButtons}>

                                            {!this.state.inverse ? <MaterialCommunityIcons name='comma' size={10} color='#fff' /> : <Text style={[styles.slideDrawerButtonText, { paddingBottom: 4 }]}>pow</Text>
                                            }
                                            {/* <MaterialCommunityIcons name='chevron-up' size={22} color='#fff' /> */}
                                        </View>
                                    </TouchableNativeFeedback>
                                    <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#333')} onPress={() => this.handleDrawerButtons('root')}>
                                        <View style={styles.slideDrawerButtons}>
                                            <Text style={[styles.slideDrawerButtonText, { fontSize: 22 }]}>
                                                √
                                            </Text>
                                        </View>
                                    </TouchableNativeFeedback>
                                </View>
                                <View style={{
                                    height: 1,
                                    width: '100%',
                                    backgroundColor: '#000'
                                }} />
                            </View>
                    }





                    {/* -------------------------------------------------------------- */}
                    {/* -------------------------------------------------------------- */}
                    {/* -------------------------------------------------------------- */}

                    <View style={{
                        backgroundColor: '#202020'
                    }}>
                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.setState({
                                expression: '',
                                result: null,
                                parentheses: 0,
                                punctuation: true
                            })}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 22 : 25,
                                        color: '#fff'
                                    }}>
                                        AC
                                    </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => { this.handleDelete() }}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <MaterialCommunityIcons name='backspace-outline' size={this.state.toggleDrawer ? 22 : 25} color='#fff' />
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperators('%')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Feather name='percent' size={this.state.toggleDrawer ? 22 : 25} color='#fff' />
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperators('/')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <MaterialCommunityIcons name='division' size={this.state.toggleDrawer ? 25 : 30} color='#fc0' />
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('7')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        7
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('8')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        8
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('9')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        9
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperators('*')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 22 : 25,
                                        color: '#fc0'
                                    }}>
                                        x
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('4')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        4
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('5')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        5
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('6')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        6
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperators('-')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <MaterialCommunityIcons name='minus' size={this.state.toggleDrawer ? 22 : 25} color='#fc0' />
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('1')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        1
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('2')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        2
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('3')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        3
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperators('+')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <MaterialCommunityIcons name='plus' size={this.state.toggleDrawer ? 22 : 25} color='#fc0' />
                                </View>
                            </TouchableNativeFeedback>
                        </View>

                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}
                        {/* ----------------------------------------------------------- */}

                        <View style={{
                            flexDirection: 'row'
                        }}>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperators('.')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <MaterialCommunityIcons name='square-small' size={this.state.toggleDrawer ? 22 : 25} color='#fff' />
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleOperand('0')}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <Text style={{
                                        fontSize: this.state.toggleDrawer ? 25 : 30,
                                        color: '#fff'
                                    }}>
                                        0
                                </Text>
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#444')} onPress={() => this.handleParentheses()}>
                                <View style={[
                                    styles.bottomButtons,
                                    {
                                        height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    }
                                ]}>
                                    <MaterialCommunityIcons name='code-parentheses' size={this.state.toggleDrawer ? 22 : 25} color='#fff' />
                                </View>
                            </TouchableNativeFeedback>
                            <TouchableNativeFeedback background={TouchableNativeFeedback.Ripple('#ff3')} onPress={() => this.handleState()}>
                                <View style={{
                                    width: Dimensions.get('window').width / 4,
                                    height: this.state.toggleDrawer ? Dimensions.get('window').width / 4 - 24 : Dimensions.get('window').width / 4,
                                    backgroundColor: '#fc0',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    elevation: 5
                                }}>
                                    <MaterialCommunityIcons name='equal' size={this.state.toggleDrawer ? 22 : 25} color='#fff' />
                                </View>
                            </TouchableNativeFeedback>
                        </View>
                    </View>


                </View>
            </View >
        )
    }
}

const styles = StyleSheet.create({
    bottomButtons: {
        width: Dimensions.get('window').width / 4,
        backgroundColor: '#202020',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    slideDrawerButtons: {
        width: Dimensions.get('window').width / 4,
        height: Dimensions.get('window').width / 4 - 46,
        backgroundColor: '#101010',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5
    },
    slideDrawerButtonText: {
        fontSize: 18,
        color: '#fff'
    }
})

const mapStateToProps = state => {
    return {
        calculator: state.calculator
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            saveState
        }, dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)