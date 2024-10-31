import React from "react";

export default function Card(props) {
  return (
    <>
      <div className="card--container">
        <div className="card--countries">
          {props.countries.map((country, index) => (
            <p key={index}>{country}</p>
          ))}
        </div>
        <p>Current status: {props.isConflictZone ? "💥" : "🏳️"}</p>
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
