import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';

export default function SettingsScreen() {
  const { signOut } = useAuth();

  const handleDeleteAccount = () => {
    Alert.alert("Logout", "Sei sicuro di voler uscire?", [ //funzione di conferma cancellazione.
      { text: "Annulla", style: "cancel" },
      { text: "Esci", style: "destructive", onPress: signOut }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Impostazioni</Text>

      <View style={styles.section}>
        <TouchableOpacity style={styles.item} onPress={() => Alert.alert("Info", "Versione App: 1.0.0")}>
          <Ionicons name="information-circle-outline" size={24} color="#FFFFFF" />
          <Text style={styles.itemText}>Info App</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.item} onPress={() => Alert.alert("Privacy", "Policy...")}>
          <Ionicons name="shield-checkmark-outline" size={24} color="#FFFFFF" />
          <Text style={styles.itemText}>Privacy & Sicurezza</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.item, styles.logoutItem]} onPress={handleDeleteAccount}>
          <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
          <Text style={[styles.itemText, styles.logoutText]}>Elimina Account</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A1A',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 30,
  },
  section: {
    backgroundColor: '#2D2D2D',
    borderRadius: 12,
    paddingVertical: 10,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#3A3A3A',
  },
  itemText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 15,
  },
  logoutItem: {
    borderBottomWidth: 0,
    marginTop: 10,
  },
  logoutText: {
    color: '#FF3B30',
    fontWeight: '600',
  }
});