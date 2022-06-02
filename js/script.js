const addressForm = document.querySelector("#address-form");
const cepInput = document.querySelector("#cep");
const addressInput = document.querySelector("#address");
const numberInput = document.querySelector("#number");
const complementInput = document.querySelector("#complement");
const cityInput = document.querySelector("#city");
const neighborhoodInput = document.querySelector("#neighborhood");
const regionInput = document.querySelector("#region");
const formInputs = document.querySelectorAll("[data-input]");
const closeButton = document.querySelector("#close-message");
const fadeElement = document.querySelector("#fade");

// Validate CEP input
cepInput.addEventListener("keypress", (e) => {
  const onlyNumbers = /[0-9]/;
  const key = String.fromCharCode(e.keyCode);

  // allow only numbers
  if (!onlyNumbers.test(key)) {
    e.preventDefault();
    return;
  }
});

// Get address event
cepInput.addEventListener("keyup", (e) => {
  const inputValue = e.target.value;

  // check if we have correct length
  if (inputValue.length === 8) {
    getAddress(inputValue);
  }
});

// Get customer address from API
const getAddress = async (cep) => {
  toggleLoader();

  const url = `https://viacep.com.br/ws/${cep}/json/`;
  const response = await fetch(url);
  const data = await response.json();

  // if we have data
  if (data.erro === "true") {
    if (!addressInput.hasAttribute("disabled")) {
      toggleDisabled();
    }

    addressForm.reset();
    toggleLoader();
    toggleMessage(
      "Algo inesperado aconteceu",
      "CEP inválido, tente novamente!"
    );
    return;
  }

  toggleDisabled();

  // fill inputs
  addressInput.value = data.logradouro;
  cityInput.value = data.localidade;
  neighborhoodInput.value = data.bairro;
  regionInput.value = data.uf;
  toggleLoader();
};

// Add or remove disabled attribute
const toggleDisabled = () => {
  if (regionInput.hasAttribute("disabled")) {
    formInputs.forEach((input) => {
      input.removeAttribute("disabled");
    });
  } else {
    formInputs.forEach((input) => {
      input.setAttribute("disabled", "disabled");
    });
  }
};

// Show or hide loader
const toggleLoader = () => {
  const loaderElement = document.querySelector("#loader");

  fadeElement.classList.toggle("hide");
  loaderElement.classList.toggle("hide");
};

// Show or hide message
const toggleMessage = (title, msg) => {
  const messageElement = document.querySelector("#message");
  const messageTitle = document.querySelector("#message h4");
  const messageElementText = document.querySelector("#message p");

  messageTitle.innerText = title;
  messageElementText.innerText = msg;
  fadeElement.classList.toggle("hide");
  messageElement.classList.toggle("hide");
};

// Close message modal
closeButton.addEventListener("click", () => {
  toggleMessage();
});

// Save address
addressForm.addEventListener("submit", (e) => {
  e.preventDefault();

  toggleLoader();

  setTimeout(() => {
    toggleLoader();
    toggleMessage("Sucesso", "Endereço salvo com sucesso!");
    toggleDisabled();

    saveAddress();
  }, 1500);
});

const saveAddress = () => {
  const address = {
    cep: cepInput.value,
    address: addressInput.value,
    city: cityInput.value,
    neighborhood: neighborhoodInput.value,
    region: regionInput.value,
    number: numberInput.value,
    complement: complementInput.value,
  };

  localStorage.setItem("address", JSON.stringify(address));
};

const loadAddress = () => {
  const address = JSON.parse(localStorage.getItem("address"));

  if (address) {
    cepInput.value = address.cep;
    addressInput.value = address.address;
    cityInput.value = address.city;
    neighborhoodInput.value = address.neighborhood;
    regionInput.value = address.region;
    numberInput.value = address.number;
    complementInput.value = address.complement;
    toggleDisabled();
  }
};

loadAddress();
