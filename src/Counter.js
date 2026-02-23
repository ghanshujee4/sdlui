import React, { use } from "react";
import { useEffect, useState } from "react";

// import { useSelector, useDispatch } from "react-redux";
// import { increment, decrement } from "./counterSlice";

const Counter = () => {
  const [data, setData] = useState([]);
useEffect(() => {
  fetch("http://dummyjson.com/products")
    .then((response) => response.json())
    .then((data) => console.log(data))
    .then((res) => setData(res.products));
}, []);

  return (
    <div>
      <h1>Product Details</h1>
      <div>{data.map(product => (
        <div key={product}>
          
        </div>
      ))}</div>
    </div>
  );
};

export default Counter;