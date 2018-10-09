var Utils = function () {
    var EC = protractor.ExpectedConditions;

    /*Description: Method to check if element is displayed in the page
    @Param: Web-Element
    */
    this.checkElementDisplayedandClick = function (elementtocheck, elementtoclick) {
        browser.wait(function (element) {
            element.isPresent().then(function (isPresent) {
                if (isPresent) {
                    element.isDisplayed().then(function (isDisplayed) {
                        if (isDisplayed) {
                            return true;
                        }
                    });
                } else
                    return false;
            });
        }, 20000);
    };

    /*Description: Method to check if element is present in the DOM and click on it
    @Param: Web-Element of element to check , Web-Element to Click
    */
    this.checkElementPresentAndClick = function (elementtocheck, elementtoclick) {
        elementtocheck.isPresent().then(function (isPre) {
            if (isPre) {
                elementtoclick.click();
            }
        });
    };

    /*Description:Check if elements sequence is in increasing order
     * @param: Element.all 
     */
    this.checkElementIsSorted = function (ele) {
        var sorted = [],
            unSorted = [],
            i = 0;
        ele.each(function (eachName) {
            eachName.getText().then(function (name) {
                unSorted[i] = name;
                i++;
            });
        }).then(function () {

            //check sorting
            sorted = unSorted.slice();

            //use sort function of Javascript
            sorted.sort();
            expect(sorted).toEqual(unSorted);
        });
    };

    /*Description:Assert two array and their count 
     * @param: Array1, array2
     */
    this.compareTwoArrays = function (first, second) {
        expect(first.length).toEqual(second.length);
        expect(first).toEqual(second);
    };

    /*Description: Get Text of Elements into an array 
     * @param: Array
     */
    this.storeallelementtextintoarray = function (element) {
        var names = [];
        element.each(function (element, index) {
            element.getText().then(function (text) {
                names.push(text);
            });
        });
        return names;
    };


    /*Description: Click all elements in web-element array finder
     * @param: Array
     */
    this.clickallelements = function (element) {
        element.each(function (element, index) {
            element.click();
        });
    };
};
module.exports = new Utils();