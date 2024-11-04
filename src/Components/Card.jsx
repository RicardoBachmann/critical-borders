import React from "react";

export default function Card({ countries, onClick }) {
  return (
    <>
      <div className="card--container">
        <button className="card--countries" onClick={onClick}>
          {countries.map((country, index) => (
            <p key={index}>{country}</p>
          ))}
        </button>
      </div>
    </>
  );
}
