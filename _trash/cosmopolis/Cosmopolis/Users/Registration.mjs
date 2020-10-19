import { v4 as uuidv4 } from 'uuid';

export default class Registration {

  #states = {};

  constructor({ db, development, account, password }){
    this.db = db;
    this.development = development;
    this.account = account;
    this.password = password;

    this.#states = Object.fromEntries( ['registrationSuccess', 'registrationFailure', 'registrationUnknown'].map(s=>[s, ()=>this.state = s]));
    this.state = this.#states.registrationUnknown();

  }

  log(){
    console.info(...arguments);
  }

  async verify(){
    const guid = uuidv4();
    this.log(`Account creation underway ${this.account}/${this.password}`);

    if(!this.account){
      return;
    }

    if(!this.password){
      return;
    }

    try {
      this.doc = await this.db.get(this.account);
      this.log(`Doc existed in the database, account id is considered taken.`);
      this.log(this.doc);
      this.#states.registrationFailure();
      return;
    }catch(err){

      if(err.status == 404){
        // user not in database
        this.log(`Document id not found, account id maybe available.`);
        try {
          this.db.put({
            _id: this.account,
            password: this.password,
            guid,
          });
          this.log(`Account stored in database`);
          let verify = await this.db.get(this.account);
          if(verify.guid == guid){
            this.#states.registrationSuccess();
            this.log(`Account successfully registered and confirmed.`);
            return;
          }else{
            this.#states.registrationFailure();
            this.log(`Somone else registered the same id just now, account id is considered taken.`);
            return;
          }
        }catch(err){
          this.log(`Database error during put operation to add the requested account. ${JSON.stringify(err)}`);
          console.log(err);
          this.err = { number: 500, message: this.development ? JSON.stringify(err) : 'Database error.' };
          this.#states.registrationFailure();
          return;
        }
      }else{
        // non 404 error has occured
        this.log(`Database error during check to see if account available.`);
        this.err = { number: 500, message: this.development ? JSON.stringify(err) : 'Database error.' };
        return;
      }
    }

  }

}
