
   //noinspection CodeAssistanceForCoreModules
// require('dotenv').load();
var envt = require('./environment.json');
var environment = process.env.bamboo_inject_environment || envt.env;
var fs = require('fs');
var Q = require('q');
var path = require('path');
var rimraf = require('rimraf');
var sendmail = require('sendmail')({silent: true});
//var specsFromEnv = process.env.specsToRun ? process.env.specsToRun.split(',') : undefined;
var specsFromEnv = process.env.bamboo_inject_specsToRun ? process.env.bamboo_inject_specsToRun.split(',') : ['Test/OrderFoodTest.js', 'Test/SavedRestaurantTest.js', 'Test/SignUpTest.js'];
var specsToRun = specsFromEnv ? specsFromEnv : ['Test/OrderFoodTest.js', 'Test/SavedRestaurantTest.js', 'Test/SignUpTest.js'];
//var specsToRun = specsFromEnv ? specsFromEnv : ['specs/select-documents-verify-service.js,specs/unsent-facility-selection-in-matching.js,specs/verify-service-cards-in-implementation-page.js,specs/update-remove-service.js,specs/GOBF-redesign.js'];
var patientName = process.env.patientName || global.nameOfPatientCreated;
var browserNameToRun = process.env.bamboo_inject_browserNameToRun || 'chrome';
//var mysql = require('mysql');
var seleniumServer = process.env.bamboo_inject_seleniumServer;

//Fetch the current time to create new folder with the name having current date and time
var timeNow = (new Date()).toString().replace(/:/g, '-');


exports.config = {
    // The address of a running selenium server.

    seleniumAddress: 'http://localhost:4444/wd/hub',
    

    plugins: [
        {
            package: 'jasmine2-protractor-utils',
            disableHTMLReport: false,
            disableScreenshot: false,
            screenshotPath: __dirname + '/reports/screenshots - ' + timeNow + '/',
            screenshotOnExpectFailure: true,
            screenshotOnSpecFailure: true,
            clearFoldersBeforeTest: false,
            htmlReportDir: __dirname + '/reports/htmlReports - ' + timeNow + '/',
            //Commented out after discussing with Gopa
            failTestOnErrorLog: false
        },
        {
            package: require.resolve('protractor-console'),
            logLevels: ['OFF']
        }
    ],

    /*plugins: [{
       package: 'jasmine2-protractor-utils',
       disableHTMLReport: false,
       disableScreenshot: false,
       screenshotPath:'./reports/screenshots',
       screenshotOnExpectFailure:true,
       screenshotOnSpecFailure:true,
       clearFoldersBeforeTest: true,
       htmlReportDir: './reports/htmlReports',
       failTestOnErrorLog: {
                   failTestOnErrorLogLevel: 900,
                   excludeKeywords: []
               }
     }],*/

//seleniumServerJar: "../node_modules/selenium-server-standalone-jar/jar/selenium-server-standalone-2.53.1.jar",
    //chromeDriver: '../node_modules/chromedriver/lib/chromedriver/chromedriver' + (process.platform === 'darwin' ? '' : '.exe'),
    capabilities: {
        //browserName: 'firefox'
        /*browserName: 'chrome',
         //shardTestFiles: true,
         maxInstances: 1,
         'version': '09',
         'chromeOptions': {
         args: ['--test-type']
         }*/
        'browserName': browserNameToRun

    },

    framework: 'jasmine2',

    specs: specsToRun,


    getPageTimeout: 1000000,

    allScriptsTimeout: 300000,

    untrackOutstandingTimeouts: true,

    SELENIUM_PROMISE_MANAGER: true,

    beforeLaunch: function () {

        //Get the specific env object from environment.json file
        var configEnv = envt[environment];
        //Add all the key value pair to process.env
        Object.keys(configEnv).forEach(function (key) {
            process.env[key] = configEnv[key];
        });
        //Adding the current envoronment name
        process.env.currentEnv = environment;
        global.orgNameInAddressBook = null;

        global.nameOfPatientCreated = null;
        global.patientMRN = null;
        global.patientAccNo = null;
        global.firstNameOfThePatient = null;
        global.middleNameOfThePatient = null;
        global.lastNameOfThePatient = null;
        global.patientDOB = null;
        global.patientAdmitDate = null;
        global.patientEDD = null;
        global.patientGender = 'M';
        global.namePtnt = patientName;
        global.PatientNameReassigned = patientName;
        global.suluHikaruPatientName = 'Sulu, Hikaru';
        global.firstDocumentName = null;
        global.selectedProvidercardIndex = 0;
        global.totalServiceCard = null;
        global.docNameToAssignAndUnaasign = null;
        global.docNameToAssignAndUnaasign2 = null;
        global.configValueForDefaultServiceCard = false;
        global.uniqueEmailBeforeSave = null;
        global.uniquePhoneBeforeSave = null;
        global.subsUserNameFacility2 = 'mbhprouser';
        global.subsPasswordFacility2 = 'Password2';
        global.providerFaxNumber = null;
        global.urlofpatientworkflowpage = null;
        global.totalmessagesForRC = null;
        global.careCoordinationID = null;
        global.patientEpisodeIdentifier = null;
        global.pcServiceConnectionID = null;
        global.patientReferralCode = null;
        global.patientQCPin = null;
        global.actualIndex = null;
        global.qcRefCode = null;
        global.qcRefPin = null;

        //creates reports folder if does not exist
        var dir = __dirname + '/reports';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        /*           var fd = fs.openSync('./tmp/tmp.json', 'w');

                fs.closeSync(fs.openSync('./tmp/tmp.json', 'w'));*/

        var uploadsDir = __dirname + '/reports';

        fs.readdir(uploadsDir, function (err, files) {
            //var files = fs.readdirSync(uploadsDir);
            files.forEach(function (file, index) {
                fs.stat(path.join(uploadsDir, file), function (err, stat) {
                    var endTime, now;
                    if (err) {
                        return console.error(err);
                    }
                    now = new Date().getTime();
                    endTime = new Date(stat.ctime).getTime() + 43200000;
                    if (now > endTime) {
                        return rimraf(path.join(uploadsDir, file), function (err) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log('successfully deleted');
                        });
                    }
                });
            });
        });
    },

    afterLaunch: function () {

        var tu = require('./genericTestUtils.js');
        var deferred = Q.defer();
        /*
        if (!fs.existsSync(__dirname + '/reports/zip')) {
            fs.mkdirSync(__dirname + '/reports/zip');
        }

        return tu.zipDirectory(__dirname + '/reports/htmlreports/', __dirname + '/reports/zip/Report.zip', '/htmlReports').then(function (result) {
            if (result.result === 'pass') {

                var buffer = fs.readFileSync(__dirname + '/reports/zip/Report.zip');
                if (!process.env.BUILD_TAG) {
                    sendmail({
                        from: 'abhisek.dash@mindfiresolutions.com',
                        to: 'abhisek.dash@mindfiresolutions.com',
                        subject: process.env.BUILD_TAG ? process.env.BUILD_TAG : 'NaviHealth-Protractor' + ' - Report',
                        html: 'Please find the attachment for reports!',
                        attachments: [
                            {
                                filename: 'Report.zip',
                                content: buffer
                            }
                        ]
                    }, function (err, reply) {
                        console.log(err && err.stack);
                        //console.dir(reply);
                        deferred.resolve('Done!');
                    });
                }
                else {
                    deferred.resolve('Done!');
                }
            }
            return deferred.promise;
        });
        */
    },


    onPrepare: function () {

        return global.browser.getProcessedConfig().then(function (config) {
            // browser.manage().timeouts().pageLoadTimeout(30000);
            browser.driver.manage().timeouts().implicitlyWait(5000);
            browser.manage().window().maximize();
            global.presenceOf = protractor.ExpectedConditions.presenceOf;
            global.EC = protractor.ExpectedConditions;
            //  protractor.urlToRun= MBHurlToRun;
            global.waitForLoaderToDisappear = function () {
                browser.driver.wait(function () {
                    return browser.driver.findElement(by.id('loading')).isDisplayed().then(function (result) {
                        return !result
                    });
                }, 80000);
            };
            global.waitForPageToLoad = function () {

                browser.driver.wait(browser.driver.executeScript("return document['readyState'] ? 'complete' == document.readyState : true"), 40000);
            };
            global.archiveTheReferralAtIntake = function () {
                browser.driver.findElement(by.id('patientReferral-top-archive')).isDisplayed().then(function (result) {
                    if (result) {
                        browser.driver.findElement(by.id('patientReferral-top-archive')).click();
                        browser.driver.sleep(8000);
                        browser.driver.findElement(by.id('myModal_Archive-remove')).click();
                        global.waitForLoaderToDisappear();
                        browser.driver.sleep(8000);
                    }
                });
            };


            global.isAngularSite = function (flag) {
                browser.ignoreSynchronization = !flag;
            };

            var SpecReporter = require('jasmine-spec-reporter');
            jasmine.getEnv().addReporter(new SpecReporter({displayStacktrace: true}));

            var jasmineReporters = require('jasmine-reporters');
            jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
                consolidateAll: true,
                filePrefix: 'results',
                savePath: './testresults'
            }));

            /*
            var DescribeFailureReporter = require('protractor-stop-describe-on-failure');
            jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()));
            */

            //Removing this code after discussing with Gopa on 25th July
            /*browser.manage().logs().get('browser').then(function(browserLog) {
                console.log('log: ' + require('util').inspect(browserLog));
            });*/

        });

    },

// Options to be passed to Jasmine-node.
    jasmineNodeOpts: {
        isVerbose: true,
        includeStackTrace: true,
        showColors: true,
        defaultTimeoutInterval: 1800000

        // print: function() {}
    }

};
