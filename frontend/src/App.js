import Map from "./component/Map";
import Sidebar from './component/Sidebar';
import "./styles/style.css"
import "./styles/playbtn.css"

function App() {

  return (
      <div className="App">
          <Sidebar/>
          <Map/>
      </div>
  );
}

export default App;