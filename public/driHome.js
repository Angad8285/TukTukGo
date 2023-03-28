// alert("Hello")
// console.log("Hello")

// navigator.geolocation.getCurrentPosition(position => {
//     console.log(position);
// }, err => console.log(err), {enableHighAccuracy: true})


        // var x = document.getElementById("demo");
        // function getLocation() {
        //   if (navigator.geolocation) {
        //     navigator.geolocation.getCurrentPosition(showPosition);
        //   } else {
        //     x.innerHTML = "Geolocation is not supported by this browser.";
        //   }
        // }
        
        // function showPosition(position) {
        //   x.innerHTML = "Latitude: " + position.coords.latitude + 
        //   "<br>Longitude: " + position.coords.longitude; 
        // }


        let id;
        let target;
        let options;

        // target = {
        //     latitude: 30.3527569,
        //     longitude: 76.3632084,
        // };
        
        function success(pos) {
          const crd = pos.coords;
          console.log(pos.coords)

          target = {
            latitude: crd.latitude,
            longitude: crd.longitude,
          };
        
          if (target.latitude === crd.latitude && target.longitude === crd.longitude) {
            console.log("Congratulations, you reached the target");
            navigator.geolocation.clearWatch(id);
            // console.log(id + " in the callback")
          }

        console.log("called")
        }
        
        function error(err) {
          console.error(`ERROR(${err.code}): ${err.message}`);
        }
        
        options = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        };
        
        id = navigator.geolocation.watchPosition(success, error, options);

        // console.log(id + " in the end");