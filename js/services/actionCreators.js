app.service('actionCreators', ['$q', 'stateService', 'gapiService', 'mapService',
    function ($q, stateService, gapiService, mapService) {
        return {
            initGapi: function (sheetId) {
                var self = this;
                var deferred = $q.defer();

                gapiService.initGapi(sheetId).then(function (isSignedIn) {
                    // Listen for sign-in state changes.
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(isSignedIn);

                    function updateSigninStatus(isSignedIn) {
                        deferred.resolve();
                        var action = {
                            type: UPDATE_SIGNIN_STATUS,
                            payload: {
                                isSignedIn: isSignedIn
                            }
                        };
                        stateService.reduce(action);

                        // Update data
                        self.getSheetRows();
                    }
                });

                return deferred.promise;
            },
            signIn: function () {
                gapiService.signIn();
            },
            signOut: function () {
                gapiService.signOut();
            },
            getSheetRows: function () {
                gapiService.getSheetRows().then(function (rows) {
                    var action = {
                        type: GET_SHEET_ROWS,
                        payload: {
                            rows: rows
                        }
                    };
                    stateService.reduce(action);
                });
            },
            addVisit: function (person) {
                gapiService.addVisit(person).then(function (updatedPerson) {
                    var action = {
                        type: ADD_VISIT,
                        payload: {
                            updatedPerson: updatedPerson
                        }
                    };
                    stateService.reduce(action);
                });
            },
            switchDisplayMode: function (people) {
                var action = {
                    type: SWITCH_DISPLAY_MODE,
                    payload: {}
                };
                stateService.reduce(action);
            },
            setMapReady: function () {
                var deferred = $q.defer();

                mapService.injectMapApi().then(function () {
                    deferred.resolve();
                    var action = {
                        type: MAP_READY,
                        payload: {}
                    };
                    stateService.reduce(action);
                });

                return deferred.promise;
            },
            populateMap: function (people) {
                if (!people) { return; }

                mapService.populateMap(people).then(function () {
                    var action = {
                        type: POPULATE_MAP,
                        payload: {}
                    };
                    stateService.reduce(action);
                });
            }
        };
    }]);