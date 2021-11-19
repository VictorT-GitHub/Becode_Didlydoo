const vTest = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    name: "johncena",
    dates: [
      {
        date: "2050-10-10",
        available: true,
      },
      {
        date: "2022-12-25",
        available: false,
      },
      {
        date: "2030-01-01",
        available: true,
      },
      {
        date: "2021-11-17",
        available: false,
      },
    ],
  }),
};

const vDelete = {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
  },
};

document.querySelector("#eventBtn").addEventListener("click", () => {
  fetch("http://localhost:3000/api/events/f6d7d2efe5ef", vDelete)
    // .then((res) => res.json())
    .then(() => {
      console.log("data envoyée");
    });
});
