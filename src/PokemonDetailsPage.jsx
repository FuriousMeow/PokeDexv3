import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const PokemonDetailsPage = () => {
  const { id } = useParams();
  const [pokemonData, setPokemonData] = useState(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = response.data;
        setPokemonData(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPokemonData();
  }, [id]);

  if (!pokemonData) {
    return <div>Loading...</div>;
  }

  const { name, id: pokemonId, sprites, height, weight, types } = pokemonData;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', textAlign: 'center' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>{name}</h1>
      <img src={sprites.other['official-artwork'].front_default} alt={name} style={{ width: '200px', borderRadius: '50%', marginBottom: '20px' }} />
      <p style={{ fontSize: '16px', marginBottom: '8px' }}>ID: {pokemonId}</p>
      <p style={{ fontSize: '16px', marginBottom: '8px' }}>Type: {types.map((type) => type.type.name).join(', ')}</p>
      <p style={{ fontSize: '16px', marginBottom: '8px' }}>Height: {height}</p>
      <p style={{ fontSize: '16px', marginBottom: '8px' }}>Weight: {weight}</p>
      <Link to="/" style={{ textDecoration: 'none', color: '#333', backgroundColor: '#ffc107', padding: '10px 20px', borderRadius: '5px', transition: 'background-color 0.3s ease' }}>Back to Home</Link>
    </div>
  );
};

export default PokemonDetailsPage;
