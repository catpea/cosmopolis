import { v4 as uuidv4 } from 'uuid';

export default function(options){

  return function (req, res, next) {
 
    req.cosmopolis.users = {
      add: async function({account, password}){

        const addition = new Addition({
          db: req.cosmopolis.db.users,
          development: req.app.get('env') === 'development',
          account,
          password
        });
        await addition.add();
        return addition;





      },

      remove: async function({account, password}){

      },

      authenticate: async function({account, password}){
        const verification = new Verification({
          db: req.cosmopolis.db.users,
          development: req.app.get('env') === 'development',
          account,
          password
        });
        await verification.verify();
        return verification;
      },

    };

    next();
  };

};








class Addition {

  constructor({db, development, account, password}) {
    this.development = development;
    this.db = db;
    this.doc = {};
    this.err = false;

    this.success = false;
    this.taken = false;

    this.account = account;
    this.password = password;

  }

  async add() {
    if(this.development) console.info(`Attempting to add a new account.`);
    const guid = uuidv4();

    if(!this.account){
      if(this.development) console.info(`Account not specified.`);
      return;
    }

    if(!this.password){
      if(this.development) console.info(`Password not specified.`);
      return;
    }

    try {
      this.doc = await this.db.get(this.account);
      this.taken = true;
      if(this.development) console.info(`Doc existed in the database, account id is considered taken.`);
      return;
    }catch(err){
      if(err.status == 404){
        // user not in database
        if(this.development) console.info(`Document id not found, account id maybe available.`);
        try {
          this.db.put({
            _id: this.account,
            password: this.password,
            guid,
          });
          if(this.development) console.info(`Account stored in database`);
          let verify = await this.db.get(this.account);
          if(verify.guid == guid){
            this.success = true;
            if(this.development) console.info(`Account successfully registered and confirmed.`);
            return;
          }else{
            if(this.development) console.info(`Somone else registered the same id just now, account id is considered taken.`);
            this.taken = true;
            return;
          }
        }catch(err){
          if(this.development) console.info(`Database error during put operation to add the requested account. ${JSON.stringify(err)}`);
          console.log(err);
          this.err = { number: 500, message: this.development ? JSON.stringify(err) : 'Database error.' }
          return;
        }
      }else{
        // non 404 error has occured
        if(this.development) console.info(`Database error during check to see if account available.`);
        this.err = { number: 500, message: this.development ? JSON.stringify(err) : 'Database error.' }
        return;
      }
    }
  } // end verify

}




class Verification {
  constructor({db, development, account, password}) {
    this.development = development;
    this.db = db;
    this.doc = {};
    this.err = false;

    this.success = false;

    this.account = account;
    this.password = password;

  }

  async verify() {
    if(this.development) console.info(`Account verification underway ${this.account}/${this.password}`);
    if(!this.account){
      return;
    }

    if(!this.password){
      return;
    }

    try {
      this.doc = await this.db.get(this.account);
      console.log(this.doc);
    }catch(err){

      if(err.status == 404){
        // user not in database
        if(this.development) console.info(`User ${this.account} not in database.`);
      }

      this.err = { number: 500, message: this.development ? JSON.stringify(err) : 'Database error.' }
      if(this.development) console.info(`Database error.`, err);
      return;
    }

    if(this.doc.password == this.password){
      if(this.development) console.info(`Password is valid for ${this.account}`);
      this.success = true;
    }else{
      if(this.development) console.info(`Password is bad for ${this.account}`);
    }

  } // end verify

};
