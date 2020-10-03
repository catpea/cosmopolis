export default function(options){
  return function (req, res, next) {
    req.cosmopolis = {};
    next()
  };
};
