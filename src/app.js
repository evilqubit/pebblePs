var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');

var parseFeed = function(data, quantity) {
  var items = [];
  for(var i = 0; i < quantity; i++) {
    // Always upper case the description string
    var title = data[i].title;
    title = title.charAt(0).toUpperCase() + title.substring(1);

    // Get date/time substring
    var city = data[i].city ;
    //time = time.substring(time.indexOf('-') + 1, time.indexOf(':') + 3);

    // Add to menu items array
    items.push({
      title:title,
      subtitle:city
    });
  }

  // Finally return whole array
  return items;
};

// Show splash screen while waiting for data
var splashWindow = new UI.Window({
  backgroundColor:'white'
});

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 30),
  size: new Vector2(144, 40),
  text:'Downloading peerspace data...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();

// Make request to openweathermap.org
ajax(
  {
    url:'http://www.peerspace.com/spaces/all',
    type:'json'
  },
  function(data) {
    // Create an array of Menu items
    var menuItems = parseFeed(data, 10);

    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'Spaces',
        items: menuItems
      }]
    });

    // Add an action for SELECT
    resultsMenu.on('select', function(e) {
      // Get that forecast
      var forecast = data[e.itemIndex];

      // Assemble body string
      var content = data[e.itemIndex].features;

      //C apitalize first letter
      content = content.charAt(0).toUpperCase() + content.substring(1);

      // Add details etc
      content += '\number of guests: ' + forecast.number_guests +
        '\nOwner: ' + forecast.owner +
        '\nRules : ' + forecast.rules ;

      // Create the Card for detailed view
      var detailCard = new UI.Card({
        title:'Details',
        subtitle:e.item.subtitle,
        body: content
      });
      detailCard.show();
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    splashWindow.hide();
  },
  function(error) {
    console.log('Download failed: ' + error);
  }
);
