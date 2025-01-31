import { createSectionLogin } from '/js/components/login.js';
import { createSectionProfile } from '/js/components/profile.js';


function main() {
    console.log(localStorage.getItem('jwt'));
    if (localStorage.getItem('jwt') === null) {
        document.body.appendChild(createSectionLogin());
    } else {
        createSectionProfile()
    }
}

main()
