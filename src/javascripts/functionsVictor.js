const newEventName = document.querySelector("#newEventName");
let newEventDates = document.querySelectorAll(".newEventDates");
const newEventAuthor = document.querySelector("#newEventAuthor");
const newEventDescription = document.querySelector("#newEventDescription");

// ------------------------------------------------
//                   FUNCTIONS
// ------------------------------------------------
async function postAttend(eventID, inputsUserSerie, inputName) {
  let resArray = [];
  let i = 0;

  await fetch(`http://localhost:3000/api/events/${eventID}`)
    .then((res) => res.json())
    .then((data) =>
      data.dates.forEach((elem) => {
        const newAttend = {
          date: elem.date,
          available: false, // USER INPUT BOOLEAN(true/false)
        };

        if (inputsUserSerie[i].classList.contains("yes")) {
          newAttend.available = true;
        }

        resArray.push(newAttend);

        i += 1;
      })
    )
    .catch((err) => console.log("erreur: ", err));

  console.log(resArray);

  fetch(`http://localhost:3000/api/events/${eventID}/attend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: inputName, // USER INPUT STRING
      dates: [...resArray],
    }),
  }).then(() => console.log("data envoyée: attendees POST"));
}

function postAdd_Dates(eventID) {
  let resArray = [];
  newEventDates = document.querySelectorAll(".newEventDates");
  newEventDates.forEach((date) => resArray.push(date.value));
  console.log(resArray);

  fetch(`http://localhost:3000/api/events/${eventID}/add_dates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dates: [...resArray],
    }),
  }).then(() => {
    console.log("data envoyée: POST add_dates");
    displayAllEvents();
    resetAllInputs();
  });
}

// fetch api/events .then function createEventDOM() on each event in the fetch-data
function displayAllEvents() {
  document.querySelector("#allEventsContainer").innerHTML = "";

  fetch("http://localhost:3000/api/events")
    .then((res) => res.json())
    .then((data) => {
      let availabilitiesGridNumIndex = 0;
      data.forEach((event) => {
        createEventDOM(event, availabilitiesGridNumIndex);
        availabilitiesGridNumIndex += 1;
      });
    });
}

// Create DOM elements for an event (CONTAIN FETCHS: PATCH-event, DELETE-event, POST-add_dates, POST-attend)
function createEventDOM(event, availabilitiesGridNumIndex) {
  // ---- Users & Dates & Availabilities ( GRID ) ----
  const availabilitiesGrid = document.createElement("section");
  availabilitiesGrid.classList.add("bigGrid");
  availabilitiesGrid.id = `i${availabilitiesGridNumIndex}`;
  let indexGridColumns = 1;
  let indexGridRows = 1;

  const emptydivforgrid = document.createElement("div");
  emptydivforgrid.style.gridArea = "1 / 1";
  availabilitiesGrid.appendChild(emptydivforgrid);

  // Dates
  event.dates.forEach((elem) => {
    const dateDiv = document.createElement("h5");
    dateDiv.textContent = elem.date;
    availabilitiesGrid.appendChild(dateDiv);

    indexGridColumns += 1;

    // Availabilities
    let indexRowsAv = 2;

    elem.attendees.forEach((user) => {
      const userAvDiv = document.createElement("div");
      userAvDiv.classList.add("av");
      if (user.available === true) {
        userAvDiv.classList.add("greenAv");
        userAvDiv.textContent = "V";
      } else if (user.available === false) {
        userAvDiv.classList.add("redAv");
        userAvDiv.textContent = "X";
      }
      userAvDiv.style.gridColumn = indexGridColumns;
      userAvDiv.style.gridRow = indexRowsAv;
      availabilitiesGrid.appendChild(userAvDiv);
      indexRowsAv += 1;
    });
  });
  availabilitiesGrid.style.gridTemplateColumns = `repeat(${indexGridColumns}, 1fr)`;

  // Users
  event.dates[0].attendees.forEach((elem) => {
    const attendDiv = document.createElement("h6");
    attendDiv.textContent = elem.name;
    availabilitiesGrid.appendChild(attendDiv);
    indexGridRows += 1;
  });
  availabilitiesGrid.style.gridTemplateRows = `repeat(${indexGridRows}, 1fr)`;

  // ---- Users inputs (name & availabilities) ---- ( POST ATTENDEES )
  const inputName = document.createElement("input");
  inputName.placeholder = "User name";
  const sendBtn = document.createElement("button");
  sendBtn.classList.add("sendBtn");
  sendBtn.textContent = "Send";
  sendBtn.addEventListener("click", () => {
    if (inputName.value) {
      postAttend(
        event.id,
        document.querySelectorAll(`#${availabilitiesGrid.id}>.inputsBtns`),
        inputName.value
      );
    }
  });

  const inputNameDiv = document.createElement("div");
  inputNameDiv.classList.add("sendBtnAndInputNameDiv", "flexCenter");
  inputNameDiv.appendChild(inputName);
  inputNameDiv.appendChild(sendBtn);

  availabilitiesGrid.appendChild(inputNameDiv);

  event.dates.forEach((date) => {
    const trueAvBtn = document.createElement("button");
    trueAvBtn.classList.add("avBtn");
    trueAvBtn.addEventListener("click", () => {
      btnsCont.classList.add("yes");
      trueAvBtn.textContent = "X";
      falseAvBtn.textContent = "";
    });

    const falseAvBtn = document.createElement("button");
    falseAvBtn.classList.add("avBtn");
    falseAvBtn.addEventListener("click", () => {
      btnsCont.classList.remove("yes");
      trueAvBtn.textContent = "";
      falseAvBtn.textContent = "X";
    });

    const btnsCont = document.createElement("div");
    btnsCont.classList.add("inputsBtns", "flexCenter");
    btnsCont.appendChild(trueAvBtn);
    btnsCont.appendChild(falseAvBtn);

    availabilitiesGrid.appendChild(btnsCont);
  });

  // ---- Event informations (title & author & description & BTNS) ----
  const eventTitle = document.createElement("h3");
  eventTitle.textContent = `${event.name} by ${event.author}`;

  const eventDescription = document.createElement("p");
  eventDescription.textContent = event.description;

  // (fetch) PATCH event BTN (Modify Btn)
  const modifyEventBtn = document.createElement("button");
  modifyEventBtn.classList.add("modifyEventBtn");
  modifyEventBtn.textContent = "Modify";
  modifyEventBtn.addEventListener("click", () => {
    if (
      newEventName.value &&
      newEventAuthor.value &&
      newEventDescription.value
    ) {
      fetch(`http://localhost:3000/api/events/${event.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEventName.value,
          author: newEventAuthor.value,
          description: newEventDescription.value,
        }),
      }).then(() => {
        displayAllEvents();
        resetAllInputs();
      });
    }
  });

  // (fetch) ADD_DATES event BTN (Add dates Btn)
  const addDatesBtn = document.createElement("button");
  addDatesBtn.classList.add("addDatesBtn");
  addDatesBtn.textContent = "Add date(s)";
  addDatesBtn.addEventListener("click", () => postAdd_Dates(event.id));

  // (fetch) DELETE event BTN (Delete Btn)
  const deleteEventBtn = document.createElement("button");
  deleteEventBtn.classList.add("deleteEventBtn");
  deleteEventBtn.textContent = "Delete";
  deleteEventBtn.addEventListener("click", () => {
    fetch(`http://localhost:3000/api/events/${event.id}`, {
      method: "DELETE",
    }).then(() => displayAllEvents());
  });

  const eventBtnsDiv = document.createElement("section");
  eventBtnsDiv.appendChild(modifyEventBtn);
  eventBtnsDiv.appendChild(addDatesBtn);
  eventBtnsDiv.appendChild(deleteEventBtn);

  const btnsNameAuthorContainer = document.createElement("section");
  btnsNameAuthorContainer.classList.add("btnsNameAuthorContainer");
  btnsNameAuthorContainer.appendChild(eventTitle);
  btnsNameAuthorContainer.appendChild(eventBtnsDiv);

  const infosContainer = document.createElement("section");
  infosContainer.appendChild(btnsNameAuthorContainer);
  infosContainer.appendChild(eventDescription);

  // ---- Main Container ----
  const eventContainer = document.createElement("section");
  eventContainer.classList.add("eventContainer");
  eventContainer.appendChild(infosContainer);
  eventContainer.appendChild(availabilitiesGrid);

  document.querySelector("#allEventsContainer").appendChild(eventContainer);
}

function resetAllInputs() {
  newEventDates = document.querySelectorAll(".newEventDates");
  newEventDates.forEach((dateInput) => (dateInput.value = ""));

  newEventName.value = "";
  newEventAuthor.value = "";
  newEventDescription.value = "";
}

// ------------------------------------------------
//                     APP
// ------------------------------------------------
// display all events at page opening
displayAllEvents();
// reset all users inputs at page opening
resetAllInputs();

// (fetch) POST new event BTN (SUBMIT html FORM)
document.querySelector("#newEventSubmit").addEventListener("click", (e) => {
  e.preventDefault();

  newEventDates = document.querySelectorAll(".newEventDates");

  // Condition
  let indexdetrop = 0;

  newEventDates.forEach((date) => {
    if (date.value) {
      indexdetrop += 1;
    }
  });

  console.log(indexdetrop, newEventDates.length);

  if (
    newEventName.value &&
    indexdetrop === newEventDates.length &&
    newEventAuthor.value &&
    newEventDescription.value
    // Fin de la condition
  ) {
    let resArray = [];

    newEventDates.forEach((date) => {
      resArray.push(date.value);
    });

    console.log(resArray);

    fetch("http://localhost:3000/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: newEventName.value,
        dates: [...resArray],
        author: newEventAuthor.value,
        description: newEventDescription.value,
      }),
    }).then(() => {
      displayAllEvents();
      resetAllInputs();
    });
  }
});

// add dates BTN (POST new event) (=== "+" btn)
document.querySelector("#addDatesBtn").addEventListener("click", (e) => {
  e.preventDefault();

  const divContainer = document.createElement("div");

  const newDateInput = document.createElement("input");
  newDateInput.type = "date";
  newDateInput.classList.add("newEventDates");
  divContainer.appendChild(newDateInput);

  const removeDateInputBtn = document.createElement("button");
  removeDateInputBtn.classList.add("deleteDateBtn");
  removeDateInputBtn.textContent = "x";
  removeDateInputBtn.addEventListener("click", () => divContainer.remove());
  divContainer.appendChild(removeDateInputBtn);

  document.querySelector("#dateInputsContainer").appendChild(divContainer);
});
