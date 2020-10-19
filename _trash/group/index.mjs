import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import group from './routes/group.mjs';

export default function install(app) {

  app.use('/group', group);
  const views = app.get('views');
  views.push(  path.join(__dirname, 'views')  );
  app.set('views', views);


}
