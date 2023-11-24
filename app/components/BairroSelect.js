import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { FontAwesome } from '@expo/vector-icons';

const BairroSelect = ({ value, onValueChange, label, placeholder }) => {
    const [bairros, setBairros] = useState([]);
    const [cidades, setCidades] = useState([]);

    useEffect(() => {
      // Fetch para obter os bairros
      fetch('https://cima-production.up.railway.app/bairro')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Erro ao buscar bairros');
              }
              return response.json();
          })
          .then(data => setBairros(data))
          .catch(error => console.error('Erro ao buscar bairros:', error));
  
      // Fetch para obter as cidades
      fetch('https://cima-production.up.railway.app/cidade')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Erro ao buscar cidades');
              }
              return response.json();
          })
          .then(data => setCidades(data))
          .catch(error => console.error('Erro ao buscar cidades:', error));
    }, []);

    const handleInputChange = (value) => {
        onValueChange(value || ''); // Certifique-se de que o valor está sempre definido
    };

    const pickerItems = [
        ...bairros.map(bairro => ({
            label: `${bairro.nome} - ${
                cidades.find(cidade => cidade.id === bairro.codcidade)?.nome || ''
            }`,
            value: bairro.id.toString(), // Converta o valor para string
            key: bairro.id.toString(),
        })),
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{label}</Text>
            <TouchableOpacity style={styles.button}>
                <RNPickerSelect
                    style={styles.input}
                    onValueChange={(value) => handleInputChange(value)}
                    items={pickerItems}
                    value={value && value.toString()}
                    placeholder={{ label: placeholder, value: null }}
                />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
                <FontAwesome
                    name={'globe'}
                    size={22}
                    color="#2E3E5C"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    iconContainer: {
        position: 'absolute',
        left: 25,
        top: '47.3%',
    },
    input: {
        position: 'absolute',
        width: 100,
        backgroundColor: '#A9A9A9',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    button: {
        borderWidth: 1,
        borderColor: '#A9A9A9',
        borderRadius: 50,
        height: 60,
        justifyContent: 'center',
        paddingLeft: 60,
    },
});

export default BairroSelect;
