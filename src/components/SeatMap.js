import React, { useState, useEffect, useRef } from 'react';

function renderSeat(seat, key, isSelected, onClick) {
  const code = seat.code || '';
  const available = seat.available;
  const price = seat.total?.alternatives?.[0]?.[0]?.amount || 0;

  const baseColor = !code
    ? '#eee'
    : isSelected
    ? '#add8e6' // selected
    : available
    ? '#ccffcc'
    : '#ffcccc';

  const style = {
    display: 'inline-block',
    margin: 5,
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: 5,
    backgroundColor: baseColor,
    textAlign: 'center',
    minWidth: 40,
    cursor: code && available ? 'pointer' : 'default',
  };

  const title = code
    ? `Seat ${code} · RM${price} · ${available ? 'Available' : 'Unavailable'}`
    : '';

  return React.createElement(
    'div',
    {
      key,
      style,
      title,
      onClick: e => {
        e.stopPropagation(); // prevent bubble up
        if (code && available) onClick(code);
      }
    },
    code || '––',
    React.createElement('div', { style: { fontSize: '10px' } }, price ? `RM${price}` : '')
  );
}

function filterSeats(seats, search, filter) {
  return seats.filter(seat => {
    const code = seat.code || '';
    const available = seat.available;
    const price = seat.total?.alternatives?.[0]?.[0]?.amount || 0;

    if (search && !code.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter.availability === 'available' && !available) return false;
    if (filter.availability === 'unavailable' && available) return false;
    if (filter.maxPrice && price > parseFloat(filter.maxPrice)) return false;

    return true;
  });
}

export default function SeatMap({ data, search, filter }) {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const containerRef = useRef(null);

  const toggleSelect = code => {
    setSelectedSeats(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  // Click-outside detection
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setSelectedSeats([]);
      }
    }

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const rows = data.seatsItineraryParts[0]
    .segmentSeatMaps[0]
    .passengerSeatMaps[0]
    .seatMap
    .cabins[0]
    .seatRows;

  return React.createElement(
    'div',
    { ref: containerRef },
    rows.map((row, idx) => {
      const filteredSeats = filterSeats(row.seats, search, filter);
      if (filteredSeats.length === 0) return null;

      return React.createElement(
        'div',
        { key: idx, style: { marginBottom: 10 } },
        React.createElement('div', { style: { fontWeight: 'bold' } }, `Row ${row.rowNumber}`),
        React.createElement(
          'div',
          null,
          filteredSeats.map((seat, i) =>
            renderSeat(seat, `${idx}-${i}`, selectedSeats.includes(seat.code), toggleSelect)
          )
        )
      );
    }),
    selectedSeats.length > 0 &&
      React.createElement(
        'div',
        { style: { marginTop: 20, fontWeight: 'bold' } },
        'Selected Seats: ',
        selectedSeats.join(', ')
      )
  );
}
