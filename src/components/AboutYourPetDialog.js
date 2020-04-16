import React, { Component } from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Dialog from 'react-native-dialog';

class AboutYourPetDialog extends Component {
    state={
        dialogVisible: false
    };

    render() {
        return(
            <View>
                <Dialog.Container visible={true}>
                    <Dialog.Title>Sobre seu pet</Dialog.Title>
                    <Dialog.Description><Text style={{color: '#858585'}}>Conte para gente qual é o tipo de bichinho que você{'\n'}vai cadastrar no nosso aplicativo.{'\n'}{'\n'}
Cachorro, Gato, Pássaro, Hamster, Coelho, etc.</Text></Dialog.Description>
                    <Dialog.Button label={Ok} />
                </Dialog.Container>
            </View>
        )
    }
}