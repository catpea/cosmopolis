import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
import location from './routes/home.mjs';
export default function install(app) {
  app.use('/', location);
  const views = app.get('views');
  views.push(  path.join(__dirname, 'views')  );
  app.set('views', views);
  app.locals.navigation.push(  {name: '', title: 'Home', ordering:'A 0'}  );
}
