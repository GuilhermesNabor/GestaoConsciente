import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';
import AddExpenseModal from '../components/AddExpenseModal';
import DonutChart from '../components/DonutChart';
import Ticker from '../components/Ticker';

const MainScreen = ({ name, salary }) => {
  const [expenses, setExpenses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [currentSalary, setCurrentSalary] = useState(salary);
  const isFocused = useIsFocused();
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
      
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(50);
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isFocused, fadeAnim, slideAnim]);

  const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
  const remainingBalance = currentSalary - totalExpenses;

  const necessaryExpenses = expenses.filter(expense => expense.isNecessary).reduce((total, expense) => total + expense.amount, 0);
  const unnecessaryExpenses = totalExpenses - necessaryExpenses;

  const chartData = [
    {
      key: 1,
      amount: necessaryExpenses,
      color: '#4CAF50',
      total: totalExpenses,
    },
    {
      key: 2,
      amount: unnecessaryExpenses,
      color: '#E0E0E0',
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

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setModalVisible(true);
  };

  const handleDeleteExpense = async (id) => {
    try {
      const newExpenses = expenses.filter(expense => expense.id !== id);
      setExpenses(newExpenses);
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const onEditExpense = async (editedExpense) => {
    try {
      const newExpenses = expenses.map(expense =>
        expense.id === editedExpense.id ? editedExpense : expense
      );
      setExpenses(newExpenses);
      await AsyncStorage.setItem('expenses', JSON.stringify(newExpenses));
      setEditingExpense(null);
    } catch (error) {
      console.error('Error editing expense:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.contentContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
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
                <View>
                  <Text style={styles.expenseDescription}>{item.description}</Text>
                  <Text style={styles.expenseAmount}>R$ {item.amount.toFixed(2)}</Text>
                </View>
                <View style={styles.expenseActions}>
                  <TouchableOpacity onPress={() => handleEditExpense(item)}>
                    <Feather name="edit" size={20} color="#2196F3" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() =>
                    Alert.alert(
                      "Excluir Despesa",
                      "Tem certeza que deseja excluir esta despesa?",
                      [
                        {
                          text: "Cancelar",
                          style: "cancel"
                        },
                        { text: "Excluir", onPress: () => handleDeleteExpense(item.id) }
                      ]
                    )
                  }>
                    <Feather name="trash-2" size={20} color="#F44336" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
          <View style={styles.chartContainer}>
            <DonutChart data={chartData} totalExpenses={totalExpenses} />
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#4CAF50' }]} />
                <Text style={styles.legendText}>Necessário</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#E0E0E0' }]} />
                <Text style={styles.legendText}>Não Necessário</Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      <TouchableOpacity style={styles.addButton} onPress={() => {
        setEditingExpense(null);
        setModalVisible(true);
      }}>
        <Feather name="plus" size={30} color="#FFFFFF" />
      </TouchableOpacity>
      <AddExpenseModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingExpense(null);
        }}
        onAddExpense={handleAddExpense}
        onEditExpense={onEditExpense}
        editingExpense={editingExpense}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    flex: 1,
  },
  summaryContainer: {
    padding: 30,
    backgroundColor: '#4CAF50',
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
    marginTop: 5,
  },
  expensesContainer: {
    flex: 1,
    padding: 20,
  },
  expensesTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 15,
  },
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 10,
    elevation: 2,
  },
  expenseDescription: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '500',
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  expenseActions: {
    flexDirection: 'row',
    width: 60,
    justifyContent: 'space-between',
  },
  chartContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 16,
    color: '#666666',
  },
  addButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default MainScreen;