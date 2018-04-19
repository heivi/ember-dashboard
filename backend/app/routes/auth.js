var express = require('express');
var fbgraph = require('fbgraph');
var crypto = require('crypto');

var config = require(__base + 'libs/config');
var oauth2 = require(__base + 'libs/auth/oauth2');
var log = require(__base + 'libs/log')(module);

var Membership = require(__base + 'app/model/membership');
var User = require(__base + 'app/model/user');
var AccessToken = require(__base + 'app/model/accessToken');

var Dashboard = require(__base + 'app/model/dashboard');
var Page = require(__base + 'app/model/page');
var Component = require(__base + 'app/model/component');

var fs = require("fs"),
    path = require("path"),
    util = require("util");

var router = express.Router();

fbgraph.setVersion(config.get("fbgraph:version"));

var newTokenValue = function(user) {
  tokenValue = crypto.randomBytes(32).toString('hex');
  return tokenValue;
};

router.post('/facebook', function(req, res) {
  if (req.body.facebook_auth_code) {
    fbgraph.setAccessToken(req.body.facebook_auth_code);
    fbgraph.setAppSecret(process.env.FB_APP_SECRET);

    fbgraph.get("me?fields=email,name,id&debug=all", {"scope": "email"}, function(err, fbres) {
      if (!err) {
        //console.log("FB user:"+JSON.stringify(fbres));

        Membership.findOne({"providerUserId": fbres.id}).populate('userId').exec(function(err, membership) {
          //console.log("Found FB membership: "+JSON.stringify(membership));
          if (err) {
            log.error(err);
          }

          if (!membership) {
            // No membership found, create one
            var user = new User({"name": fbres.name});
            var newmembership = new Membership({"provider": "facebook", "providerUserId": fbres.id, "userId": user._id});
            user.memberships.push(newmembership);
            user.save().then(function(saveduser) {
              //console.log("Then: "+JSON.stringify(saveduser));

              token = new AccessToken({token: newTokenValue(), userId: saveduser});

              token.save().then(function(newtoken) {
                console.log("Token: "+JSON.stringify(newtoken));
                newmembership.accessToken = newtoken.token;
                newmembership.save().then(function(savedmembership) {
                  
                  // Add default content
                  
                  fs.readFile(__base+"defaultdata/trigger.js", 'utf8',function (err,defaulttrigger) {
                    if (err) {
                      console.log(err);
                    }
                    fs.readFile(__base+"defaultdata/componentdata.js", 'utf8',function (err,defaultdata) {
                      if (err) {
                        console.log(err);
                      }
                      
                      Dashboard.create({
                        'userId': user._id,
                        'name': "Kojelauta"
                      }, function(err, dash) {
                        if (err) {
                          res.statusCode = 500;
                          log.error('Internal error(%d): %s',res.statusCode,err.message);
                          return res.json({
                            errors: [err.message]
                          });
                        } else {
                          Page.create({
                            dashboard: dash._id,
                            name: 'Sää',
                            timeout: 60
                          }).then((page) => {
                            dash.pages.push(page);
                            dash.save().then(() => {
                              
                              //console.log("Saved page to dash");
                              
                              Component.create({
                                page: page._id,
                                name: "OpenWeatherMap",
                                width: "100%",
                                height: "100%",
                                triggers: defaulttrigger,
                                componentData: defaultdata
                              }).then((component) => {
                                //console.log("Saved component");
                                page.components.push(component);
                                page.save().then(() => {
                                  
                                  // All created
                                  res.json({access_token: token.token, expires_in: config.get('security:tokenLife'), status: "New user created", userId: saveduser.userId});
                                  
                                });
                              }).catch((error) => {
                                res.statusCode = 500;
                                log.error('Internal error(%d): %s',res.statusCode,error.message);
                                return res.json({
                                  errors: ['Server error']
                                });
                              });
                              
                            });
                          }).catch((error) => {
                            res.statusCode = 500;
                            log.error('Internal error(%d): %s',res.statusCode,error.message);
                            return res.json({
                              errors: ['Server error']
                            });
                          });
                        }
                      });
                      
                    });
                  });
                  
                  
                  
                  
                }, function(error) {
                  res.json({error: error})
                });
              }, function(error) {
                res.json({error: error});
              });
            }, function(error) {
              if(error.name === 'ValidationError') {
                log.error('Validation error: '+error.message);
              } else {
                log.error('Error: '+error.message);
              }
              res.json({error: error});
            });

          } else {
            // Membership found, so give accessToken
            if (membership.userId) {
              // user associated
              AccessToken.findOneAndRemove({userId: membership.userId._id}).then(function(oldtoken) {
                token = new AccessToken({token: newTokenValue(), userId: membership.userId});

                token.save().then(function(newtoken) {
                  //console.log("New token: "+JSON.stringify(newtoken));
                  res.json({access_token: newtoken.token, expires_in: config.get('security:tokenLife'), status: "Renewed token", userId: membership.userId});
                }, function(error) {
                  res.json({error: error});
                });

              }, function(error) {
                res.json({error: error});
              });
            } else {
              res.json({error: "No user associated with membership"});
            }
          }
        });


      } else {
        console.log(err);
        // Not real user / old login?
        res.json({"error": err});
      }
    });

  } else {
    res.json({"error": "No facebook_auth_code set"});
  }
});

module.exports = router;
