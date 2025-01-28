import { createElementWithClass, cleanUp } from '../utils/utils.js'

export async function createSectionProfile() {

    const response = await fetch('https://learn.zone01oujda.ma/api/graphql-engine/v1/graphql', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('jwt')}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `{
                user {
                    id
                    login
                }
            }`
        }),
    });

    if (response.ok) {
        const data = await response.json();
        console.log(data);
        createProfilePage(data)
    }

}


function createProfilePage(data) {

    const sectionLogin = document.querySelector('.sectionLogin')
    cleanUp(sectionLogin)

    const container = createElementWithClass('div', 'profile-page');

    const header = createElementWithClass('header', 'profile-header');
    const name = createElementWithClass('span', 'user-name', data.data.user[0].login);
    const logoutButton = createElementWithClass('button', 'logout-btn', 'Log Out');
    logoutButton.addEventListener('click', handleLogout);

    header.appendChild(name);
    header.appendChild(logoutButton);
    container.appendChild(header);

    const content = createElementWithClass('div', 'profile-content');
    for (let i = 0; i < 3; i++) {
        const emptyDiv = createElementWithClass('div', 'content-box', `Content Box ${i + 1}`);
        content.appendChild(emptyDiv);
    }

    container.appendChild(content);
    document.body.appendChild(container);
}

function handleLogout() {
    localStorage.removeItem('jwt');
    alert('Logged out successfully!');
    location.reload();
}
