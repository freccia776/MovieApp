import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons'; 

export type FriendCardType = 'friend' | 'request' | 'pending';

interface FriendData {

  id: number; 
  username: string;
  image: string;
}

interface FriendCardProps {
  friendItem: FriendData;
  type: FriendCardType;
  
  onPressCard?: () => void;    
  onAccept?: () => void;
  onDecline?: () => void;
  onDelete?: () => void;
}

// Componente FriendCard versatile per amici, richieste e pending
const FriendCard = ({ 
  friendItem, 
  type, 
  onPressCard, 
  onAccept, 
  onDecline, 
  onDelete 
}: FriendCardProps) => {
  
  // Controllo di sicurezza: se mancano dati essenziali, non mostriamo nulla
  if (!friendItem?.username) return null;

  const CardContent = (
    <View style={styles.infoContainer}>
      {/* Immagine con fallback se l'URL è vuoto */}
      <Image 
        source={{ uri: friendItem.image || 'https://via.placeholder.com/50' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.username} numberOfLines={1}>{friendItem.username}</Text>
    </View>
  );

  const renderRightSide = () => {
    switch (type) {
      case 'request':
        return (
          <View style={styles.buttonsContainer}>
            {/* I pulsanti specifici bloccano la propagazione del tocco alla card principale */}
            <TouchableOpacity onPress={onAccept} style={styles.acceptButton}>
              <Text style={styles.buttonText}>Accetta</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onDecline} style={styles.declineButton}>
              <Text style={styles.buttonText}>Rifiuta</Text>
            </TouchableOpacity>
          </View>
        );
      
      case 'pending':
        return (
          <View style={styles.buttonsContainer}>
            <Text style={styles.pendingText}>In attesa</Text>
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Text style={styles.buttonText}>Annulla</Text>
            </TouchableOpacity>
          </View>
        );

      case 'friend':
      default:
        // L'icona indica che è navigabile
        return <Ionicons name="chevron-forward" size={20} color="#666" />;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card} 
      onPress={onPressCard}
      activeOpacity={0.7}
      // Se non passi una funzione di navigazione, disabilitiamo il click sulla card
      disabled={!onPressCard} 
    >
      {CardContent}
      {renderRightSide()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2D2D2D",
    borderRadius: 12,
    padding: 12,
    marginVertical: 6,
    marginHorizontal: 10,
    flexDirection: "row", 
    alignItems: "center",
    justifyContent: "space-between",
    
    shadowColor: "#9966CC",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "rgba(153, 102, 204, 0.2)",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, 
    marginRight: 10,
  },
  profileImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 1.5,
    borderColor: "#9966CC",
    marginRight: 12,
    backgroundColor: '#1A1A1A', // Sfondo scuro per immagini trasparenti
  },
  username: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    flexShrink: 1, 
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  acceptButton: {
    backgroundColor: "#9966CC",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  declineButton: {
    backgroundColor: "#3A3A3A",
    borderWidth: 1,
    borderColor: "#555",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  deleteButton: {
    backgroundColor: "#3A3A3A",
    borderWidth: 1,
    borderColor: "#FF3B30", 
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  pendingText: {
    color: "#888",
    fontSize: 12,
    fontStyle: 'italic',
    marginRight: 5,
  },
});

export default FriendCard;