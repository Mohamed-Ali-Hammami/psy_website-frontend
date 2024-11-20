"use client";

import React, { useEffect, useState } from 'react';
import { client } from '../../sanity/lib/client'; // Import your Sanity client
import ProductListing from '../../components/ProductListing'; // Import the ProductListing component
import SearchBar from '../../components/TheSearchBar';
import './productpagecss.css';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number; // Optional discount price
  image: {
    _type: string;
    asset: {
      _ref: string;
      _type: string;
    };
  };
}

// ProductsPage component
const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]); // State for products
  const [searchTerm, setSearchTerm] = useState<string>(''); // State for the search term
  const [sortOption, setSortOption] = useState('default'); // State for sorting option

  // Fetch products data on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      const fetchedProducts: Product[] = await client.fetch('*[_type == "product"]');
      setProducts(fetchedProducts);
    };

    fetchProducts();
  }, []); // Empty dependency array means this runs once on mount

  // Filter products based on the search term
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products based on selected option
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case 'priceAsc':
        return a.price - b.price;
      case 'priceDesc':
        return b.price - a.price;
      case 'discount':
        return (b.discountPrice || 0) - (a.discountPrice || 0);
      default:
        return 0; // Default order
    }
  });

  return (
    <div className='productsPage'>
      <h1 className='heading'>Here you will find all the available tests</h1>
      <p className="presentationText">
        Welcome to our collection of psychological tests. Whether you&apos;re looking to assess cognitive abilities, emotional health, or behavioral traits, we have a variety of tests designed to meet your needs. Browse through our selection and find the right test for you or your institution.
      </p>
      <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
      


      <div className='productList'>
      <div className='sortOptions'>
        <label htmlFor="sort">Sort by: </label>
        <select id="sort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
          <option value="default">Default</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="discount">Discount</option>
        </select>
      </div>
        <ProductListing products={sortedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
