import React, { Component } from 'react';
import { StyleSheet, Image, Text, View, ScrollView, Button, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { createStackNavigator, createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Agenda from './Agenda';
import RegisterPet from './RegisterPet';
import Summary from './Summary';
import Services from './Services';
import Profile from './Profile';
import Pets from './Pets';
import AddNewService from './AddNewService';
import { AsyncStorage } from 'react-native';
import * as firebase from 'firebase';
import '@firebase/firestore';
import { Service } from './service/Service';
class Welcome extends Component {


    constructor(props) {
        super(props);
        this.state = {
            pets: [

            ],
            myPets: [

            ],
            enable: false
        }
    }

    componentDidMount() {
        let self = this;
        this.getuserrole();

        var database = firebase.database();
        AsyncStorage.getItem('userid').then((userId) => {
            
            database.ref('pet').on('value', snapshot => {
                let myPetsList = [];

                snapshot.forEach(c => {
                    let value = c.val();
                    if (value.userid == userId) {
                        myPetsList.push(value);
                    }
                });

                self.setState({
                    myPets: myPetsList
                });
            });
        });

        let services =[];
        const service = new Service();
        
        service.getServiceInfo((item) => 
        {
            if(item.service.toLowerCase() !== "extra")
                services.push(item);

            self.setState({
                pets: services
            });
        });
    }

    getuserrole = async () => {
        let role = await AsyncStorage.getItem('role');
        
        if (role == 'admin') {
            this.setState({
                enable: true
            })
        }
        else {
            this.setState({
                enable: false
            })
        }
    }

    render() {

        return (
            <ScrollView style={styles.container}>
                <View style={styles.header}>

                    <TouchableHighlight onPress={() => alert('‍‍🏃‍♂🏃‍♀🕒Estamos trabalhando nisto! 🏃‍♂🏃‍♀🕒')}>
                        <Image style={styles.headerLogo} source={require('../img/tv.png')}></Image>
                    </TouchableHighlight>

                    <Text style={styles.logoText}>Acompanhe {'\n'}seu pet, <Text style={{ fontWeight: 'bold', }}>ao vivo</Text>!</Text>

                    <TouchableHighlight onPress={() => alert('‍‍Precisa de Ajuda? Liga para a gente. ☎.2096-6723 ou 📱W.95451-6381')}>
                        <Image style={styles.headerRightLogo} source={require('../img/logogico_yellow.png')}></Image>
                    </TouchableHighlight>


                </View>
                <View style={styles.welcomeMessageContainer}>
                    <Text style={styles.welcomeMessage}>Seja Bem-Vindo 👋👋</Text>
                </View>

                {
                    this.state.myPets.length == 0 && (
                        <View style={styles.registerPetTextContainer}>
                            <Text style={styles.registerPetText}>Para aproveitar melhor a experiência no{'\n'}
                                aplicativo você deve cadastrar um pet!</Text>
                        </View>
                )}

                {this.state.myPets.length == 0 && (
                    <View style={styles.regPetImgContainer}>
                        <TouchableHighlight onPress={() => this.props.navigation.navigate('RegisterPet')}>
                            <Image style={styles.regPetImage} source={require('../img/welcome_img.png')}></Image>
                        </TouchableHighlight>
                        {/* <Text style={{marginTop: 12}}>Tenha acesso a todas as funcionalidades</Text> */}
                    </View>
                )}

                {this.state.myPets.length > 0 && (
                    <View style={styles.serviceTitleContainer}>
                        <Text style={styles.serviceTitle}>Meus Pets</Text>
                        {
                            (
                                <View style={styles.fbButtonContainer}>
                                    {/* <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.navigation.navigate('RegisterPet')}>
                                        <Text style={styles.buttonTextStyle}>
                                            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>+</Text>  Novo
                                    </Text>
                                    </TouchableOpacity> */}
                                </View>
                            )
                        }
                    </View>
                )}

                {this.state.myPets.length > 0 && (
                    <ScrollView style={styles.horizontalScrollView} horizontal='true'>
                        {
                            this.state.myPets.map((row, index) => {
                                return (
                                    <View key={"pets_" + index} style={styles.serviceImgContainer1}>
                                        <TouchableHighlight onPress={() => this.props.navigation.navigate('Services', { data: row })}>
                                            <Image style={{ width: wp('36%'), height: hp('18%'), borderRadius: 45 }} source={{ uri: row.file }}></Image>
                                        </TouchableHighlight>

                                        <View style={styles.serviceText}><Text >{row.name}</Text></View>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                )}

                <View style={styles.boader1}></View>
                <View style={styles.serviceTitleContainer}>
                    <Text style={styles.serviceTitle}>Comece agora seu agendamento</Text>
                    {
                        this.state.enable && (
                            <View style={styles.fbButtonContainer}>
                                <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.navigation.navigate('AddNew')}>
                                    <Text style={styles.buttonTextStyle}>
                                        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>+</Text> Adicionar
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }

                </View>

                <ScrollView style={styles.horizontalScrollView} horizontal='true'>
                    {
                        this.state.pets.map((row, index) => {
                            return (
                                <View key={"services_" + index} style={styles.serviceImgContainer1}>
                                    <TouchableHighlight onPress={() => this.props.navigation.navigate('Services', { service: row })}>
                                        <Image style={{ width: wp('36%'), height: hp('18%'), borderRadius: 5 }} source={{ uri: row.file }}></Image>
                                    </TouchableHighlight>

                                    <View style={styles.serviceText}><Text >{row.name}</Text></View>
                                </View>
                            )
                        })
                    }

                </ScrollView>
            </ScrollView>
        )
    }
}

const HomeStack = createStackNavigator({
    Welcome: {
        screen: Welcome,
        navigationOptions: {
            header: null
        }
    },
    RegisterPet: {
        screen: RegisterPet,
        navigationOptions: {
            header: null
        }
    },
    Services: {
        screen: Services,
        navigationOptions: {
            header: null
        }
    },
    AddNew: {
        screen: AddNewService,
        navigationOptions: {
            header: null
        }
    },
});

const AppNavigator = createStackNavigator({
    Services: { screen: Services }
})

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flex: 1,
        flexDirection: "row",
        marginTop: hp('10%'),
        paddingLeft: '5%',
        paddingRight: '10%'
    },
    headerLogo: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    logoText: {
        paddingRight: '40%',
    },
    headerRightLogo: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    welcomeMessageContainer: {
        paddingTop: 18,
        paddingLeft: 16,
        flex: 1
    },
    welcomeMessage: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    registerPetTextContainer: {
        flex: 1,
        marginTop: 12,
        paddingLeft: 16
    },
    registerPetText: {
        fontSize: 14,
        lineHeight: 24,
        color: '#858585',
    },
    regPetImgContainer: {
        paddingLeft: 16,
        paddingRight: 16,
        borderRadius: 15,
        marginTop: 18,
        flex: 1
    },
    regPetImage: {
        width: '100%',
        height: hp('20%'),
        borderRadius: 6
    },
    boader1: {
        backgroundColor: '#e7e7e7',
        height: 2,
        width: '100%',
        marginTop: 30
    },
    fbButtonContainer: {
        flex: 1,
        alignItems: 'center',
        height: 34,
        marginLeft: 120,
        marginTop: 12
    },
    buttonStyle: {
        backgroundColor: '#4764CB',
        borderRadius: 6,
        width: '100%',
        height: 34,
        padding: 0
    },
    buttonTextStyle: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    serviceTitleContainer: {
        flex: 1,
        flexDirection: 'row',
        height: 58,
        paddingLeft: 16,
        paddingRight: 16,
    },
    serviceTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 18
    },
    serviceImgContainer1: {
        width: wp('36%'),
        marginRight: 16,
    },
    serviceText: {
        height: 48,
        justifyContent: 'center',
    },
    horizontalScrollView: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16
    },
    boader2: {
        backgroundColor: '#e7e7e7',
        height: 6,
        width: '100%',
        marginTop: 8
    },
    listTitleContainer: {
        flex: 1,
        height: 58,
        justifyContent: 'center',
        paddingLeft: 16,
        paddingRight: 16
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    listItemContainer1: {
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 16,
        paddingRight: 16,
        marginTop: 23,
        marginBottom: 23
    },
    listItemText1: {
        fontSize: 14,
        width: '95%'
    },
    boarder3: {
        backgroundColor: '#ededed',
        height: 52,
        marginLeft: 15,
        marginRight: 15
    }
})

export default createAppContainer(createBottomTabNavigator(
    {
        Início: {
            screen: HomeStack,
            navigationOptions: {
                tabBarVisible: true
            }
        },
        Agenda: {
            screen: Agenda,
            navigationOptions: {
                tabBarVisible: true
            }
        },
        Pets: {
            screen: Pets,
            navigationOptions: {
                tabBarVisible: true
            }
        },
        Perfil: {
            screen: Profile,
            navigationOptions: {
                tabBarVisible: true
            }
        }
    },
    {
        defaultNavigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Início') {
                    iconName = `ios-home`;
                } else if (routeName === 'Agenda') {
                    iconName = `ios-archive`;
                } else if (routeName === 'Pets') {
                    iconName = `ios-paw`;
                } else if (routeName === 'Perfil') {
                    iconName = `ios-person`;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
                return <Ionicons name={iconName} size={25} color={tintColor} />;
            },

        }),

        tabBarOptions: {
            activeTintColor: 'tomato',
            inactiveTintColor: 'gray',

        },
    }
));
