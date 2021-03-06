/*

Todo:

- Validierungen dem User anzeigen lassen.
- Stylesheet verbessern.

*/

// Iban-Controller
// ============================================================================================

let ibanController = (function() {
  const codestringDE = "DE";
  const codeintDE = "1314";
  const missingTestcode = "00";

  function getChecksumDE(blz, ktoNr) {
    let block;
    let validKtoNr = crateValidKtoNr(ktoNr);
    let constructedString = "" + blz + validKtoNr + codeintDE + missingTestcode;
    block = parseInt(constructedString.slice(0, 9)) % 97;
    block = parseInt(block + constructedString.slice(9, 16)) % 97;
    block = parseInt(block + constructedString.slice(16, 23)) % 97;
    block = parseInt(block + constructedString.slice(23)) % 97;

    return 98 - block;
  }

  function crateValidKtoNr(ktoNr) {
    let ktoNrString = "" + ktoNr;
    let validKtoNr;
    if (ktoNrString.length < 10) {
      for (let i = ktoNrString.length; i < 10; i++) {
        validKtoNr = "0" + ktoNrString;
      }
      return validKtoNr;
    } else {
      return ktoNr;
    }
  }

  function constructIbanDE(blz, ktoNr, checkSum) {
    return "" + codestringDE + checkSum + blz + ktoNr;
  }

  return {
    calculateIban: function(blz, ktoNr) {
      return constructIbanDE(blz, ktoNr, getChecksumDE(blz, ktoNr));
    }
  };
})();

// UI Controller
// ============================================================================================

let UIController = (function() {

  const DOMkto = document.getElementById('input-kontonummer');
  const DOMblz = document.getElementById("input-bankleitzahl");


  return {

    validateInput: function() {

      let ktoErrors = DOMkto.validity;
      let blzErrors = DOMblz.validity;

      if (!ktoErrors.valid || !blzErrors.valid)  {
        console.log(DOMkto.validationMessage); //Fehler log in der Console.
        console.log(DOMblz.validationMessage); //User Anzeige noch Implementieren.

        return false;

      }else {
        return true;
      }

    },

    getInput: function() {
      return {
        ktonr: DOMkto.value,
        blz: DOMblz.value
      };
    },

    displayIBAN: function(IBAN) {
      document.getElementById("p-ergebnis").textContent = `IBAN: ${IBAN}`;
    }
  };
})();

// Global Controller
// ============================================================================================

let globalController = (function(ibanCtrl, UICtrl) {
  const setupEventListeners = function() {
    document
      .getElementById("btn-berechnen")
      .addEventListener("click", calculateIban);
  };

  const calculateIban = function() {
    if (UICtrl.validateInput()) {
    let customersDetails = UICtrl.getInput();

    let calculatedIBAN = ibanCtrl.calculateIban(
      customersDetails.blz,
      customersDetails.ktonr
    );

    UICtrl.displayIBAN(calculatedIBAN);
  }
  };

  return {
    init: function() {
      UICtrl.displayIBAN(""); //Platzhalter ersetzen
      setupEventListeners();
    }
  };
})(ibanController, UIController);

// Start
// ============================================================================================

globalController.init();