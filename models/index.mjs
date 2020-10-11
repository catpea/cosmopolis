import sequelizeLibrary from 'sequelize';
const { Sequelize, Model, DataTypes } = sequelizeLibrary;

//const sequelize = new Sequelize('sqlite::memory:');

// CREATE USER cosmopolis WITH PASSWORD '9a917927-f88e-4819-9abb-97c52f56d3b8'; CREATE DATABASE cosmopolis;
// psql -h localhost --username=cosmopolis # this will ask for password
const sequelize = new Sequelize('postgres://cosmopolis:9a917927-f88e-4819-9abb-97c52f56d3b8@localhost:5432/cosmopolis') // Example for postgres




    // fooInstance.getBars()
    // fooInstance.countBars()
    // fooInstance.hasBar()
    // fooInstance.hasBars()
    // fooInstance.setBars()
    // fooInstance.addBar()
    // fooInstance.addBars()
    // fooInstance.removeBar()
    // fooInstance.removeBars()
    // fooInstance.createBar()


async function main(){



  class User extends Model {}


  User.init({

    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,

    firstName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    lastName: DataTypes.STRING,

    lastLogin: DataTypes.DATE,
    birthday: DataTypes.DATE,

  }, {
    sequelize,
    paranoid: true,
  });

  class Group extends Model {}
  Group.init({

    creator: DataTypes.STRING,
    root: DataTypes.BOOLEAN,

    name: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    updated: DataTypes.DATE,

    type: DataTypes.STRING,
    kind: DataTypes.STRING,

  }, {
    sequelize,
    paranoid: true,
  });

  // User.belongsToMany(Group, { through: 'Structure'});
  //
  // Group.belongsToMany(Group, { as:'link', through: 'Structure'});





  await User.belongsToMany(Group, { through: 'Membership'});
  await Group.belongsToMany(User, { through: 'Membership'});

  await Group.belongsToMany(Group, { as:'Links', through: 'Structure'});



  const multiverse = await Group.create({
    creator: 'Root',
    root: true,

    name: 'Multiverse',
    description: 'Root of all groups in the system.',
    website: '',
    updated: new Date(),

    type: "Multiverse",
    kind: "Structure",
  });

  const universe = await Group.create({
    creator: 'Root',

    name: 'Primary Universe',
    description: 'Primary Universe.',
    website: '',
    updated: new Date(),

    type: "Universe",
    kind: "Structure",
  });

  const earth = await Group.create({
    creator: 'Root',

    name: 'Earth',
    description: 'Earth',
    website: '',
    updated: new Date(),

    type: "Universe",
    kind: "Structure",
  });

  const unitedStates = await Group.create({
    creator: 'Root',

    name: 'United States',
    description: 'United States',
    website: '',
    updated: new Date(),

    type: "Universe",
    kind: "Structure",
  });
  const sovietUnion = await Group.create({
    creator: 'Root',

    name: 'Soviet Union',
    description: `Federal socialist state in Northern Eurasia. Nominally a union of multiple national Soviet republics, in practice highly centralized. The Soviet Union had its roots in the October Revolution of 1917.`,
    website: '',
    updated: new Date(),

    type: "Universe",
    kind: "Structure",
  });

  await multiverse.addLink(universe);
  await universe.addLink(earth);
  await earth.addLink(unitedStates);
  await earth.addLink(sovietUnion);



  const alice = await User.create({

    username: 'alice',
    password: '123',
    email: 'alice@localhost',

    firstName: 'Alice',
    middleName: 'Pleasance',
    lastName: 'Liddell',

    lastLogin: new Date(1846, 7, 4),
    birthday: new Date(1846, 7, 4),

  });




  await sequelize.sync({ force:  0 }); // force recreates the table every time
  // await sequelize.sync(); // force recreates the table every time

  // const jane = await User.create({
  //   username: 'janedoe',
  //   birthday: new Date(1980, 6, 20)
  // });
  // jane.getGroups()
  // jane.countGroups()
  // jane.hasGroup()
  // jane.hasGroups()
  // jane.setGroups()
  // jane.addGroup()
  // jane.addGroups()
  // jane.removeGroup()
  // jane.removeGroups()
  // jane.createGroup()
  // console.log(jane.toJSON());

  return {Model, User, Group};

}

export default main;
