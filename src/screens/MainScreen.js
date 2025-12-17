import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import AddExpenseModal from '../components/AddExpenseModal';
import DonutChart from '../components/DonutChart';
import Ticker from '../components/Ticker';

const MainScreen = ({ name, salary }) => {
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(salary);
  const isFocused = useIsFocused();

  useEffect(() => {
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

    const getSalary = async () => {
      try {
        const savedSalary = await AsyncStorage.getItem('salary');
        if (savedSalary) {
          setCurrentSalary(parseFloat(savedSalary));
        }
      } catch (error) {
        console.error('Error getting salary:', error);
      }
    };

    if (isFocused) {
      getExpenses();
      getSalary();
    }
  }, [isFocused]);

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBalance = currentSalary - totalExpenses;

  const necessaryExpenses = expenses.filter(expense => expense.isNecessary).reduce((total, expense) => total + expense.amount, 0);
  const unnecessaryExpenses = totalExpenses - necessaryExpenses;

  const chartData = [
    {
      key: 1,
      amount: necessaryExpenses,
      color: '#2E8B57',
      total: totalExpenses,
    },
    {
      key: 2,
      amount: unnecessaryExpenses,
      color: '#A9A9A9',
      total: totalExpenses,
    }
  ];

  const handleAddExpense = async (expense) => {
    try {
      const newExpenses = [...expenses, { ...expense, id: Math.random().toString() }];
      setExpenses(newExpenses);
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.title}>Olá, {name}!</Text>
        <Text style={styles.subtitle}>Seu saldo restante é de R$ {remainingBalance.toFixed(2)}</Text>
        <Ticker />
      </View>
      <View style={styles.expensesContainer}>
        <Text style={styles.expensesTitle}>Despesas</Text>
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseDescription}>{item.description}</Text>
              <Text style={styles.expenseAmount}>R$ {item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
        <View style={styles.chartContainer}>
          <DonutChart data={chartData} totalExpenses={totalExpenses} />
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#2E8B57' }]} />
              <Text style={styles.legendText}>Necessário</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: '#A9A9A9' }]} />
              <Text style={styles.legendText}>Não Necessário</Text>
            </View>
          </View>
        </View>
      </View>
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAddExpense={handleAddExpense}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0FFF0',
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: '#2E8B57',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  expensesContainer: {
    flex: 1,
    padding: 20,
  },
  expensesTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 10,
  },
  expenseDescription: {
    fontSize: 16,
    color: '#333333',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: '#333333',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2E8B57',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  addButtonText: {
    fontSize: 30,
    color: '#FFFFFF',
  },
});

export default MainScreen;