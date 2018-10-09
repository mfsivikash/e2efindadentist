var HtmlReporter = require('protractor-beautiful-reporter');

exports.config = {
    framework: 'jasmine',
    seleniumAddress: 'http://localhost:4444/wd/hub',

    //directConnect:true,

    specs: ['Test/OrderFoodTest.js', 'Test/SavedRestaurantTest.js', 'Test/SignUpTest.js'],
    suites: {
        orderfood: 'Test/OrderFoodTest.js',
        register: 'Test/SignUpTest.js',
        savedrestaurant: 'Test/SavedRestaurantTest.js'
    },
    capabilities: {
        browserName: 'chrome',

        //Runs each spec in new browser instance
        shardTestFiles: true,

        //Maximum number of browsers that can be opened at a time
        maxInstances: 1
    },
    onPrepare: function () {

        // Add a screenshot reporter and store screenshots to `/Report/screenshots`:
        jasmine.getEnv().addReporter(new HtmlReporter({
            baseDirectory: 'Report/screenshots'
        }).getJasmine2Reporter());
    }
};