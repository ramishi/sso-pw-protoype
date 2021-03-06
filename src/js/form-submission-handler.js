function validEmail(email) {
  'use strict';
  var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  return re.test(email);
}

function validateHuman(honeypot) {
  'use strict';
  if (honeypot) { //  if hidden form filled up
    console.log('Robot Detected!');
    return true;
  } else {
    console.log('Welcome Human!');
  }
}

// get all data in form and return object
function getFormData() {
  'use strict';
  var form = document.getElementById('gform');
  var elements = form.elements; // all form elements
  var fields = Object.keys(elements).map(function (k) {
    if (elements[k].name !== undefined) {
      return elements[k].name;
      // special case for Edge's html collection
    } else if (elements[k].length > 0) {
      return elements[k].item(0).name;
    }
  }).filter(function (item, pos, self) {
    return self.indexOf(item) === pos && item;
  });
  var data = {};
  fields.forEach(function (k) {
    data[k] = elements[k].value;
    var str = ''; // declare empty string outside of loop to allow
    // it to be appended to for each item in the loop
    if (elements[k].type === 'checkbox') { // special case for Edge's html collection
      str = str + elements[k].checked + ', '; // take the string and append 
      // the current checked value to 
      // the end of it, along with 
      // a comma and a space
      data[k] = str.slice(0, -2); // remove the last comma and space 
      // from the  string to make the output 
      // prettier in the spreadsheet
    } else if (elements[k].length) {
      for (var i = 0; i < elements[k].length; i++) {
        if (elements[k].item(i).checked) {
          str = str + elements[k].item(i).value + ', '; // same as above
          data[k] = str.slice(0, -2);
        }
      }
    }
  });

  // add form-specific values into the data
  //data.formDataNameOrder = JSON.stringify(fields);
  //data.formGoogleSheetName = form.dataset.sheet || "responses"; // default sheet name
  //data.formType = form.dataset.type || ""; // no email by default
  var subjectLine = '';
  switch (data.type) {
    case 'activate':
      subjectLine = 'Activate your DoE account';
      break;
    case 'forgot':
      subjectLine = 'Forgot your DoE password?';
      break;
    case 'change':
      subjectLine = 'Change password reminder, your DoE password is expiring in 10 days';
      break;
    case 'expired':
      subjectLine = 'Your DoE password has expired';
      break;
  }
  data.subject = subjectLine || 'Activate';

  data.name = data.id.match(/[^.]*/);
  console.log(data);
  return data;
}

function handleFormSubmit(event) { // handles form submit withtout any jquery
  'use strict';
  event.preventDefault(); // we are submitting via xhr below
  var data = getFormData(); // get the values submitted in the form

  /* OPTION: Remove this comment to enable SPAM prevention, see README.md */
  if (validateHuman(data.honeypot)) { //if form is filled, form will not be submitted
    return false;
  }
  if (localStorage) {
    // Store data
    localStorage.setItem('dataStore', JSON.stringify(data));
    console.log('saving sessonstorage');
    // Retrieve data
    console.log(JSON.parse(localStorage.getItem('dataStore')));
  } else {
    alert('Sorry, your browser do not support session storage.');
  }

  if (!validEmail(data.email)) { // if email is not valid show error
    document.getElementById('email-invalid').style.display = 'block';
    return false;
  } else if (data.type === 'forgot' || data.type === 'expired') {
    console.log('forgot or expired');
    
    window.location.href = 'login.html';

  } else {
    var url = 'https://script.google.com/macros/s/AKfycbxfle4qia-R9lm3IC0zCmAo1THD2qq6BO2Ry9TwBCxJjQb7iS8/exec'; //
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    // xhr.withCredentials = true;
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
      console.log(xhr.status, xhr.statusText);
      console.log(xhr.responseText);
      //document.getElementById('gform').style.display = 'none'; // hide form
      document.getElementById('msgEmail').innerHTML = data.email;
      document.getElementById('thankyou_message').style.display = 'block';
      return;
    };
    // url encode form data for sending as post data
    var encoded = Object.keys(data).map(function (k) {
      return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]);
    }).join('&');
    xhr.send(encoded);
    console.log(encoded);
  }
}

function loaded() {
  'use strict';
  console.log('contact form submission handler loaded successfully');
  // bind to the submit event of our form
  var form = document.getElementById('gform');
  if (localStorage) {
    // Retrieve data
    var dataStore = JSON.parse(localStorage.getItem('dataStore'));
    if (dataStore) {
      //console.log(dataStore.id + dataStore.id);
      document.getElementById('id').value = dataStore.id;
      document.getElementById('email').value = dataStore.email;
    }
    
  } else {
    alert('Sorry, your browser do not support session storage.');
  }
  form.addEventListener('submit', handleFormSubmit, false);
};
document.addEventListener('DOMContentLoaded', loaded, false);
