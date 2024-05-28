import Form from "./components/Form";
import { EthProvider } from "./contexts/EthContext";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <Form />
      </div>
    </EthProvider>
  );
}

export default App;
