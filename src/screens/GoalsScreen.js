
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import ProgressBar from '../components/ProgressBar';

const GoalsScreen = ({ navigation }) => {
  const [goal, setGoal] = useState('');
  const [currentGoal, setCurrentGoal] = useState('');
  const [salary, setSalary] = useState(0);
  const [expenses, setExpenses] = useState([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const getGoal = async () => {
      try {
        const savedGoal = await AsyncStorage.getItem('goal');
        if (savedGoal) {
          setCurrentGoal(savedGoal);
        }
      } catch (error) {
        console.error('Error getting goal:', error);
      }
    };

    const getSalary = async () => {
      try {
        const savedSalary = await AsyncStorage.getItem('salary');
        if (savedSalary) {
          setSalary(parseFloat(savedSalary));
        }
      } catch (error) {
        console.error('Error getting salary:', error);
      }
    };

    const getExpenses = async () => {
      try {
        const savedExpenses = await AsyncStorage.getItem('expenses');
        if (savedExpenses) {
          setExpenses(JSON.parse(savedExpenses));
        }
      } catch (error) {
        console.error('Error getting expenses:', error);
      }
    };

    if (isFocused) {
      getGoal();
      getSalary();
      getExpenses();
    }
  }, [isFocused]);

  const handleSetGoal = async () => {
    if (goal) {
      try {
        await AsyncStorage.setItem('goal', goal);
        setCurrentGoal(goal);
        Alert.alert('Sucesso', 'Meta definida com sucesso!');
        setGoal('');
      } catch (error) {
        console.error('Error saving goal:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a meta.');
      }
    } else {
      Alert.alert('Erro', 'Por favor, preencha o campo da meta.');
    }
  };

  const handleClearGoal = async () => {
    try {
      await AsyncStorage.removeItem('goal');
      setCurrentGoal('');
      Alert.alert('Sucesso', 'Meta removida com sucesso!');
    } catch (error) {
      console.error('Error clearing goal:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao remover a meta.');
    }
  };

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBalance = salary - totalExpenses;
  const progress = currentGoal > 0 ? (remainingBalance / currentGoal) * 100 : 0;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Metas de Poupança</Text>
      </View>
      <View style={styles.form}>
        {currentGoal ? (
          <>
            <Text style={styles.currentGoal}>Meta Atual: R$ {currentGoal}</Text>
            <ProgressBar progress={progress} />
            <TouchableOpacity style={styles.clearButton} onPress={handleClearGoal}>
              <Text style={styles.clearButtonText}>Limpar Meta</Text>
            </TouchableOpacity>
          </>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Nova Meta"
          placeholderTextColor="#4CAF50"
          value={goal}
          onChangeText={setGoal}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleSetGoal}>
          <Text style={styles.buttonText}>Definir</Text>
        </TouchableOpacity>
      </View>
    </View>
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
  form: {
    padding: 20,
    marginTop: 20,
  },
  currentGoal: {
    fontSize: 20,
    color: '#333333',
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '500',
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
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  clearButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
  },
  clearButtonText: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default GoalsScreen;
