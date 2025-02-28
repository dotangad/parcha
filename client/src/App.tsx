import { useState } from "react";

// Example of importing from your shared code
// import { something } from "database/lib.ts";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="app">
      <h1>Parcha</h1>
      <div>
        <button onClick={() => setCount(count => count + 1)}>
          Count is: {count}
        </button>
      </div>
    </div>
  );
}

export default App; 