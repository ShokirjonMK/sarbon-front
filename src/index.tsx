import reportWebVitals from './reportWebVitals';
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
import App from './App';
import 'suneditor/dist/css/suneditor.min.css';
import 'assets/styles/index.scss';
import 'assets/styles/index.css';

createRoot(document.getElementById('root')!).render(
  <Provider store={store} >
    <Router>
      <App />
    </Router>
  </Provider>
);

reportWebVitals();