import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  HomeTab: undefined;
  FilmContent: { movieId: number }; // è un numero
};

// props tipizzate per le screen
export type FilmContentProps = NativeStackScreenProps<RootStackParamList, 'FilmContent'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'HomeTab'>;
