import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  Content: {
    id: number;
    type: 'film' | 'serie';
  };
};

export type ContentProps = NativeStackScreenProps<RootStackParamList, 'Content'>;