import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const fetchCharacters = async (page) => {
  const { data } = await axios.get(`https://rickandmortyapi.com/api/character?page=${page}`);
  return data;
};

const RickandMorthyComponent = () => {
  const [page, setPage] = useState(1);

  const { data, isError, isLoading } = useQuery({
    queryKey: ['characters', page],
    queryFn: () => fetchCharacters(page),
    keepPreviousData: true,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong...</p>;

  const nextPage = () => {
    if (data.info.next && page < 5) {
      setPage((old) => old + 1);
    }
  };

  const prevPage = () => {
    if (data.info.prev) {
      setPage((old) => Math.max(old - 1, 1));
    }
  };

  return (
    <div className="character-list">
      <h1>Rick and Morty Characters</h1>
      <div className="character-grid">
        {data.results.slice(0, 16).map((character) => (
          <div className="character-card" key={character.id}>
            <div className="character-image">
              <img src={character.image} alt={character.name} />
            </div>
            <div className="character-details">
              <p className="character-name"><strong>{character.name}</strong></p>
              <p className="character-info">{character.status} - {character.species}</p>
              <p className="last-seen"><small>Last seen on</small></p>
              <p className="character-location">{character.location.name}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <button
          onClick={prevPage}
          disabled={page === 1}
        >
          Previous
        </button>
        <span>Page {page}</span>
        <button
          onClick={nextPage}
          disabled={!data.info.next || page >= 5}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RickandMorthyComponent;