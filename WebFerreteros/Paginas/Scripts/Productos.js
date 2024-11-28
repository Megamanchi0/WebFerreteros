fetch('Menu.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('dvMenu').innerHTML = data;
  })
  .catch(error => {
    console.error('Hubo un problema con la solicitud fetch:', error);
  });
