import React, { Component } from 'react';
import {View, StyleSheet, Text, TextInput} from 'react-native';

const Input = ({label, value, onChangeText, placeholder, secureTextEntry}) => {
    return (
        <View container={styles.container}>
            <Text>Label</Text>
            <TextInput 
                autoCorrect={false}
                onChangeText={onChangeText}
                placeholder={placeholder}
                style={styles.input}
                secureTextEntry={secureTextEntry}
                value={value}>
            </TextInput>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        width: '100%',

    },
    label: {
        padding: 5,
        paddingBottom: 0,
        color: '#333',
        fontSize: 17,
        fontWeight: '700'
    },
    input: {
        paddingRight:5,
        paddingLeft: 5,
        paddingBottom: 2
    }
})