import React from 'react'
// import '../css/jawlaTracker.css'

export const BrotherList = () => {
    return (
        <div>
            <table className="table table-striped table-jawla">
                <tr>
                    <td>
                        <div className="row">
                            <div className="col-xs-6">
                                fn ln
								</div>
                            <div className="col-xs-6 text-muted text-right">
                                <small>
                                    <span className="glyphicon glyphicon-calendar" aria-hidden="true"></span>
                                    {'date'}
                                </small>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12 text-muted">
                                <small>
                                    <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                                    {'address'}
                                </small>
                            </div>
                        </div>
                    </td>
                </tr>
                <tr ng-hide="filteredPeople.length">
                    <td>No Results</td>
                </tr>
            </table>
        </div>
    )
}
