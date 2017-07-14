var uiAuth = angular.module('uiAuth',[]);

// service to store the user's identity
uiAuth.factory('principal', ['$q',
    function($q) {
        var _identity = undefined,
            _authenticated = false,
            _user = null;

        // persist authentication through page refresh
        if (localStorage.user) {
            _identity = localStorage.user;
            _user = localStorage.user;
            _authenticated = _identity != null;
        }

        return {
            authenticate: function(identity) {
                if (identity == null) delete localStorage.user;
                else localStorage.user = JSON.stringify(identity);
                _identity = identity;
                _authenticated = identity != null;
            },
            identity: function(force) {
                var deferred = $q.defer();
                if (force === true) _identity = undefined;
                if (!angular.isDefined(_identity)) {
                    this.authenticate(null);
                }
                deferred.resolve(_identity);
                return deferred.promise;
            },
            isAuthenticated: function() {
                return _authenticated;
            },
            isIdentityResolved: function() {
                return angular.isDefined(_identity);
            }
        };
    }
]);

// service that checks the state the user wants to go to, makes sure they're logged in and then does a role check
uiAuth.factory('authorization', ['$rootScope', '$state', 'principal', '$location', 'userService',
    function($rootScope, $state, principal, $location, userService) {

        return {
            authorize: function() {
                // verify that user is authenticated
                function identify() {
                    principal.identity()
                        .then(function() {
                            if (!principal.isAuthenticated()) {
                                console.log('user should NOT be here.');
                                $state.go('login');
                            } else {
                                console.log('user is permitted access to this state.');
                            }
                        });
                }
             }
        };
    }
]);
