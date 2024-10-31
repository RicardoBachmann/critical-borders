import React from "react";

export default function Card(props) {
  return (
    <>
      <div className="card--container">
        <h1>Countries:</h1>
        <ul className="card--countries">
          {props.countries.map((country, index) => (
            <li key={index}>{country}</li>
          ))}
        </ul>
        <p className="card--description">{props.description}</p>
        <ul>
          {props.issues.map((issue, index) => (
            <li key={index}>{issue}</li>
          ))}
        </ul>
        <div className="map--container"></div>
      </div>
    </>
  );
}
