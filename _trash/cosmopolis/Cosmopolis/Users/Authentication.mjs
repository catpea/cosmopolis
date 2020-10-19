export default class Authentication {

  #states = {};

  constructor({ db, development, account, password }){
    this.db = db;
    this.development = development;
    this.account = account;
    this.password = password;

    this.#states = Object.fromEntries( ['authenticationUnknown', 'authenticationFailure', 'authenticationSuccess'].map(s=>[s, ()=>this.state = s]));
    this.state = this.#states.authenticationUnknown();

  }

  log(){
    if(this.development) console.info(...arguments);
  }

  async verify(){

    this.log(`Account verification underway ${this.account}/${this.password}`);

    if(!this.account){
      return;
    }

    if(!this.password){
      return;
    }

    try {
      this.doc = await this.db.get(this.account);
      this.log(this.doc);
    }catch(err){
      if(err.status == 404) this.log(`User ${this.account} not in database.`);
      this.err = { number: 500, message: this.development ? JSON.stringify(err) : 'Database error.' }
      this.log(`Database error.`, err);
      return;
    }

    if(this.doc.password == this.password){
      this.log(`Password is valid for ${this.account}`);
      this.#states.authenticationSuccess();
    }else{
      this.log(`Password is bad for ${this.account}`);
      this.#states.authenticationFailure();
    }

    console.log('this.state',this.state);

  }

}
