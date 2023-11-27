import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Modal,
  Image,
  KeyboardAvoidingView,
} from 'react-native';
import { useLogin } from '../context/LoginProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';

function ChatPrincipal() {
  const { profile, userId } = useLogin();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://10.32.12.0:3000', {
      reconnection: true,
    });

    socketRef.current.on('chat message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      saveMessageLocally(message);
    });

    loadSavedMessages();

    return () => {
      // Não desconecte o socket aqui
    };
  }, []);

  const sendMessage = () => {
    if (message.trim() !== '') {
      const newMessage = {
        text: message,
        isUserMessage: true,
        userName: profile.nome,
        userId: `https://cima-production.up.railway.app/usuario/${userId}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bairro: profile.bairro, // Adicione o bairro do remetente
      };

      // Enviar a mensagem apenas para usuários do mesmo bairro
      socketRef.current.emit('chat message', newMessage, profile.bairro);
      setMessage('');
    }
  };

  const saveMessageLocally = async (message) => {
    try {
      const savedMessages = await AsyncStorage.getItem('chatMessages');
      const parsedMessages = savedMessages ? JSON.parse(savedMessages) : [];
      parsedMessages.push(message);
      await AsyncStorage.setItem('chatMessages', JSON.stringify(parsedMessages));
    } catch (error) {
      console.error('Erro ao salvar mensagem localmente:', error);
    }
  };

  const loadSavedMessages = async () => {
    try {
      const savedMessages = await AsyncStorage.getItem('chatMessages');
      if (savedMessages) {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens salvas:', error);
    }
  };

  const isReceivedImage = (message) => {
    const currentUserIP = '10.32.1.116'; // IP do usuário atual
    return message.ip !== currentUserIP && message.isReceivedImage;
  };

  const handleLongPress = (message) => {
    setSelectedMessage(message);
    setModalVisible(true);
  };

  const handleDeleteMessage = async () => {
    if (selectedMessage && !selectedMessage.deleted) {
      try {
        const deleteMessage = {
          text: 'Esta mensagem foi excluída.',
          isUserMessage: true,
          userName: profile.nome,
          userId: `https://cima-production.up.railway.app/usuario/${userId}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          deleted: true,
        };
  
        // Atualizar a lista local, marcando a mensagem como excluída para todos os usuários
        const updatedMessages = messages.map((msg) =>
          msg.id === selectedMessage.id ? { ...msg, deleted: true } : msg
        );
  
        await AsyncStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
        setMessages(updatedMessages);
  
        setSelectedMessage(null);
        setModalVisible(false);
  
        // Enviar a mensagem especial indicando exclusão para todos os usuários do mesmo bairro
        socketRef.current.emit('chat message', deleteMessage, profile.bairro);
      } catch (error) {
        console.error('Erro ao excluir mensagem localmente:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>BAIRRO - CENTRO</Text>
        </View>
        <FlatList
          style={styles.messageList}
          data={messages.filter(
            (msg) =>
              !msg.deleted &&
              (msg.bairro === profile.bairro ||
                msg.userId === `https://cima-production.up.railway.app/usuario/${userId})`
  ))}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onLongPress={() => handleLongPress(item)}
              style={[
                styles.messageContainer,
                item.userId === `https://cima-production.up.railway.app/usuario/${userId}`
                  ? styles.userMessageContainer
                  : styles.receiverMessageContainer,
                isReceivedImage(item) ? styles.receivedImageContainer : null,
                index === 0 ? styles.firstMessage : null, // Adicione o estilo firstMessage à primeira mensagem
              ]}
            >
              <Text style={styles.userNameText}>{item.userName}</Text>
              {isReceivedImage(item) ? (
                <Image source={{ uri: item.imageURL }} style={styles.receivedImage} />
              ) : (
                <Text
                  style={[
                    styles.messageText,
                    !item.isUserMessage ? styles.receiverMessageText : null,
                  ]}
                >
                  {item.text}
                </Text>
              )}
              <Text style={styles.timestampText}>{item.timestamp}</Text>
            </TouchableOpacity>
          )}
        />
        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.actionButton} onPress={handleDeleteMessage}>
                <Text style={styles.actionButtonText}>Excluir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.actionButtonText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Digite sua mensagem"
            value={message}
            onChangeText={(text) => setMessage(text)}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export default ChatPrincipal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#304269',
    height: 180,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  headerText: {
    fontSize: 24,
    fontFamily: 'Inter-bold',
    fontWeight: 'bold',
    textAlign: 'center',
    top: 100,
    left: 110,
    position: 'absolute',
    color: '#fff', // Marrom
  },
  messageList: {
    flex: 1,
    padding: 8,
  },
  messageContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    minWidth: 100,
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#D1E1FC', // Cor de fundo para mensagens enviadas pelo usuário
  },
  userNameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2E3E5C',
    marginBottom: 4,
  },
  receiverMessageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFE2D1', // Cor de fundo para mensagens recebidas
  },
  receivedImageContainer: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFEFEF',
  },
  receivedImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
  },
  messageText: {
    fontSize: 16,
    textAlign: 'right',
  },
  receiverMessageText: {
    fontSize: 16,
    textAlign: 'left',
    color: '#2E3E5C', // ou qualquer cor desejada para o texto das mensagens recebidas
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  input: {
    flex: 1,
    backgroundColor: '#EFEFEF',
    borderRadius: 8,
    marginRight: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#1C3977',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  actionButton: {
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  actionButtonText: {
    fontSize: 16,
    color: 'black',
  },
  firstMessage: {
    marginTop: 180, // ou qualquer valor de margem superior desejado
  },
});
