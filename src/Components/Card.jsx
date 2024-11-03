import React from "react";

export default function Card(props) {
  return (
    <>
      <div className="card--container">
        <button className="card--countries">
          {props.countries.map((country, index) => (
            <p key={index}>{country}</p>
          ))}
        </button>
      </div>
    </>
  );
}
