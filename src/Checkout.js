import React, { Component } from 'react';
import {StyleSheet, Image, TextInput, ScrollView, View, Text,TouchableHighlight} from 'react-native';
class Checkout extends Component {
    constructor(props)
    {
        super(props);
        this.state = {
            data:{
                num:'',
                idad:'',
                pet:'',
                porte:''
            },
            enable:false
        }
        
    }
    
    handleChange = (name,value) => {
        let data = this.state.data;
        data[name] = value;
        let enable = true;
        for(item in data)
        {
            if(!data[item])
            {
                enable = false;
            }
        }

        this.setState({
            enable:enable,
            data:data
        })
    }
    confirm = () => {

        this.props.navigation.goBack();
        this.props.navigation.state.params.selectpayment(this.state.data.porte);
    }

    render() {
        return(
            <ScrollView style = {styles.container}>
                <View style={styles.backButtonContainer}>
                    <TouchableHighlight onPress={()=>this.props.navigation.goBack()}>
                        <Image style={styles.backButton} source={require('../img/arrow_back.png')}></Image>
                    </TouchableHighlight>
                    <Text style={styles.backToHomeText}>Cartão de crédito</Text>
                 </View>
                 <View style={styles.uploadImgContainer}>
                    <Text style={styles.uploadText}>Novo cartão de crédito</Text>
                 </View>
                 <View style={{flex:1, paddingLeft: 15, paddingRight: 15}}>
                     <Text style={{height: 18, fontSize: 14, color: '#858585', marginTop: 2}}>Número do cartão</Text>
                 </View>
                 <View style={styles.cardNumContainer}>
                    <TextInput style = {styles.cardNumInput} placeholder="0000.0000.0000.0000" placeholderTextColor="#000" onChangeText={(value)=>this.handleChange("num",value)}><Image style={{}} 
                    source={require('../img/visa.png')}></Image></TextInput>
                </View>
                <View>

                </View>
                <View style={styles.textInputContainer1}>
                    <TextInput style = {styles.CPF} placeholder="Idade" placeholderTextColor="#858585" onChangeText={(value)=>this.handleChange("idad",value)}></TextInput>
                </View>
                <View style={styles.textInputContainer2}>
                    <TextInput style = {styles.petOne} placeholder="O seu pet é um?" placeholderTextColor="#858585" onChangeText={(value)=>this.handleChange("pet",value)}></TextInput>
                    <Image style={styles.infoImage} source = {require('../img/info.png')}></Image>
                </View>
                <View style={styles.textInputContainer2}>
                    <TextInput style = {styles.petOne} placeholder="Porte" placeholderTextColor="#858585" onChangeText={(value)=>this.handleChange("porte",value)}></TextInput>
                    <Image style={styles.infoImage} source = {require('../img/info.png')}></Image>
                </View>
                <View style={styles.registerButtonContainer}>
                    <Text style={this.state.enable?styles.registerButtonEnableText:styles.registerButtonText} onPress={this.confirm}>Salvar</Text>
                </View>

            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backButtonContainer: {
        height: 60,
        flexDirection: 'row',
        marginTop: 66,
        paddingLeft: 18,
    },
    backButton: {
        width: 16,
        height: 16,
        marginLeft: 3,
        marginRight: 28,
        marginTop: 16
    },
    backToHomeText: {
        fontSize: 16,
        marginTop: 16
    },
    uploadImgContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        height: 48,
    },
    uploadText: {
        fontSize: 16,
        marginTop: 16,
        fontWeight: 'bold',
        color: '#000'
    },
    cardNumContainer: {
        flex: 1,
        height: 30,
        paddingLeft: 15,
        paddingRight: 15
    },
    cardNumInput: {
        flex: 1,
        flexDirection: 'row',
        height: 30,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        fontSize: 16
    },
    textInputContainer: {
        marginTop: 30,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    CPF: {
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        fontSize: 16
    },
    textInputContainer1: {
        marginTop: 24,
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15
    },
    textInputContainer2: {
        marginTop: 24,
        flex: 1,
        flexDirection: 'row',
        paddingLeft: 15,
        paddingRight: 15
    },
    infoImage: {
        paddingTop: 16,
    },
    petOne: {
        width: '80%',
        height: 48,
        borderBottomWidth: 1,
        borderBottomColor: '#858585',
        marginRight: 37,
        fontSize: 16
    },
    registerButtonContainer: {
        flex: 1,
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 30,
        alignItems: 'center',
        justifyContent:'center'
    },
    registerButtonText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#DCDCDC',
        paddingTop: 10,
        height: 48,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderRadius: 6
    },
    registerButtonEnableText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#DCDCDC',
        paddingTop: 10,
        height: 48,
        width: '100%',
        backgroundColor: '#FFC700',
        borderRadius: 6
    }

})

export default Checkout;