const fetch = require("node-fetch");
const BOOKING_SERVICE = process.env.BOOKING_SERVICE;

exports.handler = async (evt) => {
   function InvalidInputError(message) {
      this.name = 'InvalidInputError';
      this.message = message;
   }
   InvalidInputError.prototype = new Error();
   
   function TransientError(message) {
      this.name = 'TransientError';
      this.message = message;
   }
   TransientError.prototype = new Error();
   
   // fetch the request
   let response = await fetch(BOOKING_SERVICE, {
      method: 'DELETE',
      body: JSON.stringify(evt)
   })
   
   if (response.ok) {
      // get the JSON
      let json = await response.json()
      return json;
   } else if (response.status == 418) {
      let json = await response.json();
      throw new InvalidInputError(JSON.stringify(json));
   } else if (response.status == 503) {
      let json = await response.json();
      throw new TransientError(JSON.stringify(json));
   } else {
      throw new Error("Unknown Error!!!");
   }
}
