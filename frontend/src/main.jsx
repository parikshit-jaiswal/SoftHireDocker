import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import JobProvider from "./Context/JobContext/JobProvider.jsx";
const persistor = persistStore(store);

createRoot(document.getElementById('root')).render(

  <Provider store={store}>
    <JobProvider>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </JobProvider>
  </Provider >
)
