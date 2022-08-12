import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { StyledEngineProvider } from '@mui/material';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/lib/integration/react';
import Loading from './components/common/Loading';

const persistor = persistStore(store);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <PersistGate loading={<Loading />} persistor={persistor} >
      <StyledEngineProvider injectFirst>
        <App />
      </StyledEngineProvider>
    </PersistGate>
  </Provider>
);
