import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

export default function(options){

  const db = {};

  db.pages = new PouchDB('./data/pouchdb/pages');
  db.friends = new PouchDB('./data/pouchdb/friends');

  return function (req, res, next) {
    req.cosmopolis.db = db;
    next()
  };

}
