import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import school from './routes/school.mjs';

export default function install(app) {

  app.use('/school', school);
  const views = app.get('views');
  views.push(  path.join(__dirname, 'views')  );
  app.set('views', views);


}
