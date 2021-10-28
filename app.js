var app = angular.module('lifeInWeeks', []);


/**
 * Page controller.
 */
MainCtrl = function($scope) {
  /** Page title */
  this.title = 'Vinayak\'s Journey as an RF 🙂';
  /** Date of Start */
  this.startDate = new Date("2021-07-05");
  /** Number of Weeks to display */
  this.totalWeeks = 104;
  /** Whether to show the legend */
  this.showLegend = true;
  /** Input data in JSON format */
  this.dataInput = '';

  /** Generated data */
  this.weeks = [];
  /** Generated legend */
  this.legend = [];

  this.refNumbers = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  this.dayNumbers = [];

  color_pallete = {
    "blue":'#7af',
    "green": '#6a3', 
    "red":'#F44336',  
    "pink":'#E91E63',  
    "voilet":'#9C27B0',  
    "yellow":'#FFEB3B',  
    "orange":'#FF9800',  
    "brown":'#795548',  
    "black":'#212121'
  };

  var exampleData = {
    spans: [{
      begin: '2021-07-05',
      end: '2021-07-05',
      color: color_pallete["blue"],
      description: 'Start of my RFship'
    }, {
      begin: '2021-07-06',
      end: '2021-07-08',
      color: color_pallete["pink"],
      description: 'IT setup'
    },
    {
      begin: '2021-07-12',
      end: '2021-07-15',
      color: color_pallete["yellow"],
      description: 'Handover sessions by Kapil'
    },
    {
      begin: '2021-07-16',
      end: '2021-07-16',
      color: color_pallete["black"],
      description: 'Kapil\'s last working day'
    },
    {
      begin: '2021-08-03',
      end: '2021-08-03',
      color: color_pallete["blue"],
      description: 'Started working on Altmin'
    },
    {
      begin: '2021-08-13',
      end: '2021-08-13',
      color: color_pallete["black"],
      description: 'Sriram\'s last working day'
    },
    {
      begin: '2021-08-12',
      end: '2021-08-12',
      color: color_pallete["red"],
      description: 'Missed WSDM deadline'
    },
    {
      begin: '2021-10-15',
      end: '2021-10-15',
      color: color_pallete["red"],
      description: 'Missed AISTATS deadline'
    },
    {
      begin: '2021-07-27',
      end: '2021-07-28',
      color: color_pallete["yellow"],
      description: 'FD clarification session with Kapil'
    },
    {
      begin: '2021-08-24',
      end: '2021-09-14',
      color: color_pallete["pink"],
      description: 'Buddy Mentorship discussions'
    },
    {
      begin: '2021-10-22',
      end: '2021-10-22',
      color: color_pallete["pink"],
      description: 'Aditya Vashisht\'s talk on Grad School'
    },
    {
      begin: '2021-10-14',
      end: '2021-10-14',
      color: color_pallete["black"],
      description: 'Shwetabh\'s last working day'
    },
    {
      begin: '2021-10-13',
      end: '2021-10-13',
      color: color_pallete["pink"],
      description: 'Discussion with Sreangsu on Grad School'
    },
    {
      begin: '2021-09-18',
      end: '2021-10-09',
      color: color_pallete["blue"],
      description: 'Debugging U Cluster'
    },
    {
      begin: '2021-10-25',
      end: '2021-11-05',
      color: color_pallete["blue"],
      description: 'Reviwer for AISTATS'
    },
    {
      begin: new Date().toISOString().substring(0, 10),
      end: new Date().toISOString().substring(0, 10),
      color: color_pallete["green"],
      description: "Today",
    }
  ]
  };

exampleData.spans.sort(
  function(item1, item2){
    op1 = item1.begin ? item1.begin : "";
    op2 = item2.begin ? item2.begin : "";
    return op1.localeCompare(op2);
  }
);

  /** Example data in JSON format */
  this.exampleData = JSON.stringify(exampleData, null, 2);

  // Register watchers to update view on changes.
  $scope.$watch('ctrl.startDate', this.update.bind(this));
  $scope.$watch('ctrl.totalWeeks', this.update.bind(this));
  $scope.$watch('ctrl.dataInput', this.update.bind(this));

  this.update();
  this.useExample();
};


MainCtrl.prototype.update = function() {
  // Parse input.
  if (!this.dataInput) {
    this.data = {};
  } else {
    try {
      this.data = JSON.parse(this.dataInput);
    } catch (err) {
      this.jsonError = err.message;
      return;
    }
  }
  this.jsonError = undefined;
  
  // Parse dates.
  if (this.data.spans) {
    this.data.spans.forEach(function(span) {
      if (span.begin) {
        span.begin = new Date(span.begin);
      }
      if (span.end) {
        span.end = new Date(span.end);
      }
    });
  }
  
  // Generate legend.
  this.legend = [];
  if (this.data.spans) {
    this.data.spans.forEach(function(span) {
      if (span.description && span.color) {
        this.legend.push({
          description: span.description,
          style: 'background: ' + span.color + '!important'
        });
      }
    }.bind(this));
  }

  this.prevMonday = new Date(this.startDate);
  this.prevMonday.setDate(this.prevMonday.getDate() - (this.prevMonday.getDay() + 6) % 7);

  // Arrange the labels
  day_ofw = new Date(this.prevMonday).getDay();
  this.dayNumbers = [];
  for(var idx = 0; idx < 3; ++idx){
    this.dayNumbers.push(this.refNumbers[(day_ofw + idx * 3) % 7]);
    this.dayNumbers.push("");
    this.dayNumbers.push("");
  }

  // Generate data for table.
  this.weeks = [];
  var currentWeek = 0;
  var currentDate = new Date(this.prevMonday);
  var nextWeek = new Date(this.prevMonday);
  nextWeek.setDate(currentDate.getDate() + 7);
  var week = {days: [], number: this.prevMonday.toLocaleDateString('en-US')};
  var today = new Date();
  while (currentWeek < this.totalWeeks) {
    var nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    if (nextDate > nextWeek) {
      this.weeks.push(week);
      currentWeek++;
      nextWeek.setDate(currentDate.getDate() + 7);
      var weekNum = undefined;
      if (currentWeek % 4 == 0) {
        weekNum = currentDate.toLocaleDateString('en-US');
      }
      week = {days: [], number: weekNum};
    }
    var color = undefined;
    var desc = "";
    if (this.data.spans) {
      this.data.spans.forEach(function(span) {
        if ((!span.begin || currentDate >= span.begin) && ((!span.end && currentDate <= today) || currentDate <= span.end)) {
          color = 'background: ' + span.color + '!important';
          desc = "| " + span.description;
        }
      });
    }
    var day = {
      date: new Date(currentDate),
      style: color,
      desc: desc,
    };
    week.days.push(day);

    currentDate = nextDate;
  }
};


/** Displays the default browser print window. */
MainCtrl.prototype.print = function() {
  window.print();
};


/** Clears the data input field. */
MainCtrl.prototype.clearData = function() {
  this.dataInput = '';
};


/** Copies the example into the data input field. */
MainCtrl.prototype.useExample = function() {
  this.dataInput = this.exampleData;
};


app.controller('MainCtrl', MainCtrl);
