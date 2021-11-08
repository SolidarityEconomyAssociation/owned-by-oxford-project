"use strict";

function getAddress(initiative, getTerm) {
  // We want to add the whole address into a single para
  // Not all orgs have an address
  let address = "";
  let street;
  if (initiative.street) {
    let streetArray = initiative.street.split(";");
    for (let partial of streetArray) {
      if (partial === initiative.name) continue;
      if (street) street += "<br/>";
      street = street ? (street += partial) : partial;
    }
    address += street;
  }
  if (initiative.locality) {
    address += (address.length ? "<br/>" : "") + initiative.locality;
  }
  if (initiative.region) {
    address += (address.length ? "<br/>" : "") + initiative.region;
  }
  if (initiative.postcode) {
    address += (address.length ? "<br/>" : "") + initiative.postcode;
  }
  if (initiative.countryId) {
    const countryName = getTerm('countryId');
    address += (address.length ? "<br/>" : "") + (countryName || initiative.countryId);
  }
  if (initiative.nongeo == 1 || !initiative.lat || !initiative.lng) {
    address += (address.length ? "<br/>" : "") + "<i>NO LOCATION AVAILABLE</i>";
  }
  if (address.length) {
    address = '<p class="sea-initiative-address">' + address + "</p>";
  }
  return address;
}

function getWebsite(initiative) {
  // Initiative's website. Note, not all have a website.
  if (initiative.www)
    return `<a href="${initiative.www}" target="_blank" >${initiative.www}</a>`;
  return '';
}

function linkTo(url, options) {
  return `<a class="${options.class}" href="${url}" target="_blank" ></a>`;
}

function getFacebook(initiative) {
  return initiative.facebook? linkTo(`https://facebook.com/${initiative.facebook}`,
                                     {class: "fab fa-facebook"}) : '';
}  

function getTwitter(initiative) {
  return initiative.twitter? linkTo(`https://twitter.com/${initiative.twitter}`,
                                    {class: "fab fa-twitter"}) : '';
}

function getPopup(initiative, sse_initiatives) {
  function getTerm(propertyName) {
    const vocabUri = sse_initiatives.getVocabUriForProperty(propertyName);
    return sse_initiatives.getVocabTerm(vocabUri, initiative[propertyName]);
  }
  
  const values = sse_initiatives.getLocalisedVocabs();
  const labels = sse_initiatives.getFunctionalLabels();

  let popupHTML = `
    <div class="sea-initiative-details">
      <h2 class="sea-initiative-name">${initiative.name}</h2>
      ${getWebsite(initiative)}
      <p>${initiative.desc || ''}</p>
    </div>
    
    <div class="sea-initiative-contact">
      <h3>${labels.contact}</h3>
      ${getAddress(initiative, getTerm)}
      
      <div class="sea-initiative-links">
        ${getFacebook(initiative)}
        ${getTwitter(initiative)}
      </div>
    </div>
  `;
  
  return popupHTML;
};

module.exports = {
  getPopup
};
