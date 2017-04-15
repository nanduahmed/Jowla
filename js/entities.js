app.factory('Person', [function () {
	function Person(personRowData, id) {
		if (personRowData && Number.isInteger(id)) {
			this.setData(personRowData, id);
		}
	};
	Person.prototype = {
		setData: function (personRowData, id) {
            if (personRowData instanceof Array === false || typeof personRowData[0] !== 'string') {
                console.error("Object passed is not a valid row", personRowData);
                return {};
            }

            var metaData = {};
            var visitHistory = [];

            try {
                if (personRowData[0]) {
                    metaData = JSON.parse(personRowData[0]);
                    visitHistory = metaData.visitHistory
                                    .map(function(s) {
                                        s.date = new Date(s.date)
                                        return s
                                    })
                                    .sort(function(a,b) { return b.date - a.date; })
                }
            } catch (e) {
                console.warn("metaData not valid", personRowData[0]);
            }

			angular.extend(this, {
                id: id,
                visitHistory: visitHistory,
                firstName: personRowData[1],
                lastName: personRowData[2],
                fullName: personRowData[1] + ' ' + personRowData[2],
                address: personRowData[3] + ', ' + personRowData[4] + ', ' + personRowData[5] + ' ' + personRowData[6],
                notes: metaData.notes,
                addressMD5: metaData.addressMD5,
                addressLat: metaData.addressLat,
                addressLng: metaData.addressLng,
                isHidden: metaData.isHidden
            });
		},
        isVisitedToday: function() {
            return this.visitHistory.some(function(visit){
                return visit.date.toDateString() == (new Date()).toDateString();
            });
        },
		getMetaString: function () {
            return JSON.stringify({
                addressMD5: this.addressMD5,
                addressLat: this.addressLat,
                addressLng: this.addressLng,
                notes: this.notes,
                visitHistory: this.visitHistory,
                isHidden: this.isHidden
            });
		}
	};
	return Person;
}]);
