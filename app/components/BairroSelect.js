import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const BairroSelect = ({ value, onValueChange, label, placeholder }) => {
    const [bairros, setBairros] = useState([]);
    const [cidades, setCidades] = useState([]);
  
    useEffect(() => {
      // Fetch para obter os bairros
      fetch('https://cima-production.up.railway.app/bairro')
        .then(response => response.json())
        .then(data => setBairros(data))
        .catch(error => console.error('Erro ao buscar bairros:', error));
  
      // Fetch para obter as cidades
      fetch('https://cima-production.up.railway.app/cidade')
        .then(response => response.json())
        .then(data => setCidades(data))
        .catch(error => console.error('Erro ao buscar cidades:', error));
    }, []);
  
    const handleInputChange = value => {
      onValueChange(value);
    };
  
    // Adiciona a opção "Selecione o bairro" como a primeira entrada
    const pickerItems = [
      { label: 'Selecione o bairro', value: '', key: '0' },
      ...bairros.map(bairro => ({
        label: `${bairro.nome} - ${
          cidades.find(cidade => cidade.id === bairro.codcidade)?.nome || ''
        }`,
        value: bairro.id,
        key: bairro.id.toString(),
      })),
    ];
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{label}</Text>
        <TouchableOpacity style={styles.button}>
          <RNPickerSelect
            onValueChange={value => handleInputChange(value)}
            items={pickerItems}
            value={value}
            placeholder={{ label: placeholder, value: null }}
          />
        </TouchableOpacity>
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  button: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
  },
});

export default BairroSelect;
