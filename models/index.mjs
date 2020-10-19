import sequelizeLibrary from 'sequelize';
const { Sequelize, Model, DataTypes } = sequelizeLibrary;

//const sequelize = new Sequelize('sqlite::memory:');

// CREATE USER cosmopolis WITH PASSWORD '9a917927-f88e-4819-9abb-97c52f56d3b8'; CREATE DATABASE cosmopolis;
// psql -h localhost --username=cosmopolis # this will ask for password
const sequelize = new Sequelize('postgres://cosmopolis:9a917927-f88e-4819-9abb-97c52f56d3b8@localhost:5432/cosmopolis') // Example for postgres



    // To create a One-To-One relationship, the hasOne and belongsTo associations are used together;
    // To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
    // To create a Many-To-Many relationship, two belongsToMany calls are used together.

    // select 'drop table if exists "' || tablename || '" cascade;'
    //   from pg_tables
    //  where schemaname = 'public';

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



  class User extends Model {
    getFullname() {
      return [this.firstName, this.middleName, this.lastName].filter(s=>s).join(' ');
    }
  }


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

    ordering: DataTypes.STRING,

  }, {
    sequelize,
    paranoid: true,
  });




  class Location extends Model {}
  Location.init({

    creator: DataTypes.STRING,
    root: DataTypes.BOOLEAN,

    name: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    updated: DataTypes.DATE,

    type: DataTypes.STRING,
    kind: DataTypes.STRING,

    ordering: DataTypes.STRING,

  }, {
    sequelize,
    paranoid: true,
  });


  class Thing extends Model {}
  Thing.init({

    creator: DataTypes.STRING,
    root: DataTypes.BOOLEAN,

    name: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    updated: DataTypes.DATE,

    type: DataTypes.STRING,
    kind: DataTypes.STRING,

    ordering: DataTypes.STRING,

  }, {
    sequelize,
    paranoid: true,
  });
  class Action extends Model {}
  Action.init({

    creator: DataTypes.STRING,
    root: DataTypes.BOOLEAN,

    name: DataTypes.STRING,
    description: DataTypes.STRING,
    website: DataTypes.STRING,
    updated: DataTypes.DATE,

    type: DataTypes.STRING,
    kind: DataTypes.STRING,

    ordering: DataTypes.STRING,

  }, {
    sequelize,
    paranoid: true,
  });













      class School extends Model {}
      School.init({

        name: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING,
        website: DataTypes.STRING,

      }, {
        sequelize,
        paranoid: true,
      });



      class Book extends Model {}
      Book.init({

        title: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING,

      }, {
        sequelize,
        paranoid: true,
      });

      class Chapter extends Model {}
      Chapter.init({

        title: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING,
        ordering: DataTypes.STRING,

      }, {
        sequelize,
        paranoid: true,
      });

      class Section extends Model {}
      Section.init({

        title: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING,
        ordering: DataTypes.STRING,

        text: DataTypes.TEXT,

      }, {
        sequelize,
        paranoid: true,
      });


      //
      // To create a One-To-One relationship, the hasOne and belongsTo associations are used together;
      // To create a One-To-Many relationship, the hasMany and belongsTo associations are used together;
      // To create a Many-To-Many relationship, two belongsToMany calls are used together.

      // Education
      await School.hasMany(Book);
      await Book.belongsTo(School);

      await Book.hasMany(Chapter);
      await Chapter.belongsTo(Book);

      await Chapter.hasMany(Section);
      await Section.belongsTo(Chapter);




      // World Structure
      await User.belongsToMany(School, { through: 'SchoolUserJunction'});
      await School.belongsToMany(User, { through: 'SchoolUserJunction'});


      await User.belongsToMany(Group, { through: 'GroupUserJunction'});
      await Group.belongsToMany(User, { through: 'GroupUserJunction'});

      await Group.belongsToMany(Group, { as:'Links', through: 'GroupGroupJunction'});

      await Location.belongsToMany(Location, { as:'Links', through: 'LocationLocationJunction'});

      await Thing.belongsToMany(Location, { as:'Locations', through: 'ThingLocationJunction'});
      await Location.belongsToMany(Thing, { as:'Things', through: 'ThingLocationJunction'});

      await Thing.hasMany(Action);
      await Action.belongsTo(Thing);






      // await sequelize.drop();
      await sequelize.sync({ force: true }); // force recreates the table every time






    const omniverse = await Location.create({
      creator: 'Root',

      name: 'Omniverse',
      description: 'Omniverse contains everything in the system.',
      website: '',
      updated: new Date(),

      type: "Omniverse",
      kind: "Structure",
    });


    const multiverse = await Location.create({
      creator: 'Root',

      name: 'Multiverse',
      description: 'Root of all groups in the system.',
      website: '',
      updated: new Date(),

      type: "Multiverse",
      kind: "Structure",
    });

    const universe616 = await Location.create({
      creator: 'Root',

      name: 'Universe 616',
      description: 'Primary Universe.',
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });

    const universe65 = await Location.create({
      creator: 'Root',

      name: 'Universe 65',
      description: 'Secondary Universe.',
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });


    const earth = await Location.create({
      creator: 'Root',
      root: true,

      name: 'Earth',
      description: 'Earth is the third planet from the Sun and the only astronomical object known to harbor life.',
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });

    const unitedStates = await Location.create({
      creator: 'Root',

      name: 'United States',
      description: 'United States',
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });

    const michigan = await Location.create({
      creator: 'Root',

      name: 'Michigan',
      description: 'State of Michigan',
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });

    const mcrc = await Location.create({
      creator: 'Root',

      name: 'Michigan Climate Refugee Camp',
      description: 'United States',
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });














    const sovietUnion = await Location.create({
      creator: 'Root',

      name: 'Soviet Union',
      description: `Federal socialist state in Northern Eurasia. Nominally a union of multiple national Soviet republics, in practice highly centralized. The Soviet Union had its roots in the October Revolution of 1917.`,
      website: '',
      updated: new Date(),

      type: "Universe",
      kind: "Structure",
    });

    await multiverse.addLink(universe616);
    await multiverse.addLink(universe65);
    await universe616.addLink(earth);
    await earth.addLink(unitedStates);
    await earth.addLink(sovietUnion);

    await unitedStates.addLink(michigan);
    await michigan.addLink(mcrc);

    const udhr = await Thing.create({
      creator: 'Root',

      name: 'Universal Declaration of Human Rights',
      description: `The Universal Declaration of Human Rights is an international document adopted by the United Nations General Assembly that enshrines the rights and freedoms of all human beings.`,
      website: '',
      updated: new Date(),

      type: "Book",
      kind: "Declaration",
    });
    const help = await Thing.create({
      creator: 'Root',

      name: 'System Help Manual',
      description: `Helpful instructions on how to get around the system.`,
      website: '',
      updated: new Date(),

      type: "Book",
      kind: "Declaration",
    });

    const read1 = await Action.create({
      creator: 'Root',

      name: 'Read',
      description: `Read`,
      website: '',
      updated: new Date(),

      type: "Action",
      kind: "Inspection",
    });
    const read2 = await Action.create({
      creator: 'Root',

      name: 'Read',
      description: `Read`,
      website: '',
      updated: new Date(),

      type: "Action",
      kind: "Inspection",
    });

    await help.addAction(read1);
    await earth.addThing(help);

    await udhr.addAction(read2);
    await earth.addThing(udhr);


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

  for(let i = 0; i<1; i++){

    const CU = await School.create({
      name: "Cosmopolis University #"+i,
      author: "Administrator",
      description: "Teaching how to get around the system from year one.",
      website: "http://",
    });

  }


  // await sequelize.sync({ force: true }); // force recreates the table every time
  await sequelize.sync(); // force recreates the table every time

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

  return {
    User, Group,
    School, Book, Chapter, Section,
    Location
  };

}

export default main;
