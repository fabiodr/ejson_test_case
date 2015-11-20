var faker = Meteor.npmRequire('Faker');

const options = {
  count: 10,
  complexity: 1,
  depth: 0
};

const recordIds = [];

function buildRecord(complexity, depth) {
  var record = {};

  _.times(complexity, (i) => {
    record["boolean_"+i] = _.sample([true, false]);
    record["number_"+i] = faker.random.number(100000);
    record["date_"+i] = faker.Date.recent(30);
    record["text_"+i] = faker.Lorem.sentence(20, 0);
  });

  if (depth > 0) {
    record.children = [];

    _.times(depth * 2, () => {
      record.children.push( buildRecord(Math.floor(complexity/2), depth-1));
    });
  }

  return record;
}

function resetCollection() {
  DataCollection.remove({});

  recordIds.length = 0;

  _.times(options.count, () => {
    const newAttributes = buildRecord(options.complexity, options.depth);
    recordIds.push(DataCollection.insert( _.extend({ updatedAt: new Date() }, newAttributes)));
  });
}

const checkNum = Match.Where((x) => {
  check(x, Match.Integer);
  return x >= 0;
});

Meteor.methods({
  count: (count) => {
    check(count, checkNum);
    options.count = count;
    resetCollection();
    return options;
  },
  complexity: (complexity) => {
    check(complexity, checkNum);
    options.complexity = complexity;
    return options;
  },
  depth: (depth) => {
    check(depth, checkNum);
    options.depth = depth;
    return options;
  },
  lastSize: () => {
    const lastObject = DataCollection.findOne({}, { sort: { updatedAt: -1 }});
    if(lastObject){
      return JSON.stringify(lastObject).length;
    } else {
      return 0;
    }
  }
});

Meteor.startup(() => {
  resetCollection();

  Meteor.setInterval(() => {
    const newAttributes = buildRecord(options.complexity, options.depth);
    DataCollection.update(_.sample(recordIds), _.extend({ updatedAt: new Date() }, newAttributes));
  }, 1000);
});
