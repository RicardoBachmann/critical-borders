import "./App.css";
import Card from "./Components/Card.jsx";
import data from "./data.js";

console.log(data);

function App() {
  const displayData = data.map((item) => {
    return <Card key={item.id} {...item} />;
  });
  return (
    <>
      <section>{displayData}</section>
    </>
  );
}

export default App;
