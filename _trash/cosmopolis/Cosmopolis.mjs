import Users from './Cosmopolis/Users.mjs';
import Friends from './Cosmopolis/Friends.mjs';
export default class Cosmopolis {

  constructor({req, res, next, models, development}){
    this.development = development;
    this.req = req;
    this.res = res;
    this.next = next;

    this.actions = {

      redirectToRootPage: () => this.res.redirect('/'),
      redirectToHomePage: () => this.res.redirect('/home'),
      redirectToProfilePage: () => this.res.redirect('/profile'),
      redirectToSignupPage: () => this.res.redirect('/signup'),
      redirectToLoginPage: () => this.res.redirect('/login'),

      registrationSuccess: () => this.res.redirect('/'),
      registrationFailure: () => this.res.redirect('/signup?taken=true'),
      registrationUnknown: () => this.res.redirect('/signup'),

      authenticationSuccess: ({account}) => {this.req.session.account = account; this.res.redirect('/');},
      authenticationFailure: () => this.res.redirect('/login?retry=true'),
      authenticationUnknown: () => this.res.redirect('/login?retry=true'),

      userLogout: () => {this.req.session.account = null},


    };


    this.models = models;
    this.users = new Users({development: this.development});
    this.friends = new Friends();

  }

  RequireLogin(){
    const {req, res, next, actions} = this;
    if(!req.session.account) return actions.redirectToLoginPage({res});
  }



  Logout(){
    const {req, res, next, actions} = this;
    actions.userLogout({res});
    actions.redirectToRootPage({res});
  }

  async SignIn({account, password}){
    const {state} = await this.users.authenticate({account, password});
    this.actions[state]({account});
  }

  async SignUp({account, password}){
    const {state} = await this.users.register({account, password});
    this.actions[state]({account});
  }

  Help(){
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(this)).filter(s=>s!='constructor'));
  }





}
