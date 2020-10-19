import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import location from './routes/location.mjs';

export default function install(app) {

  app.use('/location', location);

  const views = app.get('views');
  views.push(  path.join(__dirname, 'views')  );
  app.set('views', views);

  app.locals.navigation.push(  {name: 'location', title: 'Multiverse', ordering:'A 1'}  );

}
