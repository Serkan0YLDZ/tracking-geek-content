import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useDebounce } from 'use-debounce';

interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
}

interface TVShow {
  id: number;
  name: string;
  first_air_date: string;
  poster_path: string;
}

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

interface Manga {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  published: {
    from: string; // ISO format
  };
}

type ContentFilter = 'all' | 'movies' | 'tv' | 'books' | 'manga';

const SearchBox = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [movieResults, setMovieResults] = useState<Movie[]>([]);
  const [tvResults, setTvResults] = useState<TVShow[]>([]);
  const [bookResults, setBookResults] = useState<Book[]>([]);
  const [mangaResults, setMangaResults] = useState<Manga[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');
  const [debouncedValue] = useDebounce(searchTerm, 500);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const shouldShowNoResults = searchTerm && !isLoading;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setIsOpen(true);
    }
  }, [searchTerm]);

  const searchContent = async (query: string) => {
    if (!query) {
      setMovieResults([]);
      setTvResults([]);
      setBookResults([]);
      setMangaResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const tmdbOptions = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTE1MTI4MmZmMzUwNjg5MDFlODQ4NTU0Y2RiY2I5MSIsIm5iZiI6MTcyOTQxODA1Ny4xOTIzODEsInN1YiI6IjY3MTRkMWZlZDViNzkyNmU5NDcwMTBiMSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._3V-WtISDrcTJS37Y0fdnMR-VBGm2ixffj-WSTTDKMo'
        }
      };

      const requests = [];

      if (contentFilter === 'all' || contentFilter === 'movies') {
        requests.push(
          fetch(
            `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=tr-TR&page=1`,
            tmdbOptions
          ).then(res => res.json())
        );
      } else {
        requests.push(Promise.resolve({ results: [] }));
      }

      if (contentFilter === 'all' || contentFilter === 'tv') {
        requests.push(
          fetch(
            `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(query)}&include_adult=false&language=tr-TR&page=1`,
            tmdbOptions
          ).then(res => res.json())
        );
      } else {
        requests.push(Promise.resolve({ results: [] }));
      }

      if (contentFilter === 'all' || contentFilter === 'books') {
        requests.push(
          fetch(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10`
          ).then(res => res.json())
        );
      } else {
        requests.push(Promise.resolve({ docs: [] }));
      }

      if (contentFilter === 'all' || contentFilter === 'manga') {
        requests.push(
          fetch(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(query)}&limit=10`)
            .then(res => res.json())
        );
      } else {
        requests.push(Promise.resolve({ data: [] }));
      }

      const [movieData, tvData, bookData, mangaData] = await Promise.all(requests);

      setMovieResults(movieData.results?.slice(0, contentFilter === 'movies' ? 10 : 3) || []);
      setTvResults(tvData.results?.slice(0, contentFilter === 'tv' ? 10 : 3) || []);
      setBookResults(bookData.docs?.slice(0, contentFilter === 'books' ? 10 : 3) || []);
      setMangaResults(mangaData.data?.slice(0, contentFilter === 'manga' ? 10 : 3) || []);
    } catch (error) {
      console.error('Arama hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchContent(debouncedValue);
  }, [debouncedValue, contentFilter]);

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className="relative">
        <Input
          type="text"
          placeholder="Film, dizi, kitap veya manga ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10"
          onFocus={() => setIsOpen(true)}
        />
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-500" />
      </div>

      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-50 z-10">
          <div className="text-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-b-2 border-primary"></div>
          </div>
        </div>
      )}

      {isOpen && searchTerm && !isLoading && (movieResults.length > 0 || tvResults.length > 0 || bookResults.length > 0 || mangaResults.length > 0 || shouldShowNoResults) && (
        <div className="absolute mt-2 w-full rounded-md border bg-background shadow-lg z-50">
          {(contentFilter === 'all' || contentFilter === 'movies') && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-semibold text-gray-500">Filmler</span>
                <button
                  onClick={() => setContentFilter('movies')}
                  className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  Sadece Filmlerde Ara
                </button>
              </div>
              {movieResults.length > 0 ? (
                <ul className="border-b">
                  {movieResults.map((movie) => (
                    <li
                      key={movie.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer"
                    >
                      {movie.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          className="h-12 w-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{movie.title}</div>
                        <div className="text-sm text-gray-500">
                          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Tarih yok'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 border-b">Film bulunamadı</div>
              )}
            </>
          )}

          {(contentFilter === 'all' || contentFilter === 'tv') && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-semibold text-gray-500">Diziler</span>
                <button
                  onClick={() => setContentFilter('tv')}
                  className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  Sadece Dizilerde Ara
                </button>
              </div>
              {tvResults.length > 0 ? (
                <ul className="border-b">
                  {tvResults.map((show) => (
                    <li
                      key={show.id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer"
                    >
                      {show.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${show.poster_path}`}
                          alt={show.name}
                          className="h-12 w-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{show.name}</div>
                        <div className="text-sm text-gray-500">
                          {show.first_air_date ? new Date(show.first_air_date).getFullYear() : 'Tarih yok'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 border-b">Dizi bulunamadı</div>
              )}
            </>
          )}

          {(contentFilter === 'all' || contentFilter === 'books') && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-semibold text-gray-500">Kitaplar</span>
                <button
                  onClick={() => setContentFilter('books')}
                  className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  Sadece Kitaplarda Ara
                </button>
              </div>
              {bookResults.length > 0 ? (
                <ul className="border-b">
                  {bookResults.map((book) => (
                    <li key={book.key} className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer">
                      {book.cover_i && (
                        <img
                          src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                          alt={book.title}
                          className="h-12 w-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{book.title}</div>
                        <div className="text-sm text-gray-500">
                          {book.first_publish_year ? book.first_publish_year : 'Yayın yılı yok'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 border-b">Kitap bulunamadı</div>
              )}
            </>
          )}
          {(contentFilter === 'all' || contentFilter === 'manga') && (
            <>
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-sm font-semibold text-gray-500">Manga</span>
                <button
                  onClick={() => setContentFilter('manga')}
                  className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
                >
                  Sadece Manga'da Ara
                </button>
              </div>
              {mangaResults.length > 0 ? (
                <ul className="border-b">
                  {mangaResults.map((manga) => (
                    <li
                      key={manga.mal_id}
                      className="flex items-center gap-3 px-4 py-2 hover:bg-accent cursor-pointer"
                    >
                      {manga.images.jpg.image_url && (
                        <img
                          src={manga.images.jpg.image_url}
                          alt={manga.title}
                          className="h-12 w-8 object-cover rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium">{manga.title}</div>
                        <div className="text-sm text-gray-500">
                          {manga.published?.from ? new Date(manga.published.from).getFullYear() : 'Tarih yok'}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-2 text-sm text-gray-500 border-b">Manga bulunamadı</div>
              )}
            </>
          )}

          {contentFilter !== 'all' && (
            <div className="px-4 py-2 border-t">
              <button
                onClick={() => setContentFilter('all')}
                className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer"
              >
                Tüm Sonuçları Göster
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;