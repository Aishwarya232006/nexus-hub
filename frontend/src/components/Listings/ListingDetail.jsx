import React from 'react';
import { useParams } from 'react-router-dom';

const ListingDetail = () => {
  const { id } = useParams();
  
  return (
    <div>
      <h2>Listing Details</h2>
      <p>Listing ID: {id}</p>
      <p>Details page coming soon...</p>
    </div>
  );
};

export default ListingDetail;