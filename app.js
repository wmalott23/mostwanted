/*
    Author: devCodeCamp
    Description: Most Wanted Starter Code
*/
//////////////////////////////////////////* Beginning Of Starter Code *//////////////////////////////////////////

"use strict";
//? Utilize the hotkey to hide block level comment documentation
////* Mac: Press "CMD"+"K" and then "CMD"+"/"
////* PC: Press "CTRL"+"K" and then "CTRL"+"/"

/**
 * This is the main logic function being called in index.html.
 * It operates as the entry point for our entire application and allows
 * our user to decide whether to search by name or by traits.
 * @param {Array} people        A collection of person objects.
 */
function app(people) {
    // promptFor() is a custom function defined below that helps us prompt and validate input more easily
    // Note that we are chaining the .toLowerCase() immediately after the promptFor returns its value
    let searchType = promptFor(
        "Do you know the name of the person you are looking for? Enter 'yes' or 'no'",
        yesNo
    ).toLowerCase();
    let searchResults;
    switch (searchType) {
        case "yes":
            searchResults = searchByName(people);
            break;
        case "no":
            //! TODO #4: Declare a searchByTraits (multiple traits) function //////////////////////////////////////////
                //! TODO #4a: Provide option to search for single or multiple //////////////////////////////////////////
            let choicesArray = ['one', 'multiple'];
            searchType = promptFor("Would you like to search by one trait or multiple? Enter 'one' or 'multiple'", chars, choicesArray).toLowerCase();
            switch (searchType) {
                case 'one':
                    searchResults = searchByTrait(people);
                    break;
                case 'multiple':
                    searchResults = searchByTraits(people);
                    break
                default:
                    // Re-initializes the app() if neither case was hit above. This is an instance of recursion.
                    app(people);
                    break;
                }
            break;
    }
   
    // Calls the mainMenu() only AFTER we find the SINGLE PERSON
    mainMenu(searchResults, people);
}
// End of app()

/**
 * After finding a single person, we pass in the entire person-object that we found,
 * as well as the entire original dataset of people. We need people in order to find
 * descendants and other information that the user may want.
 * @param {Object[]} person     A singular object inside of an array.
 * @param {Array} people        A collection of person objects.
 * @returns {String}            The valid string input retrieved from the user.
 */
function mainMenu(person, people) {
    // A check to verify a person was found via searchByName() or searchByTrait()
    if (!person[0]) {
        alert("Could not find that individual.");
        // Restarts app() from the very beginning
        return app(people);
    }
    let choicesArray = ['info', 'family', 'descendants', 'restart', 'quit']
    let displayOption = promptFor(
        `Found ${person[0].firstName} ${person[0].lastName}. Do you want to know their 'info', 'family', or 'descendants'?\nType the option you want or type 'restart' or 'quit'.`
    , chars, choicesArray);
    // Routes our application based on the user's input
    switch (displayOption) {
        case "info":
            //! TODO #1: Utilize the displayPerson function //////////////////////////////////////////
            // HINT: Look for a person-object stringifier utility function to help
            // find person by filtered item
            // show persons traits
            let personInfo = displayPerson(person[0])

            alert(personInfo);
            break;
        case "family":
            //! TODO #2: Declare a findPersonFamily function //////////////////////////////////////////
            // HINT: Look for a people-collection stringifier utility function to help
            let personFamily = findPersonFamily(person[0], people);
            alert(personFamily);
            break;
        case "descendants":
            //! TODO #3: Declare a findPersonDescendants function //////////////////////////////////////////
            // HINT: Review recursion lecture + demo for bonus user story
            let personDescendants = findPersonDescendants(person[0], people);
            alert(personDescendants);
            break;
        case "restart":
            // Restart app() from the very beginning
            app(people);
            break;
        case "quit":
            // Stop application execution
            return;
        default:
            // Prompt user again. Another instance of recursion
            return mainMenu(person, people);
    }
}
// End of mainMenu()

/**
 * This function is used when searching the people collection by
 * a person-object's firstName and lastName properties.
 * @param {Array} people        A collection of person objects.
 * @returns {Array}             An array containing the person-object (or empty array if no match)
 */
function searchByName(people) { // takes in people data set, prompts user for first and last name, and finds person with that name in data set
    let allFirst = [] 
    for (let index = 0; index < people.length; index++) { // finds all possible first names in an array for input validation
        allFirst.push(people[index].firstName.toLowerCase())
    }
    let allLast = []
    for (let index = 0; index < people.length; index++) { // finds all possible last names in an array for input validation
        allLast.push(people[index].lastName.toLowerCase())
    }
    let firstName = promptFor("What is the person's first name?", chars, allFirst);
    let lastName = promptFor("What is the person's last name?", chars, allLast);

    // The foundPerson value will be of type Array. Recall that .filter() ALWAYS returns an array.
    let foundPerson = people.filter(function (person) {
        if (person.firstName === firstName && person.lastName === lastName) { // filters people data set based on inputs
            return true;
        }
    });
    return foundPerson; // returns foundPerson to be displayed
}
// End of searchByName()

/**
 * This function will be useful for STRINGIFYING a collection of person-objects
 * first and last name properties in order to easily send the information
 * to the user in the form of an alert().
 * @param {Array} people        A collection of person objects.
 */
function displayPeople(people) {
    alert(
        people.map(function (person) {
                return `${person.firstName} ${person.lastName}`;
            })
            .join("\n")
    );
}
// End of displayPeople()

/**
 * This function will be useful for STRINGIFYING a person-object's properties
 * in order to easily send the information to the user in the form of an alert().
 * @param {Object} person       A singular object.
 */
function displayPerson(person) {
    let personInfo = `First Name: ${person.firstName}\n`;
    personInfo += `Last Name: ${person.lastName}\n`;
    personInfo+=` gender: ${person.gender}\n`;
    personInfo+=` dob: ${person.dob}\n`;
    personInfo+=` height: ${person.height}\n`;
    personInfo+=` weight: ${person.weight}\n`;
    personInfo+=` eye Color: ${person.eyeColor}\n`;
    personInfo+=` occupation: ${person.occupation}\n`;
    personInfo+=` parents: ${person.parents}\n`;
    personInfo+=` current Spouse: ${person.currentSpouse}\n`;
    return personInfo;
}
// End of displayPerson()

/**
 * This function's purpose is twofold:
 * First, to generate a prompt with the value passed in to the question parameter.
 * Second, to ensure the user input response has been validated.
 * @param {String} question     A string that will be passed into prompt().
 * @param {Function} valid      A callback function used to validate basic user input.
 * @returns {String}            The valid string input retrieved from the user.
 */
function promptFor(question, valid, choicesArray) { // receives a question, validation function, and array of correct responses
    do {
        var response = prompt(question).trim(); //trims user input to question
    } while (!response || !valid(response, choicesArray)); // loops question if input is not within array
    return response; //returns validated input
}
// End of promptFor()

/**
 * This helper function checks to see if the value passed into input is a "yes" or "no."
 * @param {String} input        A string that will be normalized via .toLowerCase().
 * @returns {Boolean}           The result of our condition evaluation.
 */
function yesNo(input) {
    return input.toLowerCase() === "yes" || input.toLowerCase() === "no";
}
// End of yesNo()

/**
 * This helper function operates as a default callback for promptFor's validation.
 * Feel free to modify this to suit your needs.
 * @param {String} input        A string.
 * @returns {Boolean}           Default validation -- no logic yet.
 */
// check if the user's choice is within the Array returns true
function chars(input, choicesArray) { // receives user input and array of choices, validates input against array of choices
    return choicesArray.includes(input.toLowerCase()); //returns true or false to promptFor() if input is validated
    } // Default validation only
// End of chars()
function charDefined(input) { // receives user input and array of choices, validates input against array of choices
    return (typeof input != "undefined"); //returns true or false to promptFor() if input is validated
    } // Default validation only

//////////////////////////////////////////* End Of Starter Code *//////////////////////////////////////////
// Any additional functions can be written below this line ????. Happy Coding! ????

// pulling in people data set
// Allows user to filter by trait
function searchByTrait(people) {
    let choicesArray = ['gender', 'date of birth', 'height', 'weight', 'eyecolor', 'occupation'];
    let inputTrait = promptFor("What trait would you like to use to find a person? Please choose one: 'gender', 'date of birth', 'height', 'weight', 'eyecolor', 'occupation'?", chars, choicesArray).toLowerCase();
    let trait = promptFor(`What would you like to search for in ${inputTrait}`, charDefined, choicesArray).toLowerCase();
    let foundPeople = findPeople(people, inputTrait, trait);
    if(typeof foundPeople[0] == "undefined"){ // repeats function if nobody is found
        alert("Could not find anyone based on that input");
        return searchByTrait(people);
    }
    return foundPeople; //returning person's info back to app function to display
}

function searchByTraits(people) { //Search for person/persons by multiple traits 
    let choicesArray = ['gender', 'date of birth', 'height', 'weight', 'eyecolor', 'occupation'];
    let input = prompt("What would you like to look for? Choose from 'gender', 'dob', 'height', 'weight', 'eyecolor', 'occupation': Please enter like: gender male;dob 1/1/1994").toLowerCase();
    let currentInput = '';
    let traitArray = [];
    let inputArray = [];
    for(let i = 0; i<input.length; i++){//steps thru user input and  
        if(input[i] != " " && input[i] != ";") currentInput = currentInput + input[i];//concat letters into a word
        if(input[i] == " "){//pushes word before a space into trait array
            traitArray.push(currentInput);
            currentInput = '';
        }
        if(input[i] == ';' || i == input.length-1){//pushes word before ; or the last word in the input into input array
            inputArray.push(currentInput);
            currentInput = '';
        }}
    let counter = 0;// validates trait input against array
    for(let i = 0; i<traitArray.length; i++){
        if(choicesArray.includes(traitArray[i])) counter++;
    }
    if(counter != traitArray.length){//restarts function if invalid
        alert("One of the traits was invalid");
        return searchByTraits(people)
    }
    for(let i = 0; i<inputArray.length; i++){//Ensures that trait array and input array have the same number of inputs
        if(inputArray[i] == '' || typeof inputArray[i] == 'undefined'){
        alert("One of the lookup values was invalid");
        return searchByTraits(people)
}}

    let foundPeople = '';
    for(let i = 0; i<traitArray.length; i++){ // filters people dataset with each trait and each input made by user
        foundPeople = findPeople(people, traitArray[i], inputArray[i])
    };
    return foundPeople;//returns persons info to be displayed in main menu
}

function findPersonFamily(person, people){//receives person/object and people data set returns immediate family members
    let personInfo = "" //adds spouse parent and sibbling names to persons info
    let spouse = findSpouse(person,people);
    let spouseName = nameGenerator(spouse);
    personInfo+=`Current Spouse: ${spouseName}\n`;
    let parentIDArray = person.parents;
    let parents = findParents(parentIDArray, people);
    let parentNames = nameGenerator(parents);
    personInfo+=`Parents: ${parentNames}\n`;
    let siblings = findSiblings(parentIDArray, people);
    let siblingNames = nameGenerator(siblings);
    personInfo+=`Siblings: ${siblingNames}\n`;
    return personInfo;//returns person info to be displayed
}
// function findPersonDescendants(person, people){
//     let firstGen = people.filter(function(el){
//         if (el.parents.includes(person.id)) {
//             return true;
//     }})
//     let secondGen = [];
//     for (let index = 0; index < firstGen.length; index++) {
//         secondGen = people.filter(function(el){
//             if (el.parents.includes(firstGen[index].id)) {
//                 return true;
//     }})}
//     let firstGenNames = firstGen.map(function(el){
//         return el.firstName +' '+ el.lastName
//     })
//     let secondGenNames = secondGen.map(function(el){
//         return el.firstName +' '+ el.lastName
//     })
//     return `Desecendants: ${firstGenNames} , ${secondGenNames} `}

let descendants = [];
function findPersonDescendants(person, people){//takes in person/object and people/dataset and finds children and childrens children etc... until no more
    let group = [];
    if(!Array.isArray(person)) group = Array(person); // if person input is not an array, turns it into an array for lower logic
    else group = person;
    let generation = people.filter(function(el){ //steps through person's parents and filters people with parent IDs that match input person's parents
        for(let i = 0; i<group.length; i++){
            if (el.parents.includes(group[i].id)) return true; //assigns everyone to generation
        }
    })
    if(generation.length>0){ //repeats function if generation is not empty
        for(let i = 0; i<generation.length; i++){
            descendants.push(generation[i]) // pushes everyone in generations to descendants array
        }
        findPersonDescendants(generation, people)
    }
    let descendantsNames = descendants.map(function(el){ //maps descendants array to return first and last names
        return el.firstName +' '+ el.lastName;
    })
    return `Descendants: ${descendantsNames}`; //returns descendants list to be displayed
}

function findPeople(people, inputTrait, trait){
    let traitSearch = "";
    let foundPeople = people.filter(function (person) {
    if(inputTrait == 'gender') traitSearch = person.gender; //filters people data set based on parameters
    if(inputTrait == 'height') traitSearch = person.height;
    if(inputTrait == 'weight') traitSearch = person.weight;
    if(inputTrait == 'date of birth') traitSearch = person.dob;
    if(inputTrait == 'eyecolor') traitSearch = person.eyeColor;
    if(inputTrait == 'occupation') traitSearch = person.occupation;
    if(traitSearch == trait) {
        return true;
    }})
    return foundPeople;
}
function nameGenerator(peopleArray){
    let fullNames = peopleArray.map(function(el){// maps parameter array to first and last name
        return el.firstName + ' ' + el.lastName;
})
    return fullNames;
}

function findSiblings(parentArray, people){
    let siblings = people.filter(function(el){//filters people based on persons matching  parent id
    let counter = 0;
    for(let i = 0; i<el.parents.length; i++)
        if(parentArray.includes(el.parents[i])) counter++;
    if(counter > 0) return true;
})
    return siblings;
}

function findParents(parentArray, people){
    let parents = people.filter(function(el){//filters people based on persons parent id
        if(parentArray.includes(el.id)) return true;
    })
    return parents;
}

function findSpouse(person,people){
    let spouse = people.filter(function(el){//finds spouse 
    if(el.id == person.currentSpouse) return true;
    })
    return spouse;
}