import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Assets/styles/global.css';
import { Pagination } from '@material-ui/lab';
import { BrowserRouter as Router, Route, Link, Routes, useNavigate, useParams } from 'react-router-dom';


function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (searchInput) {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${searchInput}`);
          const data = response.data;
          setPokemonList([data]);
          setTotalPages(1);
          setCurrentPage(1);
        } catch (error) {
          console.error(error);
        }
      } else {
        try {
          const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${(currentPage - 1) * 20}`);
          const results = response.data.results;
          const pokemonDataPromises = results.map((result) => axios.get(result.url));
          const pokemonDataResponses = await Promise.all(pokemonDataPromises);
          const pokemonDataList = pokemonDataResponses.map((response) => response.data);
          const totalCountResponse = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1');
          const totalCount = totalCountResponse.data.count;
          setPokemonList(pokemonDataList);
          setTotalPages(Math.ceil(totalCount / 20));
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [searchInput, currentPage]);

  const handleSearch = (event) => {
    event.preventDefault();
    setSearchInput(event.target.value);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<HomePage searchInput={searchInput} handleSearch={handleSearch} pokemonList={pokemonList} currentPage={currentPage} totalPages={totalPages} handlePageChange={handlePageChange} />}
          />
          <Route path="/pokemon/:id" element={<PokemonDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function HomePage({ searchInput, handleSearch, pokemonList, currentPage, totalPages, handlePageChange }) {
  return (
    <div className="homePage">
      <div className="homePageHeading">
        <h1>Welcome To PokeDex</h1>
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Введіть ім'я або Id"
          value={searchInput}
          onChange={handleSearch}
          className="searchInput"
        />
      </div>
      <div className="pokemonList">
        {pokemonList.map((pokemonData) => (
          <Link key={pokemonData.id} to={`/pokemon/${pokemonData.id}`}>
            <div className="pokemonCard">
              <img src={pokemonData.sprites.other['official-artwork'].front_default} alt={pokemonData.name} className="pokemonImage" />
              <h3 className="pokemonName">Ім'я: {pokemonData.name}</h3>
              <p>ID: {pokemonData.id}</p>
              <p>Тип: {pokemonData.types.map((type) => type.type.name).join(', ')}</p>
              <p>Зріст: {pokemonData.height}</p>
              <p>Вага: {pokemonData.weight}</p>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <Pagination count={totalPages} page={currentPage} onChange={handlePageChange} />
      </div>
    </div>
  );
}

function PokemonDetailsPage() {
  const navigate = useNavigate();
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

  const handleGoBack = () => {
    navigate('/');
  };

  return (
    <div>
      <h2>Pokemon Details</h2>
      <button onClick={handleGoBack}>Go Back</button>
      <div className="pokemonDetails">
        <img src={sprites.other['official-artwork'].front_default} alt={name} />
        <p>ID: {pokemonId}</p>
        <p>Type: {types.map((type) => type.type.name).join(', ')}</p>
        <p>Height: {height}</p>
        <p>Weight: {weight}</p>
      </div>
    </div>
  );
}

export default App;
