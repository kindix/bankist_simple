"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: "Andrii Hrytsanchuk",
  movements: [200, 455.23, -306.5, 2500, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 7205,

  movementsDates: [
    "2021-11-18T21:31:17.178",
    "2021-12-23T07:42:02.383",
    "2022-01-28T09:15:04.904",
    "2022-04-01T10:17:24.185",
    "2022-05-08T14:11:59.604",
    "2022-11-24T17:01:17.194",
    "2022-11-21T13:36:17.929",
    "2022-11-22T10:51:36.790",
  ],
  currency: "UAH",
  locale: "UK", // de-DE
};

const account2 = {
  owner: "Oksana Hrytsanchuk",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 4705,

  movementsDates: [
    "2021-11-01T13:15:33.035",
    "2021-11-30T09:48:16.867",
    "2021-12-25T06:04:23.907",
    "2022-01-25T14:18:46.235",
    "2022-02-05T16:33:06.386",
    "2022-04-10T14:43:26.374",
    "2022-06-25T18:49:59.371",
    "2022-07-26T12:01:20.894",
  ],
  currency: "USD",
  locale: "en-US",
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////
// Functions

//===============================
// 176 + 177 Dates
//================================
function format_date(date, locale) {
  function calc_days_pass(day1, day2) {
    return Math.round(Math.abs(day2 - day1) / (1000 * 86400));
  }

  const days_passed = calc_days_pass(new Date(), date);

  if (days_passed === 0) return "Today";
  if (days_passed === 1) return "Yesterday";
  if (days_passed <= 7) return `${days_passed} days ago`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const mounth = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();

  // return `${day}/${mounth}/${year}`;
  return new Intl.DateTimeFormat(locale).format(date);
}

function format_cur(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
  }).format(value);
}

function display_movments(acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;

  movs.forEach((mov, index) => {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const date = new Date(acc.movementsDates[index]);

    const display_date = format_date(date, acc.locale);

    const format_mov = format_cur(mov, acc.locale, acc.currency);

    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${
      index + 1
    } ${type} </div>
    <div class="movements__date">${display_date}</div>

    <div class="movements__value">${format_mov}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
}

//===========================
// 151 Computing user names
//===========================
const user = "Oksana Hrysnanchuk"; //oh

function create_user_names(accs) {
  accs.forEach((acc) => {
    acc.user_name = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
}

create_user_names(accounts);

function calc_print_balance(acc) {
  acc.balance = acc.movements.reduce((sum, elem) => sum + elem, 0);
  labelBalance.textContent = format_cur(acc.balance, acc.locale, acc.currency);
}

function calc_display_summary(acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumIn.textContent = format_cur(incomes, acc.locale, acc.currency);
  const outcomes = acc.movements
    .filter((mov) => mov < 0)
    .reduce((sum, mov) => sum + mov, 0);
  labelSumOut.textContent = format_cur(
    Math.abs(outcomes),
    acc.locale,
    acc.currency
  );

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int) => int >= 1)
    .reduce((sum, int) => sum + int, 0);
  labelSumInterest.textContent = format_cur(interest, acc.locale, acc.currency);
}

function update(acc) {
  display_movments(acc);
  calc_print_balance(acc);
  calc_display_summary(acc);
}

//=================================
// 181 TIMERS
//================================

function start_log_timer() {
  //set a time 10 min
  let time = 10 * 3600;

  function tick() {
    const min = String(Math.trunc(time / 3600)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);
    // call and show
    labelTimer.textContent = `${min}:${sec}`;

    // logout
    if (time === 0) {
      clearInterval(timer_interval);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
    // decrease 1 sec
    time--;
  }

  // call timer every sec
  tick();
  const timer_interval = setInterval(tick, 1000);
  return timer_interval;
}

//===========================
// 158 LOGin
//===========================
//Event handler
let curr_acc, timer_interval;

//=====================================================================
//fake always logged in================================================
// curr_acc = account1;
// update(curr_acc);
// containerApp.style.opacity = 100;
//=====================================================================

btnLogin.addEventListener("click", function (event) {
  //prevent form to submiting
  event.preventDefault();

  curr_acc = accounts.find((acc) => acc.user_name === inputLoginUsername.value);
  if (curr_acc?.pin === +inputLoginPin.value) {
    //display UI and massage
    labelWelcome.textContent = `Welcome back ${curr_acc.owner.split(" ")[0]}`;
    containerApp.style.opacity = 100;

    //===============================
    // 176 Dates
    //================================
    // const day = `${now.getDate()}`.padStart(2, 0);
    // const mounth = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hours = `${now.getHours()}`.padStart(2, 0);
    // const minutes = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${day}/${mounth}/${year}, ${hours}:${minutes}`;

    //=========================
    // 178 Internationalization date
    //=========================

    const now = new Date();
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "numeric",
      month: "numeric", //long, 2-digit
      year: "numeric",
      // weekday: "short", //long
    };

    labelDate.textContent = new Intl.DateTimeFormat(
      curr_acc.locale,
      options
    ).format(now);

    //clear
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    if (timer_interval) clearInterval(timer_interval);
    timer_interval = start_log_timer();

    update(curr_acc);
  }
});
//=================================
//159 Transfer
//=================================

btnTransfer.addEventListener("click", function (event) {
  event.preventDefault();

  const for_who = accounts.find(
    (acc) => acc.user_name === inputTransferTo.value
  );
  const amount = +inputTransferAmount.value;

  // console.log(for_who, amount);

  if (
    amount > 0 &&
    for_who &&
    curr_acc.balance >= amount &&
    for_who?.user_name !== curr_acc.user_name
  ) {
    curr_acc.movements.push(-amount);
    for_who.movements.push(amount);

    //add date
    curr_acc.movementsDates.push(new Date().toISOString());
    for_who?.movementsDates.push(new Date().toISOString());
    //update
    update(curr_acc);
  }

  inputTransferTo.value = inputTransferAmount.value = "";

  //reset timer
  clearInterval(timer_interval);
  timer_interval = start_log_timer();
});

btnLoan.addEventListener("click", function (event) {
  event.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && curr_acc.movements.some((elem) => elem >= 0.1 * amount)) {
    setTimeout(function () {
      //add movement
      curr_acc.movements.push(amount);
      //add date
      curr_acc.movementsDates.push(new Date().toISOString());
      update(curr_acc);
    }, 3000);
  }

  inputLoanAmount.value = "";

  //reset timer
  clearInterval(timer_interval);
  timer_interval = start_log_timer();
});

//=====================
// 160 FINDINDEX
//====================
btnClose.addEventListener("click", function (event) {
  event.preventDefault();

  if (
    curr_acc.pin === +inputClosePin.value &&
    curr_acc.user_name === inputCloseUsername.value
  ) {
    const index = accounts.findIndex(
      (acc) => acc.user_name === curr_acc.user_name
    );
    //delete
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = "";
});

//======================
// 163 Sorting
//=======================

let sorted = false;

btnSort.addEventListener("click", function (event) {
  event.preventDefault();

  display_movments(curr_acc, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES
//============================
// 170 Converting and cheaking numbers
//============================
/*
console.log(23 === 23.0); //true

// base 10 - 0 to 9
// binary 2 - 0 to 1
console.log(0.1 + 0.2 - 0.3); // 5.551115123125783e-17

//convert str to num
console.log(Number("23"));
console.log(+"23");

//parse

console.log(Number.parseInt("30.3px", 10)); // 30
console.log(Number.parseFloat("2.5rem", 10));

console.log(Number.isNaN(+"1"));
console.log(Number.isNaN(23 / 0));

console.log(Number.isFinite(23.4));
console.log(Number.isFinite(23 / 0));

console.log(Number.isInteger(3.3));

//============================
// 171 Math and rounding
//============================

console.log(Math.sqrt(4)); //4 ** 1/2

console.log(Math.max(1, 3, 5));

console.log(Math.min(1, 3, 5));

console.log(Math.PI * Number.parseFloat("10px") ** 2);

console.log(Math.trunc(Math.random() * 100) + 1);

function random_int(min, max) {
  return Math.floor(Math.random() * (max - min) + 1) + min;
}
console.log(random_int(10, 20));

//rounding integer

console.log(Math.trunc(23.3));
console.log(Math.round(33.4)); // 33
console.log(Math.round(23.9)); // 24
console.log(Math.ceil(23.9)); // 24
console.log(Math.ceil(23.9)); // 24
console.log(Math.floor(23.9)); // 23
console.log(Math.floor(23.1)); // 23
console.log(Math.floor("23.1")); // 23

console.log(Math.trunc(-23.1));
console.log(Math.round(-23.1));
console.log(Math.floor(-23.1));
console.log(Math.ceil(-23.1));

// rounding decimals

console.log(+(2.7).toFixed());

//============================
// 172 Remainder operator (%) mojulo
//============================

console.log(5 % 2); //залишок

console.log();

function is_even(number) {
  return number % 2 === 0;
}

console.log(is_even(4));

labelBalance.addEventListener("click", function () {
  [...document.querySelectorAll(".movements__row")].forEach((row, index) => {
    if (index % 2 === 0) row.style.backgroundColor = "orangered";
    else if (index % 2 === 1) row.style.backgroundColor = "green";
    if (index % 3 === 0) row.style.backgroundColor = "blue";
  });
});

//============================
// 173 Number separator : 100_000_000_000
//============================

const number = 1000_000_000;

console.log(number);

console.log(Number("2_300_000"));
mber = 1000_000_000;

//============================
// 174 BIGint
//============================

console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
console.log(typeof 982798729472987429874239874239743298n);
console.log(BigInt(98279872));
console.log(20n == 20); //true

//============================
// 175 DAte
//============================
// crate date

const now = new Date();
console.log(now);

console.log(new Date("December 24, 2015"));

console.log(new Date(account1.movementsDates[0]));

// console.log(account1.movementsDates.map((time) => new Date(time)));

console.log(new Date(2022, 11 - 1, 11, 12, 12, 2));
console.log(new Date(2022, 1, 30));

// milisec
console.log(new Date(3 * 86400 * 1000));

//working with date

const past = new Date(2000, 11, 31, 23, 59, 59, 99);
console.log(past);
console.log(past.getFullYear());
console.log(past.getMonth());
console.log(past.getDate());
console.log(past.getDay());
console.log(past.getHours());
console.log(past.getMinutes());
console.log(past.getSeconds());
console.log(past.toISOString());
console.log(past.getTime());

console.log(new Date(978299999099));

console.log(new Date(past.setFullYear(2022)));


//=========================
// 177 operators with a date()
//=========================
const past = new Date(2000, 11, 31, 23, 59, 59, 99);

console.log(Number(past));
console.log(+past);
console.log(past.getTime());

function calc_days_pass(day1, day2) {
  return Math.abs(day2 - day1) / (1000 * 86400);
}

console.log(calc_days_pass(new Date(), past));


//=========================
// 179 Internationalization numbers
//=========================
const num = 1234.32432;

const options = {
  style: "currency", //procent, currency
  unit: "mile-per-hour",
  currency: "EUR",
  // useGroping: false
};

console.log("DE:     ", new Intl.NumberFormat("de-DE", options).format(num));
console.log("US:     ", new Intl.NumberFormat("en-US", options).format(num));
console.log("UK:     ", new Intl.NumberFormat("UK", options).format(num));
console.log("SY:     ", new Intl.NumberFormat("ar-SY", options).format(num));
console.log(
  navigator.language,
  new Intl.NumberFormat(navigator.language, options).format(num)
);

//=========================
// 180 TIMERS
//=========================

//setTimeout
const ingrediens = ["cheese", "corn"];
const timer_pizza = setTimeout(
  (ing1, ing2) =>
    console.log(`Here is your pizza 🍕 with ${ing1} and ${ing2}.`),
  3000,
  ...ingrediens
);

setTimeout(function () {
  console.log("My massage after 5 sec");
}, 5000);

console.log("Waiting....");

if (ingrediens.includes("corn")) clearTimeout(timer_pizza);

//setInterval

// setInterval(function () {
//   const now = new Date();
//   console.log(`${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
// }, 1000);
*/

//====================================
// 181 Implementing a countDown timer
//====================================
