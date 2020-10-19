import Authentication from './Users/Authentication.mjs';
import Registration from './Users/Registration.mjs';

import PouchDB from 'pouchdb';
import PouchFind from 'pouchdb-find';
PouchDB.plugin(PouchFind);

export default class Users {

  constructor({development}){

    // this is not available to the public
    // this maybe replaced with another database
    this.db = new PouchDB('./data/pouchdb/users');
    //development
    this.development = development;
  }

  get(){}

  remove(){}

  async register({account, password}){
    const {db, development} = this;
    const response = new Registration({ db, development, account, password });
    await response.verify();
    return response;
  }

  async authenticate({account, password}){
    const {db, development} = this;
    const response = new Authentication({ db, development, account, password });
    await response.verify();
    return response;
  }

}
