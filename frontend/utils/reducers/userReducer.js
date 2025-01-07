const initialState = {
    user: null, // user data will contain the token and other info
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_USER_DATA':
            return {
                ...state,
                user: action.payload,
            };
        case 'REGISTER_USER': // Add this case
            return { ...state, ...action.payload };
        case 'LOGOUT_USER':
            return {
                ...state,
                user: null,
            };
        default:
            return state;
    }
};

export default userReducer;
