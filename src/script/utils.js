export function loadingAuth(isloading, isLogin) {
  console.log(isloading);
  if (isloading) {
    console.log('e');

    document.querySelector('.btn-auth').textContent = 'Loading...';
  } else {
    if (isLogin) {
      console.log('r');
      document.querySelector('.btn-auth').innerHTML = 'Se connecter &rarr;';
    } else {
      document.querySelector('.btn-auth').innerHTML = 'Créer le compte &rarr;';
    }
  }
}
