document.addEventListener("DOMContentLoaded", getJson);

let allStudents = [];

const Student = {
  firstname: "",
  lastname: "",
  middlename: "",
  nickname: "",
  house: "",
  img: undefined
};

const dataContainer = document.querySelector("#data_container");
const temp = document.querySelector("template");

const popup = document.querySelector("#popup");

async function getJson() {
  console.log("getJson");

  const jsonData = await fetch("students1991.json");

  const jsonStudents = await jsonData.json();
  console.log(jsonStudents);

  prepareData(jsonStudents);

  document.querySelector("select#theme").addEventListener("change", selected);
  //showStudents();
}

function prepareData(jsonStudents) {
  jsonStudents.forEach(jsonStudent => {
    // TODO: Create new object with cleaned data - and store that in the allAnimals array
    let student = Object.create(Student);

    // gør jsonStudent data rent!

    console.log(jsonStudent);
    const fullname = jsonStudent.fullname;
    console.log(fullname);
    const nameparts = fullname.split(" ");

    const firstname = nameparts[0];
    console.log(firstname);

    student.firstname = firstname;

    const lastname = nameparts[1];
    console.log("lastname:", lastname);

    student.lastname = lastname;

    student.house = jsonStudent.house;

    allStudents.push(student);
  });

  showStudents();
}

function showStudents() {
  dataContainer.innerHTML = "";

  allStudents.forEach(student => {
    let clone = temp.cloneNode(true).content;
    clone.querySelector(".name").textContent = `${student.firstname} ${student.lastname}`;
    clone.querySelector(".house").textContent = student.house;

    dataContainer.appendChild(clone);

    dataContainer.lastElementChild.addEventListener("click", () => {
      showSingle(student);
    });
  });
}

function showSingle(student) {
  console.log("showSingle");
  popup.style.display = "flex";

  document.querySelector(".single_name").textContent = student.fullname;
  document.querySelector(".single_house").textContent = student.house;

  document.querySelector(".luk").addEventListener("click", () => {
    document.querySelector("#popup").style.display = "none";
  });
}

function selected() {
  console.log("selected");

  const theme = this.value;
  console.log(theme);
  document.querySelector("#popup").dataset.theme = theme;

  //const color = this.dataset.popupbg;

  //document.querySelector(".single_student").style.setProperty(color, selectedTheme);
}
