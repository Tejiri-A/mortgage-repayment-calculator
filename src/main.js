"use strict";
import "./style.css";

/*
input fields (node list)
clear all button
radio buttons(node list)
calculate repayments button
results section
repayment amount and term repayment
*/
const mortgageAmount = document.getElementById("amount");
const mortgageTerm = document.getElementById("term");
const mortgageInterest = document.getElementById("rate");
const clearAllBtn = document.querySelector(`[data-function='clear-all']`);
const mortgageTypes = document.querySelectorAll(`input[type='radio']`);
const resultSection = document.getElementById("results");
const monthlyRepayments = document.getElementById("repaymentAmount");
const termRepayment = document.getElementById("termRepayment");
const emptyPage = document.getElementById("empty");
const completedPage = document.getElementById("completed");
const calculateMortgage = document.getElementById("calcMortgage");
const form = document.querySelector("form");
// const errorMessage = document.querySelectorAll('.error_message')

function textValidation(inputField) {
  if (inputField.value.trim() === "") {
    inputField.parentElement.nextElementSibling.style.visibility = "visible";

    if (!inputField.nextElementSibling) {
      inputField.parentElement.classList.add("before:bg-primary-red");
      inputField.parentElement.classList.add("border-primary-red");

      setTimeout(() => {
        inputField.parentElement.classList.remove("before:bg-primary-red");
        inputField.parentElement.classList.remove("border-primary-red");
        inputField.parentElement.nextElementSibling.style.visibility = "hidden";
      }, 5000);
      return;
    }
    inputField.parentElement.classList.add("border-primary-red");
    inputField.nextElementSibling.classList.add("bg-primary-red");
    setTimeout(() => {
      inputField.parentElement.nextElementSibling.style.visibility = "hidden";
      inputField.parentElement.classList.remove("border-primary-red");
      inputField.nextElementSibling.classList.remove("bg-primary-red");
    }, 5000);
    return false;
  } else return true;
}

function radioValidation(radioBoxes) {
  // console.log(radioBoxes);
  const isRadioBoxChecked = [...radioBoxes].some((radioBox) => {
    return radioBox.checked;
  });
  if (isRadioBoxChecked === false) {
    radioBoxes[0].parentElement.parentElement.nextElementSibling.style.visibility =
      "visible";
  }
  setTimeout(() => {
    radioBoxes[0].parentElement.parentElement.nextElementSibling.style.visibility =
      "hidden";
  }, 5000);
  return isRadioBoxChecked;
}

function calculateRepaymentMortgage(
  principal,
  annualInterestRate,
  loanTermInYears
) {
  // 1. Monthly interest rate
  const monthlyInterestRate = annualInterestRate / 100 / 12;

  // 2. Number of payments
  const numOfPayments = loanTermInYears * 12;

  /*
  The formula is P * ((r(1+r)^n) / ((1+r)^n - 1))
  */

  // (1+r)^n
  const stepOne = Math.pow(1 + monthlyInterestRate, numOfPayments);

  // r(1+r)^n
  const stepTwo = monthlyInterestRate * stepOne;

  // ((1+r)^n) - 1
  const stepThree = Math.pow(1 + monthlyInterestRate, numOfPayments) - 1;

  // calculating the fraction
  const fraction = stepTwo / stepThree;

  // Calculate monthly repaymnet mortgage

  const M = principal * fraction;

  // Calculate total mortgege to be pated over the term
  const T = M * numOfPayments;

  return [M.toFixed(2), T.toFixed(2)];
}

function calculateInterestOnlyMortgage(
  principal,
  annualInterestRate,
  numOfPayments
) {
  const monthlyPayment = (principal * (annualInterestRate / 100)) / 12;
  const totalPayment = monthlyPayment * (numOfPayments * 12);
  return [monthlyPayment, totalPayment];
}

function updateUIAfterCalculation(monthlyRepayment, totalRepayment) {
  const formatter = new Intl.NumberFormat("en-GB");
  monthlyRepayments.innerText = `£${formatter.format(monthlyRepayment)}`;
  termRepayment.innerText = `£${formatter.format(totalRepayment)}`;

  emptyPage.classList.add("hidden");
  completedPage.classList.remove("hidden");
}

document.addEventListener("DOMContentLoaded", () => {
  mortgageAmount.addEventListener("keydown", (e) => {
    // Allow only numbers and format value in en-GB
    if (!/[0-9]|Backspace|Delete|ArrowLeft|ArrowRight|Tab/.test(e.key)) {
      e.preventDefault();
    }
    setTimeout(() => {
      let value = mortgageAmount.value.replace(/\D/g, "");
      if (value) {
        value = new Intl.NumberFormat("en-GB").format(Number(value));
        mortgageAmount.value = value;
      }
    }, 0);
  });
  clearAllBtn.addEventListener("click", () => {
    document
      .querySelectorAll(`input[type="text"]`)
      .forEach((textBox) => (textBox.value = ""));
    mortgageTypes.forEach((radioBox) => (radioBox.checked = false));
    if (!completedPage.classList.contains("hidden")) {
      completedPage.classList.add("hidden");
      emptyPage.classList.remove("hidden");
    }
  });
  calculateMortgage.addEventListener("click", () => {
    if (
      !textValidation(mortgageAmount) ||
      !textValidation(mortgageTerm) ||
      !textValidation(mortgageInterest) ||
      !radioValidation(mortgageTypes)
    ) {
      return;
    }

    const mortgageType = document.querySelector(
      `input[name='type']:checked`
    ).value;
    const principal = +mortgageAmount.value.replace(/,/g, "");
    const term = +mortgageTerm.value;
    const rate = +mortgageInterest.value;
    if (mortgageType === "repayment") {
      const [monthlyMortgagePayment, totalMortgagePayment] =
        calculateRepaymentMortgage(principal, rate, term);

      updateUIAfterCalculation(monthlyMortgagePayment, totalMortgagePayment);
    }
    if (mortgageType === "interest") {
      const [monthlyMortgagePayment, totalMortgagePayment] =
        calculateInterestOnlyMortgage(principal, rate, term);
      updateUIAfterCalculation(monthlyMortgagePayment, totalMortgagePayment);
    }
  });

  form.addEventListener("submit", (e) => {
    // prevent page reloading on submit
    e.preventDefault();
  });
});
