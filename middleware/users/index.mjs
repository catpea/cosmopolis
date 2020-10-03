

export default function(options){

  const api = {};

  api.add = function({user, password}){

  }

  api.remove = function({user}){

  }

  api.verify = function({user, password}){

  }

  return function (req, res, next) {
    req.cosmopolis.users = api;
    next()
  };

};
