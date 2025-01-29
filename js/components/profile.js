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
    firstName
    lastName
  }
              progress(
                where: {
                  _and: [
                    { object: { type: { _eq: "project" } } },
                    { grade: { _is_null: false } }
                  ]
                }
              ) {
                objectId
                grade
                path
                object {
                  name
                  type
                }
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
    const name = createElementWithClass('span', 'user-name', `Welcome, ${data.data.user[0].firstName} ${data.data.user[0].lastName} !`);
    const logoutButton = createElementWithClass('button', 'logout-btn', 'Log Out');
    logoutButton.addEventListener('click', handleLogout);

    header.appendChild(name);
    header.appendChild(logoutButton);
    container.appendChild(header);
    creatSvg()

    const content = createElementWithClass('div', 'profile-content');
    content.appendChild(creatSvg());

    for (let i = 0; i < 3; i++) {
        const emptyDiv = createElementWithClass('div', 'content-box', `Content Box ${i + 1}`);
        content.appendChild(emptyDiv);
    }

    container.appendChild(content);
    document.body.appendChild(container);
}

function creatSvg() {
  const emptyDiv = createElementWithClass('div', 'content-box');
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('height', '100%');
  svg.setAttribute('width', '100%');
  svg.setAttribute('viewBox', '0 0 680 303');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('style', 'overflow: visible');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  path.setAttribute('d', 'M0 303L2.38 303L4.76 303L7.13 303L9.51 303L11.89 303L14.27 303L16.64 303L19.02 303L21.4 303L23.78 303L26.15 303L28.53 303L30.91 303L33.29 303L35.66 303L38.04 303L40.42 303L42.8 301.09L45.17 301.09L47.55 301.09L49.93 301.09L52.31 301.09L54.69 298.75L57.06 298.75L59.44 298.75L61.82 296.41L64.2 296.41L66.57 296.41L68.95 296.41L71.33 294.08L73.71 294.08L76.08 294.08L78.46 294.08L80.84 294.08L83.22 294.08L85.59 294.08L87.97 294.08L90.35 294.08L92.73 294.08L95.1 294.08L97.48 294.08L99.86 294.08L102.24 294.08L104.62 290.56L106.99 290.56L109.37 290.56L111.75 290.56L114.13 290.56L116.5 290.56L118.88 290.56L121.26 290.56L123.64 290.56L126.01 290.56L128.39 290.56L130.77 290.56L133.15 290.56L135.52 290.56L137.9 290.56L140.28 290.56L142.66 290.56L145.03 290.56L147.41 290.56L149.79 290.56L152.17 290.56L154.55 290.56L156.92 290.56L159.3 290.56L161.68 290.56L164.06 290.56L166.43 290.56L168.81 290.56L171.19 290.56L173.57 290.56L175.94 290.56L178.32 290.56L180.7 290.56L183.08 290.56L185.45 290.56L187.83 290.56L190.21 290.56L192.59 290.56L194.97 290.56L197.34 287.05L199.72 287.05L202.1 287.05L204.48 287.05L206.85 287.05L209.23 287.05L211.61 287.05L213.99 287.05L216.36 287.05L218.74 287.05L221.12 287.05L223.5 287.05L225.87 283.54L228.25 283.54L230.63 283.54L233.01 280.02L235.38 280.02L237.76 280.02L240.14 280.02L242.52 280.02L244.9 280.02L247.27 279.49L249.65 279.49L252.03 279.49L254.41 279.49L256.78 279.49L259.16 279.49L261.54 279.49L263.92 279.49L266.29 279.49L268.67 279.49L271.05 277.58L273.43 277.58L275.8 277.58L278.18 277.58L280.56 277.58L282.94 277.58L285.31 277.58L287.69 277.58L290.07 277.58L292.45 277.58L294.83 268.23L297.2 263.55L299.58 263.55L301.96 263.55L304.34 263.55L306.71 263.55L309.09 263.55L311.47 263.55L313.85 263.02L316.22 258.34L318.6 258.34L320.98 258.34L323.36 258.34L325.73 253.66L328.11 253.66L330.49 249.84L332.87 249.84L335.24 249.84L337.62 249.84L340 249.84L342.38 240.49L344.76 240.49L347.13 240.49L349.51 240.49L351.89 240.49L354.27 240.49L356.64 240.49L359.02 240.49L361.4 240.49L363.78 240.49L366.15 240.49L368.53 240.49L370.91 240.49L373.29 240.49L375.66 240.49L378.04 240.49L380.42 240.49L382.8 227.36L385.17 227.36L387.55 227.36L389.93 227.36L392.31 227.36L394.69 227.36L397.06 227.36L399.44 227.36L401.82 227.36L404.2 227.36L406.57 227.36L408.95 227.36L411.33 227.36L413.71 227.36L416.08 227.36L418.46 227.36L420.84 227.36L423.22 227.36L425.59 227.36L427.97 227.36L430.35 227.36L432.73 227.36L435.1 227.36L437.48 227.36L439.86 227.36L442.24 227.36L444.62 227.36L446.99 227.36L449.37 227.36L451.75 227.36L454.13 227.36L456.5 227.36L458.88 227.36L461.26 227.36L463.64 227.36L466.01 227.36L468.39 227.36L470.77 227.36L473.15 227.36L475.52 227.36L477.9 227.36L480.28 200.64L482.66 200.64L485.03 200.64L487.41 200.64L489.79 200.64L492.17 200.64L494.55 200.64L496.92 200.64L499.3 200.64L501.68 200.64L504.06 200.64L506.43 200.64L508.81 200.64L511.19 200.64L513.57 200.64L515.94 200.64L518.32 200.64L520.7 200.64L523.08 200.64L525.45 200.64L527.83 200.64L530.21 200.64L532.59 200.64L534.97 200.64L537.34 200.64L539.72 200.64L542.1 200.64L544.48 200.64L546.85 200.64L549.23 200.64L551.61 200.64L553.99 200.64L556.36 200.64L558.74 200.64L561.12 200.64L563.5 200.64L565.87 200.64L568.25 200.64L570.63 200.64L573.01 200.64L575.38 200.64L577.76 200.64L580.14 200.64L582.52 200.64L584.9 200.64L587.27 200.64L589.65 200.64L592.03 200.64L594.41 171.53L596.78 171.53L599.16 171.53L601.54 171.53L603.92 171.53L606.29 171.53L608.67 171.53L611.05 171.53L613.43 115.4L615.8 115.4L618.18 115.4L620.56 115.4L622.94 115.4L625.31 77.98L627.69 77.98L630.07 77.98L632.45 77.98L634.83 77.98L637.2 77.98L639.58 59.28L641.96 59.28L644.34 59.28L646.71 59.28L649.09 59.28L651.47 59.28L653.85 59.28L656.22 59.28L658.6 59.28L660.98 59.28L663.36 59.28L665.73 59.28L668.11 19.76L670.49 0L672.87 0L675.24 0L677.62 0L680 0');
  path.setAttribute('stroke', 'red');
  path.setAttribute('fill', 'transparent');
  path.setAttribute('stroke-width', '2');

  svg.appendChild(path);
  emptyDiv.appendChild(svg)

  return emptyDiv
}

function handleLogout() {
    localStorage.removeItem('jwt');
    alert('Logged out successfully!');
    location.reload();
}
