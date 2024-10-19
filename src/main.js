import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPinia } from 'pinia';  // Import createPinia from Pinia

// Create the Vue app instance
const app = createApp(App);

// Create the Pinia instance (state management)
const pinia = createPinia();

// Use the Pinia plugin in the Vue app
app.use(pinia);

// Mount the app to the DOM
app.mount('#app');
