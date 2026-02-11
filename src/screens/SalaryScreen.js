import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, Alert, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const SALARIES_STORAGE_KEY = 'salaries';

const SalaryScreen = () => {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [salaryInput, setSalaryInput] = useState('');
  const [salaries, setSalaries] = useState([]);
  const [editingSalaryId, setEditingSalaryId] = useState(null);

  useEffect(() => {
    loadSalaries();
  }, []);

  const loadSalaries = useCallback(async () => {
    try {
      const storedSalaries = await AsyncStorage.getItem(SALARIES_STORAGE_KEY);
      if (storedSalaries) {
        setSalaries(JSON.parse(storedSalaries));
      }
    } catch (error) {
      console.error('Failed to load salaries:', error);
      Alert.alert('Erro', 'Não foi possível carregar os salários.');
    }
  }, []);

  const saveSalaries = useCallback(async (currentSalaries) => {
    try {
      await AsyncStorage.setItem(SALARIES_STORAGE_KEY, JSON.stringify(currentSalaries));
    } catch (error) {
      console.error('Failed to save salaries:', error);
      Alert.alert('Erro', 'Não foi possível salvar os salários.');
    }
  }, []);

  const handleAddOrUpdateSalary = useCallback(() => {
    if (!salaryInput) {
      Alert.alert('Erro', 'Por favor, insira um valor de salário.');
      return;
    }
    const salaryValue = parseFloat(salaryInput.replace(',', '.'));
    if (isNaN(salaryValue) || salaryValue <= 0) {
      Alert.alert('Erro', 'Por favor, insira um valor de salário válido.');
      return;
    }

    const newSalaryEntry = {
      id: editingSalaryId || uuidv4(),
      date: selectedDate,
      amount: salaryValue,
    };

    let updatedSalaries;
    if (editingSalaryId) {
      updatedSalaries = salaries.map((salary) =>
        salary.id === editingSalaryId ? newSalaryEntry : salary
      );
    } else {
      updatedSalaries = [...salaries, newSalaryEntry];
    }

    setSalaries(updatedSalaries);
    saveSalaries(updatedSalaries);
    setSalaryInput('');
    setEditingSalaryId(null);
  }, [salaryInput, selectedDate, salaries, editingSalaryId, saveSalaries]);

  const handleEditSalary = useCallback((id) => {
    const salaryToEdit = salaries.find((salary) => salary.id === id);
    if (salaryToEdit) {
      setSelectedDate(salaryToEdit.date);
      setSalaryInput(String(salaryToEdit.amount));
      setEditingSalaryId(id);
    }
  }, [salaries]);

  const handleDeleteSalary = useCallback((id) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza de que deseja excluir este registro de salário?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Excluir',
          onPress: () => {
            const updatedSalaries = salaries.filter((salary) => salary.id !== id);
            setSalaries(updatedSalaries);
            saveSalaries(updatedSalaries);
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  }, [salaries, saveSalaries]);

  const renderSalaryItem = useCallback(({ item }) => (
    <View style={styles.salaryItem}>
      <Text style={styles.salaryItemText}>
        {`R$ ${item.amount.toFixed(2).replace('.', ',')} recebidos em ${format(new Date(item.date), 'dd/MM/yyyy', { locale: ptBR })}`}
      </Text>
      <View style={styles.salaryItemActions}>
        <TouchableOpacity onPress={() => handleEditSalary(item.id)} style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteSalary(item.id)} style={[styles.actionButton, styles.deleteButton]}>
          <Text style={styles.actionButtonText}>Apagar</Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [handleEditSalary, handleDeleteSalary]);

  const markedDates = salaries.reduce((acc, salary) => {
    acc[salary.date] = { selected: true, marked: true, selectedColor: '#4CAF50' };
    return acc;
  }, {
    [selectedDate]: { selected: true, selectedColor: '#4CAF50' }
  });

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Registro de Salários</Text>

      <View style={styles.inputContainer}>
        <Calendar
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            const existingSalary = salaries.find(s => s.date === day.dateString);
            if (existingSalary) {
              setSalaryInput(String(existingSalary.amount));
              setEditingSalaryId(existingSalary.id);
            } else {
              setSalaryInput('');
              setEditingSalaryId(null);
            }
          }}
          markedDates={markedDates}
          theme={{
            selectedDayBackgroundColor: '#4CAF50',
            todayTextColor: '#4CAF50',
            arrowColor: '#4CAF50',
            dotColor: '#4CAF50',
            monthTextColor: '#4CAF50',
            textDayFontFamily: 'monospace',
            textMonthFontFamily: 'monospace',
            textDayHeaderFontFamily: 'monospace',
          }}
        />

        <TextInput
          style={styles.textInput}
          placeholder="Valor do salário (ex: 2500.00)"
          keyboardType="numeric"
          value={salaryInput}
          onChangeText={setSalaryInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateSalary}>
          <Text style={styles.buttonText}>{editingSalaryId ? 'Atualizar Salário' : 'Adicionar Salário'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Salários Registrados</Text>
      {salaries.length === 0 ? (
        <Text style={styles.noSalariesText}>Nenhum salário registrado ainda.</Text>
      ) : (
        <FlatList
          data={salaries.sort((a, b) => new Date(b.date) - new Date(a.date))}
          renderItem={renderSalaryItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.salaryList}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
    color: '#333',
  },
  inputContainer: {
    marginBottom: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  textInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
    textAlign: 'center',
  },
  salaryList: {
    paddingBottom: 20,
  },
  noSalariesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
    marginTop: 10,
  },
  salaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  salaryItemText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  salaryItemActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    backgroundColor: '#2196F3', // Blue for edit
  },
  deleteButton: {
    backgroundColor: '#F44336', // Red for delete
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default SalaryScreen;
