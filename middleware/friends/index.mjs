export default function(options){

  return function (req, res, next) {

    req.cosmopolis.friends = {};

    req.cosmopolis.friends.add = async function(){

      try {
        const response = await db.put({
          _id: 'mydoc',
          type:'friend',
          deleted:false,

          account: 'Heroes',
          started:'',
          ended:'',

          visible:true,
          friend:'',
        });
      } catch (err) {
        console.log(err);
      }

    }

    req.cosmopolis.friends.list = async function(){

      const result = [];
      try {
        result = await req.cosmopolis.db.friends.find({
          selector: {account: req.session.account, friend:'', type:'friend', deleted:false},
          fields: ['_id', 'friend', 'started', 'visible'],
          sort: ['name']
        });
      } catch (err) {
        console.log(err);
      }

    };


    next();

  };

}
