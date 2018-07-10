window.onload = () => {
  //onAuthStateChange cambio de estado de la persona que esta ahi
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //si estamos logueados+
      loggedOut.style.display = "none";
      loggedIn.style.display = "block";
      console.log("User > " + JSON.stringify(user));
    } else {
      //no estamos logueados
      loggedOut.style.display = "block";
      loggedIn.style.display = "none";
    }
  });

  firebase.database().ref('messages')
  .limitToLast(1)// Filtro para no obtener todos los mensajes, solo 2   
  .once('value')
  .then((messages)=>{
    console.log("Mensajes > "+JSON.stringify(messagess));
      })
.catch(()=>{

});
  //aca comenzamos a escuchar por nuevos mensajes usando el evento
  //on child_added
  firebase.database().ref('messages')
  .limitToLast(2)// Filtro para no obtener todos los mensajes, solo 2   
    .on('child_added', (newMessage) => {
      messageContainer.innerHTML += `
  <p>Nombre: ${newMessage.val().creatorName}</p>
  <p>${newMessage.val().text}</p>
  `;

    });


};



function logInOrRegister() {
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().createUserWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      console.log("Usuario registrado");
    })
    .catch(() => {
      console.log("Error de firebase >" + error.code);
      console.log("Error de firebase, mensaje >" + error.message);
    })
}

function login() {
  const emailValue = email.value;
  const passwordValue = password.value;
  firebase.auth().signInWithEmailAndPassword(emailValue, passwordValue)
    .then(() => {
      console.log("Usuario con login exitoso");
    })
    .catch((error) => {
      console.log("Error de firebase >" + error.code);
      console.log("Error de firebase, mensaje >" + error.mensaje);
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      console.log("Chao");
    })
    .catch();
}

function loginFacebook() {
  const provider = new firebase.auth.FacebookAuthProvider();
  //provider.addScope("user_birthday"); tienene que pedirle permiso a facebook
  provider.setCustomParameters({
    'display': 'popup'
  });
  firebase.auth().signInWithPopup(provider)
    .then(() => {
      console.log("Login con Facebook");
    })
    .catch((error) => {
      console.log("Error de firebase > " + error.code);
      console.log("Error de firebase, mensaje > " + error.message);
    });
}

//Firebase Database
//Usaremos una coleccion para guardar los mensaje, llamada messages

function sendMessage() {
  const currentUser = firebase.auth().currentUser;
  const messageAreaText = messageArea.value;

  //para tener una nueva llave en la coleccion messages
  const newMessageKey = firebase.database().ref().child('messages').push().key;

  firebase.database().ref(`messages/${newMessageKey}`).set({
    creator: currentUser.uid,
    creatorName: currentUser.displayName,
    text: messageAreaText
  });
}