import { createRoot } from 'react-dom/client'
import App from './Components/App'
import { Provider } from 'react-redux'
import store from './Redux/Store'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
    <Provider store={store}>
    
    <App />
    </Provider>
    </BrowserRouter>
 
)
