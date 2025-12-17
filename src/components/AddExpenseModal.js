
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Modal, Switch } from 'react-native';

const AddExpenseModal = ({ visible, onClose, onAddExpense, onEditExpense, editingExpense }) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [isNecessary, setIsNecessary] = useState(false);

  useEffect(() => {
    if (editingExpense) {
      setDescription(editingExpense.description);
      setAmount(editingExpense.amount.toString());
      setIsNecessary(editingExpense.isNecessary);
    } else {
      setDescription('');
      setAmount('');
      setIsNecessary(false);
    }
  }, [editingExpense]);

  const handleSave = () => {
    if (description && amount) {
      const expenseData = {
        id: editingExpense ? editingExpense.id : Math.random().toString(),
        description,
        amount: parseFloat(amount),
        isNecessary,
      };

      if (editingExpense) {
        onEditExpense(expenseData);
      } else {
        onAddExpense(expenseData);
      }

      onClose();
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{editingExpense ? 'Editar Despesa' : 'Adicionar Despesa'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Descrição"
            placeholderTextColor="#4CAF50"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Valor"
            placeholderTextColor="#4CAF50"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>É uma despesa necessária?</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isNecessary ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setIsNecessary}
              value={isNecessary}
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={handleSave}>
            <Text style={styles.addButtonText}>{editingExpense ? 'Salvar' : 'Adicionar'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#4CAF50',
  },
  addButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#4CAF50',
    fontSize: 16,
  },
});

export default AddExpenseModal;
