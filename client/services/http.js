app.service('httpService', function ($http) {
  this.addPictures = (picture) => {
    console.log('http', picture);
    const view = new DataView(picture)
    $http.post('/pictures', {view})
      .then((something) =>{
        console.log(something);
      })
  }

  this.getPictures = () => {
    $http.get(`/pictures`)
      .then((pictures) => {
        console.log(pictures)
      })
  }
});