import {reactive} from "vue";

let isLoggedIn;

isLoggedIn = !!localStorage.getItem('token');

// 'isLoggedIn' is a property of an object.
// 'reactive' makes the property 'alive'.
export const authState = reactive({
    isLoggedIn: isLoggedIn
})