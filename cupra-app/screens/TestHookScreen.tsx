import React from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useUserData } from '../hooks/useUserData';

export default function TestHookScreen() {
  const { userData, loading, error, refreshUserData } = useUserData();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Test de useUserData</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estado:</Text>
        <Text>Cargando: {loading ? 'Sí' : 'No'}</Text>
        <Text>Error: {error || 'Ninguno'}</Text>
      </View>
      
      <Button 
        title="Recargar datos" 
        onPress={refreshUserData} 
      />
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Datos del Usuario:</Text>
        {userData ? (
          <ScrollView style={styles.dataContainer}>
            {Object.entries(userData).map(([key, value]) => (
              <View key={key} style={styles.dataRow}>
                <Text style={styles.dataKey}>{key}:</Text>
                <Text style={styles.dataValue}>
                  {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                </Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text>No hay datos disponibles</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dataContainer: {
    maxHeight: 300,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  dataKey: {
    fontWeight: 'bold',
    width: 120,
  },
  dataValue: {
    flex: 1,
  },
});