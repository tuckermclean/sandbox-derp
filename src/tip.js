function calculateTip(bill, tipPercent, people) {
  const tipAmount = (bill * tipPercent) / 100;
  const total = bill + tipAmount;
  const perPerson = total / people;
  return { tipAmount, total, perPerson };
}

module.exports = { calculateTip };
