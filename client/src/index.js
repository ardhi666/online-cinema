import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { QueryClient, QueryClientProvider } from "react-query";
import {store} from './redux/store'
import {Provider} from 'react-redux'


const container = document.getElementById('root');
const root = createRoot(container);

const client = new QueryClient();

root.render(
  <React.StrictMode>
      <Provider store={store}>
      <QueryClientProvider client={client}>
          <App />
      </QueryClientProvider>
      </Provider>
  </React.StrictMode>
);



