import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Wrapper para armazenamento seguro que funciona tanto em mobile quanto na web.
 * No mobile usa SecureStore, na web usa localStorage.
 */

async function setItemAsync(chave: string, valor: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(chave, valor);
  } else {
    await SecureStore.setItemAsync(chave, valor);
  }
}

async function getItemAsync(chave: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(chave);
  } else {
    return await SecureStore.getItemAsync(chave);
  }
}

async function deleteItemAsync(chave: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.removeItem(chave);
  } else {
    await SecureStore.deleteItemAsync(chave);
  }
}

export const storage = {
  setItemAsync,
  getItemAsync,
  deleteItemAsync,
};
