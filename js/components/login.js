import { createElementWithClass, createInputBox, cleanUp } from '../utils/utils.js'
import { createSectionProfile } from '../components/profile.js'

export function createSectionLogin() {
    const section = createElementWithClass('section', 'sectionLogin');

    const wrapperDiv = createElementWithClass('div', 'wrapper');

    const formBoxDiv = createElementWithClass('div', 'form-box login');
    const heading = createElementWithClass('h2', '', 'Login');
    formBoxDiv.appendChild(heading);

    const usernameBox = createInputBox(
        'text',
        'username',
        'Username',
        `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
        </svg>
        `
    );
    formBoxDiv.appendChild(usernameBox);

    const passwordBox = createInputBox(
        'password',
        'password',
        'Password',
        `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        `
    );
    formBoxDiv.appendChild(passwordBox);

    const button = createElementWithClass('button', 'btn', 'Login');
    button.type = 'submit';
    addEventButton(button, section)
    formBoxDiv.appendChild(button);

    wrapperDiv.appendChild(formBoxDiv);
    section.appendChild(wrapperDiv);

    return section;
}

function addEventButton(button, section) {
    button.addEventListener('click', async () => {

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('https://learn.zone01oujda.ma/api/auth/signin', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
                'Content-Type': 'application/json',
            },

        })

        if (response.ok) { 
            const data = await response.json();
            localStorage.setItem('jwt', data)
            
            const openAnimationDiv = createElementWithClass('div', 'open-animation');
            section.appendChild(openAnimationDiv);

            setTimeout(()=> {
                openAnimationDiv.remove();
                createSectionProfile()
            }, 1500)
            
            setTimeout(()=> {
                const wrapper = document.querySelector('.wrapper')
                cleanUp(wrapper)
            }, 500)
        }
    })
}

