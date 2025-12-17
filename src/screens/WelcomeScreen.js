
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const WelcomeScreen = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [salary, setSalary] = useState('');

  return (
    <Animatable.View animation="fadeIn" duration={1500} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bem-vindo ao Gestão Consciente!</Text>
        <Text style={styles.subtitle}>Para começar, precisamos de algumas informações:</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Qual o seu nome?"
          placeholderTextColor="#4CAF50"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Qual o seu salário?"
          placeholderTextColor="#4CAF50"
          value={salary}
          onChangeText={setSalary}
          keyboardType="numeric"
        />
        <TouchableOpacity
          style={[styles.button, (!name || !salary) && styles.disabledButton]}
          onPress={() => onComplete(name, salary)}
          disabled={!name || !salary}
        >
          <Text style={styles.buttonText}>Começar</Text>
        </TouchableOpacity>
      </View>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#4CAF50',
    padding: 40,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 10,
  },
  form: {
    padding: 20,
    marginTop: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderColor: '#4CAF50',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  disabledButton: {
    backgroundColor: '#A9A9A9',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WelcomeScreen;
