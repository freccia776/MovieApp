import React from 'react';
import MovieCard from './MovieCard';
import SerieCard from './SerieCard';
import { GenericCard } from '../api/tmdb';
import { Text } from 'react-native';

export default function FavoriteCard({ card }: { card: GenericCard }) {
 

  if (card.tipo === 'movie') {
    return <MovieCard movieItem={{ id: card.id, title: card.title, image: card.image }} />;
  }
  
    return <SerieCard serieItem={{ id: card.id, name: card.name, image: card.image }} />;
  
  
}