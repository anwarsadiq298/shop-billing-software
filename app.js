const fs = require("fs");

let items = [
  { name: "Chai", price: 100, qty: 3 },
  { name: "Biscuit", price: 50, qty: 2 },
  { name: "Cake", price: 200, qty: 1 }
];

let grandTotal = 0;
let receipt = "=== My Shop Bill ===\n";

for (let i = 0; i < items.length; i++) {
  let itemTotal = items[i].price * items[i].qty;
  receipt = receipt + items[i].name + " - Total: " + itemTotal + "\n";
  grandTotal = grandTotal + itemTotal;
}

let discount = 0;
if (grandTotal > 350) {
  discount = 50;
}

let finalBill = grandTotal - discount;

receipt = receipt + "Grand Total: " + grandTotal + "\n";
receipt = receipt + "Discount: " + discount + "\n";
receipt = receipt + "Final Bill: " + finalBill + "\n";

fs.writeFileSync("bill.txt", receipt);

console.log(receipt);
console.log("Bill saved to bill.txt");

