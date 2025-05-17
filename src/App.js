import React, { useEffect, useState } from 'react';
import SeatMap from './components/SeatMap';

export default function App() {
  const [seatData, setSeatData] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({ availability: 'all', maxPrice: '' });

  useEffect(() => {
    fetch('/SeatMapResponse.json')
      .then(res => res.json())
      .then(setSeatData)
      .catch(console.error);
  }, []);

  return React.createElement(
    'div',
    { style: { padding: 20, fontFamily: 'sans-serif' } },
    React.createElement('h1', null, 'Flight Seat Map Display'),
    React.createElement(
      'div',
      { style: { marginBottom: 16 } },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search seat (e.g. 4A)',
        value: search,
        onChange: e => setSearch(e.target.value),
        style: { marginRight: 10 }
      }),
      React.createElement('select', {
        value: filter.availability,
        onChange: e => setFilter({ ...filter, availability: e.target.value }),
        style: { marginRight: 10 }
      },
        React.createElement('option', { value: 'all' }, 'All'),
        React.createElement('option', { value: 'available' }, 'Available'),
        React.createElement('option', { value: 'unavailable' }, 'Unavailable')
      ),
      React.createElement('input', {
        type: 'number',
        placeholder: 'Max Price (MYR)',
        value: filter.maxPrice,
        onChange: e => setFilter({ ...filter, maxPrice: e.target.value })
      })
    ),
    seatData
      ? React.createElement(SeatMap, { data: seatData, search, filter })
      : React.createElement('p', null, 'Loading seat map...')
  );
}
