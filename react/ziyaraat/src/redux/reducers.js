import { combineReducers } from 'redux'
import { login } from '../auth/authReducer';
// import { masjidReducer } from '../masjids/masjidReducer';


const ziyaraatReducer = combineReducers({
    login,
    // masjidReducer
});

export default ziyaraatReducer