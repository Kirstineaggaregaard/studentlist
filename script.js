"use strict";

document.addEventListener("DOMContentLoaded", start);

const HTML = {};
let studentJSON = [];
let allOfStudent = [];
let countsOfStudents;
let selectedFilter;
let sortedStudents = [];
const mySorting = document.querySelectorAll("#sorting > .sort");
let familiesJSON = [];
let halfBlood = [];
let pureBlood = [];
let expelledStudents = [];
let filteredArray = [];

const Student = {
  firstName: "",
  lastName: "",
  middleName: null,
  nickName: null,
  images: null,
  house: "",
  gender: "",
  bloodStatus: "",
  expelled: false,
  winner: false,
  star: false
};

//START AND GET JSON

function start() {
  HTML.template = document.querySelector("template");
  HTML.dest = document.querySelector("#data_container");
  HTML.popup = document.querySelector("#popup");
  HTML.wrapper = document.querySelector(".content");
  HTML.studentName = document.querySelector(".single_name");
  HTML.blood = document.querySelector(".single_blood");

  // EVENTLISTENER ON FILTER HOUSES
  document.querySelectorAll(".filter").forEach(elm => {
    elm.addEventListener("click", handleFilter);
  });

  mySorting.forEach(elm => {
    elm.addEventListener("click", sortStudents);
  });

  // eventlistener for hacking Kirstine into hogwarts

  document.querySelector(".hack").addEventListener("click", hackTheSystem);

  allOfStudent = filteredArray;

  countsOfStudents = 0;

  getJson();
}

// GET JSON FOR STUDENTS
async function getJson() {
  const url = "//petlatkea.dk/2020/hogwarts/students.json";
  const url2 = "//petlatkea.dk/2020/hogwarts/families.json";
  const jsonData = await fetch(url);
  const jsonDataFamily = await fetch(url2);

  studentJSON = await jsonData.json();
  familiesJSON = await jsonDataFamily.json();
  arrangeObjects(studentJSON, familiesJSON);
}

//POPUP
function showPopup(student) {
  console.log("showPopup");

  popup.style.display = "flex";

  document.querySelector(".content").dataset.theme = student.house;

  if (student.lastName == undefined) {
    HTML.studentName.textContent = student.firstName;
  } else if (student.middleName == undefined) {
    HTML.studentName.textContent = student.firstName + " " + student.lastName;
  } else {
    HTML.studentName.textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  }

  if (student.nickName != null) {
    HTML.studentName.textContent = `${student.firstName} "${student.nickName}" ${student.lastName}`;
  }

  document.querySelector(".single_house").textContent = "House: " + student.house;

  if (student.fullName == "") {
    HTML.studentName.textContent = student.fullName + "";
  }

  document.querySelector(".single_gender").textContent = "Gender: " + student.gender;

  document.querySelector(".single_blood").textContent = "Bloodstatus: " + student.blood;

  // PREFECT

  if (student.winner === true) {
    document.querySelector(".single_prefect").textContent = "Prefect: Yes";
  } else {
    document.querySelector(".single_prefect").textContent = "Prefect: No";
  }

  // INQUISITORIAL SQUAD

  if (student.star === true) {
    document.querySelector(".single_squad").textContent = "A part of inquisitorial squad: Yes";
  } else {
    document.querySelector(".single_squad").textContent = "A part of inquisitorial squad: No";
  }

  document.querySelector(".student_photo").src = student.photo;

  document.querySelector(".close").addEventListener("click", () => {
    popup.style.display = "none";
  });
}

//CLEAN UP DATA

function arrangeObjects() {
  // DIFINE FAMILIES BLOOD STATUS
  halfBlood = familiesJSON.half;
  pureBlood = familiesJSON.pure;

  studentJSON.forEach(cleanData);
}

function cleanData(studentData) {
  let student = Object.create(Student);

  // FULLNAME //TRIM REMOVES WHITESPACE
  let fullName = studentData.fullname.trim();
  fullName = fullName.toLowerCase();

  // FIRSTNAME
  let firstletter = fullName.substring(0, 1);
  firstletter = firstletter.toUpperCase();

  student.firstName = fullName.substring(1, fullName.indexOf(" "));
  student.firstName = firstletter + student.firstName;

  // LASTNAME
  student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.length + 1);

  let firstletterLastName = student.lastName.substring(0, 1);
  firstletterLastName = firstletterLastName.toUpperCase();
  student.lastName = firstletterLastName + fullName.substring(fullName.lastIndexOf(" ") + 2, fullName.length + 1);

  // MIDDLE NAME
  student.middleName = fullName.substring(student.firstName.length + 1, fullName.lastIndexOf(" "));
  let firstletterMiddle = student.middleName.substring(0, 1);
  firstletterMiddle = firstletterMiddle.toUpperCase();
  if (student.middleName == " ") {
    student.middleName = null;
  } else if (student.middleName.includes('"')) {
    firstletterMiddle = student.middleName.substring(1, 2);
    firstletterMiddle = firstletterMiddle.toUpperCase();
    student.nickName = firstletterMiddle + fullName.substring(student.firstName.length + 3, fullName.lastIndexOf(" ") - 1);
  } else {
    student.middleName = firstletterMiddle + fullName.substring(student.firstName.length + 2, fullName.lastIndexOf(" "));
  }

  if (fullName.includes(" ") == false) {
    student.firstName = fullName.substring(1);
    student.firstName = firstletter + student.firstName;

    student.middleName = null;
    student.lastName = null;
  }
  // IMAGES
  let photoFirstChar = firstletter.toLowerCase();
  student.photo = "images/" + student.lastName + "_" + photoFirstChar + ".png";

  // HOUSE
  student.house = studentData.house.toLowerCase();
  student.house = student.house.trim();
  let houses = student.house.substring(0, 1);
  houses = houses.toUpperCase();
  student.house = houses + student.house.substring(1);

  // GENDER
  student.gender = studentData.gender;

  // BLOODSTATUS

  const studentHalfBlood = halfBlood.some(halfBloodType => {
    return halfBloodType === student.lastName;
  });

  const studentPureBlood = pureBlood.some(pureBloodType => {
    return pureBloodType === student.lastName;
  });

  if (studentHalfBlood === true) {
    student.blood = "Halfblood";
  } else if (studentPureBlood === true) {
    student.blood = "Pureblood";
  } else {
    student.blood = "Muggler";
  }

  console.log(student);

  allOfStudent.push(student);
  displayList(allOfStudent);
}

function displayList(elm) {
  HTML.dest.innerHTML = "";

  elm.forEach(showStudent);

  // SEARCHBAR
  // src: https://stackoverflow.com/questions/36897978/js-search-using-keyup-event-on-input-tag

  let search = document.getElementById("search");
  let el = document.querySelectorAll(".student");

  search.addEventListener("keyup", function() {
    el.forEach(student => {
      if (
        student
          .querySelector(".name")
          .textContent.toLowerCase()
          .includes(search.value.toLowerCase())
      ) {
        student.style.display = "block";
      } else {
        student.style.display = "none";
      }
    });
  });
}

function showStudent(student) {
  let klon = HTML.template.cloneNode(true).content;

  if (student.lastName == undefined) {
    klon.querySelector(".name").textContent = student.firstName;
  } else {
    klon.querySelector(".name").textContent = student.firstName + " " + student.lastName;
  }

  if (student.lastName == "") {
    klon.querySelector(".name").textContent = student.firstName + " " + student.lastName;
    +"";
  }

  klon.querySelector(".house").textContent = "House: " + student.house;

  // Display winner/prefect
  let studentPrefect = klon.querySelector("[data-field=winner]");

  if (student.winner === true) {
    studentPrefect.dataset.winner = true;
  } else {
    studentPrefect.dataset.winner = false;
  }

  // Display star/squad
  let studentSquad = klon.querySelector("[data-field=star]");

  if (student.star === true) {
    studentSquad.dataset.star = true;
  } else {
    studentSquad.dataset.star = false;
  }

  // eventlistener for selected prefect students
  klon.querySelector(".student .prefect_button").addEventListener("click", () => {
    console.log("click prefect");
    selectPrefect(student);
  });

  // eventlistener for selected squad students
  klon.querySelector(".student .squad_button").addEventListener("click", () => {
    console.log("click squad member");
    selectSquad(student);
  });

  // eventlistener for expelled students
  klon.querySelector(".student button").addEventListener("click", () => {
    console.log("click expell");
    expellStudent(student);
  });

  HTML.dest.appendChild(klon);

  HTML.dest.lastElementChild.querySelector(".name").addEventListener("click", function() {
    showPopup(student);
  });
}

// EXPELL STUDENT

function expellStudent(student) {
  console.log("expell");
  student.expelled = true;

  expelledStudents.push(student);

  filteredArray = allOfStudent.filter(student => {
    return student.expelled === false;
  });

  const removeStudent = allOfStudent.indexOf(student);
  allOfStudent.splice(removeStudent, 1);

  displayList(filteredArray);
}

// SELECT PREFECT

function selectPrefect(clickedStudent) {
  // create array of winners

  const winners = allOfStudent.filter(student => {
    return student.winner === true;
  });

  const winnersOfHouse = winners.some(winner => {
    return winner.house === clickedStudent.house;
  });

  if (clickedStudent.winner === true) {
    clickedStudent.winner = false;
  } else if (winnersOfHouse) {
    clickedStudent.winner = false;
  } else {
    clickedStudent.winner = true;
  }

  if (winners.length > 1) {
    clickedStudent.winner = false;
  }

  displayList(filteredArray);
}

function selectSquad(clickedStudent) {
  console.log(clickedStudent.star);
  if (clickedStudent.star === true) {
    clickedStudent.star = false;
  } else {
    clickedStudent.star = true;
  }

  displayList(filteredArray);
}

// FILTERING

function handleFilter() {
  console.log(this.dataset.filter);
  selectedFilter = this.dataset.filter;
  console.log(selectedFilter);

  document.querySelectorAll(".filter").forEach(elm => {
    elm.classList.remove("valgt");
  });
  this.classList.add("valgt");

  filterArray(selectedFilter);
}

function filterArray(selectedFilter) {
  if (selectedFilter == "all") {
    filteredArray = allOfStudent;
  } else if (selectedFilter === "expelled") {
    console.log(expelledStudents);
    filteredArray = expelledStudents;

    displayList(filteredArray);
  } else {
    filteredArray = filterStudentByHouse(selectedFilter);
  }
  displayList(filteredArray);
}

function filterStudentByHouse(house) {
  const result = allOfStudent.filter(filterFunction);

  function filterFunction(student) {
    if (student.house === house) {
      return true;
    } else {
      return false;
    }
  }
  console.log(result);
  return result;
}

// SORTING

function sortStudents() {
  console.log("sortButton");

  //const sort = this.dataset.sort;
  if (this.dataset.action === "sort") {
    clearAllSort();
    console.log("forskellig fra sorted", this.dataset.action);
    this.dataset.action = "sorted";
  } else {
    if (this.dataset.sortDirection === "asc") {
      this.dataset.sortDirection = "desc";
      console.log("sortdir desc", this.dataset.sortDirection);
    } else {
      this.dataset.sortDirection = "asc";
      console.log("sortdir asc", this.dataset.sortDirection);
    }
  }
  mySort(this.dataset.sort, this.dataset.sortDirection);
}

function clearAllSort() {
  console.log("clearAllSort");
  mySorting.forEach(elm => {
    elm.dataset.action = "sort";
  });
}

function mySort(sortBy, sortDirection) {
  console.log(`mySort-, ${sortBy} sortDirection-  ${sortDirection}  `);
  let desc = 1;
  sortedStudents = allOfStudent.filter(allOfStudent => true);
  if (sortDirection === "desc") {
    desc = -1;
  }

  sortedStudents.sort(function(a, b) {
    var x = a[sortBy];
    var y = b[sortBy];
    if (x < y) {
      return -1 * desc;
    }
    if (x > y) {
      return 1 * desc;
    }
    return 0;
  });

  displayList(sortedStudents);
}

// HACK KIRSTINE INTO HOGWARTS!!!

function hackTheSystem() {
  console.log("You have hacked Kirstine into the system");

  const mySelf = Object.create(Student);

  mySelf.firstName = "Kirstine";
  mySelf.lastName = "Aggergaard";
  mySelf.gender = "A real woman";
  mySelf.house = "Chamber of Secrets";
  mySelf.cantNotBeExpelled = true;

  allOfStudent.unshift(mySelf);

  displayList(allOfStudent);
}
