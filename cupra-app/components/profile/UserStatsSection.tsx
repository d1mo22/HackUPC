import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface UserStatsProps {
  rachaActual: number;
  puntos: number;
  textColor: string;
  accentColor: string;
  backgroundColor: string;
}

const UserStatsSection = ({ 
  rachaActual = 0, 
  puntos = 0, 
  textColor, 
  accentColor,
  backgroundColor
}: UserStatsProps) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        Estadísticas
      </Text>
      
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Ionicons name="flame" size={30} color={accentColor} />
          <Text style={[styles.statValue, { color: textColor }]}>
            {rachaActual}
          </Text>
          <Text style={[styles.statLabel, { color: textColor }]}>
            Racha actual
          </Text>
        </View>
        
        <View style={styles.statItem}>
          <Ionicons name="star" size={30} color={accentColor} />
          <Text style={[styles.statValue, { color: textColor }]}>
            {puntos}
          </Text>
          <Text style={[styles.statLabel, { color: textColor }]}>
            Puntos
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginVertical: 7,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    padding: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.8,
    marginTop: 4,
  },
});

export default UserStatsSection;