import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    login() {
      this.get('session').authenticate('authenticator:torii', 'facebook-connect')
      .then((data) => {
        console.log(data);
        this.transitionToRoute("index");
      }).catch((err) => {
        console.error(err);
        this.transitionToRoute("index");
      });
    }
  }
});