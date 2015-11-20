Session.setDefault('shouldRender', false);
Session.setDefault('count', 10);
Session.setDefault('complexity', 1);
Session.setDefault('depth', 0);
Session.setDefault('lastSize', 0);

const settingsCallback = (err, { count, complexity, depth }) => {
  if(err) {
    console.error(err);
  } else {
    Session.set('count', count);
    Session.set('complexity', complexity);
    Session.set('depth', depth);
  }
};

Meteor.startup(() => {
  Meteor.call('count', Session.get('count'), settingsCallback); // Re-sync with server settings

  Meteor.setInterval(() => {
    Meteor.call('lastSize', (err, lastSize) => {
      Session.set('lastSize', lastSize.toLocaleString());
    });
  }, 1000);
});


Template.ModeSelector.helpers({
  shouldRender: (value) => {
    return Session.get('shouldRender') === value;
  },
  session: (key) => {
    return Session.get(key);
  }
});

Template.ModeSelector.events({
  "change input[type='radio']": function({ target: { value } }) {
    Session.set('shouldRender', value === 'true');
  },
  "change input[type='range']": function({ target: { name, value } }) {
    const intValue = parseInt(value, 10);
    Meteor.call(name, intValue, settingsCallback);
  }
});

Template.Data.helpers({
  data: function(){
    return DataCollection.find({}, { sort: { updatedAt: -1 }});
  }
});
Template.DataEntry.helpers({
  stringified: function() {
    return JSON.stringify(this, null, '\t');
  }
});
