import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

export default class Friends {

  constructor(){


        // this.db = {
        //   users: new PouchDB('./data/pouchdb/users'),
        //   pages: new PouchDB('./data/pouchdb/pages'),
        //   friends: new PouchDB('./data/pouchdb/friends'),
        // };

  }

  id(){}
  add(){}
  remove(){}
  verify(){}

}
