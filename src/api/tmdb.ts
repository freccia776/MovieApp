

//QUESTO FILE GESTISCE TUTTE LE CHIAMATE ALL'API DI TMDB PER QUANTO RIGUARDA HOME E RICECA al momento

const API_KEY = process.env.EXPO_PUBLIC_TMDB_API_KEY;  //SFRUTTO LE ENVIROMENT VARIABLES DI EXPO
const BASE_URL = "https://api.themoviedb.org/3";



//INTERFACCIA TYPIZZATA PER I FILM E SERIE

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  image: string;
}


export interface Serie {

id: number;
name: string;
overview: string;
poster_path: string;
image: string;

}



//FUNZIONI ASINCRONE CON PROMISE CIOÈ COSA VIENE RESTITUITO IN FUTURO DALLA FUNZIONE 
//LE FUNZIONI ASINCRONE UTILIZZANO AWAIT PER ASPETTARE LA RISPOSTA DEL SERVER

export async function getPopularMovies(): Promise<Movie[]> {
  const res = await fetch(
    BASE_URL + "/movie/popular?api_key=" + API_KEY + "&language=it-IT&page=1"
  );
  const data = await res.json();
  
  const movies: Movie[] = [];
  data.results.forEach((movie: any) => {
  movies.push({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    image: "https://image.tmdb.org/t/p/w500" +  movie.poster_path,
  });
});
return movies;
}

export async function getNowPlayingMovies(): Promise<Movie[]> {
  const res = await fetch(
    BASE_URL + "/movie/now_playing?api_key=" + API_KEY + "&language=it-IT&page=1"
  );
  const data = await res.json();
  const movies: Movie[] = [];
  data.results.forEach((movie: any) => {
    movies.push({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    image: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
    }); 
  });
  return movies; 

}


export async function getNewSeries(): Promise<Serie[]> {
  const res = await fetch(
    BASE_URL + "/tv/on_the_air?api_key=" + API_KEY + "&language=it-IT&page=1"
  );
  
  const data = await res.json();
  const series: Serie[] = [];
    data.results.forEach((serie: any) => {
      series.push({
        id: serie.id,
          name: serie.name,
          overview: serie.overview,
          poster_path: serie.poster_path,
          image: "https://image.tmdb.org/t/p/w500" + serie.poster_path,
      }); 
    });
  return series;
}


export async function getPopularSeries(): Promise<Serie[]> {

  const res = await fetch(
    BASE_URL + "/tv/popular?api_key=" + API_KEY + "&language=it-IT&page=1"
  );
  
  const data = await res.json();
  const series: Serie[] = [];
    data.results.forEach((serie: any) => {
      series.push({
        id: serie.id,
          name: serie.name,
          overview: serie.overview,
          poster_path: serie.poster_path,
          image: "https://image.tmdb.org/t/p/w500" + serie.poster_path,
      }); 
    });
  return series;
}


export interface ContentDetails {
  id: number;
  title: string;     // opzionale (alcune API usano "name" invece di "title")
  tipo: 'movie' | 'serietv';
  anno: string;
  durata?: number;    
  seasons?: number;   
  episodes?: number;  
  overview: string;
  poster_path: string;
  image: string;
}



export async function getContentById(id: number, type: 'movie' | 'serietv'): Promise<ContentDetails> {
  let endpoint = "";

  if (type === "movie") {
    endpoint = "https://api.themoviedb.org/3/movie/" + id + "?api_key=" +  API_KEY + "&language=it-IT";
  } else {
    endpoint = "https://api.themoviedb.org/3/tv/" + id + "?api_key=" + API_KEY + "&language=it-IT";
  }


  const res = await fetch(endpoint);
  if (!res.ok) {
    throw new Error("Errore nel recupero dei dati:" + res.status);
  }

  const data = await res.json();
  let contenuto: ContentDetails = {
  id: data.id,
  title: data.title || data.name,
  tipo: type,
  anno: (data.release_date || data.first_air_date || "").slice(0, 4),
  overview: data.overview,
  poster_path: data.poster_path,
  image: "https://image.tmdb.org/t/p/w500" + data.poster_path  
};

// Se è un film → aggiungo durata
if (type === "movie") {
  contenuto.durata = data.runtime;
}

// Se è una serie → aggiungo seasons e episodes
if (type === "serietv") {
  contenuto.seasons = data.number_of_seasons;
  contenuto.episodes = data.number_of_episodes;
}


  return contenuto;
}

//funzione di ricerca da implementare

export async function searchMovies(text: string): Promise<Movie[]> {

 const res = await fetch(
    BASE_URL + "/search/movie?api_key="+ API_KEY + "&language=it-IT&query=" + text
  );


  const data = await res.json();

  const movies: Movie[] = [];
  data.results.forEach((movie: any) => {
    movies.push({
    id: movie.id,
    title: movie.title,
    overview: movie.overview,
    poster_path: movie.poster_path,
    image: "https://image.tmdb.org/t/p/w500" + movie.poster_path,
    }); 

  });
  return movies; 


}

export async function searchSeries(text: string): Promise<Serie[]> {

 const res = await fetch(
    BASE_URL + "/search/tv?api_key="+ API_KEY + "&language=it-IT&query=" + text
  );


  const data = await res.json();

  const series: Serie[] = []; //PROBLEMI DI TIPIZZAZIONE???
  data.results.forEach((serie: any) => {
    series.push({
    id: serie.id,
    name: serie.name,
    overview: serie.overview,
    poster_path: serie.poster_path,
    image: "https://image.tmdb.org/t/p/w500" + serie.poster_path,
    }); 
    
  });
  return series; 


}
