app.service('pageService', ['$rootScope', function ($rootScope) {
    var self = this;
    self.setTitle = function(title) {
        $rootScope.title = 'Jowla - ' + title;
    };
}]);

app.service('gapiService', ['$q', function ($q) {
    var self = this;

    self.injectedOnce = false;
    self.injectGapi = function () {
        var deferred = $q.defer();

        if (self.injectedOnce) {
            deferred.resolve("Maps API Loaded");
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function(){
                deferred.resolve("Google API loaded");
            };
            script.src = 'https://apis.google.com/js/api.js';
            document.body.appendChild(script);
            self.injectedOnce = true;
        }

        return deferred.promise;
    }
    self.initGapi = function (sheetId) {
        var deferred = $q.defer();
        SPREAD_SHEET_ID = sheetId;
        var SCOPES = "https://www.googleapis.com/auth/spreadsheets";
        var DISCOVERY_DOCS = ["https://sheets.googleapis.com/$discovery/rest?version=v4"];

        self.injectGapi().then(function() {
            gapi.load('client:auth2', function() {
                gapi.client.init({
                    discoveryDocs: DISCOVERY_DOCS,
                    clientId: GAPI_CLIENT_ID,
                    scope: SCOPES
                }).then(function () {
                    deferred.resolve(gapi.auth2.getAuthInstance().isSignedIn.get());
                });
            });
        });

        return deferred.promise;
    };

    self.signIn = function () {
        gapi.auth2.getAuthInstance().signIn();
    };

    self.signOut = function () {
        gapi.auth2.getAuthInstance().signOut();
    };

    self.getSheetRows = function () {
        var deferred = $q.defer();

        if (gapi.auth2.getAuthInstance().isSignedIn.get()) {
            gapi.client.sheets.spreadsheets.get({
                spreadsheetId: SPREAD_SHEET_ID
            }).then(function (response) {
                var title = response.result.properties.title;
                var firstSheet = response.result.sheets[0];
                var users = firstSheet.protectedRanges[0].editors ?
                    firstSheet.protectedRanges[0].editors.users : [];

                gapi.client.sheets.spreadsheets.values.get({
                    spreadsheetId: SPREAD_SHEET_ID,
                    range: firstSheet.properties.title + '!A2:K',
                }).then(function (response) {
                    deferred.resolve({
                        title: title,
                        users: users,
                        rows: response.result.values
                    });
                }, function (response) {
                    deferred.reject(response.result.error);
                });
            }, function (response) {
                deferred.reject(response.result.error);
            });

        } else {
            deferred.reject("Not signed in");
        }

        return deferred.promise;
    };

    self.addVisit = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        updatedPerson.visitHistory.unshift({
            date: new Date(),
            reportedBy: gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getName()
        });

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!A' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };

    self.updateNotes = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!I' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.notes]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        // This makes sure the notes in the meta data cell is removed
        // Can be removed in the future once no notes are left in the metadata column
        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!A' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };

    self.updateCountry = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        var newCountryCode = updatedPerson.country ? updatedPerson.country.code : "";

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!J' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[newCountryCode]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };

    self.updateLanguages = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        var newLanguageCodes = updatedPerson.languages ? updatedPerson.languages.map(function(l) { return l.code; }).join(',') : "";

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!K' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[newLanguageCodes]]
        }).then(function (response) {
            deferred.resolve(newLanguageCodes);
        });

        return deferred.promise;
    };

    self.addCoordinates = function (person, location) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        updatedPerson.addressMD5 = MD5(updatedPerson.address);
        updatedPerson.addressLat = location.lat();
        updatedPerson.addressLng = location.lng();

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!A' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };

    self.hidePerson = function (person) {
        var deferred = $q.defer();

        var updatedPerson = angular.copy(person);
        updatedPerson.isHidden = true;

        gapi.client.sheets.spreadsheets.values.update({
            spreadsheetId: SPREAD_SHEET_ID,
            range: 'List!A' + (person.id + 2),
            valueInputOption: 'USER_ENTERED',
            values: [[updatedPerson.getMetaString()]]
        }).then(function (response) {
            deferred.resolve(updatedPerson);
        });

        return deferred.promise;
    };
}]);

app.service('mapService', ['$q', '$rootScope', 'gapiService', function ($q, $rootScope, gapiService) {
    var self = this;

    self.injectedOnce = false;
    self.injectMapApi = function () {
        var deferred = $q.defer();

        if (self.injectedOnce) {
            deferred.resolve("Maps API Loaded");
        } else {
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.onload = function(){
                deferred.resolve("Maps API Loaded");
            };
            script.src = 'https://maps.googleapis.com/maps/api/js?v=3&key=' + GOOGLE_MAP_KEY;
            document.body.appendChild(script);
            self.injectedOnce = true;
        }


        return deferred.promise;
    };

    self.populateMap = function (people, personId) {
        var deferred = $q.defer();

        if (people.ids instanceof Array === false) {
            return deferred.reject("Passed value is not an array");
        }

        var bounds = new google.maps.LatLngBounds();

        var config = {
            zoom: 2,
            center: { lat: 21.4225, lng: 39.8262 }
        };

        var mapEl = document.getElementById('map');
        if (mapEl == null) {
            deferred.reject("No map element");
        } else {
            var map = new google.maps.Map(mapEl, config);

            self.getMarkers(people, personId).then(function (markers) {
                var infoWindow = new google.maps.InfoWindow(), marker, i;

                if (markers.length === 0) {
                    deferred.resolve(markers);
                }

                // Loop through our array of markers & place each one on the map
                markers.forEach(function(person) {
                    var position = new google.maps.LatLng(person.addressLat, person.addressLng);
                    bounds.extend(position);
                    marker = new google.maps.Marker({
                        position: position,
                        map: map,
                        title: person.fullName
                    });

                    if (personId !== undefined) {
                        map.setCenter(position);
                        map.setZoom(17);
                    } else {
                        // Allow each marker to have an info window
                        google.maps.event.addListener(marker, 'click', (function(marker, i) {
                            return function() {
                                infoWindow.setContent(
                                    '<b>' + person.fullName + '</b><br>' +
                                    person.address + '<br>' +
                                    '<a href="#/' + SPREAD_SHEET_ID + '/p/' + person.id + '">View more details...</a>'
                                );
                                infoWindow.open(map, marker);
                            }
                        })(marker, i));
                        // Automatically center the map fitting all markers on the screen
                        map.fitBounds(bounds);
                    }

                    deferred.resolve(markers);
                });
            });
        }

        return deferred.promise;
    };

    self.getMarkers = function (people, personId) {
        var deferred = $q.defer();
        var markers = [];

        if (people.ids instanceof Array === false) {
            return deferred.reject("Passed value is not an array");
        } else if (people.ids.length === 0) {
            deferred.resolve([]);
        }

        var validMarkers = 0;
        var skippedMarkers = 0;
        var completedMarkers = 0;

        if (personId !== undefined) {
            self.getMarker(people.list[personId]).then(function(marker) {
                markers.push(marker);
                $rootScope.$broadcast('mapPopulationStatusChanged', {
                    completed: 1,
                    total: 1
                });
                deferred.resolve(markers);
            });
        } else {
            people.ids.forEach(function (pId) {
                var person = people.list[pId];
                if (person.isFiltered) {
                    skippedMarkers++;
                } else {
                    // Only display people that match search term
                    self.getMarker(person).then(function(marker) {
                        markers.push(marker);

                        validMarkers++;
                        completedMarkers = validMarkers + skippedMarkers;
                        $rootScope.$broadcast('mapPopulationStatusChanged', {
                            completed: completedMarkers,
                            total: people.ids.length
                        });
                        if (completedMarkers === people.ids.length) {
                            deferred.resolve(markers);
                        }
                    });
                }
            });
        }

        return deferred.promise;
    };

    self.getMarker = function(person) {
        var deferred = $q.defer();
        self.delayIndex = self.delayIndex || 0;

        if (person.addressLat && person.addressLng && MD5(person.address) === person.addressMD5) {
            deferred.resolve(person);
        } else {
            var geocoder = new google.maps.Geocoder();
            setTimeout(function () {
                geocoder.geocode({ 'address': person.address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {
                        var location = results[0].geometry.location;
                        gapiService.addCoordinates(person, location);

                        person.addressLat = location.lat();
                        person.addressLng = location.lng();
                        person.addressMD5 = MD5(person.address);
                        deferred.resolve(person);
                    }
                });
            }, 1000 * self.delayIndex++);
        }

        return deferred.promise;
    }
}]);
