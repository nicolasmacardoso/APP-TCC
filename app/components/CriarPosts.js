import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  TouchableHighlight,
} from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import axios from 'axios';
import { useLogin } from '../context/LoginProvider';

const CreatePostScreen = () => {
  const [titulo, settitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [errorImage, setErrorImage] = useState('');
  const [errortitulo, setErrortitulo] = useState('');
  const [errorDescricao, setErrorDescricao] = useState('');

  const { userId } = useLogin();

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permissão para acessar a galeria foi negada!');
      }
    })();
  }, []);

  const convertImageToBase64 = async (imageUri) => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      return base64;
    } catch (error) {
      console.error('Erro ao converter imagem para base64:', error);
      throw error;
    }
  };

  const handleCreatePost = async () => {
    // Verificar se os campos obrigatórios foram preenchidos
    if (!imagem) {
      setErrorImage('Selecione uma imagem para a publicação');
      return;
    } else {
      setErrorImage('');
    }

    if (!titulo) {
      setErrortitulo('Preencha o campo de título.');
      return;
    } else {
      setErrortitulo('');
    }

    if (!descricao) {
      setErrorDescricao('Preencha o campo de descrição.');
      return;
    } else {
      setErrorDescricao('');
    }

    try {
      const isBase64 = imagem.startsWith('data:image');
      const imageData = isBase64 ? imagem : await convertImageToBase64(imagem);

      // Criar um objeto com os dados da postagem
      const postData = {
        titulo: titulo,
        descricao: descricao,
        imagem: imageData,
        codusuario: userId,
      };

      // Enviar a postagem para o servidor usando a API
      const response = await axios.post('https://cima-production.up.railway.app/postagem', postData);

      // Verificar se a postagem foi criada com sucesso
      if (response.status === 201) {
        // Exibir o modal de feedback
        setModalVisible(true);

        // Limpar os campos após a criação do post
        settitulo('');
        setDescricao('');
        setImagem('');
        setErrorImage('');
        setErrortitulo('');
        setErrorDescricao('');
      } else {
        console.error('Erro ao criar postagem:', response.data.message);
      }
    } catch (error) {
      console.error('Erro ao criar postagem:', error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.canceled) {
        setImagem(result.uri);
        setErrorImage('');
      }
    } catch (error) {
      console.error('Erro ao escolher imagem da galeria:', error);
    }
  };  

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        extraScrollHeight={Platform.select({ ios: 50, android: 0 })}
        enableOnAndroid
      >
        <Text style={styles.titulo}>Criar Publicação</Text>

        <View style={styles.formContainer}>
          <View style={styles.imageContainer}>
            <Text style={styles.label}>Capa:</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              {imagem ? (
                <Image source={{ uri: imagem }} style={styles.previewImage} />
              ) : (
                <>
                  <AntDesign name="picture" size={40} color="#FFA500" />
                  <Text style={styles.imagePickerText}>Adicionar Imagem</Text>
                </>
              )}
            </TouchableOpacity>
            {errorImage ? <Text style={styles.errorText}>{errorImage}</Text> : null}
          </View>

          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.tituloInput}
            placeholder="Digite o título..."
            placeholderTextColor="#ccc"
            value={titulo}
            onChangeText={(text) => {
              settitulo(text);
              setErrortitulo('');
            }}
          />
          {errortitulo ? <Text style={styles.errorText}>{errortitulo}</Text> : null}

          <Text style={styles.label}>Descrição:</Text>
          <TextInput
            style={styles.descriptionInput}
            placeholder="Nos conte mais sobre sua postagem..."
            placeholderTextColor="#ccc"
            multiline
            numberOfLines={4}
            value={descricao}
            onChangeText={(text) => {
              setDescricao(text);
              setErrorDescricao('');
            }}
          />
          {errorDescricao ? <Text style={styles.errorText}>{errorDescricao}</Text> : null}
        </View>

        <TouchableOpacity style={styles.postButton} onPress={handleCreatePost}>
          <Text style={styles.postButtonText}>Postar</Text>
        </TouchableOpacity>

        <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <AntDesign name="checkcircle" size={128} color="#FFA500" />
              <Text style={styles.modalText}>Publicação concluída com sucesso!</Text>
              <TouchableHighlight style={styles.okButton} onPress={closeModal}>
                <Text style={styles.okButtonText}>OK</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 16,
    justifyContent: 'center',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    marginTop: -20,
    color: '#8B4513', // Marrom
  },
  formContainer: {
    marginTop: 40,
  },
  imageContainer: {
    marginBottom: 24,
  },
  imagePicker: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  imagePickerText: {
    color: '#FFA500', // Laranja
    marginTop: 8,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: '#8B4513', // Marrom
    fontWeight: 'bold',
  },
  tituloInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  descriptionInput: {
    height: 80,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 4,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: '#FFA500', // Laranja
    padding: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    marginTop: 50,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 32,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  okButton: {
    backgroundColor: '#FFA500',
    padding: 16,
    borderRadius: 8,
  },
  okButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: 100,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginTop: 5,
  },
});

export default CreatePostScreen;
