import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    login() {
      this.get('session').authenticate('authenticator:custom', {})
      .then((data) => {
        console.log(data);
        //alert('SUCCESS ' + JSON.stringify(this.get('session.data')));
        this.transitionToRoute("index");
      }).catch((err) => {
        console.error(err);
        alert("Error logging in: "+err);
        this.transitionToRoute("index");
      });
    }
  }
});