import React from 'react';
import { Image } from 'expo-image'; // Usiamo expo-image per la cache
import { StyleSheet, ImageStyle } from 'react-native'; // <-- CORREZIONE: Usa ImageStyle invece di ViewStyle

// URL del placeholder (preso da S3 o locale)
const DEFAULT_AVATAR_URL = 'https://movieapp-michele.s3.eu-north-1.amazonaws.com/default-avatar.webp';
interface AvatarProps {
  uri?: string | null; // Accetta stringa o null
  size?: number;       // Dimensione personalizzabile
  style?: ImageStyle;  // <-- CORREZIONE: Il tipo corretto per un'immagine è ImageStyle
}

export default function Avatar({ uri, size = 50, style }: AvatarProps) {
  // Logica intelligente: usa l'URI se c'è, altrimenti il default
  const source = uri ? { uri } : { uri: DEFAULT_AVATAR_URL };

  return (
    <Image
      source={source}
      style={[
        styles.avatar, 
        { width: size, height: size, borderRadius: size / 2 }, // Rotondo dinamico
        style
      ]}
      contentFit="cover"
      transition={500}
      cachePolicy="disk" // Fondamentale per risparmiare costi AWS
    />
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: '#2D2D2D', // Colore di sfondo mentre carica
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
});